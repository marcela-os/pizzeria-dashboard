/* eslint-disable */
import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';
import {select, settings} from '../settings.js';

class HourPicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, settings.hours.open);
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value; /* Aby po odświeżeniu strony była od razu widoczna godzina */
  }

  initPlugin(){
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input); /* uruchomienie pluginu */
    thisWidget.dom.input.addEventListener('input', function() {
      thisWidget.value = thisWidget.dom.input.value;
    });
  }

  parseValue(value){
    return utils.numberToHour(value);
  }

  isValid(){
    return true;
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.output.innerHTML = thisWidget.value; /* ma zamieniać zawartość elementu thisWidget.dom.output na wartość widgetu */
  }

}

export default HourPicker;
