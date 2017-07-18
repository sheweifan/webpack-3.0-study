import _ from 'lodash';
import './style.css';

function component() {
  var element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack', 'haha', 'hehe'], ' ');
  element.classList.add('hello');

  return element;
}

document.body.appendChild(component());