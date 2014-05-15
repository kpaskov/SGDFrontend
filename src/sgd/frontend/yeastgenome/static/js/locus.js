
$(document).ready(function() {
  	$.getJSON(locus_graph_link, function(data) {
  		if(data['nodes'].length > 1) {
  			var graph = create_cytoscape_vis("cy", layout, graph_style, data);
            var slider = create_slider("slider", graph, data['min_cutoff'], data['max_cutoff'], function (new_cutoff) {return "node[gene_count >= " + new_cutoff + "], edge";}, 10);
            create_discrete_filter("union_radio", graph, slider, function(){return "node, edge";}, data["max_cutoff"]);
            create_discrete_filter("go_radio", graph, slider, function(){return "node, edge[type = 'GO']";}, data["max_cutoff"]);
            create_discrete_filter("phenotype_radio", graph, slider, function(){return "node, edge[type = 'PHENOTYPE']";}, data["max_cutoff"]);
            create_discrete_filter("domain_radio", graph, slider, function(){return "node, edge[type = 'DOMAIN']";}, data["max_cutoff"]);
            create_discrete_filter("genetic_radio", graph, slider, function(){return "node, edge[type = 'GENINTERACTION']";}, data["max_cutoff"]);
            create_discrete_filter("physical_radio", graph, slider, function(){return "node, edge[type = 'PHYSINTERACTION']";}, data["max_cutoff"]);
  		}
		else {
			hide_section("network");
		}
	});

	//Hack because footer overlaps - need to fix this.
    add_footer_space("resources");
});

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
    .selector("edge[type='GO']")
	.css({
		'line-color': "#4daf4a"
	})
    .selector("edge[type='PHENOTYPE']")
	.css({
		'line-color': "#984ea3"
    })
    .selector("edge[type='DOMAIN']")
	.css({
        'line-color': "#377eb8"
    })
    .selector("edge[type='PHYSINTERACTION']")
	.css({
        'line-color': "#ff7f00"
    })
    .selector("edge[type='GENINTERACTION']")
	.css({
        'line-color': "#fb9a99"
    })
    .selector("edge[type='REGULATION']")
	.css({
        'line-color': "#a65628"
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
