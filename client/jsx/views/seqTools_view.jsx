
"use strict";

const React = require("react");
const SearchForm = require("../components/seqtools/search_form.jsx");

var seqToolsView = {};

seqToolsView.render = function () {
	React.render(<SearchForm />,  document.getElementById("j-main"));
};

export default seqToolsView;
