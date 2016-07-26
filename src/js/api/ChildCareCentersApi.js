import BaseApi from './BaseApi';
import { geometryValidator } from './validation/stateValidator';
import topojson from 'topojson';
export const ENDPOINT = '/data';
import {default as bbox } from 'turf-bbox';
import { tsvParse } from 'd3-dsv';

const CHILD_CARE_CENTER_FILE_NAME = 'childCareCenters.tsv';

export class ChildCareCentersApi extends BaseApi {
  constructor (settings, cache = null) {
    super(settings, cache);
  }

  fetchChildCareCenters () {
    let request = super.get(ENDPOINT + `/${CHILD_CARE_CENTER_FILE_NAME}`);
    return request.then(result => {
      try {
        let rows = tsvParse(result);
        return rows;
      } catch (error) {
        return Promise.reject(error);
      }
    });
  };
};

export default new ChildCareCentersApi();
