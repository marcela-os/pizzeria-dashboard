import {select, templates, settings, classNames} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import utils from '../utils.js';


class Booking {
  constructor(bookingWrapper){
    const thisBooking = this;

    thisBooking.render(bookingWrapper);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };
    //console.log('getData params', params);

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),   /* zawiera adres API który zwraca listę rezerwacji */
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),  /* zwraca listę wydarzeń jednorazowych */
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),   /* zwraca listę wydarzeń cyklicznych */
    };
    //console.log('getData urls',urls);
    Promise.all([
      fetch(urls.booking),  /*pozoli nam uruchomić kolejna metode dopiero gdy wszystkie pytania (booking,eventsCurrent,eventsRepeat) zwrócą nam odpowiedzi */
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){   /*odpowiedź z serwera po przetworzeniu json na tablice lub obiekt */
        console.log(bookings);
        console.log(eventsCurrent);
        console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.table);
    }
    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
    for(let item of eventsRepeat){
      if(item.repeat === 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    console.log('thisBooking.booked', thisBooking.booked);
    thisBooking.sliderColor();
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    console.log(date, hour, duration, table);
    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      //console.log('loop', hourBlock);

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      } /*sprawdzenie czy dla tej godziny istnieje już tablica a jeśli nie to stworzenie jej */

      thisBooking.booked[date][hourBlock].push(table); /* przypisanie stolika do danej godziny */
    }
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
			||
			typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }
      if(
        !allAvailable
				&&
				thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) /*> -1  includes sprawdza czy tableId znajduje się w tablicy thisBooking.booked[thisBooking.date][thisBooking.hour] */
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }

      table.addEventListener('click' , function() {
        table.classList.toggle(classNames.booking.tableBooked);
        if (table.classList.contains(classNames.booking.tableBooked)){
          thisBooking.tableChoose = tableId;
        }

        thisBooking.sendBooking();
      });
    }
  }

  sliderColor(){
    const thisBooking = this;
    const hoursAmount = thisBooking.booked[thisBooking.datePicker.correctValue];

    //console.log(Object.values(hoursAmount));
    const newArray = Object.values(hoursAmount);
    const element = thisBooking.dom.wrapper.querySelector('.rangeSlider');
    const sliders = [];

    for (let i in newArray) {
      const first = ((i - 12) * 100) / 12;
      const second = (((i - 12) + .5) * 100) / 12;

      if (i < 24){
        if(newArray[i].length <= 1 ){
          sliders.push('/*' + i + '*/green ' + first + '%, green ' + second + '%');
        }	else if (newArray[i].length === 2){
          sliders.push('/*' + i + '*/orange ' + first + '%, orange ' + second + '%');
        }	else if (newArray[i].length === 3){
          sliders.push('/*' + i + '*/red ' + first + '%, red ' + second + '%');
        }
      }
    }
    sliders.sort();
    const newSliders = sliders.join();
    let newSlidersGradient = 'linear-gradient(to right, ' + newSliders + ')';
    element.style.background = newSlidersGradient;
  }


  render(bookingWrapper){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = bookingWrapper;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.cart.address);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.cart.phone);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
  }
  sendBooking(){
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking; /* kontaktujemy się z endopointem booking */

    const payload = { /* dane, które będą wysłane do serwera */

      ppl: thisBooking.peopleAmount.value,
      duration:  thisBooking.hoursAmount.value,
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.tableChoose,
    };

    const options = { /* zawiera opcje, które skonfigurują zapytanie */
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    fetch (url, options)
      .then(function(response){
        return response.json();
      }) .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
        thisBooking.makeBooked(payload.date, payload.hour, payload.table, payload.duration);
      });
  }
}

export default Booking;
