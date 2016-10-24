import { createAction, handleActions } from 'redux-actions';
import * as UiLoadingStatuses from '../constants/loadingStatus';
import * as urbanicity from '../constants/urbanicity';
import { selectMapFeature, resetMap } from '../map/Map.state.interactivity';
import StatesApi from '../../api/StatesApi';
import ZipsApi from '../../api/ZipsApi';

import ChildCareCentersApi from '../../api/ChildCareCentersApi';

import * as _ from 'lodash';
import turfPoint from 'turf-point';

export const STATE_LIST_LOAD_STATES = 'STATE_LIST_LOAD_STATES';
export const STATE_LIST_LOAD_STATES_SUCCESS = 'STATE_LIST_LOAD_STATES_SUCCESS';
export const STATE_LIST_LOAD_STATES_FAILURE = 'STATE_LIST_LOAD_STATES_FAILURE';
export const STATE_LIST_UPDATE_STATE_SELECTION = 'STATE_LIST_UPDATE_STATE_SELECTION';
export const STATE_LIST_CLEAR_SELECTION = 'STATE_LIST_CLEAR_SELECTION';
export const STATE_LIST_UPDATE_FILTER = 'STATE_LIST_UPDATE_FILTER';
export const STATE_LIST_LOAD_ZIP_CODE_SUCCESS = 'STATE_LIST_LOAD_ZIP_CODE_SUCCESS';
export const STATE_LIST_UPDATE_DIMENSIONS = 'STATE_LIST_UPDATE_DIMENSIONS';
export const STATE_LIST_HIDE_POPUP = 'STATE_LIST_HIDE_POPUP';
export const STATE_LIST_SHOW_POPUP = 'STATE_LIST_SHOW_POPUP';
export const STATE_LIST_HIDE_ABOUT_DATA = 'STATE_LIST_HIDE_ABOUT_DATA';
export const STATE_LIST_SHOW_ABOUT_DATA = 'STATE_LIST_SHOW_ABOUT_DATA';
export const STATE_LIST_SET_OVERLAY_MODE = 'STATE_LIST_SET_OVERLAY_MODE';
export const STATE_LIST_SET_URBANICITY = 'STATE_LIST_SET_URBANICITY';
export const STATE_LIST_SELECT_ZIP = 'STATE_LIST_SELECT_ZIP';
export const STATE_LIST_STATE_SELECT_LOAD_ZIP_SUCCESS = 'STATE_LIST_STATE_SELECT_LOAD_ZIP_SUCCESS';
export const STATE_LIST_STATE_SELECT_LOAD_ZIP_FAILURE = 'STATE_LIST_STATE_SELECT_LOAD_ZIP_FAILURE';


// ACTIONS
export const updateWindowDimensions = createAction(STATE_LIST_UPDATE_DIMENSIONS);
export const loadStates = createAction(STATE_LIST_LOAD_STATES);
export const setStateLoadingSuccess = createAction(STATE_LIST_LOAD_STATES_SUCCESS);
export const setStateLoadingFailure = createAction(STATE_LIST_LOAD_STATES_FAILURE);
export const updateStateSelection = createAction(STATE_LIST_UPDATE_STATE_SELECTION);
export const resetStateListSelection = createAction(STATE_LIST_CLEAR_SELECTION);
export const showStatePopupAction = createAction(STATE_LIST_SHOW_POPUP);
export const hideStatePopupAction = createAction(STATE_LIST_HIDE_POPUP);
export const showAboutDataAction = createAction(STATE_LIST_SHOW_ABOUT_DATA);
export const hideAboutDataAction = createAction(STATE_LIST_HIDE_ABOUT_DATA);
export const setOverlayModeAction = createAction(STATE_LIST_SET_OVERLAY_MODE);
export const setUrbanicityAction = createAction(STATE_LIST_SET_URBANICITY);
export const setZipAction = createAction(STATE_LIST_SELECT_ZIP);
export const loadZipGeoJsonSuccessAction = createAction(STATE_LIST_STATE_SELECT_LOAD_ZIP_SUCCESS);
export const loadZipGeoJsonFailureAction = createAction(STATE_LIST_STATE_SELECT_LOAD_ZIP_FAILURE);


// DEFAULT STATE
export const DEFAULT_STATE_LIST_STATE = {
  states: {
    dictionary: {},
    geoJson: null,
    selectedStateId: null
  },
  childCareCenters: null,
  childCareCentersGeoJson: null,
  status: UiLoadingStatuses.LOADING,
  overlayMode: 'DESERTS',
  urbanicity: urbanicity.ALL
};

export const hideStatePopup = () => dispatch => dispatch(hideStatePopupAction());
export const showStatePopup = () => dispatch => dispatch(showStatePopupAction());
export const hideAboutData = () => dispatch => dispatch(hideAboutDataAction());
export const showAboutData = () => dispatch => dispatch(showAboutDataAction());

export const setOverlayMode = (mode) => dispatch => dispatch(setOverlayModeAction(mode));
export const setUrbanicity = (mode) => dispatch => dispatch(setUrbanicityAction(mode));
export const setZip = zip => dispatch => dispatch(setZipAction(zip));

