import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

const FilterComponent = React.createClass( {
  propTypes: {
    minValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    minRange: PropTypes.number.isRequired,
    maxRange: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    stateId: PropTypes.string.isRequired,
    onUpdateFilter: PropTypes.func.isRequired
  },

  handleMinChange(event) {
    let number = +event.target.value;
    this.props.onUpdateFilter(+this.props.stateId, this.props.name, number, this.props.maxValue);
  },

  handleMaxChange(event) {
    let number = +event.target.value;
    this.props.onUpdateFilter(+this.props.stateId, this.props.name, this.props.minValue, number);
  },

  componentDidMount() {
    // const DEBOUNCE_DELAY_MS = 400;
    // let debounceOptions = {maxWait: 500};
    // this.proxyHandleMaxChange = _.debounce((max) => {
    //   this.props.onUpdateFilter(+this.props.stateId, this.props.name, this.props.minValue, max);
    // }, DEBOUNCE_DELAY_MS, debounceOptions);
    // this.proxyHandleMinChange = _.debounce((min) => {
    //   this.props.onUpdateFilter(+this.props.stateId, this.props.name, min, this.props.maxValue);
    // }, DEBOUNCE_DELAY_MS, debounceOptions);
    // debugger;
  },

  render () {
    let range = {
      min: this.props.minValue,
      max: this.props.maxValue
    };
    let start = [this.props.minRange, this.props.maxRange];
    return (
      <div>
        <h6>{this.props.name}</h6>
        <input 
           type="range"
           value={this.props.minValue}
           min={this.props.minRange}
           max={this.props.maxRange}
           onChange={(e) => this.handleMinChange(e)}/>
        <input 
           type="range"
           value={this.props.maxValue}
           min={this.props.minRange}
           max={this.props.maxRange}
           onChange={(e) => this.handleMaxChange(e)}/>
      </div>
    );
  }
});

export default FilterComponent;