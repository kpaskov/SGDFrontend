import React from 'react';
import _ from 'underscore';
import Radium from 'radium';
import Clipboard from 'clipboard';

import DownloadButton from '../widgets/download_button.jsx';

const CopyToClipButton = React.createClass({
  propTypes: {
    domId: React.PropTypes.string.isRequired,
    copiedText: React.PropTypes.string.isRequired
  },

  render () {
    return (
      <span>
        <a id={this._getButtonDomId()} data-clipboard-target={`#${this._getTextDomId()}`}><i className='fa fa-clipboard' /> Copy to Clipboard</a>
        <span style={{ width: 1, height: 1, overflow: 'hidden', display: 'inline-block' }}>
          <input id={this._getTextDomId()} defaultValue={this.props.copiedText} />
        </span>
      </span>
    );
  },

  componentDidMount() {
    this._clip = new Clipboard(`#${this._getButtonDomId()}`);
  },

  componentWillUnmount() {
    this._clip.destroy();
  },

  _getButtonDomId () {
    return `sgd-copy-btn-${this.props.domId}`;
  },

  _getTextDomId () {
    return `sgd-copy-${this.props.domId}`;
  }
});

const SearchResult = React.createClass({
  propTypes: {
    category: React.PropTypes.string.isRequired,
    description: React.PropTypes.string,
    highlights: React.PropTypes.object,
    name: React.PropTypes.string.isRequired,
    href: React.PropTypes.string,
    loci: React.PropTypes.array, // i.e. ['rad54', ...]
    keyStr: React.PropTypes.string // same as key to give a unique str
  },

  getInitialState() {
    return {
      isLociVisible: false
    };
  },

  render () {
    let innerNode = this._getBasicResultNode();
    return (
      <div className='search-result' style={[style.wrapper]}>
        {innerNode}
       
      </div>
    );
  },

  _getBasicResultNode () {
    let name = this.props.name || '(no name available)';
    return (
      <div>
        <div className='search-result-title-container' style={[style.titleContainer]}>
          <h2 style={[style.title]}>
            <a href={this.props.href}>{name}</a>
          </h2>
          <span><span className={`search-cat ${this.props.category}`}/> {this.props.categoryName}</span>
        </div>
        {this._renderHighlightsNode()}
        {this._renderDisplayedLoci()}
      </div>
    );
  },

  _renderDisplayedLoci () {
    let loci = this.props.loci;
    if (!loci || loci.length === 0) return null;
    const labelSuffix = (loci.length > 1) ? 's' : '';
    const onToggleLociVisible = e => {
      e.preventDefault();
      this.setState({ isLociVisible: !this.state.isLociVisible });
    };
    // crop loci if necessary and show a message for UI
    let actionMessage;
    let nodes;
    if (this.state.isLociVisible) {
      nodes = loci.map( (d, i) => {
        let separatorNode = (i === loci.length - 1) ? null : <span> | </span>;
        let href = `/locus/${d}/overview`;
        return <span key={`${this.props.href}.searchLocusLink${i}`}><a href={href}>{d}</a>{separatorNode}</span>;
      });
      actionMessage = <span>Hide</span>;
    } else {
      nodes = null;
      actionMessage = <span><i className='fa fa-chevron-down' /> Show All</span>;
    }
    // render to clipboard button
    let lociStr = loci.reduce( (prev, d, i) => {
      let separator = (i === loci.length - 1) ? '' : '|';
      prev += `${d}${separator}`;
      return prev;
    }, '');
    let domIdStr = this.props.keyStr;
    // disable clipboard thing in safari
    let clipNode = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) ?
      null : <span style={[style.inlineItem]}><CopyToClipButton domId={domIdStr} copiedText={lociStr} /></span>;
    return (
      <div>
          <div style={[style.lociContainer]}>
            <span style={[style.inlineItem]}>{loci.length.toLocaleString()} Associated Gene{labelSuffix}:</span>
            {clipNode}
            <span style={[style.inlineItem]}><a onClick={onToggleLociVisible}>{actionMessage}</a></span>
          </div>
        <div>{nodes}</div>
      </div>
    );
  },

  // if highlights, returns highlighted HTML in <dl>, otherise description
  _renderHighlightsNode () {
    // format highlights
    let highlightKeys = this.props.highlights ? Object.keys(this.props.highlights) : [];
    let highlightNodes = highlightKeys.map( (d, i) => {
      let highLabel = d.replace(/_/g, ' ');
      let highVal = this.props.highlights[d].join('...');
      return <p style={[style.description]} key={`resHigh${i}`}><span style={[style.highlightKey]}>{highLabel}</span>: <span dangerouslySetInnerHTML={{ __html: highVal }} /></p>;
    });
    return (
      <div>
        <p style={[style.description, style.primaryDescription]}>{this.props.description}</p>
        {highlightNodes}
      </div>
    );
  }
});

const style = {
  wrapper: {
    borderBottom: '1px solid #ddd',
    paddingBottom: '1rem',
    marginBottom: '1rem'
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  title: {
    marginBottom: 0,
    width: '75%'
  },
  description: {
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    'WebkitLineClamp': 2,
    'WebkitBoxOrient': 'vertical',
    overflow: 'hidden',
    maxHeight: '3.6rem',
    marginBottom: 0
  },
  primaryDescription: {
    marginBottom: '0.5rem'
  },
  geneList: {
    marginBottom: 0
  },
  highlightKey: {
    fontWeight: 'bold'
  },
  lociContainer: {
    marginTop: '1rem'
  },
  inlineItem: {
    marginRight: '1rem'
  }
};

module.exports = Radium(SearchResult);
