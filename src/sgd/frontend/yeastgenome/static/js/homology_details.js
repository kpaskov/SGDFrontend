$(document).ready(function() {

	$.getJSON('/backend/locus/' + locus['sgdid']  + '/complement_details', function(data) {
	    var complement_table = create_complement_table(data);
  	    create_download_button("complement_table_download", complement_table, locus['display_name'] + "_complement_annotations");

	});
    
});

function create_complement_table(data) {
  	var datatable = [];
	var complements = {};
	for (var i=0; i < data.length; i++) {
        datatable.push(complement_data_to_table(data[i], i));
		complements[data[i]["complement"]["id"]] = true;
	}

    set_up_header('complement_table', datatable.length, 'entry', 'entries', Object.keys(complements).length, 'complement', 'complements');

	var options = {};
	options["bPaginate"] = true;
	options["aaSorting"] = [[4, "asc"]];
    options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false},nnull, null, null, null, null, {"sWidth": "250px"}, null, null];
    options["oLanguage"] = {"sEmptyTable": "No complement data for " + locus['display_name']};
	options["aaData"] = datatable;

    return create_table("complement_table", options);
}


