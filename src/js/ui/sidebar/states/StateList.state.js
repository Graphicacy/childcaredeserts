import { createAction, handleActions } from 'redux-actions';
import _ from 'lodash';
import ChildCareCentersApi from '../../../api/ChildCareCentersApi';
import StatesApi from '../../../api/StatesApi';
import ZipsApi from '../../../api/ZipsApi';
import * as UiLoadingStatuses from '../../constants/loadingStatus';
import { resetMap } from '../../map/Map.state.interactivity';
export const STATE_LIST_LOAD_STATES = 'STATE_LIST_LOAD_STATES';
import { selectMapFeature } from '../../map/Map.state.interactivity';
export const STATE_LIST_LOAD_STATES_SUCCESS = 'STATE_LIST_LOAD_STATES_SUCCESS';
export const STATE_LIST_LOAD_STATES_FAILURE = 'STATE_LIST_LOAD_STATES_FAILURE';
export const STATE_LIST_UPDATE_STATE_SELECTION = 'STATE_LIST_UPDATE_STATE_SELECTION';
export const STATE_LIST_CLEAR_SELECTION = 'STATE_LIST_CLEAR_SELECTION';
export const STATE_LIST_UPDATE_FILTER = 'STATE_LIST_UPDATE_FILTER';
export const STATE_LIST_LOAD_ZIP_CODE_SUCCESS = 'STATE_LIST_LOAD_ZIP_CODE_SUCCESS';
import { default as turfPoint } from 'turf-point';
import { default as turfSample } from 'turf-sample';

// DEFAULT STATE
export const DEFAULT_STATE_LIST_STATE = {
  states: {
    dictionary: {},
    geoJson: null,
    selectedStateId: null
  },
  childCareCenters: null,
  childCareCentersGeoJson: null,
  status: UiLoadingStatuses.LOADING
};

// ACTIONS
export const loadStates = createAction(STATE_LIST_LOAD_STATES);
export const setStateLoadingSuccess = createAction(STATE_LIST_LOAD_STATES_SUCCESS);
export const setStateLoadingFailure = createAction(STATE_LIST_LOAD_STATES_FAILURE);
export const updateStateSelection = createAction(STATE_LIST_UPDATE_STATE_SELECTION);
export const resetStateListSelection = createAction(STATE_LIST_CLEAR_SELECTION);
export const loadStateZipCodeSuccess = createAction(STATE_LIST_LOAD_ZIP_CODE_SUCCESS, 
  (stateZipGeoJson, stateId) => { return {stateZipGeoJson, stateId}; });

export const updateFilter = createAction(STATE_LIST_UPDATE_FILTER, (stateId, filterId, min, max) => {
  return {stateId, filterId, min, max};
});

export const fetchStates = () => {
  return (dispatch) => {
    dispatch(loadStates());
    let loadingStates = StatesApi.fetchStatesGeometry();
    let loadingChildCareCenters = ChildCareCentersApi.fetchChildCareCenters();

    return Promise.all([loadingStates, loadingChildCareCenters])
      .then(results => {
        let areas = results[0];
        let childCareCenters = results[1];

        dispatch(setStateLoadingSuccess({geoJson: areas, childCareCenters}));
        return areas;
      })
      .catch(e => {
        console.log(e);
        dispatch(setStateLoadingFailure(e));
      });
  };
};

