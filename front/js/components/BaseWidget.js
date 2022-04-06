class BaseWidget {
  constructor(wrapperElement, initialValue){
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;
  }

  get value(){ /*getter - metoda wykonywana przy każdej próbie odczytania własciwości value */
    const thisWidget = this;

    return thisWidget.correctValue;
  }

  set value(value){ /*setter -metoda wykonywana przy każdej próbie ustawienia nowej wartości właściwości value */
    const thisWidget = this;

    const newValue = thisWidget.parseValue(value);

    /* Add validation */
    if (newValue !== thisWidget.correctValue && thisWidget.isValid(newValue)) {
      thisWidget.correctValue = newValue;
      thisWidget.announce();
    }

    thisWidget.renderValue();
  }

  setValue(value){
    const thisWidget = this;

    thisWidget.value = value; /* przekierowywuje na setter który ustali nową wartość */
  }

  parseValue(value){ /*przekształca wartość którą chcemy ustawić na odpowiedni typ lub formę */
    return parseInt(value);
  }

  isValid(value){
    return !isNaN(value);  /*funkcja isNaN sprawdza czy przekazana wartość(value) jest Not a Number, ! jest negacją */
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }

  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true,  /* włączamy jego właściwość bubbles, dzięki czemu ten event po wykonaniu na jakimś elemencie będzie przekazany jego rodzicowi, oraz rodzicowi rodzica, i tak dalej */
    });
    
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;
