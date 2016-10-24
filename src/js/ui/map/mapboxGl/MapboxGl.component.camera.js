import React, { PropTypes } from 'react';
import _ from 'lodash';
import mapboxGl from 'mapbox-gl';

const MapboxGlComponentCamera = React.createClass( {
  propTypes: {
    camera: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired
  },

  componentDidMount() {
  },

  setBounds ({bounds, bearing = 0, /* angle = 0, */ animationSpeed = 1.4, pixelBuffer = 50 }) {
    if (!this.props.map) {
      /*eslint-disable no-console */
      console.warn('Map was driven prior to being available.');
      /*eslint-enable no-alert */
      return;
    }

    const width = window.innerWidth;

    const offset = (width <= 768)
      ? [0,0]
      : [200, 0];

    const mapBounds = mapboxGl.LngLatBounds.convert(bounds);
    this.props.map.fitBounds(mapBounds, { speed: animationSpeed,
      padding: pixelBuffer,
      pitch: bearing,
      offset: offset
    });
  },

  setOrientation ({bearing, angle}) {
    this.props.map.setBearing(angle);
    this.props.map.setPitch(bearing);
  },

  componentWillUpdate () {
  },

  // update camera takes priority. If there are two changes at once,
  // only update camera position - not bearing or angle.
  updateCamera (camera, previousCamera) {
    const isBoundsChanged = previousCamera.bounds !== camera.bounds;
    if (isBoundsChanged) {
      this.setBounds(camera);
      return true;
    }

    const previousOrientation = {bearing: previousCamera.bearing, angle: previousCamera.angle};
    const currentOrientation = {bearing: camera.bearing, angle: camera.angle};

    const isOrientationChanged = _.isEqual(previousOrientation, currentOrientation) === false;
    if (isOrientationChanged) {
      this.setOrientation(camera);
      return true;
    }

    return false;
  },

  componentDidUpdate(previousProps) {
    if (!this.props.map) {
      /*eslint-disable no-console */
      console.warn('Map was driven prior to being available.');
      /*eslint-enable no-console */
      return;
    }

    // update camera takes priority. If there are two changes at once,
    // only update camera position - not bearing or angle.
    this.updateCamera(this.props.camera, previousProps.camera);
  },

  componentWillUnmount() {

  },

  render () {
    return null;
  }
});

export default MapboxGlComponentCamera;
