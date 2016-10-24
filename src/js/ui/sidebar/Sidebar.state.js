import { combineReducers } from 'redux';
import stateListReducer from './StateList.state';

export default combineReducers({
  stateList: stateListReducer
});
