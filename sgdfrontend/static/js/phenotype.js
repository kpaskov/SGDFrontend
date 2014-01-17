
$(document).ready(function() {
	//Get evidence data
	$.getJSON(phenotype_details_link, function(data) {
	  	if(data.length > 0) {
	  	    var phenotype_table = create_phenotype_table(data);
	  	    create_analyze_button("evidence_table_analyze", phenotype_table, analyze_link, analyze_filename, true);
  	        create_download_button("evidence_table_download", phenotype_table, download_table_link, download_filename);
	  	}
	  	else {
	  		$("#evidence_message").show();
	  		$("#evidence_wrapper").hide();
	  		$("#evidence_header").html(0);
	  		$("#gene_header_id").html(0);
	  	}
	});

	//Hack because footer overlaps - need to fix this.
	add_footer_space("phenotype");

});

function create_phenotype_table(data) {
	var datatable = [];
	var genes = {};
	for (var i=0; i < data.length; i++) {
        datatable.push(phenotype_data_to_table(data[i], i));
		genes[data[i]['bioentity']['id']] = true;
	}

  	$("#evidence_header").html(data.length);
  	$("#gene_header_id").html(Object.keys(genes).length);

  	var options = {};
	options["bPaginate"] = true;
	options["aaSorting"] = [[3, "asc"]];
    options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, null, null, null, {'sWidth': '250px'}, null];
	options["aaData"] = datatable;

    return create_table("evidence_table", options);
}