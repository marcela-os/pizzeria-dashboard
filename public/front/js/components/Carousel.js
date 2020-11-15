import {select} from '../settings.js';

class Carousel{
  constructor(){
    const thisElement = this;

    thisElement.getElements();

  }

  getElements(){
    const thisElement = this;


    thisElement.carousel = document.querySelectorAll(select.carousel.element);
    thisElement.dots = document.querySelectorAll(select.carousel.dots);

    let allCarousels = thisElement.carousel;
    let item = 0;

    allCarousels[item].classList.add('active');
    thisElement.dots[item].classList.add('fas');

    function nextItem (){
      allCarousels[item].classList.remove('active');
      thisElement.dots[item].classList.remove('fas');

      item = item + 1;

      if (item >= 3){
        item = 0;
      }

      allCarousels[item].classList.add('active');
      thisElement.dots[item].classList.add('fas');
    }
    setInterval(nextItem,3000);
  }
}



export default Carousel;
