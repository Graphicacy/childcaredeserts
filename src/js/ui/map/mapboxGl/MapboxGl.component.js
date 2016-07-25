import React, { PropTypes } from 'react';
import mapboxGl from 'mapbox-gl';
import MapboxGlComponentLayer from './MapboxGl.component.layer';
import MapboxGlComponentCamera from './MapboxGl.component.camera';
import _ from 'lodash';
const MapboxGlComponent = React.createClass( {
  propTypes: {
    camera: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    ground: PropTypes.object.isRequired,
    layers: PropTypes.object.isRequired,
    elementId: PropTypes.string.isRequired,
    onMapInitialized: PropTypes.func.isRequired,
    onMapReadyToDisplay: PropTypes.func.isRequired,
    isReadyToInsertStateLayers: PropTypes.bool.isRequired,
    onFeatureClick: PropTypes.func,
    onFeatureHover: PropTypes.func,
    mapLayers: PropTypes.object,
  },

  componentDidMount() {
    mapboxGl.accessToken = this.props.settings.token;
    this.map = new mapboxGl.Map({
        container: this.props.elementId,
        // we're going to try to override this ASAP actually.
        style: this.props.ground.mapStyle,
        boxZoom: false,
        dragRotate: false,
        keyboard: false,
        touchZoomRotate: true,
        drageRotate: false,
        maxZoom: 16.5
      });

    // disable useless things like rotate, etc
    this.map.touchZoomRotate.disableRotation();
    // initialize to our bounds.
    if (this.props.camera.bounds != null) {
      // overpad the map just a bit, and an instant later, zoom out, set max bounds, and zoom back in.
      this.map.fitBounds(this.props.camera.bounds, {linear: false, padding: 20, speed: 100});
      setTimeout(() => {
        let zoomedOut = this.map.getZoom() * 0.80;
        this.map.setZoom(zoomedOut);
        let currentBounds = this.map.getBounds();
        this.map.setMaxBounds(currentBounds);
        this.map.fitBounds(this.props.camera.bounds, {linear: false, padding: 20, speed: 100});
      }, 100)
    }
    
    this.map.once('style.load', () => {
      if (this.props.onMapInitialized != null) {
        this.props.onMapInitialized(this.map);
      }
    });

    this.map.once('load', () => {
      if (this.props.onMapInitialized != null) {
        this.props.onMapReadyToDisplay(this.map);
      }
    });
  },

  render () {
    if (this.props.isReadyToInsertStateLayers === false) {
      return null;
    }
    
    return (
      <div>
      {(this.props.isReadyToInsertStateLayers) && 
        <div>
          <MapboxGlComponentLayer 
            source={this.props.mapLayers.source} 
            layers={this.props.mapLayers.layers}
            onFeatureClick={this.props.onFeatureClick}
            onFeatureHover={this.props.onFeatureHover}
            map={this.map} />
          <MapboxGlComponentCamera 
            camera={this.props.camera}
            map={this.map}/>
        </div>
        }
      </div>)
  }
});

export default MapboxGlComponent;
