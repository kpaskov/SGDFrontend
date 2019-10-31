import React from 'react';
import _ from 'underscore';

const HelpIcon = require('../widgets/help_icon.jsx');
const HistoryTable = require('./history_table.jsx');
const SequenceDetailsModel = require('../../models/sequence_details_model.jsx');
const SequenceNeighborsModel = require('../../models/sequence_neighbors_model.jsx');
const SequenceComposite = require('./sequence_composite.jsx');
const SequenceToggler = require('./sequence_toggler.jsx');
const AsyncVariantViewer = require("../variant_viewer/async_variant_viewer.jsx");
const VariantViewerStore = require("../../stores/variant_viewer_store.jsx");

/*
  Fetches data from model and renders locus diagram (or loader while fetching).
*/
let AsyncSequenceView = React.createClass({

  getDefaultProps: function () {
    return {
      detailsCallback: null, // (err, detailsModel)
      geneticPosition: null,
      isSimplified: false, // simplified is for LSP
      locusDisplayName: null,
      locusHistoryData: null,
      locusFormatName: null,
      showAltStrains: true,
      showVariants: false,
      showOtherStrains: true,
      showHistory: true,
      locusId: null,
    };
  },

  getInitialState: function () {
    return {
      neighborsModel: null,
      detailsModel: null
    };
  },

  render: function () {
    let mainStrainNode = this._getMainStrainNode();
    let altStrainsNode = this._getAltStrainsNode();
    let variantNode = this._getVariantsNode();
    let otherStrainsNode = this._getOtherStrainsNode();
    let historyNode = this._getHistoryNode();

    return (<div>
      {mainStrainNode}
      {altStrainsNode}
      {variantNode}
      {otherStrainsNode}
      {historyNode}
    </div>);
  },

  componentDidMount: function () {
    this._fetchData();
  },

  // from locusId, get data and update
  _fetchData: function () {
    let _neighborsModel = new SequenceNeighborsModel({ id: this.props.locusId });
    _neighborsModel.fetch( (err, response) => {
      if (this.isMounted()) {
        this.setState({ neighborsModel: _neighborsModel });
        let _detailsModel = new SequenceDetailsModel({
          id: this.props.locusId,
          locusDiplayName: this.props.locusDisplayName,
          locusFormatName: this.props.locusFormatName,
          locusSGDID: this.props.locusSGDID
        });
        _detailsModel.fetch( (err, response) => {
          if (this.isMounted()) this.setState({ detailsModel: _detailsModel });

          // call details callback (if defined)
          if (this.props.detailsCallback) {
            this.props.detailsCallback(err, _detailsModel);
          }
        });
      }
    });
  },

  _getMainStrainNode: function () {
    let innerNode = (<SequenceComposite
      isSimplified={this.props.isSimplified}
      focusLocusDisplayName={this.props.locusDisplayName}
      focusLocusFormatName={this.props.locusFormatName}
      geneticPosition={this.props.geneticPosition}
      neighborsModel={this.state.neighborsModel}
      detailsModel={this.state.detailsModel}
      showAltStrains={false}
    />);

    if (this.props.isSimplified) {
      return <div>{innerNode}</div>;
    } else {
      return (<section id='reference'>
        {innerNode}
      </section>);
    }
  },

  _getAltStrainsNode: function () {
    let node = null;
    if (!this.props.showAltStrains) return node;
    if (this.state.detailsModel ? this.state.detailsModel.attributes.altStrainMetaData.length : false) {
      let _defaultAltStrainKey = this.state.detailsModel.attributes.altStrainMetaData[0].key;
      node = (<section id='alternative'><SequenceComposite
        focusLocusDisplayName={this.props.locusDisplayName}
        neighborsModel={this.state.neighborsModel}
        detailsModel={this.state.detailsModel}
        defaultAltStrainKey={_defaultAltStrainKey}
        showAltStrains={true}
        showSubFeatures={false}
      /></section>);
    }

    return node;
  },

  _getVariantsNode: function () {
    if (!this.props.showVariants) return null;
    let variantViewerStore = new VariantViewerStore();
    return (
      <section id='variants'>
        <h2>Variants</h2>
        <hr />
        <AsyncVariantViewer hideTitle sgdid={this.props.locusSGDID} store={variantViewerStore} />
      </section>
    );
  },  

  _getOtherStrainsNode: function () {
    let node = null
    if (!this.props.showOtherStrains) return node;
    if (this.state.detailsModel ? this.state.detailsModel.attributes.otherStrains.length : false) {
      let outerHelpNode = <HelpIcon text='Other laboratory, industrial, and environmental isolates; sequences available via the Download button.' isInfo={true} />;
      let innerHelpNode = <HelpIcon text='Select a strain using the pull-down in order to download its sequence as an .fsa file using the Download button located directly below.' />;
      node = (<section id='other'>
        <h2>Other Strains {outerHelpNode}</h2>
        <hr />
        <div className='panel sgd-viz'>
          <h3>Strains Available for Download {innerHelpNode}</h3>
          <SequenceToggler
            sequences={this.state.detailsModel.attributes.otherStrains}
            locusDisplayName={this.props.locusDisplayName} showSequence={false}
            buttonId='other_download'
          />
        </div>
      </section>);
    }

    return node;
  },

  _getHistoryNode: function () {
    let node = null;
    if (this.props.showHistory && this.props.locusHistoryData) {
      node = <HistoryTable data={this.props.locusHistoryData} dataType='SEQUENCE' />;
    }

    return node;
  },

});

module.exports = AsyncSequenceView;
