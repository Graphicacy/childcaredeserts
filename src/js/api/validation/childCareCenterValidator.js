import createValidator from './propertyValidator';
import _ from 'lodash';

const ID_FIELD = '_id';
const EXPECTED_PROPERTY_VALIDATORS = {
  black: _.isNumber,
  density: _.isNumber,
  latino: _.isNumber,
  latitude: _.isNumber,
  longitude: _.isNumber,
  meanearnin: _.isNumber,
  name: _.isString,
  state: _.isNumber,
  tier: _.isNumber,
  [ID_FIELD]: _.isString,
  zcta: _.isString,
  zip: _.isString
};

export const childCareValidator = createValidator(EXPECTED_PROPERTY_VALIDATORS);
export default childCareValidator;
