import React, { PropTypes } from 'react';
import mapboxGl from 'mapbox-gl';
import { geoBounds } from 'd3-geo';
import MapboxGlComponentLayer from './MapboxGl.component.layer';
import MapboxGlComponentCamera from './MapboxGl.component.camera';
import * as urbanicity from '../../constants/urbanicity';
// import MapboxGlComponentUrlLayer from './MapboxGl.component.urlLayer';

const MapboxGlComponent = React.createClass( {

  propTypes: {
    camera: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    ground: PropTypes.object.isRequired,
    layers: PropTypes.array.isRequired,
    elementId: PropTypes.string.isRequired,
    onMapInitialized: PropTypes.func.isRequired,
    onMapReadyToDisplay: PropTypes.func.isRequired,
    isReadyToInsertStateLayers: PropTypes.bool.isRequired,
    onFeatureClick: PropTypes.func,
    onFeatureHover: PropTypes.func,
    overlayMode: PropTypes.string,
    urbanicity: PropTypes.string,
    selectedZip: PropTypes.string,
    stateZipGeoJsonDict: PropTypes.object,
    setCameraBounds: PropTypes.func
  },

  componentDidMount() {
    mapboxGl.accessToken = this.props.settings.token;

    this.map = new mapboxGl.Map({
      container: this.props.elementId,
      // we're going to try to override this ASAP actually.
      // currently CAP style mapbox://styles/cap/ciqxz8ptq0007bonnm0lmwz45 in map.state.ground
      style: this.props.ground.mapStyle,
      boxZoom: false,
      dragRotate: false,
      keyboard: false,
      touchZoomRotate: true,
      drageRotate: false,
      maxZoom: 11,
    });

    // disable useless things like rotate, etc
    this.map.touchZoomRotate.disableRotation();

    // initialize to our bounds.
    setTimeout(() => {
      this.map.resize();
    }, 800);

    if (this.props.camera.bounds) {
      // overpad the map just a bit, and an instant later, zoom out, set max bounds, and zoom back in.
      this.map.fitBounds(this.props.camera.bounds, {linear: false, padding: 20, speed: 1000});
      setTimeout(() => {
        const zoomedOut = this.map.getZoom() * 0.80;
        this.map.setZoom(zoomedOut);
        const currentBounds = this.map.getBounds();
        this.map.setMaxBounds(currentBounds);
        this.map.fitBounds(this.props.camera.bounds, {linear: false, padding: 20, speed: 100});
      }, 1000);
    }

    this.map.once('style.load', () => {
      if (this.props.onMapInitialized) {
        this.props.onMapInitialized(this.map);
      }
    });

    this.map.once('load', () => {
      if (this.props.onMapInitialized) {
        this.props.onMapReadyToDisplay(this.map);
      }
    });

    this.map.scrollZoom.disable();
    this.map.touchZoomRotate.disable();
    this.map.dragRotate.disable();
    this.map.addControl(new mapboxGl.Navigation({ position: 'top-left' }));
  },

  componentWillUnmount () {
    this.map.remove();
  },

  render() {
    if (this.props.isReadyToInsertStateLayers === false) {
      return null;
    }

    // TODO: is there a clean way to remove this from the mapbox component?
    const CHILDCARE_LAYER = 'childCareLayer';
    const ZIP_LAYER = 'zips_style';
    const ZIP_OUTLINE = 'zipOutlineLayer';

    const overlayMode = this.props.overlayMode;
    const hasChildcareLayer = !!this.map.getLayer(CHILDCARE_LAYER);
    const hasZipLayer = !!this.map.getLayer(ZIP_LAYER);
    const hasZipOutline = !!this.map.getLayer(ZIP_OUTLINE);

    if (hasChildcareLayer) {
      const isVisible = this.map.getLayoutProperty(CHILDCARE_LAYER, 'visibility') === 'visible';

      if (!isVisible && overlayMode === 'CENTERS') {
        this.map.setLayoutProperty(CHILDCARE_LAYER, 'visibility', 'visible');
        hasZipLayer && this.map.setPaintProperty(ZIP_LAYER, 'fill-opacity', 0.3);
      } else if (isVisible && overlayMode === 'DESERTS'){
        this.map.setLayoutProperty(CHILDCARE_LAYER, 'visibility', 'none');
        hasZipLayer && this.map.setPaintProperty(ZIP_LAYER, 'fill-opacity', 1);
      }

      // TODO: standardize string vs number in props
      if (hasZipLayer) {
        switch (this.props.urbanicity) {
          case urbanicity.ALL: {
            this.map.setFilter(ZIP_LAYER, ['in', 'urb', '1', '2', '3']);
            this.map.setFilter(CHILDCARE_LAYER, ['in', 'urbanicity', 1, 2, 3]);
            break;
          }
          case urbanicity.RURAL: {
            this.map.setFilter(ZIP_LAYER, ['==', 'urb', '3']);
            this.map.setFilter(CHILDCARE_LAYER, ['==', 'urbanicity', 3]);
            break;
          }
          case urbanicity.SUBURBAN: {
            this.map.setFilter(ZIP_LAYER, ['==', 'urb', '2']);
            this.map.setFilter(CHILDCARE_LAYER, ['==', 'urbanicity', 2]);
            break;
          }
          case urbanicity.URBAN: {
            this.map.setFilter(ZIP_LAYER, ['==', 'urb', '1']);
            this.map.setFilter(CHILDCARE_LAYER, ['==', 'urbanicity', 1]);
            break;
          }
        }
      }

    }

    const zip = this.props.selectedZip;
    if (hasZipOutline) {
      if (zip && this.props.stateZipGeoJsonDict) {
        const zipGeoJson = this.props.stateZipGeoJsonDict[zip];
        const bounds = geoBounds(zipGeoJson);
        this.map.setFilter(ZIP_OUTLINE, ['==', 'ZCTA5CE10', zip]);
        const width = window.innerWidth;

        const offset = (width <= 768)
          ? [0,0]
          : [220, 0];

        this.map.fitBounds(bounds, {
          bearing: 0,
          animationSpeed: 1.4,
          pixelBuffer: 100,
          offset: offset
        });
      } else {
        this.map.setFilter(ZIP_OUTLINE, ['==', 'ZCTA5CE10', '-1']);
      }
    }



    return (
      <div> {
        (this.props.isReadyToInsertStateLayers) &&
        (
          <div>
            {
              this.props.layers.map((mapLayer, index) => {
                return (
                  <MapboxGlComponentLayer
                    key={index}
                    source={mapLayer.source}
                    layers={mapLayer.layers}
                    onFeatureClick={this.props.onFeatureClick}
                    onFeatureHover={this.props.onFeatureHover}
                    map={this.map} />
                );
              })
            }

            <MapboxGlComponentCamera
              camera={this.props.camera}
              map={this.map}/>
          </div>
        )
      }
      </div>);
  }
});


export default MapboxGlComponent;
