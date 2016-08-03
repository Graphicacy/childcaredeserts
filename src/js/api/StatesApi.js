import BaseApi from './BaseApi';
import { geometryValidator } from './validation/stateValidator';
import topojson from 'topojson';
export const ENDPOINT = 'data';
import {default as bbox } from 'turf-bbox';
import { tsvParse } from 'd3-dsv';
import _ from 'lodash';

const STATE_FILE_NAME = 'states.json';

export class StatesApi extends BaseApi {
  constructor (settings, cache = null) {
    super(settings, cache);
  }

  fetchStatesGeometry () {
    let request = super.get(ENDPOINT + `/${STATE_FILE_NAME}`);

    return request.then(result => {
      try {
        // use topojson to get our geojson
        let states = topojson.feature(result, result.objects.states);

        // validate our results...
        geometryValidator(states);

        // and create a map-friendly properties object for each feature.
        let uiObject = {
          ui_isSelected: false,
          ui_isInactive: false
        };

        let fakeGeoJsonObject = {
          "type": "FeatureCollection",
          "features": []
        };
        states.features.forEach(f => {
          // attach the bounding box to the properties
          fakeGeoJsonObject.features = [f];
          f.properties.bbox = bbox(fakeGeoJsonObject);
          let bounds = [
            [f.properties.bbox[0], f.properties.bbox[1]],
            [f.properties.bbox[2], f.properties.bbox[3]]];
          f.properties.bounds = bounds;
          // attach UI-related code to the properties.
          f.properties = {...f.properties, ...uiObject};
        });
        return states;
      } catch (error) {
        return Promise.reject(error);
      }
    });
  }
}

export default new StatesApi();
