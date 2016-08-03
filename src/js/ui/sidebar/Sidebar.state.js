'use strict';
import { combineReducers } from 'redux';
import { default as stateListReducer } from './states/StateList.state';
// import { default as filterReducer } from '.states/stateItem/filter/Filter.state';

export default combineReducers({
  stateList: stateListReducer,
  // filter: filterReducer
});