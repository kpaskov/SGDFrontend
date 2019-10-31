google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);
function drawChart() {

    let phenotype_overview = null;
    if(!(typeof observable === 'undefined')) {
        phenotype_overview = observable['overview'];
    }
    else if(!(typeof phenotype === 'undefined')) {
        phenotype_overview = phenotype['overview'];
    }
    else if(!(typeof locus === 'undefined')) {
        phenotype_overview = locus['phenotype_overview'];
    }

    if(phenotype_overview['experiment_categories'].length > 1) {
        let label = 'Annotations';
        let data = google.visualization.arrayToDataTable(phenotype_overview['experiment_categories']);
        let options = {
            'legend': {'position': 'top', title: 'Experiment Type'},
            'title': label + ' by mutant type and experiment type',
            'vAxis': {title: 'Mutant Type'},
            'hAxis': {title: 'Number of ' + label, minValue:0, maxValue:5, gridlines:{count:6}},
            'chartArea': {left:110,top:50,width:"60%",height:"60%"},
            'dataOpacity':.75,
            'colors': ["#7FBF7B", "#AF8DC3", "#1F78B4"],
            'backgroundColor': 'transparent',
            'height':300
        };

        let chart = new google.visualization.BarChart(document.getElementById('mutant_experiment_chart'));

        // The select handler. Call the chart's getSelection() method
        function barSelectHandler() {
            let selectedItem = chart.getSelection()[0];
            if (selectedItem) {
                $('#phenotype_table_filter > label > input:first').removeClass('flash');
                let mutant_type = phenotype_overview['experiment_categories'][selectedItem.row+1][0];
                let experiment_type = phenotype_overview['experiment_categories'][0][selectedItem.column];
                let phenotype_table = $($.fn.dataTable.fnTables(true)).dataTable();
                phenotype_table.fnFilter( mutant_type + ' ' + experiment_type );
                try {
                    $('#navbar_annotations > a:first').click();
                }
                catch(err) {

                }
                $('#phenotype_table_filter > label > input:first').addClass('flash');
            }
        }

        // Listen for the 'select' event, and call my function selectHandler() when
        // the user selects something on the chart.
        google.visualization.events.addListener(chart, 'select', barSelectHandler);

        chart.draw(data, options);
    }

    if(phenotype_overview['strains'].length > 1) {
	let label = 'Annotations';
        let strain_data = google.visualization.arrayToDataTable(phenotype_overview['strains']);
        let strain_options = {
            'legend': {'position': 'none'},
            'title': label + ' in different strain backgrounds',
            'vAxis': {title: 'Number of ' + label, minValue:0, maxValue:5, gridlines:{count:6}},
            'hAxis': {title: 'Strain'},
            'dataOpacity':.75,
            'colors': ["#1F78B4"],
            'chartArea': {left:50,top:50,width:"80%",height:"50%"},
            'backgroundColor': 'transparent',
            'height':300
        };
        let strain_chart = new google.visualization.ColumnChart(document.getElementById('strain_chart'));

        // The select handler. Call the chart's getSelection() method
        function selectHandler() {
            let selectedItem = strain_chart.getSelection()[0];
            if (selectedItem) {
                $('#phenotype_table_filter > label > input:first').removeClass('flash');
                //let value = strain_data.getValue(selectedItem.row, selectedItem.column);
                let strain = phenotype_overview['strains'][selectedItem.row+1][0];
                let phenotype_table = $($.fn.dataTable.fnTables(true)).dataTable();
                phenotype_table.fnFilter( strain );
                try {
                    $('#navbar_annotations > a:first').click();
                }
                catch(err) {

                }
                $('#phenotype_table_filter > label > input:first').addClass('flash');
            }
        }

        // Listen for the 'select' event, and call my function selectHandler() when
        // the user selects something on the chart.
        google.visualization.events.addListener(strain_chart, 'select', selectHandler);

        strain_chart.draw(strain_data, strain_options);
    }

    if(phenotype_overview['experiment_categories'].length == 1 && phenotype_overview['strains'].length == 1) {
        $("#summary_wrapper").hide()
    }
}
