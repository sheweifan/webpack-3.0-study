// import _ from 'lodash';
// function component() {
//   var element = document.createElement('div');

//   // Lodash, now imported by this script
//   element.innerHTML = _.join(['Hello', 'webpack', 'haha', 'hehe',MyLibrary], ' ');
//   element.classList.add('hello');

//   return element;
// }

// document.body.appendChild(component());
// 


import React,{ Component , PropTypes } from 'react';

import { render } from 'react-dom';

import Test from './Test.jsx';

import './style.less';
// import './style.css';

render(
	<Test />,
	document.getElementById('root')
)