export const fetchStates = () => {
  return (dispatch) => {
    dispatch(loadStates());
    const loadingStates = StatesApi.fetchStatesGeometry();
    const loadingStateDemog = StatesApi.fetchStatesDemographics();
    const loadingChildCareCenters = ChildCareCentersApi.fetchChildCareCenters();
    const loadingChildCareBinary = ChildCareCentersApi.fetchBinaryCC();
    const loadingZipUrbanicity = ZipsApi.fetchZipUrbanicity();
    const loadingZipDemogs = ZipsApi.fetchZipDemogs();

    return Promise.all([
      loadingStates,
      loadingStateDemog,
      loadingChildCareCenters,
      loadingChildCareBinary,
      loadingZipUrbanicity,
      loadingZipDemogs
    ])
      .then(results => {
        const [
          areas,
          stateDemog,
          childCareCenters,
          ccbinary,
          zipUrbanicity,
          zipDemographics
        ] = results;

        dispatch(setStateLoadingSuccess({
          geoJson: areas,
          stateDemog,
          childCareCenters,
          ccbinary,
          zipUrbanicity,
          zipDemographics
        }));
        return areas;
      })
      .catch(e => {
        console.log(e);
        dispatch(setStateLoadingFailure(e));
      });
  };
};

export const resetSelection = () => {
  return (dispatch) => {
    dispatch(resetStateListSelection());
    dispatch(resetMap());
  };
};


export const selectState = (selectedState) => {
  return (dispatch, /* getState */) => {
    if (selectedState.ui_isSelected) {
      return;
    }
    ZipsApi.getStateGeoJson(selectedState.STATE)
      .then(result => {
        dispatch(updateStateSelection(selectedState));
        dispatch(selectMapFeature(selectedState));
        dispatch(loadZipGeoJsonSuccessAction(result));
      })
      .catch(err => {
        console.log(err.stack);
        resetSelection()(dispatch);
      });
  };
};


export const updateDimensions = () => dispatch =>
  dispatch(updateWindowDimensions());




export const stateListActions = {
  fetchStates,
  selectState,
  hideStatePopup,
  showStatePopup,
  showAboutData,
  hideAboutData,
  resetSelection,
  updateDimensions,
  setOverlayMode,
  setUrbanicity,
  setZip
};

const urbanicityMap = {
  [urbanicity.URBAN]: 1,
  [urbanicity.SUBURBAN]: 2,
  [urbanicity.RURAL]: 3
};

