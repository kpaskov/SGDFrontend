
$(document).ready(function() {

    if(reference['expression_datasets'].length > 0) {
        $("#expression_table_analyze").hide();
        var expression_table = create_expression_table(reference['expression_datasets']);
        create_download_button("expression_table_download", expression_table, reference['display_name'] + '_datasets');
    }
    else {
        hide_section('expression');
    }

    $.getJSON('/backend/reference/' + reference['sgdid'] + '/literature_details', function(data) {
        data.sort(function(a, b) {return a['locus']['display_name'] > b['locus']['display_name']});

        create_literature_list('primary', data, 'Primary Literature')
        create_literature_list('additional', data, 'Additional Literature')
        create_literature_list('review', data, 'Reviews')
    });

    var download_link = '/download_citations';
    $("#download_citation").click(function() {post_to_url(download_link, {"display_name":reference['display_name'].replace(' ', '_') + '_citation.nbib', "reference_ids": [reference['id']]});})

    if(reference['counts']['interaction'] > 0) {
        $.getJSON('/backend/reference/' + reference['sgdid'] + '/interaction_details', function(data) {
            var interaction_table = create_interaction_table(data);
            create_download_button("interaction_table_download", interaction_table, reference['display_name'] + "_interactions");
            create_analyze_button("interaction_table_analyze", interaction_table, reference['display_name'] + " interaction genes", true);
        });
    }
    else {
        hide_section("interaction");
    }

    if(reference['counts']['go'] > 0) {
        $.getJSON('/backend/reference/' + reference['sgdid'] + '/go_details', function(data) {
            var go_table = create_go_table(data);
            create_download_button("go_table_download", go_table, reference['display_name'] + "_go_terms");
            create_analyze_button("go_table_analyze", go_table, reference['display_name'] + " Gene Ontology terms", true);
        });
    }
    else {
        hide_section("go");
    }

    if(reference['counts']['phenotype'] > 0) {
        $.getJSON('/backend/reference/' + reference['sgdid'] + '/phenotype_details', function(data) {
            var phenotype_table = create_phenotype_table(data);
            create_download_button("phenotype_table_download", phenotype_table, reference['display_name'] + "_phenotypes");
            create_analyze_button("phenotype_table_analyze", phenotype_table, reference['display_name'] + " phenotype genes", true);
        });
    }
    else {
        hide_section("phenotype");
    }

    if(reference['counts']['disease'] > 0) {
        $.getJSON('/backend/reference/' + reference['sgdid'] + '/disease_details', function(data) {
            var disease_table = create_disease_table(data);
            create_download_button("disease_table_download", disease_table, reference['display_name'] + "_diseases");
            create_analyze_button("disease_table_analyze", disease_table, reference['display_name'] + " disease genes", true);
        });
    }
    else {
        hide_section("disease");
    }

    if(reference['counts']["regulation"] > 0) {
        $.getJSON('/backend/reference/' + reference['sgdid'] + '/regulation_details', function(data) {
            var regulation_table = create_regulation_table(data);
            create_download_button("regulation_table_download", regulation_table, reference['display_name'] + "_regulation");
            create_analyze_button("regulation_table_analyze", regulation_table, reference['display_name'] + " regulation genes", true);
        });
    }
    else {
        hide_section("regulation");
    }
});

