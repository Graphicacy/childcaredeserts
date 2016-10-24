import { createAction, handleActions } from 'redux-actions';
import { some, clamp } from 'lodash';

// ------------------------------------
// Constants
// ------------------------------------
export const BOUNDING_BOX_OF_LOWER_48_STATES = [
  [-113.1591796875,51.1242127578],[-71.0595703125,27.9555910046]
];

//[[[-113.1591796875,27.9555910046],[-113.1591796875,49.3537557183],[-71.0595703125,49.3537557183],[-71.0595703125,27.9555910046],[-113.1591796875,27.9555910046]]]

// [[-124.763068, 24.544701], [-66.949895, 49.384358]];
export const MAP_CAMERA_SET_BOUNDS          = 'MAP_CAMERA_SET_BOUNDS';
export const MAP_CAMERA_SET_BEARING         = 'MAP_CAMERA_SET_BEARING';
export const MAP_CAMERA_SET_ANGLE           = 'MAP_CAMERA_SET_ANGLE';
export const MAP_CAMERA_SET_PIXEL_BUFFER    = 'MAP_CAMERA_SET_PIXEL_BUFFER';
export const MAP_CAMERA_SET_ANIMATION_SPEED = 'MAP_CAMERA_SET_ANIMATION_SPEED';

// ------------------------------------
// Default State
// ------------------------------------
const DEFAULT_CAMERA_STATE = {
  bounds: BOUNDING_BOX_OF_LOWER_48_STATES,
  bearing: 0.0,
  angle: 0.0,
  pixelBuffer: 20.0,
  animationSpeed: 0.7
};

// ------------------------------------
// Actions
// ------------------------------------
export const setCameraBounds         = createAction(MAP_CAMERA_SET_BOUNDS);
export const setCameraBearing        = createAction(MAP_CAMERA_SET_BEARING);
export const setCameraAngle          = createAction(MAP_CAMERA_SET_ANGLE);
export const setCameraPixelBuffer    = createAction(MAP_CAMERA_SET_PIXEL_BUFFER);
export const setCameraAnimationSpeed = createAction(MAP_CAMERA_SET_ANIMATION_SPEED);

export const mapCameraActions = {
  setCameraBounds,
  setCameraBearing,
  setCameraAngle,
  setCameraPixelBuffer,
  setCameraAnimationSpeed
};

const MERCATOR_PROJECTION_BOUNDS = {
  longitude: [-180, 180],
  latitude:  [-85, 85]
};

const cleanBounds = (minLong, minLat, maxLong, maxLat) => {
  [minLong, minLat, maxLong, maxLat] = [minLong, minLat, maxLong, maxLat].map(x => parseFloat(x));
  const isInvalid = some([minLong, minLat, maxLong, maxLat], isNaN);
  if (isInvalid) {
    return null;
  }

  const bounds = [
    [
      clamp(minLong, MERCATOR_PROJECTION_BOUNDS.longitude[0], MERCATOR_PROJECTION_BOUNDS.longitude[1]),
      clamp(minLat, MERCATOR_PROJECTION_BOUNDS.latitude[0],  MERCATOR_PROJECTION_BOUNDS.latitude[1])
    ],
    [
      clamp(maxLong, MERCATOR_PROJECTION_BOUNDS.longitude[0], MERCATOR_PROJECTION_BOUNDS.longitude[1]),
      clamp(maxLat, MERCATOR_PROJECTION_BOUNDS.latitude[0],  MERCATOR_PROJECTION_BOUNDS.latitude[1])
    ]
  ];

  return bounds;
};

const actionHandlers = {
  MAP_CAMERA_SET_BOUNDS: (state, { payload }) => {
    const { bounds } = payload;
    const isBoundsValid = bounds && bounds.length === 2;
    if (isBoundsValid === false) {
      return state;
    }

    const cleanedBounds = cleanBounds(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]);
    if (!cleanedBounds) {
      return state;
    }

    return { ...state, bounds: cleanedBounds };
  },

  MAP_CAMERA_SET_BEARING: (state, { payload: { bearing } }) => {
    return { ...state, bearing };
  },

  MAP_CAMERA_SET_ANGLE: (state, { payload: { angle } }) => {
    return { ...state, angle: clamp(angle, 0, 360) };
  },

  MAP_CAMERA_SET_PIXEL_BUFFER: (state, { payload: { pixelBuffer } }) => {
    return { ...state, pixelBuffer: clamp(pixelBuffer, 0, 500) };
  },

  MAP_CAMERA_SET_ANIMATION_SPEED: (state, { payload: { animationSpeed } }) => {
    return { ...state, animationSpeed: clamp(animationSpeed, 0.00001, 5) };

  }
};

export default handleActions(actionHandlers, DEFAULT_CAMERA_STATE);
