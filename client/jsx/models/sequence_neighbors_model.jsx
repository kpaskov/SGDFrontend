"use strict";

var _ = require("underscore");

var BaseModel = require("./base_model.jsx");
var LocusFormatHelper = require("../lib/locus_format_helper.jsx");

// var MAIN_STRAIN_NAME = "S288C";

var main_strain_list = ["S288C", "W303", "Sigma1278b", "SK1", "SEY6210", "X2180-1A", "CEN.PK", "D273-10B", "JK9-3d", "FL100", "Y55", "RM11-1a"];


module.exports = class SequenceNeighborsModel extends BaseModel {

	constructor (options) {
		options = options || {};
		options.url = `/backend/locus/${options.id}/neighbor_sequence_details`;
		super(options);
		if (options.id) this.id = parseInt(options.id);
	}

	parse (response) {
	
	        var MAIN_STRAIN_NAME = "";
		var i;
		for (i = 0; i < main_strain_list.length; i++) {
  		    if (_.keys(response).includes(main_strain_list[i])) {
		       MAIN_STRAIN_NAME = main_strain_list[i];
		       break
		    }  
		}

		var _altNames = _.filter(_.keys(response), n => { return n !== MAIN_STRAIN_NAME; });

		var _altStrains = _.map(_altNames, n => {
			return this._formatStrainName(n, response[n]);
		});
		var _mainStrain = this._formatStrainName(MAIN_STRAIN_NAME, response[MAIN_STRAIN_NAME]);

		return {
			mainStrain: _mainStrain,
			altStrains: _altStrains
		};
	}

	_formatStrainName (strainDisplayName, strainData) {
		if (strainData.neighbors.length > 0){
			var _contigData = LocusFormatHelper.formatContigData(strainData.neighbors[0].contig);
			var _loci = this._assignTracksToLocci(strainData.neighbors);
			var _trackDomain = LocusFormatHelper.getTrackDomain(_loci);

			var _start = _.min(_loci, (d) => { return d.start; }).start;
			var _end = _.max(_loci, (d) => { return d.end; }).end;

			console.log('_start='+_start + ', _end=' + _end);

			var _focusLocus = _.filter(_loci, l => {
				return l.locus.id === this.id;
			})[0];
			if (_focusLocus) {
				var _focusLocusDomain = [_focusLocus.start, _focusLocus.end];
			} else {
				var _focusLocusDomain = [_start, _end];
			}
			return {
				data: { locci: _loci },
				domainBounds: [_start, _end],
				contigData: _contigData,
				focusLocusDomain: _focusLocusDomain,
				strainKey: strainDisplayName + "_" + _contigData.formatName,
				trackDomain: _trackDomain
			};

			}
			else{
				return {
					data: {},
					domainBounds: [],
					contigData: {},
					focusLocusDomain: [],
					strainKey: strainDisplayName,
					trackDomain: {}
				}
			}
		
	}

	/*
		Takes an array of locci, and assigns a track number to make sure they don't overlap.
		Positive for watson, negative for crick.  Further from 0 is further from the center.
	*/
	_assignTracksToLocci (locci) {
		return _.map(locci, (d) => {
			return LocusFormatHelper.assignTrackToSingleLocus(d, locci);
		});
	}
};
