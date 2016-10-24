import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import _ from 'lodash';

import { stateListActions } from './StateList.state';
import { mapStateToProps } from './StateCharts.container';


const stateDenom = {
  ALL: "Americans",
  ["08"]: "Coloradans",
  ["13"]: "Georgians",
  ["17"]: "Illinoisans",
  ["24"]: "Marylanders",
  ["27"]: "Minnesotans",
  ["37"]: "North Carolinians",
  ["39"]: "Ohioans",
  ["51"]: "Virginians"
}

const StateSelectContainer = React.createClass({

  propTypes: {
    stateList: PropTypes.array.isRequired,
    selectedState: PropTypes.object,
    selectState: PropTypes.func.isRequired,
    resetSelection: PropTypes.func.isRequired,
    stateDemographics: PropTypes.object,
    status: PropTypes.string
  },

  onStateSelection(state) {
    this.props.selectState(state);
  },

  onResetSelection() {
    this.props.resetSelection();
  },

  render() {

    const perc = n => Math.round( n * 100 ) + '%';

    const current = this.props.selectedState && {
      value: this.props.selectedState,
      label: this.props.selectedState.NAME
    };

    const loading = this.props.status !== 'SUCCESS';

    let total;
    if (!loading) {
      total = +this.props.stateDemographics.in_desert_all;
    }

    const stateOptions = [{
      label: 'Show all states',
      value: 'ALL'
    }].concat(_.sortBy(this.props.stateList.map(state => {
      return {
        label: state.stateProperties.NAME,
        value: state
      };
    }), 'label'));

    return (
      <div className="state-select-container">
        <h1 className="title-header">
          Where Are the <br/> Child Care Deserts?
        </h1>

        <p className="description-paragraph">
          A child care desert (shown in orange) is any ZIP code with more than 30 children
          under age 5 that contains either zero child care centers or so
          few centers that there are more than three times as many
          children as spaces in centers.
        </p>

        <Select
            name="select-state"
            searchable={false}
            options={stateOptions}
            value={current}
            placeholder="Select a state"
            onChange={selected => {
              if (selected && selected.value !== 'ALL') {
                this.onStateSelection(selected.value.stateProperties);
              } else {
                this.onResetSelection();
              }
            }}
        />

        <h1 className="x-percent-header">
          {loading ? '(loading...)' : perc(total)} of {
            stateDenom[current ? current.value.STATE : 'ALL']
          }{current ? '' : ' in the study'}<br/> live in a child care desert.
        </h1>
      </div>
    );
  }
});


export default connect(mapStateToProps, stateListActions)(StateSelectContainer);
