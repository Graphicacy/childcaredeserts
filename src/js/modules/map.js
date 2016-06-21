var MGL = require( 'mapbox-gl' );
var d3 = require( 'd3' );

MGL.accessToken = 'pk.eyJ1IjoiY2FwIiwiYSI6Ik9TUW53bE0ifQ.jKQeBguXYI5q-uu3tAdlfQ';

class Map {
  constructor( points, states, state, centerView, zips ){
    this.state = state;
    this.centerView = centerView;

    this.map = new MGL.Map({
      container: 'map',
      center: this.state.center,
      style: 'mapbox://styles/cap/cilwksqa900359mm3ge1ui5yf',
      zoom: 6
    })
    .on( 'style.load', () => {
      this.addPolygons( states, 'states', {
        'fill-color': '#000000',
        'fill-opacity': 0.15
      }, [ '!=', 'NAME', this.state.name ]

      );

      // TODO: move this marker layer over to mapbox
      // update zipcodes layers properties
      map.addSource('zipcodes', {
        type: 'vector',
        url: 'mapbox://cap.a4u143ob'
      });

      map.addLayer({
        "id": "zipcodes",
        "type": "fill",
        "source": "zipcodes",
        "source-layer": "data",
        "paint": {
          'fill-color': 'rgba(0,0,0,0)',
          'fill-outline-color': '#777777',
          'fill-opacity': 0.25
        }
    });
      // this.addPolygons( zips, 'zips', {
      //   'fill-color': 'rgba(0,0,0,0)',
      //   'fill-outline-color': '#777777',
      //   'fill-opacity': 0.25
      // }, [ '==', 'state', this.state.FP ] );
      this.addMarkers( points, 'centers');
    });

    window.map = this.map;

    this.setMaxBounds( this.map.getBounds() );
    this.map.setZoom( this.state.zoom );

  }

  addMarkers( points, key ){

    this.map.addSource( key, {
        type: 'geojson',
        data: points
    });

    this.map.addLayer({
      id: `points`,
      type: 'circle',
      source: key,
      interactive: true,
      paint: {
        'circle-opacity': 0.6,
        'circle-radius': 5,
        'circle-blur': 1,
        'circle-color': {
          property: 'tier',
          type: 'categorical',
          stops: [
            [ 0, '#999999' ],
            [ 1, '#FED101' ],
            [ 2, '#B5D000' ],
            [ 3, '#5AA719' ]
          ]
        },
      },
      filter: [ '==', 'state', this.state.code ]
    });

    let cv = this.centerView;

    this.map.on( 'mousemove', e => {
      var features = map.queryRenderedFeatures(e.point, { layers: ['zipcodes'] });
      if( features[0]){
        if( features[0].properties.meanearnings )
          console.log( features[0].properties );
      }
      if( features.length > 0 )
        cv.setState( features[0].properties );
    });

  }

  addPolygons( poly, key, paint, filter ){
    this.map.addSource( key, {
      type: 'geojson',
      data: poly
    });

    this.map.addLayer({
      id: key,
      type: 'fill',
      source: key,
      paint: paint,
      filter: filter
    });
  }

  currentState( state ){
    this.state = state;

    this.removeMaxBounds();

    this.map.flyTo({
      center: this.state.center,
      zoom: 6
    });

    setTimeout( () => {
      this.setMaxBounds( this.map.getBounds() );

      this.map.setFilter( 'states',
        [ '!=', 'NAME', this.state.name ]
      );

      this.map.setFilter( 'zips',
        [ '==', 'state', this.state.FP ]
      );

      this.map.setFilter( 'points', [ '==', 'state', this.state.code ] );

      this.map.flyTo({
        zoom: this.state.zoom
      });


    }, 1200 );

  }

  // filters( k, breaks ){
  //   let f = [];
  //
  //   for( var i=0; i<breaks.length; i++){
  //     if (i<= 0) {
  //      f.push([ 'all',
  //        [ '<', k, breaks[i + 1] ],
  //        [ '==', 'state', this.state.code ]
  //      ])
  //    }
  //    else if (i < breaks.length - 1) {
  //      f.push([ 'all',
  //        [ '>=', k, breaks[i] ],
  //        [ '<', k, breaks[i + 1]],
  //        [ '==', 'state', this.state.code ]
  //      ])
  //    } else {
  //      f.push([ 'all',
  //        [ '>=', k, breaks[i] ],
  //        [ '==', 'state', this.state.code ]
  //      ])
  //    }
  //   }
  //   return f;
  // }

  setMaxBounds( bounds ){
    var b = MGL.LngLat.convert( bounds );
    this.map.transform.lngRange = [b.getWest(), b.getEast()];
    this.map.transform.latRange = [b.getSouth(), b.getNorth()];
  }

  removeMaxBounds(){
    this.map.transform.lngRange = null;
    this.map.transform.latRange = null;
  }
}


// TODO query zipcode geometries
class Zip {
  constructor(zips){
    this.zips = zips;
  }

  filter(state){
    return this.zips.objects.zip_codes_for_the_usa.geometries.filter( g => { return g.properties.state == state; } );
  }
}

export { Map, Zip };
