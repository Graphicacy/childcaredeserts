import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { format } from 'd3-format';
import * as _ from 'lodash';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

import * as urbanicity from '../constants/urbanicity';
import { stateListActions } from './StateList.state';
import {
  getSelectedStateProperties,
  getStatesList,
  getStateDemographics,
  getOverlayMode,
  getUrbanicity
} from './Sidebar.selectors';


export const mapStateToProps = (state) => {
  const stateList = getStatesList(state);
  const selectedState = getSelectedStateProperties(state);
  const stateDemographics = getStateDemographics(state);
  const obj = {
    stateList,
    selectedState,
    stateDemographics,
    urbanicity: getUrbanicity(state),
    overlayMode: getOverlayMode(state),
    status: _.get(state, 'sidebar.stateList.status')
  };
  return obj;
};


export const BLUE = '#005288';
export const BLUE_HOVER = '#91AEBC';
export const ORANGE = '#f99d33';
export const GRAY = '#F7F9F9';
export const WHITE = '#FFFFFF';
export const BLACK = '#000000';

const StateChartContainer = React.createClass({

  propTypes: {
    stateList: PropTypes.array.isRequired,
    selectedState: PropTypes.object,
    selectState: PropTypes.func.isRequired,
    resetSelection: PropTypes.func.isRequired,
    setOverlayMode: PropTypes.func.isRequired,
    setUrbanicity: PropTypes.func.isRequired,
    stateDemographics: PropTypes.object,
    overlayMode: PropTypes.string,
    urbanicity: PropTypes.string.isRequired,
    status: PropTypes.string
  },


  render () {

    if (this.props.status !== 'SUCCESS') {
      return (
        <div className="loader">Loading...</div>
      );
    }

    const perc = n => Math.round( n * 100 ) + '%';

    const pie = (prop, kind) => {
      const v = this.props.stateDemographics[prop];
      return [
        { name: 'Center', value: (1 - (+v)), kind },
        { name: 'Desert', value: (+v), color: ORANGE, kind }
      ];
    };

    const p = prop => {
      return Number(this.props.stateDemographics[prop]);
    };

    const barData = [
      {
        name: 'Rural',
        Desert: p('in_desert_rural'),
        Center: p('in_center_rural')
      },
      {
        name: 'Suburban',
        Desert: p('in_desert_suburban'),
        Center: p('in_center_suburban')
      },
      {
        name: 'Urban',
        Desert: p('in_desert_urban'),
        Center: p('in_center_urban')
      }
    ];

    const RADIAN = Math.PI / 180;
    const renderLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}) => {

      const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      if (!index) return '';

      return (
        <text x={x} y={y} fill={WHITE}
              textAnchor={x > cx ? 'start' : 'end'}
              dominantBaseline="central">
          {perc(percent)}
        </text>
      );
    };


    const selectedState = !!this.props.selectedState;

    const tickFormatter = format('.3s');

    const PIE_CHART_WIDTH = 300;
    const PIE_CHART_HEIGHT = 180;
    const LARGE_PIE_RADIUS = 30;
    const SMALL_PIE_RADIUS = 15;

    const tooltipFormat = ({ payload }) => {
      const point = payload[0];

      // pie tooltip
      if (point.kind) {
        const value = point.name === 'Desert' ? point.value : (1 - point.value);
        return (
          <div className="cap-tooltip">
            {perc(value)} of the {point.kind !== 'All' ? point.kind + ' ' : '' }
            population lives in a child care desert.
          </div>
        );
      }

      const [ desert, center ] = payload;

      const total = desert.value + center.value;
      const percentage = desert.value / total;

      // bar tooltip
      return (
        <div className="cap-tooltip">
          {perc(percentage)} of children in {desert.payload.name + ' '}
          areas live in a child care desert.
        </div>
      );
    };

    return (
      <div className="charts-container">
        <PieChart width={PIE_CHART_WIDTH} height={PIE_CHART_HEIGHT}>

          <Pie
               label={renderLabel}
               data={pie('in_desert_all', 'All')}
               startAngle={90}
               endAngle={90 + 360}
               cx={PIE_CHART_WIDTH / 2}
               cy={2 * LARGE_PIE_RADIUS}
               outerRadius={LARGE_PIE_RADIUS}>{
            pie('in_desert_all', 'All')
              .map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || GRAY}/>)
          }
          </Pie>

          <text x={PIE_CHART_WIDTH / 2 - 7} y={4 * LARGE_PIE_RADIUS - 10} fill={'#ffffff'}>
            All
          </text>

          <Pie
               data={pie('in_desert_white', 'White')}
               startAngle={90}
               endAngle={90 + 360}
               cx={PIE_CHART_WIDTH / 3 - SMALL_PIE_RADIUS}
               cy={4.5 * LARGE_PIE_RADIUS}
               outerRadius={SMALL_PIE_RADIUS}>{
            pie('in_desert_white', 'white')
              .map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || GRAY}/>)
          }
          </Pie>

          <text x={PIE_CHART_WIDTH / 3 - SMALL_PIE_RADIUS - 18} y={5.7 * LARGE_PIE_RADIUS} fill={'#ffffff'}>
            White
          </text>

          <Pie
               data={pie('in_desert_black', 'Black')}
               startAngle={90}
               endAngle={90 + 360}
               cx={PIE_CHART_WIDTH / 2}
               cy={4.5 * LARGE_PIE_RADIUS}
               outerRadius={SMALL_PIE_RADIUS}>{
            pie('in_desert_black', 'black')
              .map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || GRAY}/>)
          }
          </Pie>

          <text x={PIE_CHART_WIDTH / 2 - 16} y={5.7 * LARGE_PIE_RADIUS} fill={'#ffffff'}>
            Black
          </text>

          <Pie
               data={pie('in_desert_hispanic', 'Hispanic')}
               startAngle={90}
               endAngle={90 + 360}
               cx={PIE_CHART_WIDTH * 2 / 3 + SMALL_PIE_RADIUS}
               cy={4.5 * LARGE_PIE_RADIUS}
               outerRadius={SMALL_PIE_RADIUS}
               >{
            pie('in_desert_hispanic', 'hispanic')
              .map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || GRAY}/>)
          }
          </Pie>

          <text x={PIE_CHART_WIDTH * 2 / 3 + SMALL_PIE_RADIUS - 25} y={5.7 * LARGE_PIE_RADIUS} fill={'#ffffff'}>
            Hispanic
          </text>

          <Tooltip content={tooltipFormat}/>
        </PieChart>

        <BarChart
            className="demographics-bar-chart"
            barSize={21}
            width={300} height={120} data={barData}
            layout="vertical"
            margin={{top: 5, right: 30, left: 20, bottom: 0}}>
          <YAxis stroke={WHITE}
                  axisLine={false}
                  tick={{stroke: 'none', fontSize: 13}}
                  tickLine={false} type="category" dataKey="name"/>
          <XAxis stroke={WHITE}
                 tickCount={3}
                 type="number"
                 axisLine={false}
                 tickFormatter={v => {
                   if (v >= 1000) return tickFormatter(v);
                   return v.toString();
                 }} />
          <CartesianGrid horizontal={false} stroke={WHITE}/>
          <Bar dataKey="Desert" stackId="a" fill={ORANGE} />
          <Bar dataKey="Center" stackId="a" fill={GRAY} />
          <Tooltip cursor={{ fill: BLUE_HOVER }} content={tooltipFormat}/>
        </BarChart>
        <h4>
          Number of children under 5
        </h4>
        <hr className="button-divider"/>
        <div className={
            (selectedState)
              ? 'center-buttons'
              : 'center-buttons no-click'}>
          <button
            onClick={() => this.props.setUrbanicity(urbanicity.ALL)}
            className={this.props.urbanicity === urbanicity.ALL ? 'selected' : ''}>All</button>
          <button
            onClick={() => this.props.setUrbanicity(urbanicity.RURAL)}
            className={this.props.urbanicity === urbanicity.RURAL ? 'selected' : ''}>Rural</button>
          <button
            onClick={() => this.props.setUrbanicity(urbanicity.SUBURBAN)}
            className={this.props.urbanicity === urbanicity.SUBURBAN ? 'selected' : ''}>Suburban</button>
          <button
            onClick={() => this.props.setUrbanicity(urbanicity.URBAN)}
            className={this.props.urbanicity === urbanicity.URBAN ? 'selected' : ''}>Urban</button>
        </div>
        <div className={'center-buttons desert-toggle ' + (selectedState ? '' : ' no-click')}>
          <button
            className={this.props.overlayMode === 'DESERTS' ? 'selected' : ''}
            onClick={() => this.props.setOverlayMode('DESERTS')}>Deserts</button>
          <button
            className={this.props.overlayMode === 'CENTERS' ? 'selected' : ''}
            onClick={() => this.props.setOverlayMode('CENTERS')}>Centers</button>
        </div>
      </div>
    );
  }
});

export default connect(mapStateToProps, stateListActions) (StateChartContainer);
