import {select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product{
  constructor(id, data){
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    //console.log('newProduct', thisProduct);
  }
  renderInMenu(){
    const thisProduct = this;

    const generatedHTML = templates.menuProduct(thisProduct.data);
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    const menuContainer = document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }
  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }
  initAccordion(){
    const thisProduct = this;

    /* znajdż element reagujący na kliknięcie */
    //const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

    thisProduct.accordionTrigger.addEventListener('click', function(){
      event.preventDefault();
      /*toggle-dodanie klasy jeśli jej nie było */
      thisProduct.element.classList.toggle('active');

      const activeProducts = document.querySelectorAll('.product.active');
      //console.log('activeProducts', activeProducts);

      for (let activeProduct of activeProducts) {
        if (activeProduct !== thisProduct.element) {
          activeProduct.classList.remove('active');
        }
      }
    });
  }
  initOrderForm(){
    const thisProduct = this;
    //console.log('initOrderForm');

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  processOrder(){
    const thisProduct = this;
    //console.log('processOrder');

    const formData = utils.serializeFormToObject(thisProduct.form);

    thisProduct.params = {};

    let price = thisProduct.data.price;
    //pętla iterująca po parametrach
    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      //pętla iterująca po opcjach parametru
      for (let optionId in param.options) {
        const option = param.options[optionId];
        //co robi ta const? - sprawdzamy, czy istnieje formData[paramId], a jeśli tak, to czy ta tablica zawiera klucz równy wartości optionId
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
        //jesli opcja jest wybrana i opcja nie jest domyślna
        if(optionSelected && !option.default){
          price += option.price; // add price
        } else if (!optionSelected && option.default) {
          price -= option.price; // deduct price
        }

        const images = thisProduct.imageWrapper;
        const imageVisible = classNames.menuProduct.imageVisible;
        //const z wyszukiwanymi elementami
        const optionImages = images.querySelectorAll('.' + paramId + '-' + optionId);
        //console.log('wyszukiwane', optionImages);
        //if - ma sprawdzac czy opcja została dodana
        // w if i w else ma być pętla iterująca po znalezionych elementach
        // 2 if sprawdza, czy ten parametr został już dodany do thisProduct.params; jesli nie to dodajemy jego label oraz pusty obiekt options
        if(optionSelected){
          if(!thisProduct.params[paramId]){
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;
          for (let image of optionImages) {
            image.classList.add(imageVisible);
          }
        } else if (!optionSelected){
          for (let image of optionImages) {
            image.classList.remove(imageVisible);
          }
        }
      }
    }
    /*multiply price by amount; tworzymy cenę całkowitą price i cenę jednej sztuki priceSingle */
    /*price *= thisProduct.amountWidget.value;*/
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    /*thisProduct.priceElem.innerHTML = price;*/
    thisProduct.priceElem.innerHTML = thisProduct.price;
    //console.log(thisProduct.params);
  }

  initAmountWidget(){
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated' , function() {
      thisProduct.processOrder();
    });
  }
  addToCart(){ /* przekazuje ona całą instancję jako argument metody app.cart.add */
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);   /* wywołanie eventu - dispaczowanie*/
  }
}

export default Product;
