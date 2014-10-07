/** @jsx React.DOM */
"use strict";

var React = require("react");
var _ = require("underscore");

var DataTable = require("../data_table.jsx");
var SequenceDetailsModel = require("../../models/sequence_details_model.jsx");
var SequenceNeighborsModel = require("../../models/sequence_neighbors_model.jsx");
var LocusDiagram = require("../viz/locus_diagram.jsx");

/*
	Fetches data from model and renders locus diagram (or loader while fetching).
*/
module.exports = React.createClass({

	getDefaultProps: function () {
		return {
			baseUrl: null,
			focusLocusDisplayName: null,
			hasControls: true,
			locusId: null,
			showSubFeatures: false,
		};
	},

	getInitialState: function () {
		return {
			data: null, // { locci: [] }
			domainBounds: null, // [0, 100]
			watsonTracks: 1,
			crickTracks: 1,
			tableData: null
		};
	},

	render: function () {
		if (this._isPending()) {
			return <div><img className="loader" src="/static/img/dark-slow-wheel.gif" /></div>;
		} else {
			var labelNode = this._getLabelNode();
			var tableNode = this._getSubFeaturesTable();
			return (<div>
				{labelNode}
				<LocusDiagram
					contigData={this.state.contigData}
					data={this.state.data}
					domainBounds={this.state.domainBounds}
					focusLocusDisplayName={this.props.focusLocusDisplayName}
					showSubFeatures={this.props.showSubFeatures}
					watsonTracks={this.state.watsonTracks}
					crickTracks={this.state.crickTracks}
				/>
				{tableNode}
			</div>);
		}
	},

	componentDidMount: function () {
		this._fetchData();
	},

	// from locusId, get data and update
	_fetchData: function () {
		var options = {
			id: this.props.locusId,
			baseUrl: this.props.baseUrl
		};

		// init either details or neighbors model
		var sequenceDetailsModel = new SequenceDetailsModel(_.clone(options));
		var sequenceNeighborsModel = new SequenceNeighborsModel(_.clone(options));
		var model = this.props.showSubFeatures ? sequenceDetailsModel: sequenceNeighborsModel;
 
 		// fetch data and set result
		model.fetch( (err, response) => {
			if (this.isMounted()) this.setState({
				contigData: response.contigData,
				data: response.data,
				domainBounds: response.domainBounds,
				watsonTracks: Math.abs(response.trackDomain[1]),
				crickTracks: Math.abs(response.trackDomain[0]),
				tableData: response.tableData
			});
		});

	},

	_getLabelNode: function () {
		var focusLocus = this._getFocusLocus();

		// TEMP labeling content
		var _labelNode = this.props.showSubFeatures ?
				<h3 className="locus-diagram-label-text">Subfeatures <span className="round secondary label">{focusLocus.tags.length}</span></h3> :
				<h3 className="locus-diagram-label-text">Location: <a>Chromosome VI</a> 55,345 - 58,632</h3>;
		return _labelNode;
	},

	_getFocusLocus: function () {
		// require focus locus display name
		if (!this.props.focusLocusDisplayName) return false;

		var _locci = this.state.data.locci;
		return _.filter(_locci, d => { return d.locus.display_name === this.props.focusLocusDisplayName; })[0];
	},

	// return true if it has necessary data to render
	_isPending: function () {
		return !(this.state.data && this.state.domainBounds);
	},

	_getSubFeaturesTable: function () {
		var tableNode = null;
		if (this.props.showSubFeatures) {
			var options = {
				bPaginate: false,
				oLanguage: { "sEmptyTable": "No subfeatures for " + this.props.focusLocusDisplayName + '.' }
			};

			tableNode = <DataTable data={this.state.tableData} usePlugin={true} pluginOptions={options} />;
		}

		return tableNode;
	},

});