export const selectState = (selectedState) => {
  return (dispatch, getState) => {
    console.log(selectedState.ui_isSelected)
    if (selectedState.ui_isSelected) {
      return;
    }

    // let stateId = parseInt(selectedState.STATE)
    // ZipsApi.fetchZips(stateId)
    //   .then(result=> {
    //     debugger;
    //     dispatch(loadStateZipCodeSuccess(result, selectedState.STATE));
    //   })
    //   .catch(error => {
    //     debugger;
    //   });
    
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
  resetSelection,
  updateFilter
};

// ------------------------------------
// Reducers
// ------------------------------------
export const stateListReducers = {
  STATE_LIST_LOAD_STATES: (state, { payload }) => {
    let newState = { ...state };
    newState.status = UiLoadingStatuses.LOADING

    newState.states = {geoJson: null, selectedStateId: null};
    newState.childCareCenters = null;
    newState.dictionary  = null;
    newState.childCareCentersGeoJson = null;
    return newState;
  },
  STATE_LIST_LOAD_STATES_SUCCESS: (state, { payload }) => {
    let newState = { ...state };
    newState.status = UiLoadingStatuses.SUCCESS;
    let childCareDictionary = createChildCareCentersDictionary(payload.childCareCenters);
    let stateDictionary = createStateDictionary(payload.geoJson, childCareDictionary);
    newState.states = {geoJson: payload.geoJson, selectedStateId: null}; 
    newState.dictionary = stateDictionary;
    newState.childCareCenters = payload.childCareCenters;
    newState.childCareCentersGeoJson = childCareDictionary.allChildCareCenters
    return newState;
  },
  STATE_LIST_LOAD_STATES_FAILURE: (state, { payload }) => {
    console.log('FAILURE');
    let newState = { ...state };
    newState.status = UiLoadingStatuses.FAILURE;

    newState.states = {geoJson: null, selectedStateId: null};
    newState.childCareCenters = null;
    newState.dictionary  = null;
    newState.childCareCentersGeoJson = null;
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

    let selectedUiState = {
      ui_isSelected: true,
      ui_isInactive: false
    };

    let deselectedUiState = {
      ui_isSelected: false,
      ui_isInactive: true
    };

    // just update the properties, rather than creating anew GeoJSON object.
    let newFeatures = newState.states.geoJson.features.map(f => {
      let isSelected = f.properties.STATE === payload.STATE;
      let mixedObject = isSelected ? selectedUiState : deselectedUiState;
      f.properties = { ...f.properties, ...mixedObject };
      return f;
    });

    newState.states.geoJson.features = newFeatures;
    newState.states = {...newState.states, ...{ selectedStateId: +payload.STATE }};
    return newState;
  },
  STATE_LIST_UPDATE_FILTER: (state, { payload }) => {
    let { stateId, filterId, min, max } = payload;

    // find sought filter.
    if (state.dictionary == null) {
      return state;
    }

    let soughtState = state.dictionary[stateId];

    // remap the filters - we must create a NEW array rather than
    // mutate an item in the old array.
    soughtState.filters = soughtState.filters.map((filter, index) => {
      if (filter.name !== filterId) {
        return {...filter};
      }
      filter.currentMin = min;
      filter.currentMax = max;
      return {...filter};
    });

    state.dictionary = {...state.dictionary};
    let newState = { ...state };
    return newState;
  },
  STATE_LIST_LOAD_ZIP_CODE_SUCCESS: (state, { payload }) => {
    if (state.dictionary == null) {
      return state;
    }
    let { stateZipGeoJson, stateId } = payload;
    let soughtState = state.dictionary[parseInt(stateId)];
    soughtState.zipsGeoJson = stateZipGeoJson;

    state.dictionary = {...state.dictionary};
    let newState = { ...state };
    return newState;
  }
};

const createStateDictionary = (stateGeoJson, childCareDictionary) => {
  // TODO: HUGE I8N PROBLEM HERE.
  // Consider spanish, french, german?
  const SOUGHT_CHILD_CARE_PROPERTIES = [
    { soughtProperty: 'black', name: 'Black' }, // alt: African American ???????
    { soughtProperty: 'latino', name: 'Latino' }, // alt: Latin@ ???????
    { soughtProperty: 'meanearnin', name: 'Mean Earnings' },
    { soughtProperty: 'density', name: 'Density' }
  ];

  try {
    let stateProperties = _.map(stateGeoJson.features, 'properties');
    let shallowCopy = _.clone(stateProperties);
    let stateDictionary = _.reduce(shallowCopy, (hash, stateProperties) => {
      let id = parseInt(stateProperties.STATE);
      hash[id] = {id};
      hash[id].stateProperties = stateProperties;

      // while we're here we may as well add the childCare stuff too
      let childCareGeoJson = childCareDictionary[id];
      hash[id].childCareCentersGeoJson = childCareGeoJson;
      hash[id].filters = SOUGHT_CHILD_CARE_PROPERTIES.map(props => {
        let childCareProperties = _.map(childCareGeoJson.features, 'properties');
        let filterObject = createFilterObject(childCareProperties, props.soughtProperty, props.name);
        return filterObject;
      })
      hash[id].zipsGeoJson = null;
      return hash;
    }, {});

    return stateDictionary;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const createFilterObject = (array, soughtProperty, name) => {
  let max = _.max(_.map(array, soughtProperty));
  return {
    min: 0,
    max,
    currentMin: 0,
    currentMax: max,
    name,
    id: soughtProperty
  };
}

const createChildCareCentersDictionary = (childCareCenters) => {
  // convert our centers to GeoJson Features
  let points = childCareCenters.map(childCareCenter => {
    let { latitude, longitude } = childCareCenter;
    let point = turfPoint([longitude, latitude], childCareCenter);
    return point;
  });

  let centersByStateDictionary = _.reduce(points, (hash, childCareCenterFeature) => {
    let id = childCareCenterFeature.properties.state;

    // check to see if the entry already exists in our dictionary...
    if (hash[id] == null) {
      // add it to our dictionary
      hash[id] = {
          "type": "FeatureCollection",
          "features": []
      };
    }

    hash[id].features.push(childCareCenterFeature);
    return hash;
  }, {});

  let allChildCareCenters = {
          "type": "FeatureCollection",
          "features": points
      };

  centersByStateDictionary.allChildCareCenters = allChildCareCenters;
  return centersByStateDictionary;
}

export default handleActions(stateListReducers, DEFAULT_STATE_LIST_STATE);