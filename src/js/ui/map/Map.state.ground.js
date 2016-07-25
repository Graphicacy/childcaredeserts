'use strict';
import {
  createAction, handleActions
}
from 'redux-actions';
import _ from 'lodash';

// ------------------------------------
// Constants
// ------------------------------------
export const MAP_GROUND_SET_MAP_STYLE = 'MAP_GROUND_SET_MAP_STYLE';

const LIGHT_MAP_NAME = 'mapbox://styles/cap/cilwksqa900359mm3ge1ui5yf';

const LIGHT_MAP = {
  name: 'Light',
  type: 'vector',
  url: LIGHT_MAP_NAME
};

const AVAILABLE_MAPS = [ LIGHT_MAP ];

// ------------------------------------
// Default State
// ------------------------------------
const DEFAULT_GROUND_STATE = {
  mapStyle:           LIGHT_MAP_NAME,
  availableMapStyles: AVAILABLE_MAPS
};

// ------------------------------------
// Actions
// ------------------------------------
export const setMapStyle = createAction(MAP_GROUND_SET_MAP_STYLE);

export const mapGroundActions = {
  setMapStyle
};

var actionHandlers = {
  MAP_GROUND_SET_MAP_STYLE: (state, { payload: { styleName } }) => {
    let soughtStyle = _.find(state.availableMapStyles, 'name', styleName);
    if (soughtStyle == null) {
      return state;
    }

    return { ...state, mapStyle: soughtStyle };
  }
};

export default handleActions(actionHandlers, DEFAULT_GROUND_STATE);