function create_literature_list(list_id, data, topic) {
    var primary_list = $("#" + list_id + "_list");
    var see_more_list = document.createElement('span');
    see_more_list.id = list_id + '_see_more'

    var topic_data = [];
    for(var i=0; i < data.length; i++) {
        if(data[i]['topic'] == topic) {
            topic_data.push(data[i]);
        }
    }
    var count = 0;
    for(var i=0; i < topic_data.length; i++) {
        count = count + 1;
        var a = document.createElement('a');
        a.href = topic_data[i]['locus']['link'];
        a.innerHTML = topic_data[i]['locus']['display_name'];
        if(i > 10) {
            see_more_list.appendChild(a);
        }
        else {
            primary_list.append(a);
        }
        if(i != topic_data.length-1) {
            var comma = document.createElement('span');
            comma.innerHTML = ', ';
            if(i > 10) {
                see_more_list.appendChild(comma);
            }
            else {
                primary_list.append(comma);
            }
        }
        else if(topic_data.length > 10) {
            var see_less = document.createElement('a');
            see_less.innerHTML = ' <i class="fa fa-arrow-circle-left"></i> Show fewer';
            see_less.id = list_id + '_see_less_button';
            see_less.onclick = function() {
                $('#' + list_id + '_see_more').hide();
                $('#' + list_id + '_see_more_button').show();
            };
            see_more_list.appendChild(see_less);
        }
        if(i==10) {
            var see_more = document.createElement('a');
            see_more.innerHTML = ' ... <i class="fa fa-arrow-circle-right"></i> Show all';
            see_more.id = list_id + '_see_more_button';
            see_more.onclick = function() {
                $('#' + list_id + '_see_more').show();
                $('#' + list_id + '_see_more_button').hide();
            };

            primary_list.append(see_more);
            primary_list.append(see_more_list);
        }
        $('#' + list_id + '_see_more').hide();
    }

    if(count > 0) {
        primary_list.show();
    }
    else {
        $("#" + list_id + "_list_header").hide()

    }
}

function create_interaction_table(data) {
    if("Error" in data) {
        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[3, "asc"]];
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bSortable":false}, null, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, null, null, null, null, null, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}]
        options["oLanguage"] = {"sEmptyTable": data["Error"]};
        options["aaData"] = [];
    }
    else {
        var datatable = [];
        var genes = {};
        for (var i=0; i < data.length; i++) {
            datatable.push(interaction_data_to_table(data[i], i));
            genes[data[i]["locus1"]["id"]] = true;
            genes[data[i]["locus2"]["id"]] = true;
        }

        set_up_header('interaction_table', datatable.length, 'entry', 'entries', Object.keys(genes).length, 'gene', 'genes');

        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[3, "asc"]];
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bSortable":false}, null, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, null, null, null, null, null, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}]
        options["oLanguage"] = {"sEmptyTable": "No interaction data for " + reference['display_name']};
        options["aaData"] = datatable;
    }

    return create_table("interaction_table", options);
}

function create_go_table(data) {
    var options = {};
    options["bPaginate"] = true;
    options["aaSorting"] = [[3, "asc"]];
    options["bDestroy"] = true;
    options["aoColumns"] = [
            {"bSearchable":false, "bVisible":false}, //evidence_id
            {"bSearchable":false, "bVisible":false}, //analyze_id
            null, //gene
            {"bSearchable":false, "bVisible":false}, //gene systematic name
            null, //gene ontology term
            {"bSearchable":false, "bVisible":false}, //gene ontology term id
            null, //qualifier
            {"bSearchable":false, "bVisible":false}, //aspect
            null, //method
            null, //evidence
            null, //source
            null, //assigned on
            null, //annotation_extension
            {"bSearchable":false, "bVisible":false} // reference
            ];

    if("Error" in data) {
        options["oLanguage"] = {"sEmptyTable": data["Error"]};
        options["aaData"] = [];
    }
    else {
        var datatable = [];
        var genes = {};
        for (var i=0; i < data.length; i++) {
            datatable.push(go_data_to_table(data[i], i));
            genes[data[i]["locus"]["id"]] = true;
        }

        set_up_header('go_table', datatable.length, 'entry', 'entries', Object.keys(genes).length, 'gene', 'genes');

        options["oLanguage"] = {"sEmptyTable": "No gene ontology data for " + reference['display_name']};
        options["aaData"] = datatable;
    }

    return create_table("go_table", options);
}

function create_phenotype_table(data) {
    if("Error" in data) {
        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[4, "asc"]];
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, {"bSearchable":false, "bVisible":false}, null, null, null, {'sWidth': '250px'}, {"bSearchable":false, "bVisible":false}];
        options["oLanguage"] = {"sEmptyTable": data["Error"]};
        options["aaData"] = [];
    }
    else {
        var datatable = [];
        var genes = {};
        for (var i=0; i < data.length; i++) {
            datatable.push(phenotype_data_to_table(data[i], i));
            genes[data[i]['locus']['id']] = true;
        }

        set_up_header('phenotype_table', datatable.length, 'entry', 'entries', Object.keys(genes).length, 'gene', 'genes');

        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[4, "asc"]];
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, {"bSearchable":false, "bVisible":false}, null, null, null, {'sWidth': '250px'}, {"bSearchable":false, "bVisible":false}];
        options["oLanguage"] = {"sEmptyTable": "No phenotype data for " + reference['display_name']};
        options["aaData"] = datatable;
    }

    return create_table("phenotype_table", options);
}

