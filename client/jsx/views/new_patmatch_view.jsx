'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
const SearchForm = require('../components/patmatch/patmatch_search_form.jsx');

var newPatmatchView = {};

newPatmatchView.render = function () {
  ReactDOM.render(<SearchForm />, document.getElementById('j-main'));
};

module.exports = newPatmatchView;
