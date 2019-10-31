
$(document).ready(function() {

    $.getJSON('/backend/complex/' + complex['complex_accession'], function(data) {

	document.getElementById("summary_paragraph").innerHTML = data['description'] + "<p></p>" + data['properties']

        let complex_table = create_complex_table(data);

        if(data != null && data["graph"]["nodes"].length > 1) {
            let _categoryColors = {
                'protein': '#1f77b4',
                'small molecule': '#1A9E77',
                'subcomplex': '#E6AB03',
                'small molecule': '#7d0df3', //potential bug
                'other subunit': '#d62728'
            };
            views.network.render(data["graph"], _categoryColors, "j-complex");
        } else {                                                                                                   
            hide_section("diagram");                                                                              
        } 
        
        if (data != null && data["network_graph"]["nodes"].length > 1) {
            let _categoryColors = {
                'FOCUS': 'black',
                'GO': '#2ca02c',
                'subunit': '#1f77b4',
                'complex': '#E6AB03'
            };
            let filters = {
                ' All': function(d) { return true; },
                ' GO Terms': function(d) {
                    let acceptedCats = ['FOCUS', 'GO', 'complex'];
                    return acceptedCats.includes(d.category);
                },
                ' Subunits': function(d) {
                    let acceptedCats = ['FOCUS', 'subunit', 'complex'];
                    return acceptedCats.includes(d.category);
                },
            }
            views.network.render(data["network_graph"], _categoryColors, "j-complex-network", filters, true);            
        } else {
            hide_section("network");
        }
    });

});

function create_complex_table(data) {
    let evidence = data['subunit'];
    let datatable = [];
    let subunits = {};
    for (let i = 0; i < evidence.length; i++) {
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

    let options = {};
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
