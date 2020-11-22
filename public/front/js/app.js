import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Carousel from './components/Carousel.js';

const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children; /*będziemy wyszukiwać kontener zawieracjący wszystkie strony. Children - ma przechowywać kontener podstron, dzięki temu znajdą się wszystkie dzieci kontenera stron */
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    thisApp.navSubpage = document.querySelectorAll(select.nav.subpage);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id; /* [0] - za pomocą 0 wybieramy pierwszą z podstron.  .id - wydobywamy jej id */
    for(let page of thisApp.pages){
      if(page.id === idFromHash){  /*dla każdej strony sprawdzamy czy strony czy jej id jest = wydobytemu hasha ze strony */
        pageMatchingHash = page.id;
        break; /*break przerywa pętle, kończy iterację po pętli jeśli warunek został spełniony */
      }
    }
    thisApp.activatePage(pageMatchingHash); /* aktywujemy odpowiednią podstronę */

    for(let link of thisApp.navLinks){
      link.addEventListener('click', thisApp.onLinkClick.bind(thisApp));
    }
    for(let subpage of thisApp.navSubpage){
      subpage.addEventListener('click', thisApp.onLinkClick.bind(thisApp));
    }
  },
  onLinkClick: function(event){
    const clickedElement = event.currentTarget;
    event.preventDefault();

    const id = clickedElement.getAttribute('href').replace('#', ''); /*get page id from href attribute */
    this.activatePage(id); /* run thisApp.activatePage with that id */
    /* change URL hash - zmieniamy adres strony zależnie od teo jaką podstronę mamy włączoną*/
    window.location.hash = '#/' + id; /* jak jest samo # to strona się przewija, jak dodamy #/ to strona przestaje się przewijać */
  },
  activatePage: function(pageId){
    const thisApp = this;

    /* add class "active" to matching pages, remove from non-matching */
    /*for(let page of thisApp.pages){
      if(page.id == pageId){
        page.classList.add(classNames.pages.active);
      } else {
        page.classList.remove(classNames.pages.active);
      }
    } - niżej zapisane to samo ale w 1 linijce. niżej za pomocą 2 argumentu kontrolujemy czy klasa zostanie nadana czy nie */
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id === pageId);
    }
    /* add class "active" to matching links, remove from non-matching */
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') === '#' + pageId
      );
    }
    for(let subpage of thisApp.navSubpage){
      subpage.classList.toggle(
        classNames.nav.active,
        subpage.getAttribute('href') === '#' + pageId
      );
    }
  },

  initMenu: function(){
    const thisApp = this;
    //console.log('thisApp.data', thisApp.data);

    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function(){
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        //console.log('parsedResponse', parsedResponse);

        /*save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse; /* kod w funkcji otrzymującej argument parsedResponse wykonuje się dopiero wtedy, kiedy otrzyma odpowiedź z serwera */
        /*execute initMenu method */
        thisApp.initMenu();
      });
    //console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  initCart: function(){ /* metoda initCart będzie inicjować instancję koszyka*/
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu); /* poprzez propagacje Lista Produktów dowaiduje się o naszym customowym evencie */
    /* nasluchujemy customowego eventu z Product.js  */
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  initBooking: function(){
    const thisApp = this;

    const bookingWrapper = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(bookingWrapper);
  },

  initCarousel: function(){
    const thisApp = this;

    const carouselElement = document.querySelector(select.carousel.element);
    thisApp.carousel = new Carousel(carouselElement);
    //console.log('testApp', carouselElement);
  },

  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initCarousel();
  },
};

app.init();
