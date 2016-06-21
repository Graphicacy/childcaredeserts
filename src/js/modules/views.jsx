import { Map } from './map';

var d3 = require( 'd3' );
var topojson = require( 'topojson' );

var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var $ = require('jquery');

var states = [
  { code: 'GA', name: 'Georgia', center: [-84.41,32.73], zoom: 6.95478, FP: '13' },
  { code: 'NC', name: 'North Carolina', center: [-81.31,35.35], zoom: 6.6, FP: '37' },
  { code: 'MN', name: 'Minnesota', center: [-95.30, 45.72], zoom: 6.2, FP: '27' },
  { code: 'IL', name: 'Illinois', center: [-89.3985,40.6331], zoom: 6.95478, FP: '17' },
  { code: 'VA', name: 'Virginia', center: [-78.6569,37.4316], zoom: 6.95478, FP: '51' },
  { code: 'MD', name: 'Maryland', center: [-76.6413,39.0458], zoom: 6.95478, FP: '24' },
  { code: 'OH', name: 'Ohio', center: [-82.9071,40.4173], zoom: 6.95478, FP: '39' },
  { code: 'CO', name: 'Colorado', center: [-106.1086,37.7531], zoom: 6, FP: '8' },
  { code: 'WA', name: 'Washington', center: [-120.7401,47.7511], zoom: 6.95478, FP: '53' }
];

var map;

let mousemove = () => {

};

var StateNav = React.createClass({
  render(){
    return (
      <div className="stateNav">
        <h1>States</h1>
        <StateList data={this.props.data} />
      </div>
    );
  }
});

var StateList = React.createClass({
  click( i ){
    map.currentState( this.props.data[i] );
  },
  render(){
    var stateNodes = this.props.data.map( (state,i) => {
      return (
        <li onClick={this.click.bind(this,i)} code={state.code} key={i}>{state.name}</li>
      )
    });

    return (
      <ul className="stateList">
        {stateNodes}
      </ul>
    );

  }
});

var CenterData = React.createClass({
  getInitialState(){
    return {
      name: null,
      address: null,
      capacity: null,
      chidren_under_six_below_fpl: null,
      city: null,
      state: null,
      zip: null,
      qris: null
    };
  },
  render(){
    var s = this.state;
    return (
      <div className="centerData">
        <h3>{s.name}</h3>
        <h4>{s.licensed_or_qris}</h4>
        <div><span>location: </span><span>{s.city}, </span><span>{s.state} </span><span>{s.zip}</span></div>
        <div><span>tier: </span><span>{s.tier}</span></div>
      </div>
    );
  }
});

function init(){

  $.getJSON( 'data/childcenters.geojson', centers => {
    centers.features.forEach( c => {
      let p = c.properties;
      p.tier = +p.tier;
    })

    $.getJSON( 'data/states.json', statesPolys => {
      ReactDOM.render(
        <StateNav data={states} />,
        document.getElementById( 'state-selection' )
      );
      let centerView = ReactDOM.render(
        <CenterData />,
        document.getElementById( 'center-data' )
      );

      d3.json( 'data/14states--simplified2.json', zips => {
          console.log( zips );
          let zipcodes = topojson.feature( zips, zips.objects["14states--simplified2"] );
          map = new Map( centers, statesPolys, states[0], centerView, zipcodes );
      });



    });
  });

}

export { init }
