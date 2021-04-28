'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

var SearchForm = require('../components/blast/blast_search_form.jsx');

var blastView = {};
blastView.render = function () {
  ReactDOM.render(
    <SearchForm blastType="sgd" />,
    document.getElementById('j-main')
  );
};

module.exports = blastView;
