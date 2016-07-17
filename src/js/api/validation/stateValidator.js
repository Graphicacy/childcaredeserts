import _ from 'lodash';
import createValidator from './propertyValidator';
const FEATURE_COLLECTION = 'FeatureCollection';
const ID_FIELD = 'STATE';
const EXPECTED_PROPERTY_VALIDATORS = {
  GEO_ID: _.isString,
  CENSUSAREA: _.isNumber,
  [ID_FIELD]: _.isString,
  NAME: _.isString
};

export const featurePropertiesValidator = createValidator(EXPECTED_PROPERTY_VALIDATORS);

const EXPECTED_GEO_JSON_FEATURE_COLLECTION_PROPERTIES =  {
  type: (type) => _.isString(type) && type == FEATURE_COLLECTION,
  features: (features) => {
    let isArray = _.isArray(features);
    if (isArray === false) {
      return false;
    }
    
    let everyPropertyIsValid = _.every(features, feature => featurePropertiesValidator(feature.properties));
    if (everyPropertyIsValid === false) {
      return false;
    }
    let uniqueItemsById = _(features)
      .map(f => f.properties[ID_FIELD])
      .uniq()
      .value();
    let everyPropertyIdIsUnique = uniqueItemsById && features && uniqueItemsById.length === features.length;

    return everyPropertyIsValid && everyPropertyIdIsUnique;
  }
};

export const geometryValidator = createValidator(EXPECTED_GEO_JSON_FEATURE_COLLECTION_PROPERTIES);
const validateGeoJson = (geoJson) => {
  if (geoJson == null) {
    throw new Error('geoJson cannot be null.');
  }

  let isValid = geometryValidator(geoJson);
  if (isValid === false) {
    throw new Error('geojson was invalid.');
  }

  return isValid;
};

export default validateGeoJson;