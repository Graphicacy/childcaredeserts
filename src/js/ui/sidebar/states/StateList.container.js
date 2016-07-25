import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import StateItemComponent from './StateItem.component';
import { stateListActions } from './StateList.state';
import { getSelectedState, getStatesList } from '../Sidebar.selectors';

const mapStateToProps = (state) => {
  let stateList = getStatesList(state);
  let selectedState = getSelectedState(state);
  let obj = {
    stateList,
    selectedState
  };

  return obj;
};

const StateListContainer = React.createClass( {
  propTypes: {
    stateList: PropTypes.array.isRequired,
    selectedState: PropTypes.object
  },

  onStateSelection(state) {
    this.props.selectState(state);
  },

  onResetSelection() {
    this.props.resetSelection();
  },

  render () {
    return (
      <div>
        <button onClick={this.onResetSelection}>Reset Selection</button>
        {
          this.props.stateList.map(state => 
          {
            return ( <StateItemComponent 
              key={state.STATE} 
              stateItem={state} 
              onStateSelected={this.onStateSelection}/>);
          }
        )
        }
      </div>
    );
  }
});

export default connect(mapStateToProps, stateListActions) (StateListContainer);
