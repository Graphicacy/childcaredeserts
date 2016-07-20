import { createAction, handleActions } from 'redux-actions';
import _ from 'lodash';
import GeometryApi from '../../../api/GeometryApi';
import * as UiLoadingStatuses from '../../constants/loadingStatus';
import { resetMap } from '../../map/Map.state.interactivity';
export const STATE_LIST_LOAD_STATES = 'STATE_LIST_LOAD_STATES';
import { selectMapFeature } from '../../map/Map.state.interactivity';
export const STATE_LIST_LOAD_STATES_SUCCESS = 'STATE_LIST_LOAD_STATES_SUCCESS';
export const STATE_LIST_LOAD_STATES_FAILURE = 'STATE_LIST_LOAD_STATES_FAILURE';
export const STATE_LIST_UPDATE_STATE_SELECTION = 'STATE_LIST_UPDATE_STATE_SELECTION';
export const STATE_LIST_CLEAR_SELECTION = 'STATE_LIST_CLEAR_SELECTION';

// DEFAULT STATE
export const DEFAULT_STATE_LIST_STATE = {
  states: {
    geoJson: null,
    selectedStateId: null
  },
  status: UiLoadingStatuses.LOADING
};

// ACTIONS
export const loadStates = createAction(STATE_LIST_LOAD_STATES);
export const setStateLoadingSuccess = createAction(STATE_LIST_LOAD_STATES_SUCCESS);
export const setStateLoadingFailure = createAction(STATE_LIST_LOAD_STATES_FAILURE);
export const updateStateSelection = createAction(STATE_LIST_UPDATE_STATE_SELECTION);
export const resetStateListSelection = createAction(STATE_LIST_CLEAR_SELECTION);

export const fetchStates = () => {
  return (dispatch) => {
    dispatch(loadStates());
    return GeometryApi.fetchStateGeometry()
      .then(areas => {
        dispatch(setStateLoadingSuccess({geoJson: areas}));
        return areas;
      })
      .catch(e => {
        dispatch(setStateLoadingFailure(e));
      });
  };
};

export const selectState = (selectedState) => {
  return (dispatch, getState) => {
    if (selectedState.ui_isSelected) {
      return;
    }
    
    dispatch(updateStateSelection(selectedState));
    dispatch(selectMapFeature(selectedState));
  };
};

export const resetSelection = () => {
  return (dispatch) => {
    dispatch(resetStateListSelection());
    dispatch(resetMap());
  }
}

export const stateListActions = {
  fetchStates,
  selectState,
  resetSelection
};

// ------------------------------------
// Reducers
// ------------------------------------
export const stateListReducers = {
  STATE_LIST_LOAD_STATES: (state, { payload }) => {
    let newState = { ...state };
    newState.status = UiLoadingStatuses.LOADING

    newState.states = {geoJson: null, selectedStateId: null};
    return newState;
  },
  STATE_LIST_LOAD_STATES_SUCCESS: (state, { payload }) => {
    let newState = { ...state };
    newState.status = UiLoadingStatuses.SUCCESS;

    newState.states = {geoJson: payload.geoJson, selectedStateId: null}; 
    return newState;
  },
  STATE_LIST_LOAD_STATES_FAILURE: (state, { payload }) => {
    let newState = { ...state };
    newState.status = UiLoadingStatuses.FAILURE;

    newState.states = {geoJson: null, selectedStateId: null};
    return newState;
  },
  STATE_LIST_CLEAR_SELECTION: (state, { payload }) => {
    let newState = { ...state };
    // clear selection for all states
    let blankUi = {
      ui_isSelected: false,
      ui_isInactive: false
    };
    let newGeoJson = {...state.states.geoJson};
    newGeoJson.features.map(f => {
      f.properties = {...f.properties, ...blankUi};
      return f;
    });
    newState.states = {geoJson: newGeoJson, selectedStateId: null};
    return newState;
  },
  STATE_LIST_UPDATE_STATE_SELECTION: (state, { payload }) => {
    let newState = stateListReducers[STATE_LIST_CLEAR_SELECTION](state, {payload});
    if (payload == null) {
      return newState;
    }

    newState.states.selectedStateId = payload.STATE;

    let selectedUiState = {
      ui_isSelected: true,
      ui_isInactive: false
    };

    let deselectedUiState = {
      ui_isSelected: false,
      ui_isInactive: true
    };

    let newFeatures = newState.states.geoJson.features.map(f => {
      let isSelected = f.properties.STATE === payload.STATE;
      let mixedObject = isSelected ? selectedUiState : deselectedUiState;
      f.properties = { ...f.properties, ...mixedObject };
      return f;
    });

    newState.states.geoJson.features = newFeatures;
    newState.states = {...newState.states, ...{ selectedStateId: payload.STATE }};
    return newState;
  }
};

export default handleActions(stateListReducers, DEFAULT_STATE_LIST_STATE);