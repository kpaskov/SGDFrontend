"use strict";

const React = require("react");
const _ = require("underscore");

const Checklist = React.createClass({
	propTypes: {
		elements: React.PropTypes.array.isRequired, // [ { name: "Doggy Woggy", key: "dog" }, ...]
		initialActiveElementKeys: React.PropTypes.array,
		onSelect: React.PropTypes.func // (activeElementKeys) =>
	},

	getDefaultProps: function () {
		return {
			initialActiveElementKeys: []
		};
	},

	getInitialState: function () {
		return {
			activeElementKeys: this.props.initialActiveElementKeys
		};
	},

	render: function () {
		let _currentActive = this.state.activeElementKeys;
		let inputs = _.map(this.props.elements, (d, i) => {
			let _isActive = _currentActive.indexOf(d.key) >= 0;
			let _onClick = e => {
				// e.preventDefault();
				e.nativeEvent.stopImmediatePropagation();
				// add or remove key from active
				if (_isActive) {
					_currentActive = _.filter(_currentActive, _d => {
						return _d !== d.key;
					});
				} else {
					_currentActive.push(d.key);
				}
				if (this.props.onSelect) this.props.onSelect(_currentActive);
				this.setState({ activeElementKeys: _currentActive });
			};

			return (
			        <div className="checklist-element-container"  style={{ display: "inline-block" }} key={"radioElement" + i}>
					<input type="checkbox" onChange={_onClick} name={d.key} value={d.key} checked={_isActive} style={{ margin: 0 }}>
						<label onClick={_onClick}>{d.name}</label>
					</input>
				</div>
			);		
		});

		return (<div>{inputs}</div>);

	}

});

module.exports = Checklist;
