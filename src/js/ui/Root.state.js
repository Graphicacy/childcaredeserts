import { combineReducers } from 'redux';
import sidebarReducer from './sidebar/Sidebar.state';
import mapReducer from './map/Map.state';

export default combineReducers({
  sidebar: sidebarReducer,
  map: mapReducer
});
