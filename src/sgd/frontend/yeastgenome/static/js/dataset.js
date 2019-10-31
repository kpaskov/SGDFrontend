$(document).ready(function() {
    if(dataset['geo_id'] != null) {
        $.getJSON('/backend/dataset/' + dataset['geo_id'], function(data) {
            let dataset_table = create_dataset_conditions_table(data);
            $("#dataset_conditions_table_analyze").hide();
            $("#dataset_conditions_table_download").hide();
        });
    }
    else {
        let dataset_table = create_dataset_conditions_table(dataset);
        $("#dataset_conditions_table_analyze").hide();
        $("#dataset_conditions_table_download").hide();
    }
});

function create_dataset_conditions_table(data) {
    if("Error" in data) {
        let options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[4, "asc"]];
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, null, {"bVisible":false}, null, null, null, {'sWidth': '250px'}, null];
        options["oLanguage"] = {"sEmptyTable": data["Error"]};
        options["aaData"] = [];
    }
    else {
        let datatable = [];
        let data_sets = {}
        for (let i=0; i < data.datasetcolumns.length; i++) {
            datatable.push(dataset_data_to_table(data.datasetcolumns[i]));
            data_sets[data.datasetcolumns[i]['geo_id']] = true;
        }

        set_up_header('dataset_conditions_table', datatable.length, 'entry', 'entries', Object.keys(data_sets).length, 'dataset', 'datasets');

        let options = {};
        options["bPaginate"] = true;
        if(dataset['geo_id'] != null)
            options["oLanguage"] = {"sEmptyTable": "No data for " + data['geo_id']};
        else
            options["oLanguage"] = {"sEmptyTable": "No data for " + data['link'].split("/")[data['link'].split("/").length-1]};
        options["aaData"] = datatable;
        options["scrollX"] = true;
    }

    return create_table("dataset_conditions_table", options);
}
