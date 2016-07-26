import _ from 'lodash';
import { createSelector } from 'reselect';
import * as UiLoadingStatuses from '../constants/loadingStatus';
import { getIsDataReady, getStatesGeoJson, getSelectedState, getChildCareCentersGeoJsonDictionary} from '../sidebar/Sidebar.selectors';

export const getMapCamera = state => state.map.camera;
export const getMapGround = state => state.map.ground;
export const getMapSettings = state => state.map.settings;
export const getMapInteractivity = state => state.map.interactivity;

export const getIsReadyToInsertStateLayers = createSelector([getIsDataReady, getMapInteractivity], 
    (isDataReady, interactivity) => {
      return isDataReady && interactivity.isMapInitialized;
});

const emptyGeoJson = {
    "type": "FeatureCollection",
    "features": []
};

export const getSelectedChildCareGeoJson = createSelector(
    [getIsDataReady, getChildCareCentersGeoJsonDictionary, getSelectedState], 
    (isDataReady, dictionary, selectedState) => {
      if (isDataReady == false) {
        return emptyGeoJson;
      }

      if (selectedState == null) {
        // REMEMBER: this may be downsampled. Check the `getChildCareCentersGeoJsonDictionary` method.
        return dictionary.allChildCareCenters;
      }

      let id = parseInt(selectedState.STATE);
      let geoJson = dictionary[id];
      return geoJson;
});

export const getMapLayers = createSelector([getStatesGeoJson, getSelectedChildCareGeoJson], 
  (statesGeoJson, selectedChildCareGeoJson) => {
  let statesLayer = getStateLayer(statesGeoJson);
  let childCareLayer = getChildCareLayers(selectedChildCareGeoJson);
  return [statesLayer, childCareLayer];
});

const getChildCareLayers = (selectedChildCareGeoJson) => {
  debugger;
  let sourceName = 'childCareGeoJson';
  const INSERT_LAYER_BEFORE = 'place-city-sm';
  let source = {
    id: sourceName,
    payload: {
      'type': 'geojson',
      'data': selectedChildCareGeoJson
    }
  };

  let layers = [{
        id: 'childCareLayer',
        type: 'circle',
        source: sourceName,
        "layout": {
                "visibility": "visible"
            },

        interactive: false,
        // before: INSERT_LAYER_BEFORE,
        "paint": {
                "circle-color": "hsl(211, 100%, 76%)",
                "circle-radius": {
                    "base": 1,
                    "stops": [
                        [
                            3,
                            0.65
                        ],
                        [
                            4,
                            0.75
                        ],
                        [
                            6,
                            1.7
                        ],
                        [
                            15,
                            8
                        ]
                    ]
                }
            }
      }];

  return { source, layers };
}

const getStateLayer = (statesGeoJson) => {
  let sourceName = 'statesGeoJson';
  return {
    source: {
      id: sourceName,
      payload: {
        'type': 'geojson',
        'data': statesGeoJson
      }
    },
    layers: [
      {
        id: 'stateFillLayer',
        type: 'fill',
        source: sourceName,
        layout: {},
        interactive: true,
        paint: {
          'fill-color': '#989898',
          'fill-opacity': 0.3
        }
      },
      {
        id: 'stateSelectionLayer',
        type: 'line',
        source: sourceName,
        layout: { 'visibility': 'visible' },
        "interactive": false,
        paint: {
          'line-color': '#374C67',
          'line-opacity': 0.8,
          'line-width': 5.0
        },
        "filter": ["==", "ui_isSelected", true]
      }
    ]
  }
}