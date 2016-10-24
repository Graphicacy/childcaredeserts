import * as _ from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import { getSelectedStateProperties } from '../sidebar/Sidebar.selectors';
import { mapCameraActions, BOUNDING_BOX_OF_LOWER_48_STATES } from './Map.state.camera';
// ------------------------------------
// Constants
// ------------------------------------
export const MAP_INTERACTIVITY_SET_SELECTED_FEATURES = 'MAP_INTERACTIVITY_SET_SELECTED_FEATURES';
export const MAP_INTERACTIVITY_SET_SELECTED_FEATURE_COLLECTION = 'MAP_INTERACTIVITY_SET_SELECTED_FEATURE_COLLECTION';
export const MAP_INTERACTIVITY_IS_MAP_INITIALIZED = 'MAP_INTERACTIVITY_IS_MAP_INITIALIZED';
export const MAP_INTERACTIVITY_RESET_MAP = 'MAP_INTERACTIVITY_RESET_MAP';
export const MAP_INTERACTIVITY_HOVER_OVER_ZIP_FEATURE = 'MAP_INTERACTIVITY_HOVER_OVER_ZIP_FEATURE';
export const MAP_INTERACTIVITY_HOVER_OVER_NO_ZIP = 'MAP_INTERACTIVITY_HOVER_OVER_NO_ZIP';


export const hoverOverZip = createAction(MAP_INTERACTIVITY_HOVER_OVER_ZIP_FEATURE, zip => ({zip}));
export const hoverOverNoZip = createAction(MAP_INTERACTIVITY_HOVER_OVER_NO_ZIP);


// ------------------------------------
// Default State
// ------------------------------------
const DEFAULT_SETTINGS_STATE = {
  selectedItems: [],
  isMapInitialized: false
};

// ------------------------------------
// Actions
// ------------------------------------
export const setSelectedFeatures = createAction(MAP_INTERACTIVITY_SET_SELECTED_FEATURES);
export const setSelectedFeatureCollection = createAction(MAP_INTERACTIVITY_SET_SELECTED_FEATURE_COLLECTION);
export const setIsMapInitialized = createAction(MAP_INTERACTIVITY_IS_MAP_INITIALIZED, isMapInitialized => {
  return {isMapInitialized};
});

export const selectMapFeature = (/* stateId */) => {
  return (dispatch, getState) => {
    const selectedState = getSelectedStateProperties(getState());
    if (!selectedState) return;

    const boundingBox = selectedState.bbox;
    const newCorners = [
        [boundingBox[0], boundingBox[1]],
        [boundingBox[2], boundingBox[3]]
    ];
    const selectedBounds = {bounds: newCorners};

    dispatch(mapCameraActions.setCameraBounds(selectedBounds));
  };
};

// set the map to the widest allowable bounds of the entire
// given feature collection.  Escapes gracefully if there's
// zilch zero nada loaded.
export const resetMap = () => {
  return (dispatch, /* getState */) => {
    dispatch(mapCameraActions.setCameraBounds({bounds: BOUNDING_BOX_OF_LOWER_48_STATES}));    // let geoJson = getMapModeGeoJson(state);
  };
};

// export const selectFeatureCollection = ({featureCollection}) => {
//   return (dispatch, getState) => {
//     dispatch(setSelectedFeatureCollection({featureCollection}));
//     var boundingBox = turf.bbox(featureCollection);
//     var bounds = [[boundingBox[0], boundingBox[1]], [boundingBox[2], boundingBox[3]]];
//     dispatch(mapCameraActions.setCameraBounds({bounds: bounds}));
//   };
// };

export const mapInteractivityActions = {
  selectMapFeature,
  setIsMapInitialized,
  hoverOverZip,
  hoverOverNoZip,
  resetMap
};

const actionHandlers = {
  [MAP_INTERACTIVITY_SET_SELECTED_FEATURES]: (state, { payload: { featureCollection } }) => {
    // check if feature
    let selectedItems;
    if (!_.get(featureCollection, 'features.length')) {
      selectedItems = DEFAULT_SETTINGS_STATE.selectedItems;
    } else {
      selectedItems = [featureCollection];
    }

    return { ...state, selectedItems };
  },
  [MAP_INTERACTIVITY_SET_SELECTED_FEATURE_COLLECTION]: (state, { payload: { featureCollection } }) => {
    let selectedItems;
    if (_.get(featureCollection, 'features.length')) {
      selectedItems = DEFAULT_SETTINGS_STATE.selectedItems;
    } else {
      selectedItems = [featureCollection];
    }

    return { ...state, selectedItems };
  },

  [MAP_INTERACTIVITY_IS_MAP_INITIALIZED]: (state, { payload: { isMapInitialized } }) => {
    return { ...state, isMapInitialized };
  },

  [MAP_INTERACTIVITY_HOVER_OVER_ZIP_FEATURE](state, { payload: { zip } }) {
    return {
      ...state,
      zip
    };
  },
  [MAP_INTERACTIVITY_HOVER_OVER_NO_ZIP](state) {
    return {
      ...state,
      zip: null
    };
  }
};

export default handleActions(actionHandlers, DEFAULT_SETTINGS_STATE);
