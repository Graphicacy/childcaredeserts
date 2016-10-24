import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { format } from 'd3-format';
import _ from 'lodash';

import {
  getSelectedStateProperties,
  getStateDemographics,
  getZip,
  getStateZipGeoJsonDict,
  getZipDemogDict
} from '../sidebar/Sidebar.selectors';
import { stateListActions } from '../sidebar/StateList.state';

const StatePopupContainer = ({
    showPopup,
    selectedState,
    //zipInfo,
    hideStatePopup,
    showStatePopup,
    stateDemographics,
    selectedZip,
    zipDemogDict
  }) => {

  if (selectedZip && zipDemogDict) {
    console.log();
  }

  const data = _.get(zipDemogDict, selectedZip, {});
  const perc = n => Math.round( Number(n) * 100 ) + '%';

  const formatter = format(',');

  const zipInfo = selectedZip
    ? (
    <div>
      <div className="description-header">
        {selectedZip}
      </div>
      <div>
        Number of child care centers: {formatter(Number(data['numcenters']))}
        <br/>
        Population: {formatter(Number(data['totalpop']))}
        <br/>
        Percent White: {perc(data['perwhite'])}
        <br/>
        Percent Black: {perc(data['perblack'])}
        <br/>
        Percent Hispanic: {perc(data['perhispanic'])}
        <br/>
        <br/>
      </div>
    </div>
    )
    : (
    <span></span>
    )

  return (
    <div className={showPopup ? 'popup-container' : 'popup-container closed'}>
      <div className="popup">
        { showPopup ?
          <i className="icon-close icons" onClick={hideStatePopup}></i> :
          <i className="icon-plus icons" onClick={showStatePopup}></i> }
        <div>
          {zipInfo}
        </div>
        <div className="description-header">
          {selectedState.NAME}
        </div>
        <p>
          {stateDemographics.text_box}
        </p>
      </div>
    </div>
  );
};

StatePopupContainer.propTypes = {
  showPopup: PropTypes.bool,
  selectedState: PropTypes.object,
  zipInfo: PropTypes.element,
  showStatePopup: PropTypes.func,
  hideStatePopup: PropTypes.func,
  stateDemographics: PropTypes.object,
  selectedZip: PropTypes.string,
  zipGeoJsonDict: PropTypes.object,
  zipDemogDict: PropTypes.object
};


export default connect((state) => {
  const selectedState = getSelectedStateProperties(state);

  const obj = {
    showPopup: state.sidebar.stateList.showPopup,
    selectedState,
    stateDemographics: getStateDemographics(state),
    selectedZip: getZip(state),
    zipGeoJsonDict: getStateZipGeoJsonDict(state),
    zipDemogDict: getZipDemogDict(state)
  };

  return obj;
}, { ...stateListActions })(StatePopupContainer);
