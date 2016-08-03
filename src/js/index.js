
import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import RootContainer from './ui/Root.container';
import configureStore from './ui/configureStore';

const store = configureStore({});

ReactDOM.render(
  <RootContainer store={store} />,
  document.getElementById('root')
);
