
$(document).ready(function() {

	$.getJSON('/backend/complex/' + complex['complex_accession'], function(data) {

	  	var complex_table = create_complex_table(data);

		if(data != null && data["graph"]["nodes"].length > 1) {

		    var graph = create_cytoscape_vis("cy", layout, graph_style, data["graph"], null, true, "complex_diagram");
		    create_cy_download_button(graph, "cy_download", complex['complex_accession'] + '_subunit_graph')

		}
		else {                                                                                                   
                    hide_section("diagram");                                                                              
                } 
		
		if (data != null && data["network_graph"]["nodes"].length > 1) {
		    
		    var graph2 = create_cytoscape_vis("cy2", layout, graph_style, data["network_graph"], null, true, "complex_network");
		    create_cy_download_button(graph2, "cy2_download", complex['complex_accession'] + '_complex_network_graph')
		    
		    if (true) {	
			create_discrete_filter_bar("union_radio", graph, all_filter);
			create_discrete_filter_bar("subunit_radio", graph, subunit_filter);
			create_discrete_filter_bar("go_radio", graph, go_filter);
			$("#discrete_filter").show();
		    }
		    else {
			$("#discrete_filter").hide();
		    }
		}
		else {
		    hide_section("network");
		}
	});

});

function create_complex_table(data) {
    var evidence = data['subunit'];
    var datatable = [];
    var subunits = {};
    for (var i = 0; i < evidence.length; i++) {
	datatable.push(complex_subunit_data_to_table(evidence[i]));
	subunits[evidence[i]["display_name"]] = true;
    }

    set_up_header(
		  "complex_table",
		  datatable.length,
		  "entry",
		  "entries",
		  Object.keys(subunits).length,
		  "subunit",
		  "subunits"
		  );

    var options = {};
    options["bPaginate"] = false;
    options["bDestroy"] = true;
    options["aoColumns"] = [
			  null,
			  null,
			  null
			  ];
  options["aaData"] = datatable;
  options["oLanguage"] = {
      sEmptyTable: "No subunits for this complex???."
  };

  return create_table("complex_table", options);

}

function create_discrete_filter_bar(radio_id, graph, target_filter) {
    var radio = $("#" + radio_id);
    radio.click(function() {
	    graph.filters['discrete'] = target_filter();
	    graph.applyFilters();
	});
}

function all_filter() {
    return "node, edge";
}

function subunit_filter() {
    return "node, edge[class_type = 'complex_gene']";
}

function go_filter() {
    return "node, edge[class_type = 'complex_go']";
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
    .selector("node[type='smallmolecule']")
    .css({
	    'background-color': "#0D85F3",
	})
    .selector("node[type='subcomplex']")
    .css({
	    'background-color': "#F3750D",
        })
    .selector("node[type='othersubunit']")
    .css({
	    'background-color': "#35F30D",
        })

    .selector("node[type='Gene']")
    .css({
	    'background-color': "#FF8933",
        })
    .selector("node[type='Go']")
    .css({
	    'background-color': "#A133FF",
        })
    .selector("node[type='Complex']")
    .css({
            'background-color': "#86908C",
        })
    .selector("node[type='Current_complex']")
    .css({
	    'background-color': "#0E9F36",
        })
    .selector('edge')
    .css({
	    'width': 2,
	    'line-color': '#848484',
	    
        })
    .selector("node[sub_type='FOCUS']")
    .css({
	    'background-color': "#0E9F36",
	    'text-outline-color': '#fff',
	    'color': '#888'
        })
    .selector("edge[class_type = 'complex_go']")
    .css({
            'line-color': "#7233FF"
        })
    .selector("edge[class_type = 'complex_gene']")
    .css({
            'line-color': "#FF8933"
        })
    .selector("edge[class_type = 'complex']")
    .css({
	    'line-color': "#74FF33" 
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
