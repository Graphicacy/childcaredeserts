import BaseApi from './BaseApi';
import { geometryValidator } from './validation/stateValidator';
import * as topojson from 'topojson';
import {default as bbox } from 'turf-bbox';
import { csvParse } from 'd3-dsv';
import * as _ from 'lodash';

export const ENDPOINT = 'data';


const STATE_FILE_NAME = 'states.json';
const STATE_DEMOG_CSV = 'state_data_updated.csv';

export class StatesApiClass extends BaseApi {

  constructor (cache = {}, config = null) {
    super(cache, config);
  }


  fetchStatesDemographics() {
    const request = super.get(ENDPOINT + `/${STATE_DEMOG_CSV}`);
    return request.then(result => {
      const parsed = csvParse(result);
      return parsed.map(d => {
        return {
          ...d
        }
      });
    });
  }

  fetchStatesGeometry() {
    const request = super.get(ENDPOINT + `/${STATE_FILE_NAME}`);

    return request.then(result => {
      try {
        // use topojson to get our geojson
        const states = topojson.feature(result, result.objects.states);

        states.features = _.filter(states.features, state => {
          return state.properties.STATE !== "53";
        });

        // validate our results...
        geometryValidator(states);

        // and create a map-friendly properties object for each feature.
        const uiObject = {
          ui_isSelected: false,
          ui_isInactive: false
        };

        const fakeGeoJsonObject = {
          'type': 'FeatureCollection',
          'features': []
        };
        states.features.forEach(f => {
          // attach the bounding box to the properties
          fakeGeoJsonObject.features = [f];
          f.properties.bbox = bbox(fakeGeoJsonObject);
          const bounds = [
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

export default new StatesApiClass();
