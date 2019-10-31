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
const GeneChkUrl = "/backend/ambiguous_names";

const evidenceCode = [ 'HDA', 'HGI', 'HMP', 'IBA', 'IC',  'IEA', 'IDA', 'IEP', 'IGI', 
      		       'IKR', 'IMP', 'IMR', 'IPI', 'IRD', 'ISA', 'ISM', 'ISO', 'ISS', 
		       'NAS', 'ND',  'TAS' ];

const GoTermFinder = React.createClass({

	getInitialState() {
	        
		let param = Params.getParams();
		
		this.getAmbiguousNames();
		
		return {
			isComplete: false,
			isPending: false,
			userError: null,
			aspect: 'F',
			uploadedGenes: '',
			uploadedGenes4bg: '',
			ambiguousNames: {},
			resultData: {},
			notFound: null,
			param: param
		};
	},

	render() {	
	
		let page_to_display = this.getPage();
		
		return (<div>
			  <span style={{ textAlign: "center" }}><h1>Gene Ontology Term Finder <a target="_blank" href="https://sites.google.com/view/yeastgenome-help/analyze-help/go-term-finder?authuser=0"><img src="https://d1x6jdqbvd5dr.cloudfront.net/legacy_img/icon_help_circle_dark.png"></img></a></h1>
			  <hr /></span>
			  {page_to_display}
			</div>);
		
		 
	},

	componentDidMount() {
		let param = this.state.param;
	        if (param['submit']) {
	              this.runGoTools();
	        }				      
	},

	getPage() {
		
		let param = this.state.param;

	        if (this.state.isComplete) {

			let data = this.state.resultData;
			let output = data['output'];
			if (typeof(output) != "undefined") {
			     return (<div>
			     	     <h3>There is an issue for this search. Please take a look at the following message and try to fix your query and resubmit again.</h3>
			     	     <p dangerouslySetInnerHTML={{ __html: output }} />
			     	     </div>);
			}

			let resultTable = data['html'];
			let graph = data['image_html'];
			let termsUrl = data['term_page'];
			let tabUrl = data['tab_page'];
			let pngUrl = data['png_page'];
			let pngHtmlUrl = data['image_page'];
			let svgUrl = data['svg_page'];
			let psUrl = data['ps_page'];
			let tableUrl = data['table_page'];
			let inputUrl = data['input_page'];
	
			let resultText = this.getResultText();
			let tableSaveOptions = this.tableSaveOptions(tableUrl, termsUrl, tabUrl, inputUrl);
			let graphSaveOptions = this.graphSaveOptions(pngUrl, pngHtmlUrl, svgUrl, psUrl, inputUrl);

			tableSaveOptions = "<br><h2 id='table'><center>Search Results in HTML Table Format</center></h2><br>" + tableSaveOptions;
			graphSaveOptions = "<h2 id='graph'><center>Search Results in GO View Tree Image Format</center></h2><br>" + graphSaveOptions;

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
			     return <p>Please wait while we retrieve the requested information.</p>; 
			}

			return this.getFrontPage();
			
		}
	},

	getFrontPage() {

		let descText = this.topDescription();		

		let submitReset = this.submitReset();
		let geneBox = this.getGeneBox();
		let ontology = this.getOntology();
		let gene4bgBox = this.getGene4bgBox();
		let optionalInput = this.getOptionalInput();
				 
		let _defaultSection = { headers: [[<span style={ style.textFont }><a name='step1'>Step 1. Query Set (Your Input)</a></span>, <span style={ style.textFont }><a name='step2'>Step 2. Choose Ontology</a></span>]],
                                     rows:    [[geneBox, ontology]] };
			  
		let _backgroundSection = { headers: [[<span style={ style.textFont }><a name='step3'>Step 3. (Optional) Specify your background set of genes</a></span>, <span style={ style.textFont }><a name='step4'>Step 4. Optional Input</a></span>]],
                                     rows:    [[gene4bgBox, optionalInput]] };

		return (<div>
			<div dangerouslySetInnerHTML={{ __html: descText}} />
			<div className="row">
			     <div className="large-12 columns">
			     	  <form onSubmit={this.onSubmit} onReset={this.onReset} target="infowin">
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

	        let _elements = [ { name: "Process", key: "P" }, { name: "Function", key: "F" }, { name: "Component", key: "C" }];

		return (<div style={{ textAlign: "top" }}>
		        <h3><strong>Pick an ontology aspect:</strong></h3> 
		        <p><h3><RadioSelector id='aspect' name='aspect' elements={_elements} initialActiveElementKey='F'/></h3></p>
			<p></p>
			<p><h3>Search using default settings or use Step 3 and/or Step 4 below to customize your options.</h3></p>	
			</div>);

	},

	getGeneBox() {

		let genes = window.localStorage.getItem("geneList");
		if (genes) {

                   return (<div style={{ textAlign: "top" }}>
			   <h3><strong>Enter Gene/ORF names</strong> (separated by a return or a space):</h3>
                           <textarea ref='genes' onChange={this._onChange} name='genes' rows='2' cols='90' value={ genes }></textarea>
			   Note: If you have a big gene list (>100), save it as a file and upload it below.
			   <h3><strong style={{ color: 'red'}}>OR</strong> <strong>Upload a file of Gene/ORF names</strong> (.txt or .tab format):
                           <input className="btn btn-default btn-file" type="file" name='uploadFile' onChange={this.handleFile} accept="image/*;capture=camera"/></h3>
                   </div>);
		}
		else {

		   return (<div style={{ textAlign: "top" }}>
                           <h3><strong>Enter Gene/ORF names</strong> (separated by a return or a space):</h3>
                           <textarea ref='genes' onChange={this._onChange} name='genes' rows='2' cols='90'></textarea>
                           Note: If you have a big gene list (>100), save it as a file and upload it below.
                           <h3><strong style={{ color: 'red'}}>OR</strong> <strong>Upload a file of Gene/ORF names</strong> (.txt or .tab format):
                           <input className="btn btn-default btn-file" type="file" name='uploadFile' onChange={this.handleFile} accept="image/*;capture=camera"/></h3>
		   </div>);
		
		} 

        },

	getGene4bgBox() {

                return (<div style={{ textAlign: "top" }}>
                        <h3>Leave empty to use default background set (all features in the database that have GO annotations)
			<strong style={{ color: 'red'}}> OR</strong> <strong>Enter Gene/ORF names</strong> (separated by a return or a space):</h3>
                        <textarea ref='genes4bg' onChange={this._onChange} name='genes4bg' rows='4' cols='163'></textarea>
			Note: If you have a big background list (>100), save it as a file and upload it below.
			<h3><strong style={{ color: 'red'}}>OR</strong> <strong>Upload a file of Gene/ORF names</strong> (.txt or .tab format):
                        <input className="btn btn-default btn-file" type="file" name='uploadFile' onChange={this.handleFile4bg} accept="image/*;capture=camera"/></h3>
                        </div>);

        },

	getOptionalInput() {

                // used for computational only: IBA, IEA, IRD
                // used for both manual and computational: IKR, IMR

                // let _init_active_keys = evidenceCode;
		let _init_active_keys = [];
                let _elements = [];
                for (let i = 0; i < evidenceCode.length; i++) {
                       _elements.push({ 'key': evidenceCode[i], 'name': evidenceCode[i] });
		}
		
		let _pvalueElements = [<option value='0.01' selected='selected'>0.01</option>];
                _pvalueElements.push(<option value='0.05'>0.05</option>);
                _pvalueElements.push(<option value='0.1'>0.1</option>);

                let _init_active_keys = ['FDR']
                let _FDRelements = [ { 'key': 'FDR', 'name': 'FDR'} ];

		let evidenceCodeLink = "Pick <a href=http://geneontology.org/page/guide-go-evidence-codes target='infowin3'>evidence codes</a> to exclude for calculation:";

                return (<div>
		       <h3><strong><p dangerouslySetInnerHTML={{ __html: evidenceCodeLink }} /></strong></h3>
                       <p><Checklist elements={_elements} initialActiveElementKeys={_init_active_keys} /></p>
		       <h3><strong>Pick a p-value below</strong> (default is 0.01):</h3>
                       <p><select ref='pvalue' name='pvalue' onChange={this.onChange}>{_pvalueElements}</select></p>
                       <h3>Calculate false discovery rate (FDR)?
                       <Checklist elements={_FDRelements} initialActiveElementKeys={_init_active_keys} /></h3>
                       </div>);

        },
	
	handleFile(e) {
                let reader = new FileReader();
                let fileHandle = e.target.files[0];
                let fileName = e.target.files[0].name;
                reader.onload = function(upload) {
                      this.setState({
                            uploadedGenes: upload.target.result
                      });
              }.bind(this);
              reader.readAsText(fileHandle);
        },

	handleFile4bg(e) {
                let reader = new FileReader();
                let fileHandle = e.target.files[0];
                let fileName = e.target.files[0].name;
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
		genes = genes.replace(/[^A-Za-z:\-0-9\(\)\,\_]/g, ' ');
                let re = /\+/g;
                genes = genes.replace(re, " ");
                let re = / +/g;
                genes = genes.replace(re, "|");

		return genes;

	},

	onReset(e) {
		   window.location.reload();
                   return 1;
	},

	onSubmit(e) {

		let genes = this.refs.genes.value.trim();
		let genesInBox = 0;
		if (genes == '') {
		     genes = this.state.uploadedGenes;
		     this.setState({
                            uploadedGenes: ''
                     });
		}
		else {
		     genesInBox = 1;
		}
		genes = this.processGeneList(genes);
                if (genes == '') {
                     alert("Please enter two or more gene names.");
                     e.preventDefault();
                     return 1;
                }

		let all_genes = genes.split("|");

		if (genesInBox == 1 && all_genes.length > 100) {
		     alert("You have entered more than 100 genes. Please save it as a file and upload it.");
                     e.preventDefault();
                     return 1;
                }

		// check for ambiguous genes

		let ambiguousGeneDict = this.state.ambiguousNames;

                for (let i = 0; i < all_genes.length; i++) {
                     let gene = all_genes[i];
                     if (gene in ambiguousGeneDict) {
                           let ambiguousGeneObj = ambiguousGeneDict[gene];
                           let warningMsg = "The name '" + gene + "' is associated with multiple genes. " + gene + " is ";
                           for (let j = 0; j < ambiguousGeneObj.length; j++) {
                                 let geneObj = ambiguousGeneObj[j];
                                 let display_name = geneObj['systematic_name'] + " (SGDID: " + geneObj['sgdid'] + ")";
                                 if (geneObj['gene_name']) {
                                      display_name = geneObj['gene_name'] + "/" + display_name;
                                 }
                                 if (j > 0) {
                                     warningMsg = warningMsg + " and ";
                                 }
                                 if (geneObj['name_type'] == 'alias_name') {
                                     warningMsg = warningMsg + "an alias name for " + display_name;
                                 }
                                 else {
                                     warningMsg = warningMsg + "the standard gene name for " + display_name;
                                 }
                           }
                           alert(warningMsg + ". Please modify your input list by replacing the entry '" + gene + "' with either the systematic ORF name or SGDID for the intended gene.");
                           e.preventDefault();
                           return 1;
                     }

                }

		window.localStorage.setItem("genes", genes);

		let genes4bg = this.refs.genes4bg.value.trim();
                if (genes4bg == '') {
                     genes4bg = this.state.uploadedGenes4bg;
		     this.setState({
                            uploadedGenes4bg: ''
                     });
                }
                genes4bg = this.processGeneList(genes4bg);
                	
		window.localStorage.setItem("genes4bg", genes4bg);

		let aspect = '';
		if (document.getElementById('C').checked) {
		   	aspect = 'C';		
		}      
		else if (document.getElementById('P').checked) {
                        aspect = 'P';
                }
		else {
			aspect = 'F';
		}

		// window.localStorage.clear();
                window.localStorage.setItem("aspect", aspect);

	},

        onChange(e) {
                this.setState({ text: e.target.value});
        },

	runGoTools() {

		let paramData = {};

		paramData['genes'] = window.localStorage.getItem("genes");

		if (window.localStorage.getItem("genes4bg") != '') {
		     paramData['genes4bg'] = window.localStorage.getItem("genes4bg");
		}
		paramData['aspect'] = window.localStorage.getItem("aspect");
		
		let param = this.state.param;
		
		paramData['pvalue'] = param['pvalue'];

		if (param['FDR']) {
		     paramData['FDR'] = 1;
		}

		let evidence = ""; 
		let selected = 0;
		for (let i = 0; evidenceCode.length; i++) {
		     if (typeof(evidenceCode[i]) == "undefined") {
		         break;
		     }
		     let code = param[evidenceCode[i]];
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

	getAmbiguousNames: function() {
                $.ajax({
                      url: GeneChkUrl,
                      dataType: 'json',
                      success: function(data) {
                            this.setState({ambiguousNames: data});
                      }.bind(this),
                      error: function(xhr, status, err) {
                            console.error(GeneChkUrl, status, err.toString());
                      }.bind(this)
                });
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
		return "<p><h3>The GO Term Finder (<a href='http://search.cpan.org/dist/GO-TermFinder/' target='infowin'>Version 0.86</a>) searches for significant shared GO terms, or parents of those GO terms, used to describe the genes in your list to help you discover what the genes may have in common. To map annotations of a group of genes to more general terms and/or to bin them in broad categories, use the <a href='https://www.yeastgenome.org/cgi-bin/GO/goSlimMapper.pl' target='infowin'>GO Slim Mapper</a>.</h3><h3 id='defaultsetting'>For this form, Steps 1 and 2 are required, and Steps 3 and 4 are optional. If using only Steps 1 and 2, the search will be done using these default settings: 1. All genes/features with GO annotations in the database, 2. All annotations in the database (manually curated, high-throughput, and computational), and 3. All hits with p-value < 0.01 will be displayed on results page..</h3></p>";
	
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

