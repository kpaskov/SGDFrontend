/** @jsx React.DOM */
"use strict";

var React = require("react");
var ReactDOM = require("react-dom");

var NavBar = require("../components/widgets/navbar.jsx");
var AsyncSequenceView = require("../components/sequence/async_sequence_view.jsx");
var TabsModel = require("../models/tabs_model.jsx");

var sequenceView = {};
sequenceView.render = function () {

	// set current tab
	document.getElementById("sequence_tab").className += " active";

	// define render nav bar function
	var renderNavBar = function (hasAltStrains, hasOtherStrains) {
		var _tabModel = new TabsModel({
			tabType: "sequence",
			hasAltStrains: hasAltStrains,
			hasOtherStrains: hasOtherStrains
		});
		var _navTitleText = _tabModel.getNavTitle(bootstrappedData.displayName, bootstrappedData.formatName);
		var navTitle = { href: bootstrappedData.locusLink, name: _navTitleText };
		ReactDOM.render(
			<NavBar title={navTitle} elements={_tabModel.getTabElements()} />,
			document.getElementById("navbar-container")
		);
	};

	// render navbar with alt & other strain info
	var _detailsCallback = (err, detailsModel) => {
		renderNavBar(detailsModel.attributes.altStrains.length, detailsModel.attributes.otherStrains.length);
	};

	// async sequence view, fetches data, renders main strain, alt strains, and other strains (if present)
	// once data is fetched, update the navbar
	ReactDOM.render(
		<AsyncSequenceView
			locusId={bootstrappedData.locusId} locusDisplayName={bootstrappedData.displayName}
			locusFormatName={bootstrappedData.formatName} locusHistoryData={bootstrappedData.locusHistory}
			detailsCallback={_detailsCallback} locusSGDID={bootstrappedData.sgdid}
		/>,
		document.getElementById("sequence-viz")
	);
};

module.exports = sequenceView;
