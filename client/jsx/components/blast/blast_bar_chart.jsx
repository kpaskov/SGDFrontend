
"use strict";

let React = require("react");
let d3 = require("d3");
let _ = require("underscore");

let CalcWidthOnResize = require("../mixins/calc_width_on_resize.jsx");
let FlexibleTooltip = require("./flexible_tooltip.jsx");
let StandaloneAxis = require("./standalone_axis.jsx");
let Legend = require("./blast_legend.jsx");

let HEIGHT = 10;
let POINT_WIDTH = 15;

module.exports = React.createClass({
	mixins: [CalcWidthOnResize],

	getDefaultProps: function () {
	        let _identity = (d) => { return d; };
		return {
		        data: null, // *
                        colorValue: function (d) { return d; },
                        colorScale: function (d, i) { return "#DF8B93" },
                        hasTooltip: false,
                        hasNonZeroWidth: false,
                        hasYAxis: true,
                        labelRatio: 0.5,
                        left: 50,
                        labelValue: _identity,
                        maxY: null,
                        nodeOpacity: function (d) { return "auto"; },
                        filter: null,
                        scaleType: "linear",
                        yValue: _identity,
                        start: null,
                        legendColor: null,
			totalHits: 0			
		};
	},

	getInitialState: function () {
		return {
		        DOMWidth: 355,
			widthScale: null,
                        tooltipVisible: false,
                        tooltipText: "",
                        tooltipLeft: 0,
                        tooltipTop: 0,
                        tooltipHref: null,
                        filterIsApplied: true
		};
	},

	render: function () {

		let state = this.state;
		let props = this.props;

		// require widthScale to continue
		if (!state.widthScale) return <div ref="wrapper"></div>;
		
		// create y axis, if hasYaxis
                let data = this._getData();
                let _maxY = this.props.maxY;
                let axisNode =  <StandaloneAxis 
                                 scaleType={props.scaleType} 
                                 domain={[0, _maxY]} 
                                 labelText="Query" 
                                 left={props.left} 
                                 leftRatio={props.labelRatio} 
                                 transitionDuration={500} 
                />;
                 
                let tooltipNode = props.hasTooltip ? (<FlexibleTooltip visible={state.tooltipVisible}
                                left={state.tooltipLeft} top={state.tooltipTop} text={state.tooltipText}
                        />) : null;
		
		let _onMouseOver = (e) => { this._handleMouseOver(e, d); };

		let allBars = [];
		let preBars = [];
		let h = 0;
		// h += 2*HEIGHT;
		_.map(data, d => { 
		       if (!d.same_row) {
		       	  h += 1.74*HEIGHT;
		       }
		       let bar = this._getBarNode(d, h);
		       if (d.same_row) {
			     preBars.push(bar);
		       }
		       else if (preBars) {
		       	     allBars.push(<svg style={{ width: "90%", left: this.props.left, height: HEIGHT, position: "relative"}}>{preBars}</svg>);
			     preBars = [bar];
		       }
		       else {
		             preBars.push(bar);
		       }
		});

		allBars.push(<svg style={{ width: "90%", left: this.props.left, height: HEIGHT, position: "relative"}}>{preBars}</svg>);
		
		allBars.push(<svg style={{ height: HEIGHT, position: "relative"}}></svg>); // empty row for extra space between bars and legend
    
		let legendBar = (<Legend 
                                  elements={props.legendColor}
                                  leftRatio={props.labelRatio}
                />);

		return (<div ref="wrapper" className="blast-bar-graph" onMouseLeave={this._clearMouseOver} onClick={this._clearMouseOver}>
			     {axisNode}
		             <div className="blast-bar-container" style={{ position: "relative" }}>
				   {tooltipNode}
				   {allBars}
				   <div className="lengend-container clearfix" style={{ position: "relative", height: HEIGHT*3 }}>
                                 	{legendBar}
                                   </div>
			     </div>
		</div>);
	},

	componentDidMount: function () {
                this._calculateWidthScale();
        },

        componentWillReceiveProps: function (nextProps) {
                this._calculateWidthScale(nextProps);
        },

        // called by mixin
        _calculateWidth: function () {
                this._calculateWidthScale();
        },

	_calculateWidthScale: function (props) {
	        let scaleTypes = {
		        linear: d3.scale.linear(),
			sqrt: d3.scale.sqrt()
                };
		let _baseScale = scaleTypes[this.props.scaleType];
									    
		let _props = props ? props : this.props;
		let _maxY = _props.maxY || d3.max(_props.data, _props.yValue); // defaults to maxY prop, if defined
		let _width = this.refs.wrapper.getBoundingClientRect().width;
		let _scale = _baseScale.domain([0, _maxY]).range([0, _width * (1-_props.labelRatio)]);
		this.setState({ widthScale: _scale });
	},

	_getData: function () {
                let hasFilter = this.props.filter && this.state.filterIsApplied;
                let data = this.props.data;
                if (hasFilter) {
                        data = _.filter(data, this.props.filter);
                }
		return data;
	},

	_getBarNode: function (d, h) {
		// let startX = this._getScale(d.start) + this.props.left;
		// let endX = this._getScale(d.end) + this.props.left;

		let startX = this._getScale(d.start);
                let endX = this._getScale(d.end);

		// let relativeStartX = 0;
		// let relativeEndX = endX - startX;
	
		let pathString = this._getTrapezoidStringPath(startX, endX, d.strand);

		let _opacity = 0.5;
		
		// interaction handlers
		let _onMouseover = (e) => {
			this._handleMouseOver(e, d, h);
		};
		let _onClick = (e) => {
			this._handleClick(e, d);
		}

		let _color = this.props.colorScale(this.props.colorValue(d));
		
		let shapeNode;
		// large enough for trapezoid
		if ((endX - startX) > POINT_WIDTH) {
			  shapeNode = <path d={pathString} fill={_color} opacity={_opacity} onClick= {_onClick} onMouseOver={_onMouseover} />;
		} else {  // too small; rect
			shapeNode = <rect x={0} width={endX - startX} height={HEIGHT} fill={_color} opacity={_opacity} onClick= {_onClick} onMouseOver={_onMouseover} />;
		}

		let _transform = this._getGroupTransform(d);
		return (
			<g transform={_transform}>
				{shapeNode}
			</g>
		);
	},

	// returns the transform string used to position the g element for a locus
	_getGroupTransform: function (d) {
		let obj = this._getTransformObject(d);
		return `translate(${obj.x}, ${obj.y})`;
	},

	// returns  transform x y coordinates
	_getTransformObject: function (d) {
		let _x = this._getScale(Math.min(d.start, d.end));
		let _y = this._getMidpointY();
		return {
		        x: _x,
			y: _y
		};
	},

	_getMidpointY: function () {
		// return (this.props.watsonTracks) * (HEIGHT + TRACK_SPACING) + TRACK_SPACING;
		// return (this.props.watsonTracks) * HEIGHT;
		return '';
	},

	// from relative start, relative end, and bool isWatson, return the string to draw a trapezoid
	_getTrapezoidStringPath: function (relativeStartX, relativeEndX, strand) {
		let pointWidth = Math.min(POINT_WIDTH, (relativeEndX - relativeStartX));
	
		let points;
		if (strand >= 0) {
			points = [
				{ x: relativeStartX, y: 0 },
				{ x: relativeEndX - pointWidth, y: 0 },
				{ x: relativeEndX, y: HEIGHT / 2 },
				{ x: relativeEndX - pointWidth, y: HEIGHT },
				{ x: relativeStartX, y: HEIGHT },
				{ x: relativeStartX, y: 0 }
			];
		} else {
			points = [
				{ x: relativeStartX + pointWidth, y: 0},
				{ x: relativeEndX, y: 0},
				{ x: relativeEndX, y: HEIGHT },
				{ x: relativeStartX + pointWidth, y: HEIGHT },
				{ x: relativeStartX, y: HEIGHT / 2 },
				{ x: relativeStartX + pointWidth, y: 0}
			];
		}

		let areaFn = d3.svg.line()
			.x( d => { return d.x; })
			.y( d => { return d.y; });

		// return areaFn(points) + "Z";

		return areaFn(points);

	},

	// Set the new domain; it may want some control in the future.
	_setDomain: function (newDomain) {
		this._clearMouseOver();

		// TEMP be more forgiving with new domain
		// don't let the new domain go outside domain bounds
		let _lb = Math.max(newDomain[0], this.props.domainBounds[0]);
		let _rb = Math.min(newDomain[1], this.props.domainBounds[1]);

		// make sure not TOO zoomed in
		if (_rb - _lb < MIN_BP_WIDTH) return;

		this.setState({
			domain: [_lb, _rb]
		});
	},

	_handleMouseOver: function (e, d, h) {
                // get the position
		// let target = e.currentTarget;
		// let _tooltipTop = target.offsetTop;
		// let _tooltipTop = e.clientY		
		let _tooltipTop = h;
		// let _tooltipLeft = this._getScale(d.start) + this.props.left + 10;
                let _tooltipLeft = this.props.left + 30;

                if (this.props.onMouseOver) {
                        this.props.onMouseOver(d);
                }

                if (this.props.hasTooltip) {
                        this.setState({
                                tooltipVisible: true,
                                tooltipText: `${this.props.labelValue(d)}`,
                                tooltipTop: _tooltipTop,
                                tooltipLeft: _tooltipLeft,
                        });
                }

	},

	_clearMouseOver: function () {
		this.setState({
			mouseoverId: null, 
			tooltipVisible: false
		}); 
	},

	_handleClick: function (e, d) {
		e.preventDefault();
		if (d.locus.link) {
			document.location = d.locus.link;
		}
	},

	_getScale: function (coord) {
		return this.state.widthScale(coord);
	}


});
