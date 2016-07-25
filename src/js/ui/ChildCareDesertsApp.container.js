import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MapContainer from './map/Map.container';
import SidebarContainer from './sidebar/Sidebar.container';

import { stateListActions } from './sidebar/states/StateList.state';

const mapStateToProps = (state) => {
  let obj = {
  };
  return obj;
};

const ChildCareDesertsAppContainer = React.createClass( {
  propTypes: {
    // actions
    fetchStates: PropTypes.func.isRequired
  },

  componentDidMount() {
    this.props.fetchStates();
  },

  render () {
    return (
      <div className='app-container'>
          <div className='sidebar-container'>
            <SidebarContainer/>
          </div>
          <div className='map-container'>
            <MapContainer/>
          </div>
      </div>
    );
  }
});

export default connect(mapStateToProps, { ...stateListActions })(ChildCareDesertsAppContainer);
