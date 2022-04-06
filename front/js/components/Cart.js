import {settings, select, classNames, templates} from '../settings.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';

class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    //console.log('newCart', thisCart);
  }
  getElements(element){
    const thisCart = this;
    /* obiekt thisCart.dom - w nim będziemy przechowywać wszystkie elementy DOM, wyszukane w komponencie koszyka */
    /* zamiast np. thisCart.amountElem będziemy mieli thisCart.dom.amount */
    this.dom = {};
    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    // Tworzymy tablicę, która zawiera cztery stringi (ciągi znaków). Każdy z nich jest kluczem w obiekcie select.cart. Wykorzystamy ją aby stworzyć cztery właściwości obiektu thisCart.dom o tych samych kluczach.
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }

    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
  }
  initActions(event){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click' , function() {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive); /*classList.toggle - przełączanie klas na elemencie*/
    });
    //aktualizujemy cenę w koszyku po zmianie ilości i dodawaniu nowych produktów
    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (){  // wychwycenie eventu remove i obserwowuje element productList
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function() {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  add(menuProduct){
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct); // tworzę HTML
    const generatedDOM = utils.createDOMFromHTML(generatedHTML); // tworzę element DOM
    thisCart.dom.productList.appendChild(generatedDOM); // dodaje te elementy DOM do thisCart.dom.productList

    //console.log('adding product', menuProduct);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM)); // tworzymy nową instancję klasy new CartProduct oraz dodamy ją do tablicy thisCart.products
    console.log('thisCart.products', thisCart.products);

    thisCart.update();
  }
  update(){
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (let element of thisCart.products) {
      //element.singlePrice = thisCart.subtotalPrice + element.price;
      thisCart.subtotalPrice += element.price;
      thisCart.totalNumber += element.amount;
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    //console.log('totalNumber', thisCart.totalNumber);
    //console.log('subtotalPrice',thisCart.subtotalPrice);
    //console.log('dostawa', thisCart.deliveryFee);
    //console.log('z dostawą',thisCart.totalPrice);

    for (let key of thisCart.renderTotalsKeys){
      for(let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }
  }
  remove(cartProduct){
    const thisCart = this;
    //const index = thisCart.products.indexOf('cartProduct');
    thisCart.products.splice(CartProduct, 1);
    cartProduct.dom.wrapper.remove();

    thisCart.update();
  }
  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order; /* kontaktujemy się z endopointem zamówienia (order) */

    const payload = { /* dane, które będą wysłane do serwera */
      phone: thisCart.dom.phone,
      address: thisCart.dom.address,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      totalPrice: thisCart.totalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };
    for (let element of thisCart.products) {
      let sendElement = element.getData();
      payload.products.push(sendElement);
    }
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
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }
}

export default Cart;
