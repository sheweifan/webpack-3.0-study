import _ from 'lodash';
import './style.css';

console.log(MyLibrary)
function component() {
  var element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack', 'haha', 'hehe',MyLibrary], ' ');
  element.classList.add('hello');

  return element;
}

document.body.appendChild(component());