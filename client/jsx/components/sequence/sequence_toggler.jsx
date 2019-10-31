import d3 from 'd3';
import React from 'react';
import _ from 'underscore';

const DownloadButton = require('../widgets/download_button.jsx');
const DropdownSelector = require('../widgets/dropdown_selector.jsx');
const Legend = require('../viz/legend.jsx');
const subFeatureColorScale = require('../../lib/locus_format_helper.jsx').subFeatureColorScale();
const LETTERS_PER_CHUNK = 10;
const LETTERS_PER_LINE = 60;

const SequenceToggler = React.createClass({
  getDefaultProps: function () {
    return {
      buttonId: null,
      locusDisplayName: null, // *
      locusFormatName: null,
      contigName: null,
      sequences: null, // * [{ name: "DNA Coding", sequence: "ACTCTAGGCT" key: }, ...]
      showCustomRetrieval: false,
      showSequence: true,
      subFeatureData: [],
      text: null
    };
  },

  getInitialState: function () {
    return {
      activeSequenceType: this.props.sequences[0].key
    };
  },

  render: function () {
    let textNode = null;
    if (this.props.text) {
      textNode = <h3>{this.props.text}</h3>;
    }

    let _activeSequence = this._getActiveSequence();
    let _downloadParams = {
      header: _activeSequence.header,
      sequence: _activeSequence.sequence,
      filename: _activeSequence.filename
    };

    let dropdownNode = this._getDropdownNode();
    let sequenceTextNode = this._formatActiveSequenceTextNode();

    let customRetrievalNode = null;
    if (this.props.showCustomRetrieval) {
      customRetrievalNode = (<ul className="button-group radius">
        <a className="button small secondary" href={"http://yeastgenome.org/cgi-bin/seqTools?back=1&seqname=" + this.props.locusFormatName}>Custom Sequence Retrieval</a>
      </ul>);
    }

    return (<div>
      {textNode}
      {dropdownNode}
      {sequenceTextNode}
      <div className="button-bar">
        <ul className="button-group radius">
          <li><DownloadButton buttonId={this.props.buttonId} text="Download Sequence" url="/download_sequence" extension=".fsa" params={_downloadParams}/></li>
        </ul>
        {customRetrievalNode}
      </div>

    </div>);
  },

  _getDropdownNode: function () {
    let _isDisabled = (s) => { return !s.sequence; };
    let _elements = _.map(this.props.sequences, s => {
      s.value = s.key;
      return s;
    });
    return <DropdownSelector elements={_elements} isDisabled={_isDisabled} onChange={this._handleChangeSequence} />;
  },

  _formatActiveSequenceTextNode: function () {
    let node = null;
    if (this.props.showSequence) {
      let seq = this._getActiveSequence().sequence;

      let sequenceNode;
      let legendNode = null;
      if (this._canColorSubFeatures()) {
        sequenceNode = this._getComplexSequenceNode(seq);
        let _featureTypes = _.uniq(_.map(this.props.subFeatureData, f => { return f.class_type; }));
        let _colors = _.map(_featureTypes, f => {
          return { text: f, color: subFeatureColorScale(f) };
        });
        legendNode = <Legend elements={_colors} />;
      } else {
        sequenceNode = this._getSimpleSequenceNode(seq);
      }

      node = (<div>
        {legendNode}
        <pre>
          <blockquote style={{ fontFamily: "Monospace", fontSize: 14 }}>
            {sequenceNode}
          </blockquote>
        </pre>
      </div>);
    }

    return node;

  },

  _handleChangeSequence: function (value) {
    this.setState({ activeSequenceType: value });
  },

  _getSubFeatureTypeFromIndex: function (index) {
    for (let i = this.props.subFeatureData.length - 1; i >= 0; i--) {
      let f = this.props.subFeatureData[i];
      if (index >= f.relative_start && index <= f.relative_end) {
        return f.class_type;
      }
    }

    return null;
  },

  _getSimpleSequenceNode: function (sequence) {
    let tenChunked = sequence.match(/.{1,10}/g).join(" ");
    let lineArr = tenChunked.match(/.{1,66}/g);
    let maxLabelLength = ((lineArr.length * LETTERS_PER_LINE + 1).toString().length)
    lineArr = _.map(lineArr, (l, i) => {
      let lineNum = i * LETTERS_PER_LINE + 1;
      let numSpaces = maxLabelLength - lineNum.toString().length;
      let spacesStr = Array(numSpaces + 1).join(" ");
      return `${spacesStr}${lineNum} ${l}`;
    });
    return _.map(lineArr, (l, i) => {
      return <span key={'seq' + i}>{l}<br /></span>;
    });
  },

  _getComplexSequenceNode: function (sequence) {
    let maxLabelLength = sequence.length.toString().length + 1;
    let chunked = sequence.split("");
    let offset = this.state.activeSequenceType === '1kb' ? 1000 : 0;
        
    return _.map(chunked, (c, i) => {
      i++;
      let sp = (i % LETTERS_PER_CHUNK === 0 && !(i % LETTERS_PER_LINE === 0)) ? " " : "";
      let cr = (i % LETTERS_PER_LINE === 0) && (i > 1) ? "\n" : "";
      let str = c + sp + cr;
      let _classType = this._getSubFeatureTypeFromIndex(i - offset);

      let labelNode = (i - 1) % LETTERS_PER_LINE === 0 ? <span style={{ color: "#6f6f6f" }}>{`${Array(maxLabelLength - i.toString().length).join(" ")}${i} `}</span> : null;

      return <span key={`sequence-car${i}`} style={{ color: subFeatureColorScale(_classType) }}>{labelNode}{str}</span>;
    });
  },

  _canColorSubFeatures: function () {
    // must have sub-features and be on genomic DNA
    if (this.props.subFeatureData.length <= 1 || this.state.activeSequenceType === "coding_dna" || this.state.activeSequenceType === "protein") {
      return false;
    }

    // no overlaps
    let _allTracks = _.uniq(_.map(this.props.subFeatureData, f => { return f.track; }));
    if (_allTracks.length > 1) return false;

    return true;
  },

  _getActiveSequence: function () {
    return _.findWhere(this.props.sequences, { key: this.state.activeSequenceType });
  }

});

module.exports = SequenceToggler;
