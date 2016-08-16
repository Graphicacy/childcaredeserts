import BaseApi from './BaseApi';
import { geometryValidator } from './validation/zipsValidator';
import topojson from 'topojson';
export const ENDPOINT = 'data/zips';
import _ from 'lodash';


export class ZipsApi extends BaseApi {
  constructor (cache = {}, settings = null) {
    super(cache, settings);
  }

  fetchZips (stateId) {
    if (stateId == null || _.isNumber(stateId) === false) {
      Promise.reject('stateId must be a number');
    }

    // bounds check
    if (stateId < 0 || stateId > 99) {
      Promise.reject('stateId must be one or two digits long')
    }
    // argument needs to be a string number of length 2 to work.
    // so 8 --> '08'
    // and 58 --> '58'
    // https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript#comment33639551_10073699
    let sanitizedStateId = ('00' + stateId).substr(-2,2);

    // e.g. `zips_08`, etc etc
    let filePrefix = `zips_${sanitizedStateId}`;
    let endpoint = `${ENDPOINT}/${filePrefix}.topo.json`;
    let request = super.get(endpoint);
    return request.then(result => {
      try {
        let zips = topojson.feature(result, result.objects[filePrefix]);
        // geometryValidator(zips);
        return zips;
      } catch (error) {
        return Promise.reject(error);
      }
    });
  }
}

export default new ZipsApi();
