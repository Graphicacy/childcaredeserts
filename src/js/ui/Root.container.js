// Boots the react-redux app. It is only interested
// in loading React and Redux, and finally 
// instantiating the actual application.

// Think of it as a boot loader on a computer.
// It only cares about loading the OS.
import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import ChildCareDesertsAppContainer from './ChildCareDesertsApp.container';

const RootContainer = React.createClass( {
  propTypes: {
    store:    PropTypes.object.isRequired
  },
  render () {
    return (
      <Provider store={this.props.store}>
        <ChildCareDesertsAppContainer/>
      </Provider>
    );
  }
});

export default RootContainer;
