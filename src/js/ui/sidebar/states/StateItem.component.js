import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// TODO: remove this.
import { getSelectedState, getStatesList } from '../Sidebar.selectors';

const StateItemContainer = React.createClass( {
  propTypes: {
    onStateSelected: PropTypes.func.isRequired,
    stateItem: PropTypes.object.isRequired,
  },

  onStateClick() {
    this.props.onStateSelected(this.props.stateItem);
  },

  render () {
    let isSelected = this.props.stateItem.ui_isSelected + '';
    let isInactive = this.props.stateItem.ui_isInactive + '';
    return (
      <div onClick={this.onStateClick}>
        <h6 data-is-selected={isSelected} data-id={this.props.stateItem.STATE} data-name={this.props.stateItem.NAME} >{this.props.stateItem.NAME}</h6>
        <div>Is Selected: {isSelected}</div>
        <div>Is Inactive: {isInactive}</div>
      </div>
    );
  }
});

export default StateItemContainer;