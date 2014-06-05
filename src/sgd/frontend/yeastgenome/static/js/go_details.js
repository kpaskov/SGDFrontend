$(document).ready(function() {

  	$.getJSON(go_details_link, function(data) {
  	    var mc_bp_go_table = create_go_table("mc_bp", "No manually curated biological process terms for " + display_name, function(x) {return x["annotation_type"] == "manually curated" && x["go"]["go_aspect"] == "biological process"}, data);
        create_download_button("mc_bp_go_table_download", mc_bp_go_table, download_table_link, mc_bp_download_table_filename);

        var mc_mf_go_table = create_go_table("mc_mf", "No manually curated molecular function terms for " + display_name, function(x) {return x["annotation_type"] == "manually curated" && x["go"]["go_aspect"] == "molecular function"}, data);
        create_download_button("mc_mf_go_table_download", mc_mf_go_table, download_table_link, mc_mf_download_table_filename);

        var mc_cc_go_table = create_go_table("mc_cc", "No manually curated cellular component terms for " + display_name, function(x) {return x["annotation_type"] == "manually curated" && x["go"]["go_aspect"] == "cellular component"}, data);
        create_download_button("mc_cc_go_table_download", mc_cc_go_table, download_table_link, mc_cc_download_table_filename);

        var htp_bp_go_table = create_go_table("htp_bp", "No high-throughput biological process terms for " + display_name, function(x) {return x["annotation_type"] == "high-throughput" && x["go"]["go_aspect"] == "biological process"}, data);
        create_download_button("htp_bp_go_table_download", htp_bp_go_table, download_table_link, htp_bp_download_table_filename);

        var htp_mf_go_table = create_go_table("htp_mf", "No high-throughput molecular function terms for " + display_name, function(x) {return x["annotation_type"] == "high-throughput" && x["go"]["go_aspect"] == "molecular function"}, data);
        create_download_button("htp_mf_go_table_download", htp_mf_go_table, download_table_link, htp_mf_download_table_filename);

        var htp_cc_go_table = create_go_table("htp_cc", "No high-throughput cellular component terms for " + display_name, function(x) {return x["annotation_type"] == "high-throughput" && x["go"]["go_aspect"] == "cellular component"}, data);
        create_download_button("htp_cc_go_table_download", htp_cc_go_table, download_table_link, htp_cc_download_table_filename);

        var comp_bp_go_table = create_go_table("comp_bp", "No computational biological process terms for " + display_name, function(x) {return x["annotation_type"] == "computational" && x["go"]["go_aspect"] == "biological process"}, data);
        create_download_button("comp_bp_go_table_download", comp_bp_go_table, download_table_link, comp_bp_download_table_filename);

        var comp_mf_go_table = create_go_table("comp_mf", "No computational molecular function terms for " + display_name, function(x) {return x["annotation_type"] == "computational" && x["go"]["go_aspect"] == "molecular function"}, data);
        create_download_button("comp_mf_go_table_download", comp_mf_go_table, download_table_link, comp_mf_download_table_filename);

        var comp_cc_go_table = create_go_table("comp_cc", "No computational cellular component terms for " + display_name, function(x) {return x["annotation_type"] == "computational" && x["go"]["go_aspect"] == "cellular component"}, data);
        create_download_button("comp_cc_go_table_download", comp_cc_go_table, download_table_link, comp_cc_download_table_filename);

        var transformed_data = [];
        for (var i=0; i < data.length; i++) {
            transformed_data.push(go_data_to_table(data[i], i));
        }
        var headers = ["Evidence ID", "Analyze ID", "", "Gene", "Gene Format Name", "Gene Ontology Term", "Gene Ontology Term ID", "Qualifier", "Aspect", "Method", "Evidence", "Source", "Assigned On", "Reference", "Relationships"];
        create_download_button_no_table("go_download_all", headers, transformed_data, download_table_link, display_name + "_go_annotations")
  	});

  	$.getJSON(go_graph_link, function(data) {
        if(data['nodes'].length > 1) {
            var graph = create_cytoscape_vis("cy", layout, graph_style, data);
            var slider = create_slider("slider", graph, data['min_cutoff'], data['max_cutoff'], slider_filter, data['max_cutoff']+1);
  		}
		else {
			hide_section("network");
		}
	});
});

function create_go_table(prefix, message, filter, data) {
    var options = {};
    options["aoColumns"] = [
            {"bSearchable":false, "bVisible":false}, //evidence_id
            {"bSearchable":false, "bVisible":false}, //analyze_id
            {"bSearchable":false, "bVisible":false}, //gene
            {"bSearchable":false, "bVisible":false}, //gene systematic name
            null, //gene ontology term
            {"bSearchable":false, "bVisible":false}, //gene ontology term id
            null, //qualifier
            {"bSearchable":false, "bVisible":false}, //aspect
            {"bSearchable":false, "bVisible":false}, //method
            null, //evidence
            null, //source
            null, //assigned on
            null, //annotation_extension
            null // reference
            ];
    options["bPaginate"] = true;
    options["aaSorting"] = [[5, "asc"]];

    if("Error" in data) {
        options["oLanguage"] = {"sEmptyTable": data["Error"]};
        options["aaData"] = [];
    }
    else {
        var datatable = [];
        var gos = {};
        for (var i=0; i < data.length; i++) {
            if(filter(data[i])) {
                datatable.push(go_data_to_table(data[i], i));
                gos[data[i]['go']['id']] = true;
            }
        }
        set_up_header(prefix + '_go_table', datatable.length, 'entry', 'entries', Object.keys(gos).length, 'Gene Ontology term', 'Gene Ontology terms');

        options["oLanguage"] = {"sEmptyTable": message};
        options["aaData"] = datatable;

        if(Object.keys(gos).length == 0) {
            $("#" + prefix + "_go").hide();
        }
    }

	$("#" + prefix + "_go_table_analyze").hide();

    return create_table(prefix + "_go_table", options);
}

function slider_filter(new_cutoff) {
    return "node[gene_count >= " + new_cutoff + "], edge";
}


var graph_style = cytoscape.stylesheet()
	.selector('node')
	.css({
		'content': 'data(name)',
		'font-family': 'helvetica',
		'font-size': 14,
		'text-outline-width': 3,
		'text-outline-color': '#888',
		'text-valign': 'center',
		'color': '#fff',
		'width': 30,
		'height': 30,
		'border-color': '#fff'
	})
	.selector('edge')
	.css({
		'width': 2
	})
	.selector("node[sub_type='FOCUS']")
	.css({
		'background-color': "#fade71",
		'text-outline-color': '#fff',
		'color': '#888'
	})
    .selector("node[type='GO']")
	.css({
		'shape': 'rectangle',
		'text-outline-color': '#fff',
		'color': '#888',
		'background-color': "#7FBF7B"
	});

var layout = {
	"name": "arbor",
	"liveUpdate": true,
	"ungrabifyWhileSimulating": true,
	"nodeMass":function(data) {
		if(data.sub_type == 'FOCUS') {
			return 10;
		}
		else {
			return 1;
		}
	}
};