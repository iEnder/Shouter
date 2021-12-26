import axios from 'axios';
import { $ } from './bling';

function ajaxLike(e) {
  // post to api
  axios
    .post(this.dataset.action)
    .then(res => {
      // toggle active class and set users followers to match the data sent back
      this.classList.toggle('shout-card__control-item--active');
      let element = this.querySelector('.shout-card__control-item--value');
      // if content is actually a number and isnt empty check if it has the active class
      if (!isNaN(Number(element.textContent)) || element.textContent === '') {
        if (![...this.classList].includes('shout-card__control-item--active')) {
          if (element.textContent !== '') {
            element.textContent = Number(element.textContent) - 1;
          }
        } else {
          element.textContent = Number(element.textContent) + 1;
        }
      }
    })
    .catch(console.error);
}

export default ajaxLike;

// TODO: Fix shout like not changing during like