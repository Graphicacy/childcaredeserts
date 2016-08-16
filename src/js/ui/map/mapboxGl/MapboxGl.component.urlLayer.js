import React, { PropTypes } from 'react';
import mapboxGl from 'mapbox-gl';
import _ from 'lodash';

const MapboxGlComponentUrlLayer = React.createClass( {
  propTypes: {
    urlSource: PropTypes.string.isRequired,
    layers: PropTypes.array.isRequired,
    map: PropTypes.object.isRequired,
    onFeatureClick: PropTypes.func,
    onFeatureHover: PropTypes.func
  },

  componentDidMount() {
    console.log('source', this.props.urlSource);
    // // load the source
    // var source = new mapboxGl.GeoJSONSource({
    //   data: this.props.source.payload.data
    // });
    // this.source = source;
    // this.props.map.addSource(this.props.source.id, this.source);
    // // this.props.map.addSource(this.props.source.id, this.props.source.payload);

    // // load the layers.
    // this.addLayers(this.props.map, this.props.layers);

    // // load interactivity.
    // const DEBOUNCE_DELAY_MS = 80;
    // let debounceOptions = {maxWait: 120};

    // // We should debounce our events to reduce load on CPU.
    // this.proxyOnLayerMouseOver = _.debounce(this.onLayerMouseOver, DEBOUNCE_DELAY_MS, debounceOptions);
    // this.proxyOnUpdateLayerFilter = _.debounce(this.updateLayerFilter, 80, {maxWait: 130});
    // this.props.layers
    //   .filter(layer => layer.definition.interactive)
    //   .forEach(layer => {
    //     // this line eventually just calls onLayerMouseOver
    //     // but without a ton of needless canvas queries.
    //     // The idea is better performance.
    //     this.props.map.on('mousemove', this.proxyOnLayerMouseOver);
    //     this.props.map.on('click', this.onLayerClick);
    //   });

  },

  onLayerMouseOver (e) {
    // let features = this.getInteractiveFeaturesOverPoint(e.point);
    // this.props.map.getCanvas().style.cursor = features.length ? 'pointer' : '';
    // if (this.props.onFeatureHover != null) {
    //   if (features == null || features.length === 0) {
    //     return;
    //   }

    //   this.props.onFeatureHover(features[0]);
    // }
  },

  getInteractiveFeaturesOverPoint(point) {
    // let interactiveLayerNames = this.props.layers
    //   .filter(layer => layer.definition.interactive)
    //   .map(layer => layer.definition.id);

    // var features = this.props.map.queryRenderedFeatures(point, { layers: interactiveLayerNames });
    // return features;
  },

  componentDidUpdate (previousProps) {
    // let isDuplicate = previousProps === this.props;
    // if (isDuplicate) {
    //   return;
    // }

    // let isSourceUnchanged = previousProps.source === this.props.source;
    // if (isSourceUnchanged) {
    //   return;
    // }

    // this.source.setData(this.props.source.payload.data);

    // let layers = this.props.layers;
    // layers.forEach(layer => {
    //   this.proxyOnUpdateLayerFilter(layer);
    // })
  },

  updateLayerFilter (layer) {
    // if (layer.definition.filter == null) {
    //   return;
    // }

    // this.props.map.setFilter(layer.definition.id, layer.definition.filter);
  },

  onLayerClick(e) {
    // if (this.props.onFeatureClick == null) {
    //   return;
    // }

    // let features = this.getInteractiveFeaturesOverPoint(e.point);
    // if (features == null || features.length === 0) {
    //   return;
    // }

    // this.props.onFeatureClick(features[0]);
  },

  componentWillUnmount() {
    // TODO: remove map.
  },

  addLayers (map, layers) {
    // layers.forEach(layer => {
    //   map.addLayer(layer.definition, layer.insertBefore);
    // });
  },
  render () {
    return null;    
  }
});

export default MapboxGlComponentUrlLayer;