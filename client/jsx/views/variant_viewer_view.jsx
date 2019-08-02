
"use strict";

import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import VariantViewer from "../components/variant_viewer/variant_viewer.jsx";
import Drawer from "../components/variant_viewer/drawer.jsx";

// router stuff
var { Router, Route, IndexRoute } = require("react-router");

var view = {};
view.render = function () {
	// blank react component to make no drawer
	var BlankComponent = React.createClass({ render: function () { return <span />; }});

	var RouterComponent = React.createClass({
		render: function () {
			return (
				<Router>
					<Route path="/" component={VariantViewer}>
						<IndexRoute component={BlankComponent} />
				    <Route path="/:locusId" component={Drawer} />
					</Route>
				</Router>
			);
		}
	});

	
	ReactDOM.render(<RouterComponent />, document.getElementById("j-main"));
};

export default view;
