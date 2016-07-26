import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MapboxGlComponent from './mapboxGl/MapboxGl.component';
import { getMapCamera, getMapGround, getMapSettings, getMapLayers, getMapInteractivity, getIsReadyToInsertStateLayers} from './Map.selectors';
import { mapInteractivityActions } from './Map.state.interactivity';
import { selectState } from '../sidebar/states/StateList.state';


const mapStateToProps = (state) => {
  let obj = {
    camera: getMapCamera(state),
    ground: getMapGround(state),
    layers: getMapLayers(state),
    settings: getMapSettings(state),
    interactivity: getMapInteractivity(state),
    isReadyToInsertStateLayers: getIsReadyToInsertStateLayers(state)
  };
  return obj;
};

const MapContainer = React.createClass( {
  propTypes: {
    selectState: PropTypes.func.isRequired,
    setIsMapInitialized: PropTypes.func.isRequired,
    resetMap: PropTypes.func.isRequired
  },

  onMapIsInitialized(mapReference) {
    this.props.setIsMapInitialized(true);
  },

  onMapIsReadyToDisplay(mapReference) {
    console.log('map is ready to display.');
  },

  onFeatureClick(feature) {
    this.props.selectState(feature.properties);
  },

  onFeatureHover(feature) {
    
  },

  render () {
    return (
      <div id="mapboxGl" className="map">
        <MapboxGlComponent
          camera={this.props.camera}
          ground={this.props.ground}
          layers={this.props.layers}
          settings={this.props.settings}
          interactivity={this.props.interactivity}
          elementId="mapboxGl"
          onMapInitialized={this.onMapIsInitialized}
          onMapReadyToDisplay={this.onMapIsReadyToDisplay}
          isReadyToInsertStateLayers={this.props.isReadyToInsertStateLayers}
          onFeatureClick={this.onFeatureClick}
          onFeatureHover={this.onFeatureHover}
          />
        <div className="ll">
          <span>lower left</span>
        </div>
        <div className="lr">
          <span>lower right</span> 
        </div>
        <div className="ul">
          <span>upper left</span>
        </div>
        <div className="ur"> 
          <span>upper right</span> 
        </div>
      </div>
    );
  }
});

export default connect(mapStateToProps, {...mapInteractivityActions, selectState })(MapContainer);
