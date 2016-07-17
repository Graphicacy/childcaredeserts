import BaseApi from './BaseApi';
import { geometryValidator } from './validation/stateValidator';
export const CUSTOMER_AREA_ENDPOINT = '/data';
const STATE_FILE_NAME = 'states.json';
export class GeometryApi extends BaseApi {
  constructor (settings, cache = null) {
    super(settings, cache);
  }

  fetchStateGeometry () {
    let request = super.get(CUSTOMER_AREA_ENDPOINT + `/${STATE_FILE_NAME}`);

    return request.then(result => {
      try {
        debugger;
        geometryValidator(result);
        return result;
      } catch (error) {
        // ensure we have a promise-based 
        // error propagation. 
        return Promise.reject(error);
      }
    });
  }
}

export default new GeometryApi();
