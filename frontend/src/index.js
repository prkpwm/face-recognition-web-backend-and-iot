// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import Router from './routes'
// import { browserHistory } from 'react-router';

import './index.css';

ReactDOM.render(
  <Router/>,
  document.getElementById('root')
);