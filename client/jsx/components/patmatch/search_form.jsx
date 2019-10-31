import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

const Checklist = require("../widgets/checklist.jsx");
const Params = require("../mixins/parse_url_params.jsx");
const ExampleTable = require("./example_table.jsx");
const DataTable = require("../widgets/data_table.jsx");

const PatmatchUrl = "/run_patmatch";

const LETTERS_PER_CHUNK = 10;
const LETTERS_PER_LINE = 60;

const SearchForm = React.createClass({

	getInitialState: function () {
	        
		let param = Params.getParams();
		
		let submitted = null;				
		if (param['pattern']) {
		     submitted = 1;
		}
		
		let get_seq = 0;
		if (param['seqname']) {
		   get_seq = 1;
		}

		this._getConfigData();

		return {
			isComplete: false,
			isPending: false,
			userError: null,
			configData: {},
			genome: 'S288C',
			seqtype: 'protein',
			dataset: null,
			pattern: null,
			maxHits: null,
			strand: null,
			mismatch: null,
			deletion: null,
			insersion: null,
			substitution: null,
			resultData: {},
			seqname: null,
			beg: null,
			end: null,
			param: param,
			didPatmatch: 0,
			submitted: submitted,
			seqFetched: false,
			getSeq: get_seq
		};
	},

	render: function () {		
		let formNode = this._getFormNode();
		
		if (this.state.getSeq) {
		     return (<div>{ formNode }</div>);
		}
		else {
		     return (<div>
			    <span style={{ textAlign: "center" }}><h1>Yeast Genome Pattern Matching <a target="_blank" href="https://sites.google.com/view/yeastgenome-help/analyze-help/pattern-matching?authuser=0"><img src="https://d1x6jdqbvd5dr.cloudfront.net/legacy_img/icon_help_circle_dark.png"></img></a></h1>
			    <hr /></span>
			    {formNode}
		     </div>);
		}
		 
	},

	componentDidMount: function () {
	        if (this.state.submitted) {
	              this._doPatmatch();
	        }
		// if (this.state.getSeq) {
		//      this._getSeq();
		// }
	},

	_getFormNode: function () {

		
		if (this.state.getSeq && !this.state.seqFetched) {
		        this._getSeq();
			return;
		}		
		else if (this.state.getSeq && this.state.seqFetched) {

		     	let seqNode = this._getSeqNode();
			
			return (<div dangerouslySetInnerHTML={{ __html: seqNode }} />);
				
		}
	        else if (this.state.isComplete) {

		        // if (this.state.resultData.hits == '') {
			//     let errorReport = this.state.resultData.result;
			//     return (<div dangerouslySetInnerHTML={{ __html: errorReport }} />);
			// }

			let data = this.state.resultData.hits;
			let totalHits = this.state.resultData.totalHits;
			let uniqueHits = this.state.resultData.uniqueHits;
			let downloadUrl = this.state.resultData.downloadUrl;
			
			if (totalHits == 0) {
			     return (<div><p>No hits found for your pattern. Please modify your pattern and try again..</p></div>);
			}

			let _summaryTable = this._getSummaryTable(totalHits, uniqueHits);
			let _resultTable = this._getResultTable(data, totalHits);

		       	return (<div><p><center>{_summaryTable}</center></p>
				     <p><center>{_resultTable}</center></p>
				     <p><center><blockquote style={{ fontFamily: "Monospace", fontSize: 14 }}><a href={downloadUrl}>Download Full Results</a></blockquote></center></p>
			       </div>);			

		} 
		else if (this.state.isPending) {

		        return (<div>
			       <div className="row">
			       	    <p><b>Something wrong with your patmatch search</b></p>
			       </div>
			</div>);
			
		}
		else {

		        if (this.state.submitted) {
			     return <p>Please wait... The search may take a while to run.</p>; 

			}
			
			let configData = this.state.configData;

			let genomeBoxNode = this._getGenomeBoxNode(configData);
			let seqtypeNode = this._getSeqtypeNode(); 
			let patternBoxNode = this._getPatternBoxNode();
			let datasetNode = this._getDatasetNode(configData);
                	let submitNode = this._getSubmitNode();
                	let optionNode = this._getOptionsNode();
			let patternExampleNode = this._getPatternExampleNote();

			// need to put the date in a config file
			
			let descText = "<p>Pattern Matching allows you to search for short (<20 residues) nucleotide or peptide sequences, or ambiguous/degenerate patterns. It uses the same dataset as SGD's BLAST program. If you are searching for a sequence >20 bp or aa with no degenerate positions, please use BLAST, which is much faster. Pattern Matching allows for ambiguous characters, mismatches, insertions and deletions, but does not do alignments and so is not a replacement for <a target='_blank' href='/blast-sgd'>BLAST</a>. Please note, also, that PatMatch will not find overlapping hits.</p><p>Your comments and suggestions are appreciated: <a target='_blank' href='/suggestion'>Send a Message to SGD</a></p>";
							
			return (<div>
			        <div dangerouslySetInnerHTML={{ __html: descText}} />
				<form onSubmit={this._onSubmit} target="infowin">
					<div className="row">
                        		     <div className="large-12 columns">
                               		     	  { genomeBoxNode }
						  { seqtypeNode }
						  { patternBoxNode }
						  { datasetNode }
                               			  { submitNode }
						  { optionNode }
						  { patternExampleNode }
                   		             </div>
                                       </div>
				</form>
			</div>);
		}
	},
	

	_getSeqNode: function() {

		let param = this.state.param;
                let beg = param['beg'];
                let end = param['end'];
		let dataset = param['dataset'];
		let seqname = param['seqname'];

                let seq = this.state.resultData.seq;
		let text = this.state.resultData.defline;

		let seq_orig = seq;

		let seqlen = seq.length;
		let seqStart = 0;
		
		let seqEnd = seqlen;
                if (seqlen > 5000) {
                     if (Math.ceil(beg/LETTERS_PER_LINE)*LETTERS_PER_LINE >  LETTERS_PER_LINE*4) {
                     	  seqStart = Math.ceil(beg/ LETTERS_PER_LINE)*LETTERS_PER_LINE -  LETTERS_PER_LINE*4;
                     }
                     seqEnd = seqStart+ LETTERS_PER_LINE*9;
                     if (seqEnd > seqlen) {
                         seqEnd = seqlen;
                     }
                     seq = seq.substring(seqStart, seqEnd);
                }
		
		let tenChunked = seq.match(/.{1,10}/g).join(" ");
    		let lineArr = tenChunked.match(/.{1,66}/g);
    		// let maxLabelLength = ((lineArr.length * LETTERS_PER_LINE + 1).toString().length)
		let maxLabelLength = seqEnd.toString().length + 1;

    		lineArr = _.map(lineArr, (line, i) => {
      			let lineNum = seqStart + i * LETTERS_PER_LINE + 1;
      			let numSpaces = maxLabelLength - lineNum.toString().length;
      			let spacesStr = Array(numSpaces + 1).join(" ");
			
      			if (beg >= lineNum && beg <= lineNum + 59) {
          		    let tmpBeg = beg - lineNum;
          		    let tmpEnd = end - lineNum;
          		    if (tmpEnd > 59) {
             		       tmpEnd = 59;
             		       beg = lineNum + 60;
          		    }
          		    let baseArr = line.split("");
          		    let k = 0;
          		    let newLine = ""
           		    _.map(baseArr, (base, j) => {
              		         if (k < tmpBeg || k > tmpEnd || base == ' ') {
                   		      newLine += base;
              			 }
              			 else {
                   		      newLine += "<strong style='color:blue;'>" + base + "</strong>";
              			 }
              			 if (base != ' ') {
                   		      k++;
              			 }
          	            });
          	       	    line = newLine;
      		 	}
			return `${spacesStr}${lineNum} ${line}`;
			
    	        });
		
		
    	  	// let seqNode = _.map(lineArr, (l, i) => {
    	  	//       return <span key={'seq' + i}>{l}<br /></span>;
    	  	// });
		//		
		// return (<div>
             	//       <blockquote style={{ fontFamily: "Monospace", fontSize: 14 }}>
             	//       <pre>
                //       {seqNode}
             	//       </pre>
             	//       </blockquote>
             	//       </div>);
		
		let seqlines = "";
		_.map(lineArr, (l, i) => {
		    seqlines += l + "\n";
		});
	    
		// let spacesStr = Array(maxLabelLength + 1).join(" ");
		if (seqEnd < seqlen) {
	    	     seqlines += " ..........";
		}
		if (seqStart > 0) {
		   seqlines = " ..........\n" + seqlines;
		}

		let seqSection = "<blockquote style={{ fontFamily: 'Monospace', fontSize: 14 }}><pre>" + seqlines + "</pre></blockquote>";
		
		let datasetLabel = this._getDatasetLabel(dataset);
		
                let seqNode = "<center><h1>" + datasetLabel + " for " + seqname + "</h1><h3>The matching region is highlighted in the following retrieved sequence (in <span style='color:blue;'>blue</span>)</h3>" + seqSection + "</center>";

		return seqNode;

	},

	_getGenomeBoxNode: function(data) {
	
		let _genomeDef = 'S288C';
		let _elements = _.map(data.genome, g => {
                       if (g.strain == _genomeDef) {
                            return <option value={g.strain} selected="selected">{g.label}</option>;
                       }
                       else {
                            return <option value={g.strain}>{g.label}</option>;
                       }
                });
                return(<div>
                       <h3>Choose a genome to search: </h3>
                       <p><select ref='genome' name='genome' onChange={this._onChangeGenome}>{_elements}</select></p>
                </div>);
			      
	},
		
	_getSeqtypeNode: function() {

	        let param = this.state.param;

                let pattern_type = {'peptide': 'protein', 'nucleotide': 'dna'};
                let _elements = [];
                for (let key in pattern_type) {
		     
		     if (param['seqtype'] && param['seqtype'] == 'dna') {
		     	  _elements.push(<option value='dna' selected="selected">{key}</option>);
	             }		
                     if (key == 'peptide') {
                          _elements.push(<option value={pattern_type[key]} selected="selected">{key}</option>);
                     }
                     else {
                          _elements.push(<option value={pattern_type[key]}>{key}</option>);
                     }
                }

                return(<div>
		      <h3>Enter a</h3>
		      <p><select name='seqtype' ref='seqtype' onChange={this._onChangeSeqtype}>{_elements}</select></p>
		</div>);

        },

	_getPatternBoxNode: function() {

		let param = this.state.param;
		let pattern = param['seq'];

                return (<div>
                        <h3>sequence or pattern (<a href='#examples'>syntax</a>)</h3>
			<textarea ref='pattern' value={ pattern } name='pattern' onChange={this._onChange} rows='1' cols='50'></textarea>
                </div>);

        },

	_getDatasetNode: function(data) {
	 			
				// if( dataset.indexOf('orf_') >= 0 ){
		let _elements = []; 
		for (let key in data.dataset) {
		     if (key == this.state.genome) {
		       	    let datasets = data.dataset[key];
			    for (let i = 0; i < datasets.length; i++) { 
    			    	let d = datasets[i];
				if (d.seqtype != this.state.seqtype) {
				     continue;
				}
				if (d.label.indexOf('Coding') >= 0 || d.label.indexOf('Trans') >= 0 ){
				     _elements.push(<option value={d.dataset_file_name} selected="selected">{d.label}</option>);
				}
				else {
				     _elements.push(<option value={d.dataset_file_name}>{d.label}</option>);			
				}						
			    }			    
		     }
		}	    

		return(<div>
                       <h3> Choose a Sequence Database (click and hold to see the list):</h3>
		       <p><select ref='dataset' name='dataset' onChange={this._onChange}>{_elements}</select></p>
                </div>);

	},

	_getSubmitNode: function() {
               
                return(<div>
                      <p><input type="submit" value="START PATTERN SEARCH" className="button secondary"></input> OR  <input type="reset" value="RESET FORM" className="button secondary"></input>
		      </p>
                </div>);

        },

	_getOptionsNode: function() {

		let maximumHitsNode = this._getMaximumHitsNode();
		let strandNode = this._getStrandNote();
		let mismatchNode = this._getMismatchNode();
		let mismatchTypeNode = this._getMismatchTypeNode();

		let descText = "<p>PLEASE WAIT FOR EACH REQUEST TO COMPLETE BEFORE SUBMITTING ANOTHER. These searches are done on a single computer at Stanford shared by many other people.</p><hr><h3>More Options:</h3>";

	        return(<div>
		      <div dangerouslySetInnerHTML={{ __html: descText}} />
		      <br>Maximum hits:</br>
		      { maximumHitsNode }
		      <br>If DNA, Strand:</br>
                      { strandNode }
		      <br>Mismatch:</br>
                      { mismatchNode }
                      { mismatchTypeNode }
		</div>);

	},	

	_getMaximumHitsNode: function() {

		let hits = ['25', '50', '100', '200', '500', '1000', "2000", "5000", "no limit"];
		let _elements = this._getDropdownList(hits, "500");
                return <select name='max_hits' ref='max_hits' onChange={this._onChange}>{_elements}</select>;
	
	},

	_getStrandNote: function() {

               	let strands = ['Both strands', 'Strand in dataset', 'Reverse complement of strand in dataset'];
                let _elements = this._getDropdownList(strands, "Both strands");
                return <select name='strand' ref='strand' onChange={this._onChange}>{_elements}</select>;
			
	},

	_getMismatchNode: function() {
	
		let mismatch = ['0', '1', '2', '3'];
                let _elements = this._getDropdownList(mismatch, "0");
                return <select name='mismatch' ref='mismatch' onChange={this._onChange}>{_elements}</select>;

	},	

	_getMismatchTypeNode: function() {

	        let _elements = [ { 'key': 'insertion',
		    	      	    'name': 'Insertions' },
				  { 'key': 'deletion',
                                    'name': 'Deletions' },
				  { 'key': 'substitution',
                                    'name': 'Substitutions' } ]

		let _init_active_keys = ['insertion', 'deletion', 'substitution'];

	        return (<div><a href='#mismatch_note'>(more information on use of the Mismatch option)</a>
		       <Checklist elements={_elements} initialActiveElementKeys={_init_active_keys} />
		       </div>);

	},

	_getPatternExampleNote: function() {

		let examples = ExampleTable.examples();
		
		return(<div><p><a name='examples'><h3>Supported Pattern Syntax and Examples:</h3></a></p>
		      {examples}
		      <p><h3><a name='mismatch_note'>Limits on the use of the Mismatch option</a></h3></p>
		      <p>At this time, the mismatch option (Insertions, Deletions, or Substitutions) can only be used in combination with exact patterns that do not contain ambiguous peptide or nucleotide characters (e.g. X for any amino acid or R for any purine) or regular expressions (e.g. L{3,5}X{5}DGO). In addition, the mismatch=3 option can only be used for query strings of at least 7 in length.</p>
		</div>);

        },

	_getDropdownList: function(elementList, activeVal) {
		let _elements = [];
		elementList.forEach ( function(m) {
                     if (m == activeVal) {
                     	  _elements.push(<option value={m} selected='selected'>{m}</option>);
                     }
                     else {
                          _elements.push(<option value={m}>{m}</option>);
                     }
		});
       		return _elements;
	},

	// need to combine these three
        _onChange: function(e) {
                this.setState({ text: e.target.value});
        },

	_onChangeGenome: function(e) {
                this.setState({ genome: e.target.value});
        },

	_onChangeSeqtype: function(e) {
                this.setState({ seqtype: e.target.value});
        },
	
	_getConfigData: function() {
                let jsonUrl = PatmatchUrl + "?conf=patmatch.json";
                $.ajax({
    		      url: jsonUrl,
                      dataType: 'json',
                      success: function(data) {
                            this.setState({configData: data});
                      }.bind(this),
                      error: function(xhr, status, err) {
                            console.error(jsonUrl, status, err.toString());
                      }.bind(this)
                });
        },

	_onSubmit: function (e) {
                	
		let genome = this.state.genome.value.trim();
		let seqtype = this.state.seqtype.value.trim();
		let pattern = this.refs.pattern.value.trim();
		let dataset =  this.refs.dataset.value.trim();
				
		if (pattern) {
		    window.localStorage.clear();
		    window.localStorage.setItem("genome",  genome);
		    window.localStorage.setItem("seqtype", seqtype);
		    window.localStorage.setItem("pattern", pattern);
		    window.localStorage.setItem("dataset", dataset);
		}
		else {
		    e.preventDefault();
		    return 1; 
		}

	},

	_doPatmatch: function() {

	        let param = this.state.param;

		let genome = param['genome'];
                let seqtype = param['seqtype'];
		if (typeof(seqtype) == "undefined" || seqtype == 'protein') {
                    seqtype = 'pep';
                }
                let pattern = param['pattern'];
                let dataset = param['dataset'];
		if (typeof(dataset) == "undefined") {
		    if (seqtype == 'pep') {
		        dataset = 'orf_pep';
		    }
		    else {
		        dataset = 'orf_dna';
		    }
		}
		
		let strand = param['strand'];
		if (typeof(strand) == "undefined") {
                    strand = 'Both strands';
                }
	
		if (pattern) {
                    window.localStorage.clear();
                    window.localStorage.setItem("genome",  genome);
                    window.localStorage.setItem("seqtype", seqtype);
                    window.localStorage.setItem("pattern", pattern);
                    window.localStorage.setItem("dataset", dataset);		    
		    window.localStorage.setItem("strand", strand);
                }

		let pattern = pattern.replace("%3C", "<");
		let pattern = pattern.replace("%3E", ">");

		$.ajax({
			url: PatmatchUrl,
			data_type: 'json',
			type: 'POST',
			data: { 'seqtype':      seqtype,
			        'pattern':      pattern,
				'dataset':      dataset,
				'strand':       strand,
				'max_hits':     param['max_hits'],
				'mismatch':	param['mismatch'],
				'insertion':    param['insertion'],
				'deletion':     param['deletion'],
				'substitution': param['substitution']			
                        },
			success: function(data) {
			      this.setState({isComplete: true,
			                     resultData: data});
			}.bind(this),
			error: function(xhr, status, err) {
			      this.setState({isPending: true});
			}.bind(this) 
		});

	},

	_getSeq: function() {

		let param = this.state.param;
		
		$.ajax({
                        url: PatmatchUrl,
                        data_type: 'json',
                        type: 'POST',
                        data: { 'seqname':      param['seqname'],
                                'dataset':      param['dataset']
                        },
                        success: function(data) {
                              this.setState({seqFetched: true,
                                             resultData: data});
                        }.bind(this),
                        error: function(xhr, status, err) {
                              this.setState({isPending: true});
                        }.bind(this)
                });
 
	},

	_getSummaryTable: function(totalHits, uniqueHits) {
	
                let dataset = window.localStorage.getItem("dataset");
                let pattern = window.localStorage.getItem("pattern");
                let seqtype = window.localStorage.getItem("seqtype");
		let strand  = window.localStorage.getItem("strand");

                let configData = this.state.configData;
                let seqSearched = 0;
                let datasetDisplayName = "";
                for (let key in configData.dataset) {
                     let datasets = configData.dataset[key];
                     for (let i = 0; i < datasets.length; i++) {
                         let d = datasets[i];
                         if (d.dataset_file_name == dataset) {
                            seqSearched = d.seqcount;
                            datasetDisplayName = d.label.split(" = ")[1];
                            break;
                         }
                     }
                }
		
		window.localStorage.setItem("dataset_label", datasetDisplayName);
		
                let _summaryRows = [];

                _summaryRows.push(['Total Hits', totalHits]);
                _summaryRows.push(['Number of Unique Sequence Entries Hit', uniqueHits]);
                _summaryRows.push(['Sequences Searched', seqSearched]);

		let pattern = pattern.replace("%3C", "<");
		let pattern = pattern.replace("%3E", ">");

                if (seqtype == "dna" || seqtype.indexOf('nuc') >= 0) {
                       _summaryRows.push(['Entered nucleotide pattern', pattern]);
                }
                else {
                       _summaryRows.push(['Entered peptide pattern', pattern]);
                }
                _summaryRows.push(['Dataset', datasetDisplayName]);
		
		if (seqtype == "dna" || seqtype.indexOf('nuc') >= 0) {
                       _summaryRows.push(['Strand', strand]);
                }

                let _summaryData = { headers: [['', '']],
		                     rows: _summaryRows };
		
		return <DataTable data={_summaryData} />;		

	},

	_getResultTable: function(data, totalHits) {

	        let dataset = window.localStorage.getItem("dataset");

		let withDesc = 0;
		if( dataset.indexOf('orf_') >= 0 ){		
		    withDesc = 1;
		}
		
		let notFeat = 0;
		if ( dataset.indexOf('Not') >= 0 ) {
		    notFeat = 1;
		}
								
		let _tableRows = [];

		_.map(data, d => {

			let beg = d.beg;
			let end = d.end;
			if (notFeat == 1) {
			    let featStart = d.seqname.split(':')[1].split("-")[0];
			    beg = beg - parseInt(featStart) + 1;
			    end = end - parseInt(featStart) + 1;
			}   
			let seqLink = '/nph-patmatch?seqname=' + d.seqname + '&dataset=' + dataset + '&beg=' + beg + '&end=' + end;
				   
	 	  	if (notFeat == 1) {
    				
			     _tableRows.push([d.chr, d.orfs, d.count, d.matchingPattern, d.beg, d.end, <span><a href={ seqLink} target='infowin2'>Sequence</a></span>]);

			}
		    	else if (withDesc == 0) {

			     _tableRows.push([d.seqname, d.count, d.matchingPattern, d.beg, d.end, <span><a href={ seqLink} target='infowin2'>Sequence</a></span>]);

			}
			else {		    	   

		    	     let headline = d.desc.split(';')[0];
			     let name = d.seqname;
			     if (d.gene_name) {
			       	  name = name + "/" + d.gene_name;
			     }
			     let lspLink = '/locus/' + d.seqname;

			     _tableRows.push([ <span><a href={ lspLink } target='infowin2'>{ name }</a></span>, d.count, d.matchingPattern, d.beg, d.end, <span><a href={ seqLink} target='infowin2'>Sequence</a></span>, headline]);
				
			}
                });

		let header = ['Sequence Name', 'Hit Number', 'Matching Pattern', 'Matching Begin', 'Matching End', 'Matching Result'];
     	        if (withDesc == 1) {

		     header = ['Sequence Name', 'Hit Number', 'Matching Pattern', 'Matching Begin', 'Matching End', 'Matching Result',  'Locus Information'];

		}
		else if (notFeat == 1) {

		     header = ['Chromosome', 'Between ORF - ORF', 'Hit Number', 'Matching Pattern', 'Matching Begin', 'Matching End', 'Matching Result'];

		}

		let _tableData = {
		      headers: [header],
		      rows: _tableRows
		};
		
		let pagination= true;
		if (totalHits  <= 10) {
		      pagination = false;
		}

		let _dataTableOptions = {
		    bPaginate: pagination,
		    oLanguage: { "sEmptyTable": "No Hits." }
                };

		return <DataTable data={_tableData} usePlugin={true} pluginOptions={_dataTableOptions} />;

        },

	_getDatasetLabel: function(dataset) {

	        let configData = this.state.configData;
                let datasetDisplayName = "";
		let seqtype = "";
                for (let key in configData.dataset) {
                     let datasets = configData.dataset[key];
                     for (let i = 0; i < datasets.length; i++) {
                         let d = datasets[i];
                         if (d.dataset_file_name == dataset) {
                            seqtype = d.seqtype;
                            datasetDisplayName = d.label.split(" = ")[0];
                            break;
                         }
                     }
               }

	       if (seqtype == 'dna') {
	           seqtype = 'DNA';
	       }
	       else {
 	           seqtype = 'Protein';
	       }

	       return datasetDisplayName + " " + seqtype + " Sequence";
		    
	}

});

module.exports = SearchForm;
