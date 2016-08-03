import _ from 'lodash';
import { createSelector } from 'reselect';
import * as UiLoadingStatuses from '../constants/loadingStatus';
import { 
  getIsDataReady, 
  getStatesGeoJson, 
  getChildCareCentersGeoJsonDictionary, 
  getSelectedState,
  getSelectedStateId,
  getStateDictionary}
   from '../sidebar/Sidebar.selectors';

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
    [getIsDataReady, getChildCareCentersGeoJsonDictionary], 
    (isDataReady, childCareCenters) => {
      if (isDataReady == false) {
        return emptyGeoJson;
      }

      return childCareCenters;
});

const emptyArray = [];
export const getSelectedFilters = createSelector([getSelectedStateId, getStateDictionary], (stateId, stateDictionary) => {
  if (stateId == null || stateDictionary == null) {
    return emptyArray;
  }
  return stateDictionary[stateId].filters;
});

const emptyChildCareFilter = ["has", 'tier'];
export const getChildCareMapFilter = createSelector([getSelectedFilters], (selectedFilters) => {

  if (selectedFilters == null) {
    return emptyChildCareFilter;
  }

  let filterTuples = selectedFilters.map(filter => {
    let { currentMin, currentMax, id } = filter;
    // get min
    let minFilter = ['>=', id, currentMin];
    // get max
    let maxFilter = ['<=', id, currentMax];

    return [minFilter, maxFilter];
  });

  let mapboxFilters = ["all", ..._.flatten(filterTuples)];

  return mapboxFilters;
});

export const getMapLayers = createSelector([getStatesGeoJson, getSelectedChildCareGeoJson, getChildCareMapFilter], 
  (statesGeoJson, selectedChildCareGeoJson, childCareMapFilter) => {
  let statesLayer = getStateLayer(statesGeoJson);
  let childCareLayer = getChildCareLayers(selectedChildCareGeoJson, childCareMapFilter);
  return [childCareLayer, statesLayer];
});

const getChildCareLayers = (selectedChildCareGeoJson, filter) => {
  let sourceName = 'childCareGeoJson';
  const INSERT_LAYER_BEFORE = 'place-city-sm';
  let source = {
    id: sourceName,
    payload: {
      'type': 'geojson',
      'data': selectedChildCareGeoJson
    }
  };

  let childCareDotLayer = createMapboxGlLayer({
        id: 'childCareLayer',
        type: 'circle',
        source: sourceName,
        "layout": {
                "visibility": "visible"
            },

        interactive: false,
        // before: INSERT_LAYER_BEFORE,
        filter: filter,
        "paint": {
          "circle-color": {
              property: 'tier',
              stops: [
                  [0, '#d0d1e6'],
                  [1, '#a6bddb'],
                  [2, '#3690c0'],
                  [3, '#016c59']
              ]
          }, ///"hsl(211, 100%, 76%)",
                
                "circle-radius": {
                    "base": 1,
                    property: 'tier',
                    "stops": 
                    [
                      [{zoom: 3,  value: 0},   0.65],
                      [{zoom: 3,  value: 1}, 0.65],
                      [{zoom: 3,  value: 2}, 0.65],
                      [{zoom: 3,  value: 3}, 0.65],

                      [{zoom: 4,  value: 0},   0.75],
                      [{zoom: 4,  value: 1}, 0.75],
                      [{zoom: 4,  value: 2}, 0.75],
                      [{zoom: 4,  value: 3}, 0.75],

                      [{zoom: 6.2,  value: 0},   1.3],
                      [{zoom: 6.2,  value: 1}, 1.7],
                      [{zoom: 6.2,  value: 2}, 1.7],
                      [{zoom: 6.2,  value: 3}, 1.7],

                      [{zoom: 15,  value: 0}, 4.0],
                      [{zoom: 15,  value: 1}, 8.0],
                      [{zoom: 15,  value: 2}, 8.0],
                      [{zoom: 15,  value: 3}, 8.0],
                    ]
                }
            }
      }, INSERT_LAYER_BEFORE); // 

  let layers = [childCareDotLayer];

  return { source, layers };
}

const getStateLayer = (statesGeoJson) => {
  let sourceName = 'statesGeoJson';
  let source = {
      id: sourceName,
      payload: {
        'type': 'geojson',
        'data': statesGeoJson
      }
    };

  let stateFillLayer = createMapboxGlLayer({
        id: 'stateFillLayer',
        type: 'fill',
        source: sourceName,
        layout: {},
        interactive: true,
        paint: {
          'fill-color': '#989898',
          'fill-opacity': 0.01,
        }
      }, null);
  let stateOutlineLayer = createMapboxGlLayer({
    id: 'stateOutlineLayer',
    type: 'line',
    source: sourceName,
    layout: { 'visibility': 'visible' },
    "interactive": false,
    paint: {
      'line-color': '#989898',
      'line-opacity': 0.3,
      'line-width': 1.0
    }
  }, null);

  let stateSelectedLayer = createMapboxGlLayer({
    id: 'stateSelectionLayer',
    type: 'line',
    source: sourceName,
    layout: { 'visibility': 'visible' },
    "interactive": false,
    paint: {
      'line-color': '#374C67',
      'line-opacity': 0.8,
      'line-width': 3.0
    },
    "filter": ["==", "ui_isSelected", true]
  }, null);

  let layers = [ stateFillLayer, stateOutlineLayer, stateSelectedLayer ];
  return { source, layers, before: null };
}

const createMapboxGlLayer = (mapboxObject, insertBefore) => {
  return {
    definition: mapboxObject, insertBefore
  }
}
