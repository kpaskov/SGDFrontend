/** @jsx React.DOM */
"use strict";

var React = require("react");
var _ = require("underscore");

var DidClickOutside = require("../mixins/did_click_outside.jsx");

var MultiSequenceDownload = React.createClass({
	mixins: [DidClickOutside],

	getDefaultProps: function () {
		return {
			contigName: null,
			sequences: [],
			locusDisplayName: null, // *
			locusFormatName: null, // *
		};
	},

	getInitialState: function () {
		return {
			isOpen: false
		};
	},

	render: function () {
		var _hiddenFormNodes = _.map(this.props.sequences, (s, i) => {
			return (<form ref={s.key} method="POST" action="/download_sequence" key={"hiddenNode" + i}>
				<input type="hidden" name="header" value={s.header} />
				<input type="hidden" name="sequence" value={s.sequence} />
				<input type="hidden" name="filename" value={s.filename} />
			</form>);
		});

		var buttonNodes = _.map(this.props.sequences, (s, i) => {
			var _onClick = e => {
				e.preventDefault();
				e.nativeEvent.stopImmediatePropagation();
				this._handleClick(s.key);	
			};
			return <li key={"seqButton" + i}><a onClick={_onClick}>{s.name}</a></li>;
		});
		buttonNodes.push(<li key="topSeqButton"><a href={"/cgi-bin/seqTools?back=1&seqname=" + this.props.locusFormatName}>Custom Retrieval</a></li>);

		var hiddenFormContainerNode = (<div style={{ display: "none" }}>
			{_hiddenFormNodes}
		</div>);

		var openKlass = this.state.isOpen ? "f-dropdown open" : "f-dropdown";
		return (<div>
			{hiddenFormContainerNode}
			<a className="button dropdown small secondary multi-sequence-download-button" onClick={this._toggleOpen} ><i className="fa fa-download" /> Download (.fsa)</a>
			<ul className={openKlass} style={{ position: "absolute", left: "1rem", display: this.state.isOpen ? "block" : "none" }}>
				{buttonNodes}
			</ul>
		</div>);
	},

	didClickOutside: function () {
		this.setState({ isOpen: false });
	},

	_toggleOpen: function (e) {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		this.setState({ isOpen: !this.state.isOpen });
	},

	// get the DOM node for the form; submit to download
	_handleClick: function (key) {
		this.refs[key].submit();
	}
});

module.exports = MultiSequenceDownload;
