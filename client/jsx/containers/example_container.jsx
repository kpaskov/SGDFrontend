import React from 'react';
var createReactClass = require('create-react-class');
import { connect } from 'react-redux';

const ExampleContainer = createReactClass({
  render() {
    return <h1>Example</h1>
  }
});

function mapStateToProps(_state) {
  return {
  };
}

module.exports = connect(mapStateToProps)(ExampleContainer);
