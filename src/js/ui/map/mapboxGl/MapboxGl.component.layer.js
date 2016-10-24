import React, { PropTypes } from 'react';
import mapboxGl from 'mapbox-gl';
import _ from 'lodash';

const MapboxGlComponentLayer = React.createClass( {
  propTypes: {
    source: PropTypes.object.isRequired,
    layers: PropTypes.array.isRequired,
    map: PropTypes.object.isRequired,
    onFeatureClick: PropTypes.func,
    onFeatureHover: PropTypes.func
  },

  componentDidMount() {
    // load the source
    const source = new mapboxGl.GeoJSONSource({
      data: this.props.source.payload.data
    });
    this.source = source;

    // HACK -- remove source if exists before re-adding
    // TODO: figure out why there are sometimes collisions...
    try {
      this.props.map.removeSource(this.props.source.id);
    } catch (err) {
      if (!/There is no source with this ID/.test(err.message)) {
        throw err;
      }
    }

    this.props.map.addSource(this.props.source.id, this.source);
    // this.props.map.addSource(this.props.source.id, this.props.source.payload);

    // load the layers.
    this.addLayers(this.props.map, this.props.layers);

    // load interactivity.
    const DEBOUNCE_DELAY_MS = 80;
    const debounceOptions = {maxWait: 120};

    // We should debounce our events to reduce load on CPU.
    this.proxyOnLayerMouseOver = _.debounce(this.onLayerMouseOver, DEBOUNCE_DELAY_MS, debounceOptions);
    this.proxyOnUpdateLayerFilter = _.debounce(this.updateLayerFilter, 80, {maxWait: 130});
    this.props.layers
      .filter(layer => layer.definition.interactive)
      .forEach(() => {
        // this line eventually just calls onLayerMouseOver
        // but without a ton of needless canvas queries.
        // The idea is better performance.
        this.props.map.on('mousemove', this.proxyOnLayerMouseOver);
        this.props.map.on('click', this.onLayerClick);
      });

  },

  onLayerMouseOver (e) {
    const features = this.getInteractiveFeaturesOverPoint(e.point);
    this.props.map.getCanvas().style.cursor = features.length ? 'pointer' : '';
    if (this.props.onFeatureHover) {
      if (!(features && features.length)) {
        return;
      }

      this.props.onFeatureHover(features[0]);
    }
  },

  getInteractiveFeaturesOverPoint(point) {
    const interactiveLayerNames = this.props.layers
      .filter(layer => layer.definition.interactive)
      .map(layer => layer.definition.id);

    const features = this.props.map.queryRenderedFeatures(point, { layers: interactiveLayerNames });
    return features;
  },

  componentDidUpdate (previousProps) {
    const isDuplicate = previousProps === this.props;
    if (isDuplicate) {
      return;
    }

    const isSourceUnchanged = previousProps.source === this.props.source;
    if (isSourceUnchanged) {
      return;
    }

    this.source.setData(this.props.source.payload.data);

    const layers = this.props.layers;
    layers.forEach(layer => {
      this.proxyOnUpdateLayerFilter(layer);
    });
  },

  updateLayerFilter (layer) {
    if (!layer.definition.filter) {
      return;
    }

    this.props.map.setFilter(layer.definition.id, layer.definition.filter);
  },

  onLayerClick(e) {
    if (!this.props.onFeatureClick) {
      return;
    }

    const features = this.getInteractiveFeaturesOverPoint(e.point);
    if (!(features && features.length)) {
      return;
    }

    this.props.onFeatureClick(features[0]);
  },

  addLayers (map, layers) {
    layers.forEach(layer => {
      map.addLayer(layer.definition, layer.insertBefore);
    });
  },

  componentWillUnmount () {
    const layers = this.props.layers;
    const map = this.props.map;
    layers.forEach(layer => {
      map.removeLayer(layer.definition.id);
    });
  },

  render () {
    return null;
  }
});

export default MapboxGlComponentLayer;
