/* eslint-disable */
import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';
import {select, settings} from '../settings.js';

class DatePicker extends BaseWidget {
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();
  }

  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture); /* właściwość która jest datą późniejszą od minDate o ilość dni zdefiniowaną w 2 argumencie */

    flatpickr(thisWidget.dom.input,{
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,

      locale: {
        firstDayOfWeek: 1 // start week on Monday
      },
      disable: [
        function(date) {
          // return true to disable
          return (date.getDay() === 1); //zamkniete w poniedzialek
        }
      ],

      onChange: function(selectedDates, dateStr) { /* w momencie wykrycia zmiany wartości przez plugin, chcemy ustawiać wartość właściwości */
        thisWidget.value = dateStr;
      }
    });
  }

  parseValue(nextValue){
    return nextValue;
  }


  isValid(){
    return true;
  }

  renderValue(){

  }
}

export default DatePicker;
