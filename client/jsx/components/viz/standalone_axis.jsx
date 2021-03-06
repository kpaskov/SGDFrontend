'use strict';

var d3 = require('d3');
var React = require('react');

var CalcWidthOnResize = require('../mixins/calc_width_on_resize.jsx');
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
var StandaloneAxis = createReactClass({
  mixins: [CalcWidthOnResize],
  displayName: 'StandaloneAxis',
  propTypes: {
    labelText: PropTypes.string,
    leftRatio: PropTypes.any,
    height: PropTypes.any,
    gridTicks: PropTypes.any,
    scaleTypes: PropTypes.any,
    orientation: PropTypes.any,
    tickFormat: PropTypes.any,
    transitionDuration: PropTypes.any,
    scaleType: PropTypes.any,
    ticks: PropTypes.any,
  },

  getDefaultProps: function () {
    return {
      gridTicks: false,
      labelText: null,
      leftRatio: 0,
      domain: null, // *
      orientation: 'top', // [top, right, bottom, left]
      scaleType: 'linear',
      ticks: 3,
      tickFormat: null,
      transitionDuration: 0,
    };
  },

  getInitialState: function () {
    return {
      scale: null,
    };
  },

  render: function () {
    var labelNode = this.props.labelText ? (
      <p
        className="axis-label"
        style={{
          marginLeft: `${this.props.leftRatio * 100}%`,
          position: 'relative',
        }}
      >
        {this.props.labelText}
      </p>
    ) : null;

    var _height = this.props.height || (this.props.gridTicks ? '100%' : 32);
    var _klass = `standalone-axis ${this.props.gridTicks ? 'grid-ticks' : ''}`;
    return (
      <div
        ref={(wrapper) => (this.wrapper = wrapper)}
        className={_klass}
        style={{ position: 'relative' }}
      >
        {labelNode}
        <svg
          ref={(svg) => (this.svg = svg)}
          style={{ width: '100%', height: _height }}
        ></svg>
      </div>
    );
  },

  // After initial render, calculate the scale (based on width), which will then trigger update, which eventually
  // renders d3 SVG axis.
  componentDidMount: function () {
    this._calculateScale();
  },

  UNSAFE_componentWillReceiveProps: function (nextProps) {
    this._calculateScale(nextProps);
  },

  componentDidUpdate: function () {
    this._renderSVG();
  },

  // called by mixin
  _calculateWidth: function () {
    this._calculateScale();
  },

  _calculateScale: function (nextProps) {
    var props = nextProps || this.props;

    // maxValue can't be null
    if (props.maxValue === null) return;

    var scaleTypes = {
      linear: d3.scale.linear(),
      sqrt: d3.scale.sqrt(),
    };
    var _baseScale = scaleTypes[this.props.scaleType];

    var _width = this.wrapper.getBoundingClientRect().width - 1;
    var _xOffset = _width * props.leftRatio;
    var _scale = _baseScale.domain(props.domain).range([0, _width - _xOffset]);

    this.setState({
      scale: _scale,
    });
  },

  // render d3 axis
  _renderSVG: function () {
    // must have scale calculated
    if (!this.state.scale) return;

    var _tickSize = this.props.gridTicks ? -this.wrapper.offsetHeight : 6;
    var axisFn = d3.svg
      .axis()
      .orient(this.props.orientation)
      .ticks(this.props.ticks)
      .tickFormat(this.props.tickFormat)
      .tickSize(_tickSize)
      .scale(this.state.scale);

    var svg = d3.select(this.svg);

    var _xTranslate =
      this.wrapper.getBoundingClientRect().width * this.props.leftRatio;
    var _yTranslate = this.props.orientation === 'top' ? 30 : 0;
    if (this.props.gridTicks && this.props.orientation === 'bottom') {
      _yTranslate += this.wrapper.getBoundingClientRect().height - 30;
    }
    var _translate = `translate(${_xTranslate}, ${_yTranslate})`;
    var axis = svg.selectAll('g.axis').data([null]);
    axis.enter().append('g').attr({
      class: 'axis',
      transform: _translate,
    });
    axis
      .transition()
      .duration(this.props.transitionDuration)
      .attr({ transform: _translate })
      .call(axisFn);
  },
});

module.exports = StandaloneAxis;
