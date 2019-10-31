
"use strict";

const React = require("react");
const _ = require("underscore");

const DataTable = require("../widgets/data_table.jsx");
const HelpIcon = require("../widgets/help_icon.jsx");

module.exports = React.createClass({

	getDefaultProps: function () {
		return {
			data: [], // * []
			dataType: "SEQUENCE"
		};
	},

	render: function () {
		// filter data to desired type
		let historyData = _.where(this.props.data, { history_type: this.props.dataType });

		// format history data for table
		let _tableRows = _.map(historyData, e => {
			let noteNode = <span dangerouslySetInnerHTML={{__html: e.note }} />;
			let refsNode = _.map(e.references, (r, i) => {
				let pubmedNode = r.pubmed_id ? <small> PMID:{r.pubmed_id}</small> : null;
				let sepNode = (i > 0 && i !== e.references.length - 1) ? ", " : null;
				return <span><a href={r.link}>{r.display_name}</a>{pubmedNode}{sepNode}</span>;
			});
			return [e.date_created, noteNode, refsNode];
		});
		let _tableData = {
			headers: [["Date", "Note", "References"]],
			rows: _tableRows
		};

		let _dataTableOptions = {
			bPaginate: false,
			oLanguage: { "sEmptyTable": "No history." }
		};

		return (<section id="history">
			<h2>
				History <HelpIcon isInfo={true} text="Documentation regarding nomenclature for this locus. May also contain notes and references for the mapping of this gene." />
			</h2>
			<hr />
			<DataTable data={_tableData} usePlugin={true} pluginOptions={_dataTableOptions}/>
		</section>);
	}
});
