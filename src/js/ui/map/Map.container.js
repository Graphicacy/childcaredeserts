import React, { PropTypes } from 'react';
import { connect } from 'react-redux';


import MapboxGlComponent from './mapboxGl/MapboxGl.component';
import { getMapCamera,
         getMapGround,
         getMapSettings,
         getMapLayers,
         getMapInteractivity,
         getIsReadyToInsertStateLayers} from './Map.selectors';

import { mapInteractivityActions } from './Map.state.interactivity';
import { mapActions } from './Map.state';
import { selectState, setZip } from '../sidebar/StateList.state';
import { getStateDictionary,
         getSelectedState,
         getOverlayMode,
         getUrbanicity,
         getZip,
         getStateZipGeoJsonDict } from '../sidebar/Sidebar.selectors';

import StatePopup from './StatePopup.container';

const mapStateToProps = (state) => {
  const obj = {
    camera: getMapCamera(state),
    ground: getMapGround(state),
    layers: getMapLayers(state),
    settings: getMapSettings(state),
    overlayMode: getOverlayMode(state),
    urbanicity: getUrbanicity(state),
    interactivity: getMapInteractivity(state),
    isReadyToInsertStateLayers: getIsReadyToInsertStateLayers(state),
    selectedZip: getZip(state),
    dictionary: getStateDictionary(state),
    selectedState: getSelectedState(state),
    stateZipGeoJsonDict: getStateZipGeoJsonDict(state)
  };
  return obj;
};

const MapContainer = React.createClass( {
  propTypes: {
    selectState: PropTypes.func.isRequired,
    setIsMapInitialized: PropTypes.func.isRequired,
    resetMap: PropTypes.func.isRequired,
    camera: PropTypes.object.isRequired,
    ground: PropTypes.object.isRequired,
    layers: PropTypes.array.isRequired,
    overlayMode: PropTypes.string,
    urbanicity: PropTypes.string,
    settings: PropTypes.object.isRequired,
    interactivity: PropTypes.object.isRequired,
    isReadyToInsertStateLayers: PropTypes.bool,
    hoverOverZip: PropTypes.func.isRequired,
    hoverOverNoZip: PropTypes.func.isRequired,
    selectedZip: PropTypes.string,
    dictionary: PropTypes.object,
    selectedState: PropTypes.object,
    stateZipGeoJsonDict: PropTypes.object,
    setCameraBounds: PropTypes.func,
    setZip: PropTypes.func
  },

  onMapIsInitialized() {
    this.props.setIsMapInitialized(true);
  },

  onMapIsReadyToDisplay() {
    // console.log('map is ready to display.');
  },

  onFeatureClick(feature) {
    if (feature && feature.properties && feature.properties.ZCTA5CE10) {
      this.props.setZip(feature.properties.ZCTA5CE10);
    }
  },

  onFeatureHover(/*feature*/) {
    // if (feature.layer.id === 'zips_style') {
    //   const props = {...feature.properties};
    //   props.dem = props.dem && JSON.parse(props.dem);
    //   this.props.hoverOverZip(props);
    // } else if (this.props.zip) {
    //   //this.props.hoverOverNoZip();
    // }
  },



  render () {
    const popup = !this.props.selectedState ? '' : (
      <StatePopup selectedState={this.props.selectedState}
                  showPopup={true} />
    );

    return (
      <div className="map-container">
        {popup}
        <div id="mapboxGl" className="map">
          <MapboxGlComponent
            camera={this.props.camera}
            ground={this.props.ground}
            layers={this.props.layers}
            overlayMode={this.props.overlayMode}
            urbanicity={this.props.urbanicity}
            selectedZip={this.props.selectedZip}
            stateZipGeoJsonDict={this.props.stateZipGeoJsonDict}
            setCameraBounds={this.props.setCameraBounds}
            settings={this.props.settings}
            interactivity={this.props.interactivity}
            elementId="mapboxGl"
            onMapInitialized={this.onMapIsInitialized}
            onMapReadyToDisplay={this.onMapIsReadyToDisplay}
            isReadyToInsertStateLayers={this.props.isReadyToInsertStateLayers}
            onFeatureClick={this.onFeatureClick}
            onFeatureHover={this.onFeatureHover}
            />
        </div>
      </div>
    );
  }
});

export default connect(
  mapStateToProps, {...mapInteractivityActions, selectState, setZip, ...mapActions }
)(MapContainer);
