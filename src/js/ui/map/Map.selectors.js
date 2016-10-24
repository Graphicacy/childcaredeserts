import _ from 'lodash';
import { createSelector } from 'reselect';
import {
  getIsDataReady,
  getStatesGeoJson,
  getSelectedStateProperties,
  getChildCareCentersGeoJsonDictionary,
  getOverlayMode
  } from '../sidebar/Sidebar.selectors';

import { ORANGE, GRAY } from '../sidebar/StateCharts.container';

export const getMapCamera = state => state.map.camera;
export const getMapGround = state => state.map.ground;
export const getMapSettings = state => state.map.settings;
export const getMapInteractivity = state => state.map.interactivity;

export const getIsReadyToInsertStateLayers = createSelector([getIsDataReady, getMapInteractivity],
    (isDataReady, interactivity) => {
      return isDataReady && interactivity.isMapInitialized;
    });

const emptyGeoJson = {
  'type': 'FeatureCollection',
  'features': []
};


export const getSelectedChildCareGeoJson = createSelector(
[getIsDataReady, getChildCareCentersGeoJsonDictionary],
(isDataReady, childCareCenters) => {
  if (!isDataReady) {
    return emptyGeoJson;
  }

  return childCareCenters;
});


export const getMapZipcodeUrl = createSelector([getSelectedStateProperties], (selectedState) => {
  if (!selectedState) {
    return null;
  }

  const url = `data/zipdata/zip_${selectedState.STATE}.geo.json`;
  return url;
});

export const getZipsLayer = (zipcodeUrl, overlayMode) => {
  if (!zipcodeUrl) {
    return null;
  }

  const SOURCE_NAME = zipcodeUrl;
  const INSERT_LAYER_BEFORE = 'childCareLayer';

  const source = {
    id: SOURCE_NAME,
    payload: {
      type: 'topojson',
      data: zipcodeUrl
    }
  };

  const opacity = (overlayMode === 'CENTERS' ? 0.3 : 1);

  // todo: normalize this.
  const zipcodeLayer = createMapboxGlLayer({
    'id': 'zips_style',
    'type': 'fill',
    'source': SOURCE_NAME,
    'interactive': true,
    'filter': [
      '==',
      '$type',
      'Polygon'
    ],
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'fill-antialias': true,
      'fill-opacity': opacity,
      'fill-outline-color': '#555555',
      'fill-color': {
        'property': 'ccd',
        'stops': [
          [ 0, GRAY ],
          [ 1, ORANGE ]
        ]
      }
    }
  }, INSERT_LAYER_BEFORE);


  const zipOutlineLayer = createMapboxGlLayer({
    id: 'zipOutlineLayer',
    type: 'line',
    source: SOURCE_NAME,
    layout: { 'visibility': 'visible' },
    'interactive': false,
    paint: {
      'line-color': '#555555',
      'line-opacity': 1,
      'line-width': 2.0
    },
    'filter': ['==', 'ZCTA5CE10', '-1']
  }, null);


  return { source, layers: [
    zipcodeLayer, zipOutlineLayer
  ] };
};

export const getMapLayers = createSelector(
  [getStatesGeoJson, getMapZipcodeUrl,  getSelectedChildCareGeoJson, getOverlayMode ],
  (statesGeoJson, zipUrl, selectedChildCareGeoJson, overlayMode) => {
    const statesLayer = getStateLayer(statesGeoJson);
    const zipsLayer = getZipsLayer(zipUrl, overlayMode);
    const childCareLayer = getChildCareLayers(selectedChildCareGeoJson);

    return _.without([statesLayer, childCareLayer, zipsLayer], null);
  });


const getStateLayer = (statesGeoJson) => {
  const sourceName = 'statesGeoJson';
  const source = {
    id: sourceName,
    payload: {
      'type': 'geojson',
      'data': statesGeoJson
    }
  };

  const stateFillLayer = createMapboxGlLayer({
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
  const stateOutlineLayer = createMapboxGlLayer({
    id: 'stateOutlineLayer',
    type: 'line',
    source: sourceName,
    layout: { 'visibility': 'visible' },
    'interactive': false,
    paint: {
      'line-color': '#989898',
      'line-opacity': 0.3,
      'line-width': 1.0
    }
  }, null);

  const stateSelectedLayer = createMapboxGlLayer({
    id: 'stateSelectionLayer',
    type: 'line',
    source: sourceName,
    layout: { 'visibility': 'visible' },
    'interactive': false,
    paint: {
      'line-color': '#374C67',
      'line-opacity': 0.8,
      'line-width': 3.0
    },
    'filter': ['==', 'ui_isSelected', true]
  }, null);

  const layers = [ stateFillLayer, stateOutlineLayer, stateSelectedLayer ];
  return { source, layers, before: 'water' };
};


const getChildCareLayers = (selectedChildCareGeoJson) => {
  const sourceName = 'childCareGeoJson';
  const INSERT_LAYER_BEFORE = 'place-city-sm';
  const source = {
    id: sourceName,
    payload: {
      'type': 'geojson',
      'data': selectedChildCareGeoJson
    }
  };

  const childCareDotLayer = createMapboxGlLayer({
    id: 'childCareLayer',
    type: 'circle',
    source: sourceName,
    'layout': {
      'visibility': 'visible'
    },

    interactive: false,
        // before: INSERT_LAYER_BEFORE,
    'paint': {
      'circle-color': {
        property: 'tier',
        stops: [
          [0, '#005288'],
          [1, '#005288'],
          [2, '#005288'],
          [3, '#005288']
        ]
      },

      'circle-radius': {
        'base': 1,
        property: 'tier',
        'stops':
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
          [{zoom: 6.2,  value: 1}, 1.3],
          [{zoom: 6.2,  value: 2}, 1.3],
          [{zoom: 6.2,  value: 3}, 1.3],

          [{zoom: 15,  value: 0}, 4.0],
          [{zoom: 15,  value: 1}, 4.0],
          [{zoom: 15,  value: 2}, 4.0],
          [{zoom: 15,  value: 3}, 4.0],
        ]
      }
    }
  }, INSERT_LAYER_BEFORE); //

  const layers = [childCareDotLayer];

  return { source, layers };
};



const createMapboxGlLayer = (mapboxObject, insertBefore) => {
  return {
    definition: mapboxObject, insertBefore
  };
};
