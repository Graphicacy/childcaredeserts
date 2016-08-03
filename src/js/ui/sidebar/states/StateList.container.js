import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import StateItemComponent from './stateItem/StateItem.component';
import { stateListActions } from './StateList.state';
import { getSelectedStateProperties, getStatesList } from '../Sidebar.selectors';

const mapStateToProps = (state) => {
  let stateList = getStatesList(state);
  let selectedState = getSelectedStateProperties(state);
  let obj = {
    stateList,
    selectedState
  };
  return obj;
};

const StateListContainer = React.createClass( {
  propTypes: {
    stateList: PropTypes.array.isRequired,
    selectedState: PropTypes.object,

    updateFilter: PropTypes.func.isRequired
  },

  onStateSelection(state) {
    this.props.selectState(state);
  },

  onResetSelection() {
    this.props.resetSelection();
  },

  onUpdateFilter (stateId, name, newMin, newMax) {
    this.props.updateFilter(stateId, name, newMin, newMax);
  },

  render () {
    return (
      <div>
        <button onClick={this.onResetSelection}>Reset Selection</button>
        {
          this.props.stateList.map(state => 
          {
            return ( <StateItemComponent 
              key={state.stateProperties.STATE} 
              stateItem={state}
              onUpdateFilter={this.onUpdateFilter}
              onStateSelected={this.onStateSelection}/>);
          }
        )
        }
      </div>
    );
  }
});

export default connect(mapStateToProps, stateListActions) (StateListContainer);