function create_disease_table(data) {
    if("Error" in data) {
        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[5, "asc"]];
        options["aoColumns"] = [ {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, {"bSearchable":false, "bVisible":false}, null, null, {"bSearchable":false, "bVisible":false}, null];
        //options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, {"bSearchable":false, "bVisible":false}, null, null, null, {'sWidth': '250px'}, {"bSearchable":false, "bVisible":false}];
        options["oLanguage"] = {"sEmptyTable": data["Error"]};
        options["aaData"] = [];
    }
    else {
        var datatable = [];
        var genes = {};
        for (var i=0; i < data.length; i++) {
            datatable.push(disease_data_to_table(data[i], i));
            genes[data[i]['locus']['id']] = true;
        }

        set_up_header('disease_table', datatable.length, 'entry', 'entries', Object.keys(genes).length, 'gene', 'genes');

        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[5, "asc"]];
        options["aoColumns"] = [ {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, {"bSearchable":false, "bVisible":false}, null, null, {"bSearchable":false, "bVisible":false}, null];
        //options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, {"bSearchable":false, "bVisible":false}, null, null, null, {'sWidth': '250px'}, {"bSearchable":false, "bVisible":false}];
        options["oLanguage"] = {"sEmptyTable": "No disease data for " + reference['display_name']};
        options["aaData"] = datatable;
    }

    return create_table("disease_table", options);
}

function create_regulation_table(data) {
    if("Error" in data) {
        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[4, "asc"]];
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, null, null, null, null, {"bSearchable":false, "bVisible":false}]
        options["oLanguage"] = {"sEmptyTable": data["Error"]};
        options["aaData"] = [];
    }
    else {
        var not = {"bSearchable":false, "bVisible":false};
        var tableOptions = [not, not, null, not, null, not, not, not, not, not, null, null, null, null, null, not, not];
        var datatable = [];
        var genes = {};
        for (var i=0; i < data.length; i++) {
            datatable.push(regulation_data_to_table(data[i], null));
            genes[data[i]["locus1"]["id"]] = true;
            genes[data[i]["locus2"]["id"]] = true;
        }

        set_up_header('regulation_table', datatable.length, 'entry', 'entries', Object.keys(genes).length, 'gene', 'genes');

        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[3, "asc"]];
        options["aoColumns"] = tableOptions;
        options["oLanguage"] = {"sEmptyTable": "No regulation data for " + reference['display_name']};
        options["aaData"] = datatable;
    }

	return create_table("regulation_table", options);
}

function create_expression_table(data) {
    var options = {
        'bPaginate': true,
        'aaSorting': [[3, "asc"]],
        'aoColumns': [
            {"bSearchable":false, "bVisible":false}, //Evidence ID
            {"bSearchable":false, "bVisible":false}, //Analyze ID,
            {"bVisible":false}, //Histogram
            null, //Dataset
            null, //Description
            null, //Tags
            null, //Number of Conditions
            {"bSearchable":false, "bVisible":false} //Reference
            ]
    }
    if("Error" in data) {
        options["oLanguage"] = {"sEmptyTable": data["Error"]};
        options["aaData"] = [];
    }
    else {
        var datatable = [];
        var reference_ids = {};
        for (var i=0; i < data.length; i++) {
            datatable.push(dataset_datat_to_table(data[i], i));
            if(data[i]['reference'] != null) {
                reference_ids[data[i]['reference']['id']] = true;
            }
        }

        set_up_header('expression_table', datatable.length, 'dataset', 'datasets', Object.keys(reference_ids).length, 'reference', 'references');

        options["oLanguage"] = {"sEmptyTable": "No expression data for " + reference['display_name']};
        options["aaData"] = datatable;
    }

    return create_table("expression_table", options);
}