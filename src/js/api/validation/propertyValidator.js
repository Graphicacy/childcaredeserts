import _ from 'lodash';


// The first thing you need to know about this function
// is that it curries `expectedProperties` and
// returns a new function that accepts
// an arbitrary `scrutinizedObject` argument.
const createValidator = (expectedProperties) => {
  if (expectedProperties == null) {
    throw new Error('validation requires a manifest of expected properties');
  }

  let validationKeys = _.keys(expectedProperties);
  if (validationKeys.length === 0) {
    return () => true;
  }

  // some hot currying action in this function.
  return (scrutinizedObject) => {
    // if scrutinizedObject is null and we're expected to have props,
    // obviously that's bad...
    if (scrutinizedObject == null) {
      return false;
    }

    // trying to keep things fast here... :/
    for (let currentKey in validationKeys) {
      // this sounds odd, I know. I'm getting the 
      // sought property key. if you wanted to make sure
      // you had the property 'foo', then `validationKey`
      // is `foo` - current key would be 0, 1, 2, 3 etc...
      let validationKey = validationKeys[currentKey];
      // this method is slow, but there are good ways to optimize it.
      // I need to be correct before fast.
      // What if it's named "undefined"?
      // what if it's further down the prototype chain?
      if (_.hasIn(scrutinizedObject, validationKey) === false) {
        return false;
      }

      // get the optional validation function.
      let validator = expectedProperties[validationKey];
      if (validator == null) {
        // if the validator is null, they didn't provide one
        // and that's ok.
        continue;
      }

      // Validate to ensure the propeperty is what we expect.
      let propertyToValidate = scrutinizedObject[validationKey];
      let isValid = validator(propertyToValidate);
      if (isValid === false) {
        return false;
      }
    }

    return true;
  };
};

export default createValidator;