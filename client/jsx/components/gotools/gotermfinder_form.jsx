import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

const DataTable = require("../widgets/data_table.jsx");
const Params = require("../mixins/parse_url_params.jsx");
const RadioSelector = require("./radio_selector.jsx");
const Checklist = require("./checklist.jsx");

const style = {
      button: { fontSize: 18, background: 'none', border: 'none', color: '#7392b7' },
      textFont: { fontSize: 18 }
};

const GOtoolsUrl = "/run_gotools";

const evidenceCode = [ 'HDA', 'HGI', 'HMP', 'IBA', 'IC',  'IEA', 'IDA', 'IEP', 'IGI', 
      		       'IKR', 'IMP', 'IMR', 'IPI', 'IRD', 'ISA', 'ISM', 'ISO', 'ISS', 
		       'NAS', 'ND',  'TAS' ];

const GoTermFinder = React.createClass({

	getInitialState() {
	        
		var param = Params.getParams();
		
		return {
			isComplete: false,
			isPending: false,
			userError: null,
			aspect: 'F',
			uploadedGenes: '',
			uploadedGenes4bg: '',
			resultData: {},
			notFound: null,
			param: param
		};
	},

	render() {	
	
		var page_to_display = this.getPage();
		
		return (<div>
			  <span style={{ textAlign: "center" }}><h1>Gene Ontology Term Finder <a target="_blank" href="https://sites.google.com/view/yeastgenome-help/analyze-help/go-term-finder?authuser=0"><img src="https://d1x6jdqbvd5dr.cloudfront.net/legacy_img/icon_help_circle_dark.png"></img></a></h1>
			  <hr /></span>
			  {page_to_display}
			</div>);
		
		 
	},

	componentDidMount() {
		var param = this.state.param;
	        if (param['submit']) {
	              this.runGoTools();
	        }		      
	},

	getPage() {
		
		var param = this.state.param;

	        if (this.state.isComplete) {

			var data = this.state.resultData;
			var output = data['output'];
			if (typeof(output) != "undefined") {
			     return (<div><span style={ style.textFont }>{ output }</span></div>);
			}

			var resultTable = data['html'];
			var graph = data['image_html'];
			var termsUrl = data['term_page'];
			var tabUrl = data['tab_page'];
			var pngUrl = data['png_page'];
			var pngHtmlUrl = data['image_page'];
			var svgUrl = data['svg_page'];
			var psUrl = data['ps_page'];
			var tableUrl = data['table_page'];
			var inputUrl = data['input_page'];
	
			var resultText = this.getResultText();
			var tableSaveOptions = this.tableSaveOptions(tableUrl, termsUrl, tabUrl, inputUrl);
			var graphSaveOptions = this.graphSaveOptions(pngUrl, pngHtmlUrl, svgUrl, psUrl, inputUrl);

			tableSaveOptions = "<br><a name='table'>" + "<h2><center>Search Results in HTML Table Format</center></h2><br>" + tableSaveOptions;
			graphSaveOptions = "<a name='graph'>" + "<h2><center>Search Results in GO View Tree Image Format</center></h2><br>" + graphSaveOptions;

			return (<div>
			       <p dangerouslySetInnerHTML={{ __html: resultText }} />
			       <p dangerouslySetInnerHTML={{ __html: graphSaveOptions }} />
			       <p dangerouslySetInnerHTML={{ __html: graph }} />
			       <p dangerouslySetInnerHTML={{ __html: tableSaveOptions }} />
			       <p dangerouslySetInnerHTML={{ __html: resultTable }} />
			</div>);


		} 
		else if (this.state.isPending) {

		        return (<div>
			       <div className="row">
			       	    <p><b>Something wrong with your search!</b></p>
			       </div>
			</div>);
			
		}
		else {

		        if (param['submit']) {
			     return <p>Please wait... The search may take a while to run.</p>; 
			}

			return this.getFrontPage();
			
		}
	},

	getFrontPage() {

		var descText = this.topDescription();		

		var submitReset = this.submitReset();
		var geneBox = this.getGeneBox();
		var ontology = this.getOntology();
		var gene4bgBox = this.getGene4bgBox();
		var optionalInput = this.getOptionalInput();
				 
		var _defaultSection = { headers: [[<span style={ style.textFont }><a name='step1'>Step 1. Query Set (Your Input)</a></span>, <span style={ style.textFont }><a name='step2'>Step 2. Choose Ontology</a></span>]],
                                     rows:    [[geneBox, ontology]] };
			  
		var _backgroundSection = { headers: [[<span style={ style.textFont }><a name='step3'>Step 3. Specify your background set of genes</a></span>, <span style={ style.textFont }><a name='step4'>Step 4. Optional Input</a></span>]],
                                     rows:    [[gene4bgBox, optionalInput]] };

		return (<div>
			<div dangerouslySetInnerHTML={{ __html: descText}} />
			<div className="row">
			     <div className="large-12 columns">
			     	  <form onSubmit={this.onSubmit} target="infowin">
				  	{ submitReset }
				        <DataTable data={_defaultSection} />
					<DataTable data={_backgroundSection} />
					{ submitReset }
			          </form>
			     </div>
			</div>
		</div>);

	},

	submitReset() {

		return (<div>
		       <p><input type="submit" ref='submit' name='submit' value="Submit Form" className="button secondary"></input> <input type="reset" ref='reset' name='reset' value="Reset Form" className="button secondary"></input></p>
		       </div>);

	},

	getOntology() {

	        var _elements = [ { name: "Process", key: "P" }, { name: "Function", key: "F" }, { name: "Component", key: "C" }];

		return (<div style={{ textAlign: "top" }}>
		        <h3><strong>Pick an ontology aspect:</strong></h3> 
		        <p><h3><RadioSelector id='aspect' name='aspect' elements={_elements} initialActiveElementKey='F'/></h3></p>
			<p></p>
			<p><h3>Search using <a href='#defaultsetting'>default settings</a> or use Step 3, Step 4, and/or Step 5 below to customize your options.</h3></p>	
			</div>);

	},

	getGeneBox() {

                return (<div style={{ textAlign: "top" }}>
			<h3><strong>Enter Gene/ORF names</strong> (separated by a return or a space):
                        <textarea ref='genes' onChange={this._onChange} name='genes' rows='2' cols='90'></textarea>
			<strong style={{ color: 'red'}}>OR</strong> <strong>Upload a file of Gene/ORF names</strong> (.txt or .tab format):
                        <input className="btn btn-default btn-file" type="file" name='uploadFile' onChange={this.handleFile} accept="image/*;capture=camera"/></h3>
                </div>);

        },

	getGene4bgBox() {

                return (<div style={{ textAlign: "top" }}>
                        <h3><strong>Use default background set</strong> (all features in the database that have GO annotations)</h3>
			<h3><strong style={{ color: 'red'}}>OR</strong> <strong>Enter Gene/ORF names</strong> (separated by a return or a space):
                        <textarea ref='genes4bg' onChange={this._onChange} name='genes4bg' rows='4' cols='163'></textarea></h3>
			<h3><strong style={{ color: 'red'}}>OR</strong> <strong>Upload a file of Gene/ORF names</strong> (.txt or .tab format):
                        <input className="btn btn-default btn-file" type="file" name='uploadFile' onChange={this.handleFile4bg} accept="image/*;capture=camera"/></h3>
                        </div>);

        },

	getOptionalInput() {

                // used for computational only: IBA, IEA, IRD
                // used for both manual and computational: IKR, IMR

                // var _init_active_keys = evidenceCode;
		var _init_active_keys = [];
                var _elements = [];
                for (var i = 0; i < evidenceCode.length; i++) {
                       _elements.push({ 'key': evidenceCode[i], 'name': evidenceCode[i] });
		}
		
		var _pvalueElements = [<option value='0.01' selected='selected'>0.01</option>];
                _pvalueElements.push(<option value='0.05'>0.05</option>);
                _pvalueElements.push(<option value='0.1'>0.1</option>);

                var _init_active_keys = ['FDR']
                var _FDRelements = [ { 'key': 'FDR', 'name': 'FDR'} ];

                return (<div>
		       <h3><strong>Pick evidence codes to exclude for calculation:</strong></h3>
                       <p><Checklist elements={_elements} initialActiveElementKeys={_init_active_keys} /></p>
		       <h3><strong>Pick a p-value below</strong> (default is 0.01):</h3>
                       <p><select ref='pvalue' name='pvalue' onChange={this.onChange}>{_pvalueElements}</select></p>
                       <h3>Calculate false discovery rate (FDR)?
                       <Checklist elements={_FDRelements} initialActiveElementKeys={_init_active_keys} /></h3>
                       </div>);

        },
	
	handleFile(e) {
                var reader = new FileReader();
                var fileHandle = e.target.files[0];
                var fileName = e.target.files[0].name;
                reader.onload = function(upload) {
                      this.setState({
                            uploadedGenes: upload.target.result
                      });
              }.bind(this);
              reader.readAsText(fileHandle);
        },

	handleFile4bg(e) {
                var reader = new FileReader();
                var fileHandle = e.target.files[0];
                var fileName = e.target.files[0].name;
                reader.onload = function(upload) {
                      this.setState({
                            uploadedGenes4bg: upload.target.result
                      });
              }.bind(this);
              reader.readAsText(fileHandle);
        },

	processGeneList(genes) {

		if (genes == '') {
		     return '';
		}	 	        
                genes = genes.replace(/[^A-Za-z:\-0-9]/g, ' ');
                var re = /\+/g;
                genes = genes.replace(re, " ");
                var re = / +/g;
                genes = genes.replace(re, "|");

		return genes;

	},

	onSubmit(e) {

		var genes = this.refs.genes.value.trim();
		if (genes == '') {
		     genes = this.state.uploadedGenes;
		     this.setState({
                            uploadedGenes: ''
                     });
		}
		genes = this.processGeneList(genes);
                if (genes == '') {
                     alert("Please enter two or more gene names.");
                     e.preventDefault();
                     return 1;
                }

		var genes4bg = this.refs.genes4bg.value.trim();
                if (genes4bg == '') {
                     genes4bg = this.state.uploadedGenes4bg;
		     this.setState({
                            uploadedGenes4bg: ''
                     });
                }
                genes4bg = this.processGeneList(genes4bg);
                	
		var aspect = '';
		if (document.getElementById('C').checked) {
		   	aspect = 'C';		
		}      
		else if (document.getElementById('P').checked) {
                        aspect = 'P';
                }
		else {
			aspect = 'F';
		}

		window.localStorage.clear();
                window.localStorage.setItem("genes", genes);
		window.localStorage.setItem("genes4bg", genes4bg);
                window.localStorage.setItem("aspect", aspect);

	},

        onChange(e) {
                this.setState({ text: e.target.value});
        },

	runGoTools() {

		var paramData = {};

		paramData['genes'] = window.localStorage.getItem("genes");

		if (window.localStorage.getItem("genes4bg") != '') {
		     paramData['genes4bg'] = window.localStorage.getItem("genes4bg");
		}
		paramData['aspect'] = window.localStorage.getItem("aspect");
		
		var param = this.state.param;
		
		paramData['pvalue'] = param['pvalue'];

		if (param['FDR']) {
		     paramData['FDR'] = 1;
		}

		var evidence = ""; 
		var selected = 0;
		for (var i = 0; evidenceCode.length; i++) {
		     if (typeof(evidenceCode[i]) == "undefined") {
		         break;
		     }
		     var code = param[evidenceCode[i]];
		     if (typeof(code) != "undefined") {
		     	 selected += 1; 
		     	 continue;
		     }		     
		     if (evidence != "") {
			 evidence += "|";
		     }
		     evidence += evidenceCode[i];
		}

		if (evidence != "" && selected > 0) {
		     paramData['evidence'] = evidence;
		}
		
		this.sendRequest(paramData)
		return
		 		
	},
	
	sendRequest(paramData) {

		console.log("GOtoosUrl="+GOtoolsUrl);
		console.log("genes="+paramData['genes']);
		console.log("evidence="+paramData['evidence']);
		console.log("pvalue="+paramData['pvalue']);
		console.log("FDR="+paramData['FDR']);

		$.ajax({
			url: GOtoolsUrl,
			data_type: 'json',
			type: 'POST',
			data: paramData,
			success: function(data) {
			      this.setState({isComplete: true,
			                     resultData: data});
			}.bind(this),
			error: function(xhr, status, err) {
			      this.setState({isPending: true});
			}.bind(this) 

		});
	},

	topDescription() {
		
		// 2. Manually curated and High-throughput annotation methods, 
		return "<p><h3>The GO Term Finder (<a href='http://search.cpan.org/dist/GO-TermFinder/' target='infowin'>Version 0.86</a>) searches for significant shared GO terms, or parents of those GO terms, used to describe the genes in your list to help you discover what the genes may have in common. To map annotations of a group of genes to more general terms and/or to bin them in broad categories, use the <a href='https://www.yeastgenome.org/cgi-bin/GO/goSlimMapper.pl' target='infowin'>GO Slim Mapper</a></h3>.<h3><a name='defaultsetting'>Default Settings:</a> 1. All genes/features that have GO annotations in the database, 2. All annotations in the database (manually curated, high-throughput, and computational annotations), and 3. Hits with p-value < 0.01 will be displayed on the results page</h3></p>";
	
	},

	getResultText() {
		
		return "<h3>This page displays the significant shared GO terms (or parents of GO terms) used to describe your set of genes, based on the criteria you selected to define the background set of genes and which annotations are used in the significance calculations. View Results: <a href='#graph'>Graphic</a> | <a href='#table'>Table</a></h3>";
		
	},

	tableSaveOptions(htmlUrl, termsUrl, tabUrl, inputUrl) {
		return "<h3>Save Options: <a href=" + htmlUrl + " target='infowin2'>HTML Table</a> | <a href=" + termsUrl + " target='infowin2'>Plain Text</a> | <a href=" + tabUrl + " target='infowin2'>Tab-delimited</a> | <a href=" + inputUrl + " target='infowin2'>Your Input List of Genes</a></h3>";			   
		
	},

	graphSaveOptions(pngUrl, pngHtmlUrl, svgUrl, psUrl, inputUrl) {
		return "<h3>Save Options: <a href=" + pngUrl + " target='infowin2'>PNG</a> | <a href=" + pngHtmlUrl + " target='infowin2'>PNG With HyperLinks</a> | <a href=" + svgUrl + " target='infowin2'>SVG</a> | <a href=" + psUrl + " target='infowin2'>PostScript</a> | <a href=" + inputUrl + " target='infowin2'>Your Input List of Genes</a></h3>";
     		
	}

});

module.exports = GoTermFinder;

