const React = require("react");
const _ = require("underscore");
const $ = require("jquery");

const RadioSelector = require("./radio_selector.jsx");
const BlastBarChart = require("./blast_bar_chart.jsx");
const Params = require("../mixins/parse_url_params.jsx");

const BLAST_URL = "/run_blast";

const SearchForm = React.createClass({

	getDefaultProps: function () {
                return {
                        blastType: ""
                };
        },

	getInitialState: function () {
	        
		let param = Params.getParams();
		
		let submitted = '';
		if (param['program']) {
		     submitted = 1;
		}
		else {
		     this._getConfigData(this.props.blastType);
		     if (param['name']) {
                     	  this._getSeq(param['name'], param['type']);
		     }
                }

		// need to put the date in a config file..
		let lastUpdate = "January 13, 2015";	 
		return {
			isComplete: false,
			isPending: false,
			userError: null,
			lastUpdate: lastUpdate,
			seqType: param['type'],
                        queryComment: param['name'],
		     	seqData: {},
			configData: {},
			sequence: null,
			uploadedSeq: null,
			uploadFile: null,
			program: null,
			database: null,
			outFormat: null,
			matrix: null,
			cutoffScore: null,
			wordLength: null,
			threshold: null,
			alignToShow: null,
			filtering: null,
			filter: null,
			resultData: {},
			submitted: submitted,
			param: param,
			didBlast: 0
		};
	},

	render: function () {		
		let formNode = this._getFormNode();

		if (this.props.blastType == 'sgd') {
		        return (<div>
			       <span style={{ textAlign: "center" }}><h1><i>S. cerevisiae</i> NCBI-BLAST Search <a target="_blank" href="https://sites.google.com/view/yeastgenome-help/sequence-help/blast"><img src="https://d1x6jdqbvd5dr.cloudfront.net/legacy_img/icon_help_circle_dark.png"></img></a></h1>
			       <hr /></span>
			       {formNode}
			</div>);
		}
		else {
		        return (<div>
                               <span style={{ textAlign: "center" }}><h1>Fungal Genomes Search using NCBI-BLAST <a target="_blank" href="https://sites.google.com/view/yeastgenome-help/sequence-help/fungal-blast"><img src="https://d1x6jdqbvd5dr.cloudfront.net/legacy_img/icon_help_circle_dark.png"></img></a></h1>
			       <hr /></span>
                               {formNode}
                        </div>);
		}

	},

	componentDidMount: function () {
	        if (this.state.submitted) {
	              this._doBlast();
	        }
	},

	_getFormNode: function () {
				
	        if (this.state.isComplete) {
		        if (this.state.resultData.hits == '') {
			     let errorReport = this.state.resultData.result;
			     // return (<div dangerouslySetInnerHTML={{ __html: this.state.resultData.result}} />);
			     // return (<div><p>{resultData.result}</p></div>);
			     return (<div dangerouslySetInnerHTML={{ __html: errorReport }} />);

			}

		        let descText = "<p>Query performed by the Saccharomyces Genome Database; for full BLAST options and parameters, refer to the NCBI BLAST Documentation Links to GenBank, EMBL, PIR, SwissProt, and SGD are shown in bold type; links to locations within this document are in normal type. Your comments and suggestions are requested: <a href='/suggestion'>Send a Message to SGD</a></p><hr>"; 
			if (this.state.filter) {
			       descText = descText + '<p><b>***Please Note Sequence Filtering is ON.***</b> Sequence filtering will mask out regions of low compositional complexity from your query sequence. Filtering can eliminate statistically significant but biologically uninteresting reports from the BLAST output. Low complexity regions found by a filter program are substituted using the letter "N" in nucleotide sequence (e.g., "NNNNN") and the letter "X" in protein sequences (e.g., "XXXXX"). In the BLAST output, filtered regions are shown in the query sequence as lower-case letters. Filtering is on by default, however it can be turned off by selecting "Off" from the Filter options on the BLAST form.</p><p>For more details on filtering see the <a href="http://blast.ncbi.nlm.nih.gov/blast_help.shtml">\
BLAST Help at NCBI</a>.</p><hr>';

			}
			
			let graph = this._getGraphNode(this.state.resultData.hits);
			let tableStyle = { width: "900", marginLeft: "auto", marginRight: "auto" };

			let showHits = this.state.resultData.showHits;
                        let totalHits = this.state.resultData.totalHits;

			let hitSummary = "All hits shown";
			let hitSummary2 = "";

			if (Number(showHits) < Number(totalHits)) {
			       hitSummary = "The graph shows the highest hits per range";
			       hitSummary2 = "Data has been omitted: " + showHits + "/" + totalHits + " hits displayed";
			}

			return(<div>
			       <span style={{ textAlign: "center" }}><h3>{hitSummary}</h3></span>
			       <span style={{ textAlign: "center" }}><h3>{hitSummary2}</h3></span>
 			       <div>
				    <table style={tableStyle}>
					 <tr><td>{graph}</td></tr>
				    </table>
			       </div> 	  	    
			       <div dangerouslySetInnerHTML={{ __html: descText}} />
			       <div dangerouslySetInnerHTML={{ __html: this.state.resultData.result}} />
                        </div>);

		} 
		else if (this.state.isPending) {

		        return (<div>
			       <div className="row">
			       	    <p><b>Something went wrong with your BLAST search</b></p>
			       </div>
			</div>);
			
		}
		else {

		        if (this.state.submitted) {
			     return <p>Please wait... The search may take a while to run.</p>; 

			}

		        let seqData = this.state.seqData;
                	let configData = this.state.configData;

			let seq = "";
			
			let param = this.state.param;
			if (param['sequence_id']) {
			     let seqID = param['sequence_id'];
                             seq = window.localStorage.getItem(seqID);
			}
			else {
			     seq = seqData.seq;
			}
			                
			let commentBoxNode = this._getCommentBoxNode();
                	let submitNode = this._getSubmitNode();
                	let seqBoxNode = this._getSeqBoxNode(seq);
                	let blastProgramNode = this._getBlastProgramNode(configData);
                	let databaseNode = this._getDatabaseNode(configData);
                	let optionNode = this._getOptionsNode(configData);
			// need to put the date in a config file
			let descText = "<p>Datasets updated: January 31, 2018</p><p>This form allows BLAST searches of S. cerevisiae sequence datasets. To search multiple fungal sequences, go to the <a href='/blast-fungal'>Fungal BLAST search form</a>.</p>";
			
			if (this.props.blastType == 'fungal') {
			     descText = "<p>This form allows BLAST searches of multiple fungal sequence datasets. To restrict your search to S. cerevisiae with additional BLAST search options, go to the <a href='/blast-sgd'><i>S. cerevisiae</i> BLAST search form</a>.</p>";
			}
				
			return (<div>
			        <div dangerouslySetInnerHTML={{ __html: descText}} />
				<form onSubmit={this._onSubmit} target="blast_result_win">
					<div className="row">
                        		     <div className="large-12 columns">
                               		     	  { commentBoxNode }
                               			  { submitNode }
						  { seqBoxNode }
						  { blastProgramNode }
						  { databaseNode }
						  { submitNode }
						  { optionNode }
                   		             </div>
                                       </div>
				</form>
			</div>);
		}
	},

	_getGraphNode:  function(data) {
	
		let legendColor = [{text: "< 10",     color: "#0000FF"},
				   {text: "10-50",  color: "#00FFFF"},
				   {text: "50-100", color: "#7FFF00"},
				   {text: "100-200",  color: "#8A2BE2"},
				   {text: "> 200",    color: "#DC143C"}
		];		   
					
       	        let _labelRatio = 0.1;
                let _colorScale = (d) => {
		     if (d.exp < -200) {
		          return legendColor[4].color;
	             }
		     else if (d.exp < -100) {
		     	  return legendColor[3].color;
	             }
		     else if (d.exp < -50) {
                          return legendColor[2].color;
		     }
		     else if (d.exp < -10) {
		     	  return legendColor[1].color;
	             }
		     else {
		          return legendColor[0].color;
		     }
				      
                };

                let _maxY = data[0].query_length; 
		let _left = 50;
		let _size = data.length;
		let _totalHits = this.state.resultData.totalHits; 
                let barNode = (<BlastBarChart 
		                data={data}
				size={_size} 
                                maxY={_maxY}
				left={_left}
                                yValue={ function (d) { return d.value; }}
                                start={ function (d) { return d.start; }}
                                labelValue={ function (d) { return d.name; }}
                                labelRatio={_labelRatio} 
                                colorScale={_colorScale}
                                hasTooltip={true} 
                                hasYaxis={false}
                                hasNoZeroWidth={true}
				legendColor={legendColor}
				totalHits={_totalHits}
                />);
             
                return barNode;
	
	},

	_getCommentBoxNode: function() {

                return (<div>
                        <p><h3>Query Comment (optional, will be added to output for your use):</h3></p>
                        <input type='text' ref='queryComment' onChange={this._onChange} value={this.state.queryComment} size='50'></input>
                        <p></p>
                </div>);
	},

	_getSubmitNode: function() {
               
                return(<div>
                      <p><input type="submit" value="Run NCBI-BLAST" className="button secondary"></input> OR  <input type="reset" value="Select Defaults" className="button secondary"></input>
		      </p>
                </div>);

        },

	_getSeqBoxNode: function(seq) {
                return (<div>
                        { this._submitNode }     
                        <p><h3>Upload Local TEXT File: FASTA, GCG, and RAW sequence formats are okay</h3></p>
                        WORD Documents do not work unless saved as TEXT. 
                        <input className="btn btn-default btn-file" type="file" name='uploadFile' onChange={this._handleFile} accept="image/*;capture=camera"/>
                        <p><h3>Type or Paste a Query Sequence : (FASTA or RAW format, or No Comments, Numbers are okay)</h3></p>
                        <textarea ref='sequence' onChange={this._onChange} value={seq} rows='5' cols='50'></textarea><p></p>
                </div>);   
	},

	_getBlastProgramNode: function(data) {
                let _programDef = 'blastn';
                if (this.state.seqType == 'protein') {
                       _programDef = 'blastp';
                }
                let _elements = _.map(data.program, p => {
		       if (p.script == _programDef) {
		       	    return <option value={p.script} selected="selected">{p.label}</option>;
		       }
		       else {
		       	    return <option value={p.script}>{p.label}</option>;
		       }
                });  
                return(<div>
                       <p><h3>Choose the Appropriate BLAST Program:</h3></p>
                       <p><select ref='program' name='program' onChange={this._onChange}>{_elements}</select></p>
                </div>);
        },

        _getDatabaseNode: function(data) {

                let database = data.database;
		let datagroup = data.datagroup;
                let _databaseDef = data.databasedef;
		
		let param = this.state.param;
		if (param['type'] == 'protein') {
		       _databaseDef = ['YeastORF.fsa'];
		}
                let i = 0;
                let _elements = _.map(database, d => {
                       i += 1;
		       let dataset = d.dataset;
		       if (dataset.match(/^label/)) {
		       	  dataset = datagroup[dataset];
		       }
                       
		       if($.inArray(dataset, _databaseDef) > -1) {
                            return <option value={dataset} selected='selected'>{d.label}</option>;
                       }
                       else {
                            return <option value={dataset}>{d.label}</option>;
                       }
                });

                return(<div>
                       <p><h3>Choose one or more Sequence Datasets:</h3></p> 
                       Select or unselect multiple datasets by pressing the Control (PC) or Command (Mac) key while clicking. Selecting a category label selects all datasets in that category.
                       <p><select ref='database' id='database' onChange={this._onChange} size={i} multiple>{_elements}</select></p>
                </div>);
                                        
        },

        _getOptionsNode: function(data) {

                let outFormatMenu = this._getOutFormatMenu();
                let matrixMenu = this._getMatrixMenu(data);
                let cutoffMenu = this._getCutoffScoreMenu();
                let wordLengthMenu = this._getWordLengthMenu();
                let thresholdMenu = this._getThresholdMenu();
                let alignToShowMenu = this._getAlignToShowMenu();
                let filterMenu = this._getFilterMenu();

                return(<div>
                       <b>Options:</b> For descriptions of BLAST options and parameters, refer to the BLAST documentation at NCBI.<br></br>
                       <div class="col-lg-4 col-lg-offset-4">
                             <table width="100%">
                                  <tbody>
                                      <tr><th>Output format:</th><td>{outFormatMenu}</td><td><br></br></td></tr>
                                      <tr><th>Comparison Matrix:</th><td>{matrixMenu}</td><td><br></br></td></tr>
                                      <tr><th>Cutoff Score (E value):</th><td>{cutoffMenu}</td><td><br></br></td></tr>
                                      <tr><th>Word Length (W value):</th><td>{wordLengthMenu}</td><td>Default = 11 for BLASTN, 3 for all others</td></tr>
                                      <tr><th>Expect threshold (E threshold):</th><td>{thresholdMenu}</td><td><br></br></td></tr>
                                      <tr><th>Number of best alignments to show:</th><td>{alignToShowMenu}</td><td><br></br></td></tr>
                                      <tr><th>Filter options:</th><td>{filterMenu}</td><td>DUST file for BLASTN, SEG filter for all others</td></tr>    
                                  </tbody>
                            </table>
                       </div>
                </div>);
                
        },      

        _getOutFormatMenu: function() {

                let format = ['gapped alignments', 'ungapped alignments'];

		let _elements = [];
                format.forEach ( function(f) {
	             if (f == 'gapped alignments') {
		     	  _elements.push(<option value={f} selected="selected">{f}</option>);
	             }
		     else { 
                     	  _elements.push(<option value={f}>{f}</option>);
		     }
                });

                return <p><select ref='outFormat' onChange={this._onChange}>{_elements}</select></p>;
             
        },

        _getMatrixMenu: function(data) {
                if (!data.matrix) return null;
                let matrix = data.matrix;
		let _elements = this._getDropdownList(matrix, "BLOSUM62");
		return <p><select ref='matrix' onChange={this._onChange}>{_elements}</select></p>;
        },

        _getCutoffScoreMenu: function() {

                let cutoffScore = ['10', '1', '0.1', '0.01', '0.001', '0.0001', '0.00001'];
		let _elements = this._getDropdownList(cutoffScore, "0.01");
		return <p><select ref='cutoffScore' onChange={this._onChange}>{_elements}</select></p>;

        },

        _getWordLengthMenu: function() {

                let wordLength = ['default', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
		let _elements = this._getDropdownList(wordLength, "default");
		return <p><select ref='wordLength' onChange={this._onChange}>{_elements}</select></p>;

        },

        _getThresholdMenu: function() {

                let threshold = ['default', '0.0001', '0.01', '1', '10', '100', '1000'];
		let _elements = this._getDropdownList(threshold, "default");
      		return <p><select ref='threshold' onChange={this._onChange}>{_elements}</select></p>;

        },

        _getAlignToShowMenu: function() {

                let alignToShow = ['0', '25', '50', '100', '200', '400', '500', '800', '1000'];
		
		let defaultVal = "50";
		if (this.props.blastType == 'fungal') {
		     defaultVal = "500";
		}
		alignToShow.unshift(defaultVal);
		let _elements = this._getDropdownList(alignToShow, defaultVal);
		return <p><select ref='alignToShow' onChange={this._onChange}>{_elements}</select></p>;

        },

        _getFilterMenu: function() {

                let _elements = [ { name: "On", key: "On" }, { name: "Off", key: "Off"}];
		return <RadioSelector name='filter' elements={_elements} initialActiveElementKey='On'/>; 
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

        _onChange: function(e) {
                this.setState({ text: e.target.value});
        },

	_getSeq: function(name, type) {
                let jsonUrl = BLAST_URL + "?name=" + name;
		if (type == 'protein' || type == 'pep') {
		   jsonUrl = jsonUrl + "&type=" + type;
		}
                $.ajax({
                      url: jsonUrl,
                      dataType: 'json',
                      success: function(data) {
                            this.setState({seqData: data});
                      }.bind(this),
                      error: function(xhr, status, err) {
                            console.error(jsonUrl, status, err.toString());
                      }.bind(this)
                });

        },

	_getConfigData: function(db) {
                let jsonUrl = BLAST_URL + "?conf=";
                if (db == 'sgd') {
                      jsonUrl = jsonUrl + "blast-sgd";
                }
                else {
                      jsonUrl = jsonUrl + "blast-fungal";
                }
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

		let queryComment = this.refs.queryComment.value.trim();
		let seq = this.refs.sequence.value.trim();
		if (seq == '') {
		    seq = this.state.uploadedSeq;
		}
		let program = this.refs.program.value.trim();
		let dbs = document.getElementById('database');
		let database = '';
		for (let i = 0; i < dbs.options.length; i++) {
		     if (dbs.options[i].selected) {
		     	 if (database) {
			      database = database + ' ' + dbs.options[i].value;
			 }
			 else {
			      database = dbs.options[i].value;
			 }
		     }
		}
		
                let outFormat = this.refs.outFormat.value;
                let matrix = this.refs.matrix.value;
                let cutoffScore = this.refs.cutoffScore.value;
                let wordLength = this.refs.wordLength.value;
                let threshold = this.refs.threshold.value;
                let alignToShow = this.refs.alignToShow.value;
		let filter = 'on';
		if (document.getElementById('Off').checked) {
		     filter = '';
		}
		seq = this._cleanUpSeq(seq);

		let newDatabase = this._checkParameters(seq, 
		    	      			      	program, 
		    	      			        database, 
						        wordLength, 
						        cutoffScore);

		if (newDatabase) {
		    database = newDatabase;
		    // window.localStorage.clear();
		    window.localStorage.setItem("seq", seq);
		    window.localStorage.setItem("program", program);
		    window.localStorage.setItem("database", database);
		    window.localStorage.setItem("outFormat", outFormat);
		    window.localStorage.setItem("matrix", matrix);
		    window.localStorage.setItem("cutoffScore", cutoffScore);
		    window.localStorage.setItem("wordLength", wordLength);
		    window.localStorage.setItem("threshold", threshold);
		    window.localStorage.setItem("alignToShow", alignToShow);
		    window.localStorage.setItem("filter", filter);
		}
		else {
		    e.preventDefault();
		    return 1; 
		}

	},

	_doBlast: function() {

		let seq = window.localStorage.getItem("seq");
		let program = window.localStorage.getItem("program");
		let database = window.localStorage.getItem("database");
		let outFormat = window.localStorage.getItem("outFormat");
                let matrix = window.localStorage.getItem("matrix");
                let cutoffScore = window.localStorage.getItem("cutoffScore");
                let wordLength = window.localStorage.getItem("wordLength");
                let threshold = window.localStorage.getItem("threshold");
                let alignToShow = window.localStorage.getItem("alignToShow");
                let filter = window.localStorage.getItem("filter");

		$.ajax({
			url: BLAST_URL,
			data_type: 'json',
			type: 'POST',
			data: { 'seq':         seq,
			        'program':     program,
				'database':    database,
				'outFormat':   outFormat,
				'matrix':      matrix,
				'threshold':   threshold,
				'cutoffScore': cutoffScore,
				'alignToShow': alignToShow,
				'wordLength':  wordLength,
				'filter':      filter,
				'blastType':   this.props.blastType
                        },
			success: function(data) {
			      this.setState({isComplete: true,
			                     resultData: data,
			         	     filter: filter});
			}.bind(this),
			error: function(xhr, status, err) {
			      this.setState({isPending: true}); 
			}.bind(this) 
		});

	},


	_cleanUpSeq: function(seq) {

		seq = seq.replace(/^>.*$/m, '');
		
		// get rid of anything that is no-alphabet characters
		if (seq) {
		   seq = seq.replace(/[^a-zA-Z]/g , "");
		}
		return seq;
	},

	_checkParameters: function(seq, program, database, wordLength, cutoffScore) {
	
                // check sequence
                // get seq from the box or from upload file and remove unwanted characters
                if (!seq) {
                     alert("Please enter a sequence");
                     return 0;
                }


		// check database
		if (database == '-') {
		   alert("Please select a database.");
		   return 0;
		}

		// check sequence length and cutoffScore (s) value
		// if (cutoffScore != 'default' && cutoffScore < 60 && seq.length > 100) {
		//     alert("The maximum sequence length for an S value less than 60 is 100. Please adjust either the S value or sequence");
		//     return 0;
		// }		

		// check sequence length and wordlength
		if (program == 'blastn' && wordLength != 'default' && 
		    wordLength < 11 && seq.length > 10000) {
		    alert("The maximum sequence length for a word length of less than 11 is 10000. Please fix either word length or sequence.");
		    return 0;
		}

		// check database and program to make sure they match...
		
		let configData = this.state.configData;		
		let programs = configData.program;
		let datasets = configData.database;
		
		let programType = "";
		 _.map(programs, p => {
	             if (p.script == program) {
		      	  programType = p.type;
		     }
		});
		
		let dbType = {};
		_.map(datasets, d => {
		     dbType[d.dataset] = d.type;
		});		

		database = database.replace(/\,/g, " ");

		let dblist = database.split(" ");
		let goodDatabase = "";
		let badDatabase = "";
		let good = 0;
		let removed = 0;
		let databaseType = "";
		let foundDB = {};
		dblist.forEach( function(d) {
		    if (dbType[d] == 'both' || dbType[d] == programType) {
		        if (foundDB[d] == undefined) {
		             if (goodDatabase) {
			     	  goodDatabase = goodDatabase + " ";
			     }
		             goodDatabase = goodDatabase + d;
			     good += 1;
			} 
		    }
		    else {
		    	removed += 1;
			badDatabase = badDatabase + " " + d;
			databaseType = dbType[d];
		    }
		    foundDB[d] = 1;
                });
		
		if (removed >= 1) {
		    if (databaseType) {
		        if (databaseType == 'dna') {
			    databaseType = 'DNA';
			}
			if (programType == 'dna') {
			    programType = 'DNA';
			}
		        if (removed > 1) {
		            badDatabase = badDatabase.replace(/ /g, ", ");
			    badDatabase = badDatabase.replace(/^, /, "");
			    alert("The following datasets contain " + databaseType + " sequence and thus do not work with " + program.toUpperCase() + ", which requires " + programType + " sequences: " + badDatabase + "\n\n" + "Click OK to see results with these datasets excluded.");
		        }
			else {
			    alert("The following dataset contains " + databaseType + " sequence and thus does not work with " + program.toUpperCase() + ", which requires " + programType + " sequences: " + badDatabase + "\n\n" + "Click OK to see results with this dataset excluded.");
                        }
		    }
		    if (!goodDatabase) {
		    	alert("Your choice of datasets does not include one that is appropriate for " + program + ". BLASTP and BLASTX require a protein sequence database and other BLAST programs require a nucleotide sequence database. Adjust either the program or database selection before submitting your search.");
			return 0;

		    }
		}
		
		return goodDatabase;
		
	},

	_handleFile: function(e) {
                let reader = new FileReader();
                let fileHandle = e.target.files[0];
		let fileName = e.target.files[0].name;
                reader.onload = function(upload) {
                      this.setState({
                            uploadedSeq: upload.target.result
                      });
              }.bind(this);
              reader.readAsText(fileHandle);
        }

});

module.exports = SearchForm;
