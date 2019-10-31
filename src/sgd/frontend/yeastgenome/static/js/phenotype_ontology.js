
$(document).ready(function() {

  	$.getJSON('/backend/observable/' + ontology['id'] + '/ontology_graph', function(data) {
  		let cy = create_cytoscape_vis("cy", layout, graph_style, data, null, false, "phenotypeOntology");
        create_cy_download_button(cy, "cy_download", ontology['display_name'] + '_ontology')

        $("#ontology").show();
		set_up_full_ontology("full_ontology", data['full_ontology']);
		$('#full_ontology i.fa').click(function(e) {
			if ($(this).parent().has('ul')) {
				$(this).parent().children('ul').toggle();
			}
			$(this).toggleClass('fa-minus-circle fa-plus-circle');

			e.stopPropagation();
		});

        $("a:contains('resistance to chemicals')").prev().click();
        $("a:contains('chemical compound accumulation')").prev().click();
        $("a:contains('chemical compound excretion')").prev().click();
	});
});

function set_up_full_ontology(ontology_list_id, data) {
	let list = document.getElementById(ontology_list_id);
	for (let i=0; i < data['elements'].length; i++) {
		let li = document.createElement('li');

        let link_a = document.createElement('a');
        link_a.innerHTML = data['elements'][i]['display_name'];
        link_a.href = data['elements'][i]['link'];

        li.appendChild(link_a);

		li.id = data['elements'][i]['id'];
		list.appendChild(li);
	}
	for (let i=0; i < data['elements'].length; i++) {
	    let child_id = data['elements'][i]['id'];
	    if(child_id in data['child_to_parent']) {
            let parent_id = data['child_to_parent'][child_id];

            let parent = document.getElementById(parent_id);
            let ul = null;
            if(parent.children.length <= 2) {
                ul = document.createElement('ul');
                ul.id = 'expand' + parent_id;

				let minus = document.createElement('i');
				minus.className = minus.className + ' fa fa-minus-circle';
                parent.insertBefore(minus, parent.firstChild);

                parent.appendChild(ul);
            }
            else {
                ul = parent.children[2];
            }
            let child = document.getElementById(child_id);
            list.removeChild(child);

            ul.appendChild(child);
        }
    }
}

let graph_style = cytoscape.stylesheet()
	.selector('node')
	.css({
		'content': 'data(name)',
		'font-family': 'helvetica',
		'font-size': 14,
		'text-outline-width': 3,
		'text-valign': 'center',
		'width': 30,
		'height': 30,
		'border-color': '#fff',
		'background-color': "grey",
		'text-outline-color': '#fff',
		'color': '#888'
	})
	.selector('edge')
	.css({
		'width': 2,
		'source-arrow-shape': 'triangle'
	})
	.selector("node[sub_type='FOCUS']")
	.css({
		'width': 30,
		'height': 30,
		'background-color': "#fade71",
		'text-outline-color': '#fff',
		'color': '#888'
	})
	.selector("node[sub_type='morphology']")
	.css(
		{'background-color': "#7FBF7B"
	})
	.selector("node[sub_type='fitness']")
	.css(
		{'background-color': "#AF8DC3"
	})
	.selector("node[sub_type='essentiality']")
	.css(
		{'background-color': "#1F78B4"
	})
	.selector("node[sub_type='interaction with host/environment']")
	.css(
		{'background-color': "#FB9A99"
	})
	.selector("node[sub_type='metabolism and growth']")
	.css(
		{'background-color': "#E31A1C"
	})
	.selector("node[sub_type='cellular processes']")
	.css(
		{'background-color': "#FF7F00"
	})
	.selector("node[sub_type='development']")
	.css(
		{'background-color': "#BF5B17"
});

let layout = {
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
	},
    "maxSimulationTime": 5000
};
