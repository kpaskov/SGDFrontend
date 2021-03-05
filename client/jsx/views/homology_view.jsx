const React = require('react');
const ReactDOM = require('react-dom');
const NavBar = require('../components/widgets/navbar.jsx');
const TabsModel = require('../models/tabs_model.jsx');

var homologyView = {};
homologyView.render = function () {
  var _tabModel = new TabsModel();
  let _elements = [
    { name: 'Overview', target: 'overview' }
  ];

  _elements = _elements.concat([
    { name: 'Homologs', target: 'homologs' },
    { name: 'Functional Complementation', target: 'complements' },
    { name: 'Fungal Homologs', target: 'fungal_homologs' },
    { name: 'External Identifiers', target: 'external_ids' },
    { name: 'Resources', target: 'resources' },
  ]);
  var _navTitleText = _tabModel.getNavTitle(
    locus.display_name,
    locus.format_name
  );
  ReactDOM.render(
    <NavBar title={_navTitleText} elements={_elements} />,
    document.getElementById('navbar-container')
  );
};

module.exports = homologyView;
