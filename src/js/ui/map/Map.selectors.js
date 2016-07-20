import _ from 'lodash';
import { createSelector } from 'reselect';
import * as UiLoadingStatuses from '../constants/loadingStatus';
import { getIsDataReady, getStatesGeoJson} from '../sidebar/Sidebar.selectors';

export const getMapCamera = state => state.map.camera;
export const getMapGround = state => state.map.ground;
export const getMapSettings = state => state.map.settings;
export const getMapInteractivity = state => state.map.interactivity;

export const getIsReadyToInsertStateLayers = createSelector([getIsDataReady, getMapInteractivity], 
    (isDataReady, interactivity) => {
      return isDataReady && interactivity.isMapInitialized;
});

export const getMapLayers = createSelector([getStatesGeoJson], (statesGeoJson) => {
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
});