// ------------------------------------
// Reducers
// ------------------------------------
export const stateListReducers = {

  STATE_LIST_STATE_SELECT_LOAD_ZIP_SUCCESS: (state, { payload }) => {
    return {
      ...state,
      zipOptions: _.map(payload.geojson.features, f => f.properties.ZCTA5CE10),
      stateZipGeoJsonDict: _.reduce(payload.geojson.features, (out, f) => {
        out[f.properties.ZCTA5CE10] = f;
        return out;
      }, {})
    };
  },

  STATE_LIST_SELECT_ZIP: (state, { payload }) => {

    const out = {
      ...state,
      selectedZip: payload
    };

    if (payload) {
      out.showPopup = true;
      const urb = _.get(state, `stateZipGeoJsonDict.${payload}.properties.urb`);
      if (urbanicityMap[state.urbanicity] !== Number(urb)) {
        out.urbanicity = urbanicity.ALL;
      }
    }

    return out;
  },

  STATE_LIST_SET_URBANICITY: (state, { payload }) => {
    return {
      ...state,
      urbanicity: payload,
      selectedZip: null
    };
  },

  STATE_LIST_SET_OVERLAY_MODE: (state, { payload }) => {
    return {
      ...state,
      overlayMode: payload,
      selectedZip: null
    };
  },
  STATE_LIST_UPDATE_DIMENSIONS: (state) => {
    const mobile = window.innerWidth <= 768;
    return {
      ...state,
      mobile
    };
  },
  STATE_LIST_LOAD_STATES: (state, { /* payload */ }) => {
    const newState = { ...state };
    newState.status = UiLoadingStatuses.LOADING;

    newState.states = {geoJson: null, selectedStateId: null};
    newState.childCareCenters = null;
    newState.dictionary  = null;
    newState.childCareCentersGeoJson = null;
    return newState;
  },
  STATE_LIST_LOAD_STATES_SUCCESS: (state, {
    payload: {
      stateDemog,
      childCareCenters,
      geoJson,
      ccbinary,
      zipUrbanicity,
      zipDemographics
    }
  }) => {
    const urbanicityDict = _.reduce(zipUrbanicity, (out, z) => {
      out[z.ZCTA] = Number(z.ZIP_type);
      return out;
    }, {});

    const zipDemogDict = _.reduce(zipDemographics, (out, z) => {
      out[z.ZIP] = z;
      return out;
    }, {});

    _.each(childCareCenters, center => {
      center.urbanicity = urbanicityDict[center.zcta];
    });

    const childCareDictionary = createChildCareCentersDictionary(childCareCenters);
    const stateDictionary = createStateDictionary(geoJson, childCareDictionary);
    const isChildCareCenterDesert = _.reduce(ccbinary, (out, r) => {
      out[r.zip] = r.desert;
      return out;
    }, {});

    const stateDemographics = _.reduce(stateDemog, (out, s) => {
      out[_.padStart(s.ID, 2, '0')] = s;
      return out;
    }, {});

    return {
      ...state,
      isChildCareCenterDesert,
      status: UiLoadingStatuses.SUCCESS,
      states: {geoJson: geoJson, selectedStateId: null},
      dictionary: stateDictionary,
      stateDemographics,
      childCareCenters: childCareCenters,
      childCareCentersGeoJson: childCareDictionary.allChildCareCenters,
      zipDemogDict: zipDemogDict
    };
  },
  STATE_LIST_LOAD_STATES_FAILURE: (state, { /* payload */ }) => {
    console.log('FAILURE');
    const newState = { ...state };
    newState.status = UiLoadingStatuses.FAILURE;

    newState.states = {geoJson: null, selectedStateId: null};
    newState.childCareCenters = null;
    newState.dictionary  = null;
    newState.childCareCentersGeoJson = null;
    return newState;
  },
  STATE_LIST_CLEAR_SELECTION: (state, { /* payload */ }) => {
    const newState = { ...state };
    // clear selection for all states
    const blankUi = {
      ui_isSelected: false,
      ui_isInactive: false
    };
    const newGeoJson = {...state.states.geoJson};
    newGeoJson.features.map(f => {
      f.properties = {...f.properties, ...blankUi};
      return f;
    });
    newState.states = {geoJson: newGeoJson, selectedStateId: null};
    newState.selectedZip = null;
    return newState;
  },
  STATE_LIST_UPDATE_STATE_SELECTION: (state, { payload }) => {
    const newState = stateListReducers[STATE_LIST_CLEAR_SELECTION](state, {payload});
    if (!payload) {
      return newState;
    }

    const selectedUiState = {
      ui_isSelected: true,
      ui_isInactive: false
    };

    const deselectedUiState = {
      ui_isSelected: false,
      ui_isInactive: true
    };

    // just update the properties, rather than creating anew GeoJSON object.
    const newFeatures = newState.states.geoJson.features.map(f => {
      const isSelected = f.properties.STATE === payload.STATE;
      const mixedObject = isSelected ? selectedUiState : deselectedUiState;
      f.properties = { ...f.properties, ...mixedObject };
      return f;
    });

    newState.states.geoJson.features = newFeatures;
    newState.states = {...newState.states, ...{ selectedStateId: +payload.STATE }};
    newState.showPopup = true;
    return newState;
  },
  STATE_LIST_HIDE_POPUP(state) {
    return {
      ...state,
      showPopup: false
    };
  },
  STATE_LIST_SHOW_POPUP(state) {
    return {
      ...state,
      showPopup: true
    };
  },
  STATE_LIST_HIDE_ABOUT_DATA(state) {
    return {
      ...state,
      showAbout: false
    };
  },
  STATE_LIST_SHOW_ABOUT_DATA(state) {
    return {
      ...state,
      showAbout: true
    };
  }
};


const createStateDictionary = (stateGeoJson, childCareDictionary) => {

  try {
    const stateProperties = _.map(stateGeoJson.features, 'properties');
    const shallowCopy = _.clone(stateProperties);
    const stateDictionary = _.reduce(shallowCopy, (hash, state) => {
      const id = parseInt(state.STATE);

      hash[id] = {id};
      hash[id].stateProperties = state;


      // while we're here we may as well add the childCare stuff too
      const childCareGeoJson = childCareDictionary[id];

      hash[id].zips = _.chain(childCareGeoJson.features)
        .map(z => z.properties.zip)
        .uniq()
        .value();

      hash[id].childCareCentersGeoJson = childCareGeoJson;
      hash[id].zipsGeoJson = null;
      return hash;
    }, {});

    return stateDictionary;
  } catch (error) {
    console.log(error);
    return {};
  }
};



const createChildCareCentersDictionary = (childCareCenters) => {
  // convert our centers to GeoJson Features
  const points = childCareCenters.map(childCareCenter => {
    const { latitude, longitude } = childCareCenter;
    const point = turfPoint([longitude, latitude], childCareCenter);
    return point;
  });

  const centersByStateDictionary = _.reduce(points, (hash, childCareCenterFeature) => {
    const id = childCareCenterFeature.properties.state;

    // check to see if the entry already exists in our dictionary...
    if (!hash[id]) {
      // add it to our dictionary
      hash[id] = {
        'type': 'FeatureCollection',
        'features': []
      };
    }

    hash[id].features.push(childCareCenterFeature);
    return hash;
  }, {});

  const allChildCareCenters = {
    'type': 'FeatureCollection',
    'features': points
  };

  centersByStateDictionary.allChildCareCenters = allChildCareCenters;
  return centersByStateDictionary;
};


export default handleActions(stateListReducers, DEFAULT_STATE_LIST_STATE);
