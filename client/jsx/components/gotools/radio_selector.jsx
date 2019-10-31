"use strict";

const React = require("react");
const _ = require("underscore");

module.exports = React.createClass({
	// elements, i.e.[ { name: "Doggy Woggy", key: "dog" }, ...]
	// onSelect(activeElementKey)
	propTypes: {
		elements: React.PropTypes.array.isRequired,
		initialActiveElementKey: React.PropTypes.string,
		onSelect: React.PropTypes.func
		
	},

	getInitialState: function () {
		return {
			activeElementKey: this.props.initialActiveElementKey
		};
	},

	componentDidUpdate: function () {
		if (this.props.onSelect) {
			this.props.onSelect(this.state.activeElementKey)
		}
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		return !(this.state.activeElementKey === nextState.activeElementKey);
	},

	render: function () {
		let inputs = _.map(this.props.elements, (d, i) => {
			let _onClick = (e) => {
				this.setState({
					activeElementKey: d.key
				});
			};
			let _checked = d.key === this.state.activeElementKey;

			// make the width as wide as possible
			let widthPercent = `${1 / this.props.elements.length * 100}%`;

			return (
				<div className="radio-element-container" style={{ display: "inline-block", width: widthPercent }} key={"radioElement" + i}>
					<input type="radio" onChange={_onClick} id={d.key} value={d.key} checked={_checked}>
						<label onClick={_onClick}><span style={{ fontSize: 18 }}>{d.name}</span></label>
					</input>
				</div>
			);
			
		});
		return (
			<div className="radio-selector">
				{inputs}
			</div>
		);
	}

});
