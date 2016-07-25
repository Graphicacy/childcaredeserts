'use strict';
import { combineReducers } from 'redux';

import cameraActions from './Map.state.camera';
import groundActions from './Map.state.ground';
import settingsActions from './Map.state.settings';
import interactivityActions from './Map.state.interactivity';

import { mapCameraActions } from './Map.state.camera';
import { mapGroundActions } from './Map.state.ground';
import { mapSettingsActions } from './Map.state.settings';
import { mapInteractivityActions } from './Map.state.interactivity';

export const mapActions = { 
  ...mapCameraActions,
  ...mapGroundActions,
  ...mapSettingsActions,
  ...mapInteractivityActions
};

export default combineReducers({
  camera:        cameraActions,
  ground:        groundActions,
  settings:      settingsActions,
  interactivity: interactivityActions
});
