import React, { Component } from 'react';
var createReactClass = require('create-react-class');
import { Router } from 'react-router';
import { Provider } from 'react-redux';
var PropTypes = require("prop-types");

// import routes
import Routes from './routes.jsx';

const ReduxApplication = createReactClass({
  propTypes: {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  },

	render() {
    return (
      <Provider store={this.props.store}>
        <Router history={this.props.history}>
          {Routes}
        </Router>
      </Provider>
    );
	}
});

module.exports = ReduxApplication;
