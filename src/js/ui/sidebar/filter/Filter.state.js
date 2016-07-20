import { createAction, handleActions } from 'redux-actions';
import _ from 'lodash';

export const FILTER_RESET_FILTER = 'FILTER_RESET_FILTER';
export const FILTER_SET_FILTER = 'FILTER_SET_FILTER';

// DEFAULT STATE
export const DEFAULT_FILTER_STATE = {
  settings: {
    someFilterExample: 0
  }
};

// ACTIONS
export const resetFilter = createAction(FILTER_RESET_FILTER);
export const setFilter = createAction(FILTER_SET_FILTER);

export const filterActions = {
  resetFilter,
  setFilter
};

// ------------------------------------
// Reducers
// ------------------------------------
export const filterReducers = {
  FILTER_RESET_FILTER: (state, { payload }) => {
    let newState = { ...state };
    return newState;
  },
  FILTER_SET_FILTER: (state, { payload }) => {
    let newState = { ...state };
    return newState;
  }
};

export default handleActions(filterReducers, DEFAULT_FILTER_STATE);