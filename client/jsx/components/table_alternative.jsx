/** @jsx React.DOM */
"use strict";

var d3 = require("d3");
var React = require("react");

var BarChart = require("./viz/bar_chart.jsx");
var DataTable = require("./data_table.jsx");
var GenomeSnapshot = require("./genome_snapshot.jsx");

/*
	A react component to render a table, as well as an alternetive
	way to render the same data.
*/
module.exports = React.createClass({
	getDefaultProps: function () {
		return { isInitiallyTable: true };
	},

	getInitialState: function () {
		return { isTable: null };
	},

	render: function () {
		// is table defaults to state, set to props.isInitiallyTable if state is null
		var isTable = ((this.state.isTable === null) ? this.props.isInitiallyTable : this.state.isTable);

		var barNode = (<BarChart
			data={this.props.graphData.combined} yValue={ function (d) { return d.value; } }
			labelValue={ function (d) { return d.name; } } labelRatio={0.2} colorScale={ function () { return "#DF8B93"; }}
		/>);

		return (
			<div className="table-alternative">
				<ul className="tabs sgd-tabs" data-tab>
					<li className={!isTable ? "tab-title active" : "tab-title"}>
						<a onClick={ () => { this.setState({ isTable: false }); }}><i className="fa fa-bar-chart-o"></i>&nbsp;Graph</a>
					</li>
					<li className={isTable ? "tab-title active" : "tab-title"}>
						<a onClick={ () => { this.setState({ isTable: true }); }}><i className="fa fa-table"></i>&nbsp;Table</a>
					</li>
				</ul>
				{/* render table or alternativeComponent */}
				<div className="table-alternative-content-container">
					{
						(isTable ? (<DataTable data={this.props.tableData} />) : barNode)
					}
				</div>
			</div>
		);
	}
});
