
"use strict";
var Radium = require("radium");
var React = require("react");
var _ = require("underscore");

var VariantViewerComponent = require("sgd_visualization").VariantViewerComponent;
var RadioSelector = require("../widgets/radio_selector.jsx");

var AsyncVariantViewer = React.createClass({
	propTypes: {
		hideTitle: React.PropTypes.bool,
		sgdid: React.PropTypes.string.isRequired,
		store: React.PropTypes.object.isRequired,
		parentIsProtein: React.PropTypes.bool
	},

	getDefaultProps: function () {
		return {
			hideTitle: false,
			parentIsProtein: false
		};
	},

	getInitialState: function () {
		return {
			data: null,
			childIsProtein: this.props.parentIsProtein
		};
	},

	render: function () {
		return (
			<div>
				{this._renderContentNode()}
			</div>
		);
	},

	componentDidMount: function () {
		this.props.store.fetchLocusData(this.props.sgdid, (err, _data) => {
			if (this.isMounted()) {
				this.setState({ data: _data });
			}
		});
	},

	_renderContentNode: function () {
		var data = this.state.data;
		if (!data) return <div className="sgd-loader-container"><div className="sgd-loader" /></div>;
		
		var vizNode = this.state.childIsProtein ? this._renderProteinViz() : this._renderDnaViz();
		return (
			<div>
				{this._renderHeader()}
				{vizNode}
			</div>
		);
	},

	_renderHeader: function () {
		var data = this.state.data;
		if (!data) return null;
		var name = (data.name === data.format_name) ? data.name : `${data.name} / ${data.format_name}`;
		var nameNode;
		if (data.href) {
			nameNode = <a href={data.href}>{name}</a>;
		} else {
			nameNode = name;
		}

		// init radio selector
		var _elements = [{ name: "DNA", key: "dna" }, { name: "Protein", key: "protein" }];
		var _onSelect = key => { this.setState({ childIsProtein: (key === "protein") }); };
		var _init = this.state.childIsProtein ? "protein" : "dna";
		var radioNode = <RadioSelector elements={_elements} onSelect={_onSelect} initialActiveElementKey={_init} />;
		var titleNode = (
			<div style={[style.textWrapper]}>
				<h1 style={[style.textElement]}>
					{nameNode}
				</h1>
				<p style={[style.textElement, style.description]}>{data.description}</p>
			</div>
		);
		if (this.props.hideTitle) {
			titleNode = null;
		}
		return (
			<div style={[style.headerWrapper]}>
				{titleNode}
				<div style={[style.radio]}>
					{radioNode}
				</div>
			</div>
		);
	},

	_renderDnaViz: function () {
		var data = this.state.data;
		var dnaSeqs = data.aligned_dna_sequences.map( d => {
			return {
				name: d.strain_display_name,
				id: d.strain_id,
				href: d.strain_link,
				sequence: d.sequence
			};
		});
		var variantData = data.variant_data_dna.map( d => { return _.extend(d, { snpType: d.snp_type }); });
		if (variantData.length === 0) return this._renderEmptyNode();
		var caption = this._getDateStr();
		return (<VariantViewerComponent
			name={data.name}
			chromStart={data.chrom_start}
			chromEnd={data.chrom_end}
			blockStarts={data.block_starts}
			blockSizes={data.block_sizes}
			contigName={data.contig_name}
			contigHref={data.contig_href}
			alignedDnaSequences={dnaSeqs}
			variantDataDna={variantData}
			dnaLength={data.dna_length}
			strand={"+"}
			isProteinMode={false}
			downloadCaption={caption}
			isRelative={true}
		/>);
	},

	_renderProteinViz: function () {
		var data = this.state.data;
		var proteinSeqs = data.aligned_protein_sequences.map( d => {
			return {
				name: d.strain_display_name,
				id: d.strain_id,
				href: d.strain_link,
				sequence: d.sequence
			};
		});
		// correct the fact that some ids are null for domains
		var _id;
		var _domains = data.protein_domains.map( (d, i) => {
			_id = d.id || i;
			return _.extend(d, { id: _id });
		});
		var variantData = data.variant_data_protein.map( d => { return _.extend(d, { snpType: "nonsynonymous" }); });
		if (variantData.length === 0) return this._renderEmptyNode();
		var caption = this._getDateStr();
		return (<VariantViewerComponent
			name={data.name}
			chromStart={data.chrom_start}
			chromEnd={data.chrom_end}
			contigName={data.contig_name}
			contigHref={data.contig_href}
			alignedProteinSequences={proteinSeqs}
			variantDataProtein={variantData}
			proteinLength={data.protein_length}
			strand={"+"}
			isProteinMode={true}
			domains={_domains}
			downloadCaption={caption}
			isRelative={true}
		/>);
	},

	_renderEmptyNode: function () {
		var isProtein = this.state.childIsProtein;
		var data = this.state.data;
		var variantLength = isProtein ? data.variant_data_protein.length : data.variant_data_dna.length;
		var numSequences = isProtein ? data.aligned_protein_sequences.length : data.aligned_dna_sequences.length;
		var text;
		if (numSequences <= 1) {
			text = "Sequence is only available from one strain.  No comparison could be made."
		} else {
			text = "These sequences are identical."
		}
		return <p style={[style.emptyNode]}>{text}</p>;
	},

	_getDateStr: function () {
		var now = new Date();
		var month = (now.getMonth() + 1).toString();
		var date = now.getDate().toString();
		if (month.length === 1) month = "0" + month;
		if (date.length === 1) date = "0" + date;
		var txt = "SGD " + now.getFullYear() + "-" + month + "-" + date;
		return txt;
	}
});

var style = {
	headerWrapper: {
		display: "flex",
		justifyContent: "space-between",
		marginTop: -12
	},
	textWrapper: {
		display: "flex",
		alignItems: "flex-end"
	},
	textElement: {
		marginTop: 0,
		marginBottom: 0
	},
	description: {
		marginBottom: "0.2rem",
		marginLeft: "1rem"
	},
	radio: {
		width: "11rem",
		marginTop: 5,
		marginRight: "2rem"
	},
	emptyNode: {
		marginTop: "5rem",
		textAlign: "center"
	}
};

export default Radium(AsyncVariantViewer);
