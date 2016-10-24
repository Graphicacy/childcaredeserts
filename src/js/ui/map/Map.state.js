import { combineReducers } from 'redux';

import { default as cameraActions, mapCameraActions } from './Map.state.camera';
import { default as groundActions, mapGroundActions } from './Map.state.ground';
import { default as settingsActions, mapSettingsActions } from './Map.state.settings';
import { default as interactivityActions, mapInteractivityActions } from './Map.state.interactivity';




export const mapActions = {
  ...mapCameraActions,
  ...mapGroundActions,
  ...mapSettingsActions,
  ...mapInteractivityActions,
};

export default combineReducers({
  camera:        cameraActions,
  ground:        groundActions,
  settings:      settingsActions,
  interactivity: interactivityActions
});
