
$(document).ready(function() {

	$.getJSON(chemical_details_link, function(data) {
	  	var phenotype_table = create_phenotype_table(data);
	  	create_analyze_button("phenotype_table_analyze", phenotype_table, analyze_link, analyze_filename, true);
  	    create_download_button("phenotype_table_download", phenotype_table, download_table_link, download_filename);
	});

});

function create_phenotype_table(data) {
  	var datatable = [];
	var phenotypes = {};
	for (var i=0; i < data.length; i++) {
        datatable.push(phenotype_data_to_table(data[i], i));
		phenotypes[data[i]["phenotype"]["id"]] = true;
	}

    set_up_header('phenotype_table', datatable.length, 'entry', 'entries', Object.keys(phenotypes).length, 'phenotype', 'phenotypes');

	var options = {};
	options["bPaginate"] = true;
	options["aaSorting"] = [[4, "asc"]];
    options["aoColumns"] = [
        {"bSearchable":false, "bVisible":false}, //Evidence ID
        {"bSearchable":false, "bVisible":false}, //Analyze ID
        null, //Gene
        {"bSearchable":false, "bVisible":false}, //Gene Systematic Name
        null, //Phenotype
        {"bVisible":false}, //Phenotype slim
        null, //Experiment Type
        {"bVisible":false}, //Experiment Type Category
        null, //Mutant Information
        null, //Strain Background
        null, //Chemical
        {"sWidth": "250px"}, //Details
        null //Reference
    ];
    options["oLanguage"] = {"sEmptyTable": "No phenotype data for " + display_name};
	options["aaData"] = datatable;

    return create_table("phenotype_table", options);
}