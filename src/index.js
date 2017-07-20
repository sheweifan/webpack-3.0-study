// import _ from 'lodash';
// import './style.less';
// import './style.css';

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

render(
	<Test />,
	document.getElementById('root')
)