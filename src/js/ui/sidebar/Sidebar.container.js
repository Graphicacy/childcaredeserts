import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import StateListContainer from './states/StateList.container';

// TODO: remove this.
import { stateListActions } from './states/StateList.state';

const mapStateToProps = (state) => {
  let obj = {
  };
  return obj;
};

const SidebarContainer = React.createClass( {
  propTypes: {

  },

  render () {
    return (
      <div>
        <StateListContainer/>
      </div>
    );
  }
});

export default connect(mapStateToProps, { ...stateListActions })(SidebarContainer);
