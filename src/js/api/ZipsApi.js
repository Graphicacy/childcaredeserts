import BaseApi from './BaseApi';
import { csvParse } from 'd3-dsv';
import _ from 'lodash';

export const ENDPOINT = 'data';

export const ZIP_URBANICITY_CSV = 'zips_urbanicity.csv';
export const ZIP_DEMOG_CSV = 'ZIPcodestats_forGraphicacy.csv';

class ZipsApi extends BaseApi {
  constructor (cache = {}, settings = null) {
    super(cache, settings);
  }

  fetchZipDemogs() {
    const request = super.get(`${ENDPOINT}/${ZIP_DEMOG_CSV}`);
    return request.then(result => {
      const parsed = csvParse(result);
      return parsed;
    });
  }

  fetchZipUrbanicity() {
    const request = super.get(`${ENDPOINT}/${ZIP_URBANICITY_CSV}`);
    return request.then(result => {
      const parsed = csvParse(result);
      return parsed;
    });
  }

  getStateGeoJson(stateId) {
    const request = super.get(
      `${ENDPOINT}/zipdata/zip_${_.padStart(stateId, 2, '0')}.geo.json`
    );

    return request.then(result => {
      return { geojson: result, stateId };
    });
  }

}

export default new ZipsApi();
