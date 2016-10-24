import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './ui/configureStore';
import RootContainer from './ui/Root.container';

const store = configureStore({});

ReactDOM.render(
  <RootContainer store={store} />,
  document.getElementById('root')
);
