'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
const SearchForm = require('../components/patmatch/restrictSiteMapper.jsx');

var restSiteMapperView = {};

restSiteMapperView.render = function () {
  ReactDOM.render(<SearchForm />, document.getElementById('j-main'));
};

module.exports = restSiteMapperView;
