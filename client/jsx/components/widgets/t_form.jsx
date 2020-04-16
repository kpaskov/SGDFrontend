import React from 'react';
import ToSchema from 'tcomb-json-schema';
const t = require('tcomb-form');
const Form = t.form.Form;

// create form from JSON validation format
const TForm = React.createClass({
  propTypes: {
    onSubmit: React.PropTypes.func, // (value) => form value object
    submitText: React.PropTypes.string,
    validationObject: React.PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      submitText: 'Submit',
    };
  },
  /*
    example object
    {
      title: 'Paper',
      type: 'object',
      properties: {
        title: { type: 'string' },
        abstract: { type: 'string' }
      },
      required: ['title']
    }
  */

  render() {
    // convert json schema to tcomb schema obj
    let tcombSchema = ToSchema(this.props.validationObject);
    return (
      <div>
        <Form ref="form" type={tcombSchema} />
        <a className="button small secondary" onClick={this._onSubmit}>
          {this.props.submitText}
        </a>
      </div>
    );
  },

  _onSubmit(e) {
    e.preventDefault();
    let value = this.refs.form.getValue();
    if (typeof this.props.onSubmit === 'function') this.props.onSubmit(value);
  },
});

module.exports = TForm;
