import BaseApi from './BaseApi';
import { tsvParse, csvParse } from 'd3-dsv';
import childCareCenterValidator from './validation/childCareCenterValidator';
import _ from 'lodash';

export const ENDPOINT = 'data';


const CHILD_CARE_CENTER_FILE_NAME = 'childCareCenters.tsv';
const CHILD_CARE_CENTER_BINARY = 'Child Care Desert binary variable.csv';

export class ChildCareCentersApiClass extends BaseApi {
  constructor (cache = {}, settings = null) {
    super(cache, settings);
  }

  fetchBinaryCC() {
    const request = super.get(`${ENDPOINT}/${CHILD_CARE_CENTER_BINARY}`);
    return request.then(result => {
      const parsed = csvParse(result);
      return parsed.map(p => ({
        zip: p.ZCTA,
        desert: !!(+p.ccdesert)
      }));
    });
  }

  fetchChildCareCenters () {
    const request = super.get(ENDPOINT + `/${CHILD_CARE_CENTER_FILE_NAME}`);
    return request.then(result => {
      try {
        const rawRows = tsvParse(result);

        // map the raw string data to numbers where applicable...
        const parsedRows = _.chain(rawRows)
          .filter(r => {
            return r.state !== '53';
          })
          .map(r => {
            const parsedObject = {
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
            if (!parsedObject.density) {
              parsedObject.meanearnin = parsedObject.density;
            }

            return parsedObject;
          })
          .value();
        // validate that we have the properties we need.
        const isValid = _.every(parsedRows, row => childCareCenterValidator(row));
        if (isValid === false) {
          throw new Error('child care centers tsv is not valid.');
        }

        return parsedRows;

      } catch (error) {
        return Promise.reject(error);
      }
    });
  }
}

export default new ChildCareCentersApiClass();
