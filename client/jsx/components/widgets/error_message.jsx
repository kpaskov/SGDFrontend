import React from 'react';
var createReactClass = require('create-react-class');

const ErrorMessage = createReactClass({
  getDefaultProps() {
    return {
      heading: 'Woops!',
      message: "There was an unexpected error.  We're sorry about that.  Try reloading the page.  If the problem persists, send an email to sgd-helpdesk@lists.stanford.edu describing the problem."
    };
  },
  render() {
    return (
      <div className="panel warning">
        <h1>{this.props.heading}</h1>
        <p>{this.props.message}</p>
      </div>
    )
  }
});

module.exports = ErrorMessage;
