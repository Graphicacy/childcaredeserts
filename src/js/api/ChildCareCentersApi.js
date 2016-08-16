import BaseApi from './BaseApi';
import { geometryValidator } from './validation/stateValidator';
import topojson from 'topojson';
export const ENDPOINT = 'data';
import {default as bbox } from 'turf-bbox';
import { tsvParse } from 'd3-dsv';
import childCareValidator from './validation/childCareCenterValidator';
import _ from 'lodash';

const CHILD_CARE_CENTER_FILE_NAME = 'childCareCenters.tsv';

export class ChildCareCentersApi extends BaseApi {
  constructor (cache = {}, settings = null) {
    super(cache, settings);
  }

  fetchChildCareCenters () {
    let request = super.get(ENDPOINT + `/${CHILD_CARE_CENTER_FILE_NAME}`);
    return request.then(result => {
      try {
        let rawRows = tsvParse(result);

        // map the raw string data to numbers where applicable...
        let parsedRows = rawRows.map(r => {
          let parsedObject = {
            // parse our numbers quickly...
            black: +r.black,
            density: +r.density,
            latino: +r.latino,
            latitude: +r.latitude,
            longitude: +r.longitude,
            meanearnin: +r.meanearnin,
            state: +r.state,
            tier: +r.tier,

            // and pass through the rest.
            name: r.name,
            _id: r._id,
            zcta: r.zcta,
            zip: r.zip
          };

          //TODO: we have bad data so we're fixing it.
          if (parsedObject.density == null || parsedObject.density === 0) {
            parsedObject.meanearnin = parsedObject.density;
          }

          return parsedObject;
        });
        // validate that we have the properties we need.
        let isValid = _.every(parsedRows, row => {
          let isPass = childCareValidator(row);
          if (isPass === false) {
          }

          return isPass;
        });
        if (isValid === false) {
          throw new Error('child care centers tsv is not valid.');
        }

        return parsedRows;

      } catch (error) {
        return Promise.reject(error);
      }
    });
  };
};

export default new ChildCareCentersApi();
