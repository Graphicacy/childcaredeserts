import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// TODO: remove this.
import FilterComponent from './filter/Filter.component';

const StateItemContainer = React.createClass( {
  propTypes: {
    onStateSelected: PropTypes.func.isRequired,
    stateItem: PropTypes.object.isRequired,
    onUpdateFilter: PropTypes.func.isRequired
  },

  onStateClick() {
    this.props.onStateSelected(this.props.stateItem.stateProperties);
  },

  render () {
    return (
      <div onClick={this.onStateClick}>
        <h3 
          data-id={this.props.stateItem.stateProperties.STATE} 
          data-name={this.props.stateItem.stateProperties.NAME} >
          {this.props.stateItem.stateProperties.NAME}
        </h3>
        {
          this.props.stateItem.filters.map(filter => {
            return (<FilterComponent 
              key={filter.name}
              onUpdateFilter={this.props.onUpdateFilter}
              minValue={filter.currentMin}
              maxValue={filter.currentMax}
              name={filter.name}
              stateId={this.props.stateItem.stateProperties.STATE}
              minRange={filter.min}
              maxRange={filter.max}
               />);
          })
        }
      </div>
    );
  }
});

export default StateItemContainer;