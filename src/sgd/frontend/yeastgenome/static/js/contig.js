draw_overview(contig['overview']);

$(document).ready(function() {

    $("#sequence_download").click(function f() {
        if('filename' in contig) {
            post_to_url('/download_sequence', {
                "filename": contig['filename'],
                "sequence": contig['residues'],
                'header': contig['header']});
        }
        else {
            post_to_url('/download_sequence', {
                "filename":contig['strain']['display_name'] + '_' + contig['display_name'] + '.fsa',
                "sequence": contig['residues'],
                'header': 'gb|' + contig['genbank_accession'] + '| Saccharomyces cerevisiae ' + contig['strain']['display_name'] + ', whole genome shotgun sequence [length=' + contig['residues'].length + ']'});
        }
    });

  	$.getJSON('/backend/contig/' + contig['id'] + '/sequence_details', function(data) {
        let feature_table = create_feature_table(data['genomic_dna']);
        create_download_button("chromosomal_coord_table_download", feature_table, contig['display_name'] + '_features');
        create_analyze_button("chromosomal_coord_table_analyze", feature_table, "<a href='" + contig['link'] + "' class='gene_name'>" + contig['display_name'] + "</a> genes", true);

        if (data['genomic_dna'].length > 1) {
            set_up_sequence("feature_div", data['genomic_dna']);        
        }
  	});

});

let colors = ["#2E2EFE", "#FA5858", "#088A08", "#F3F781", "#9F81F7"];
let color_index = 0;

function strand_to_direction(strand) {
    if(strand == '+') {
        return "5'";
    }
    else {
        return "3'";
    }
}

function make_ready_handler(chart_id, chart, min_tick, max_tick, display_name_to_format_name, data_array) {
    function ready_handler() {
        function tooltipHandler(e) {
                let datarow = data_array[e.row];
                let title_spans = $(".google-visualization-tooltip-item > span");
                if(title_spans[0].innerHTML in display_name_to_format_name) {
                    title_spans[0].innerHTML = title_spans[0].innerHTML + ' (' + display_name_to_format_name[title_spans[0].innerHTML] + ')';
                    let spans = $(".google-visualization-tooltip-action > span");
                    if(spans.length > 3) {
                        spans[1].innerHTML = ' ' + datarow[2] + '-' + datarow[3];
                        spans[2].innerHTML = 'Length:';
                        spans[3].innerHTML = ' ' + datarow[3] - datarow[2] + 1;
                    }
                }
                else {
                    $(".google-visualization-tooltip-item").parent().parent().hide();
                }
        }
        google.visualization.events.addListener(chart, 'onmouseover', tooltipHandler);

        //Fix timeline axis.
        let svg_gs = $("#" + chart_id + " > div > div > div > svg > g");

        let y_one = min_tick;
        if(y_one == 1) {
            y_one = 0;
        }
        let y_two = max_tick;

        let tickmark_holder = svg_gs[1];
        let tickmarks = tickmark_holder.childNodes;

        let m = Math.round((y_two - y_one)/tickmarks.length/10000)*10000;
        if(m == 0) {
            m = Math.round((y_two - y_one)/tickmarks.length/1000)*1000;
        }
        if(m == 0) {
            m = Math.round((y_two - y_one)/tickmarks.length/100)*100;
        }
        if(m == 0) {
            m = Math.round((y_two - y_one)/tickmarks.length/10)*10;
        }
        if(m == 0) {
            m = Math.round((y_two - y_one)/tickmarks.length);
        }

        for (let i=0; i < tickmarks.length; i++) {
            let tick = y_one + i*m;
            if(tick == 0) {
                tick = 1;
            }
            $(tickmarks[i]).html(tick);
        }
    }
    return ready_handler;
}

function set_up_sequence(chart_id, data) {
    let container = document.getElementById(chart_id);

    let chart = new google.visualization.Timeline(container);

    let dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: 'string', id: 'Domain' });
    dataTable.addColumn({ type: 'string', id: 'Name' });
    dataTable.addColumn({ type: 'number', id: 'Start' });
    dataTable.addColumn({ type: 'number', id: 'End' });

    let data_array = [];

    let start = new Date()
    let end = new Date()

    let display_name_to_format_name = {};

    data_array.push(["5'", '', 1, 1]);
    data_array.push(["3'", '', 1, 1]);

    for (let i=0; i < data.length; i++) {
        let start = data[i]['start'];
        let end = data[i]['end'];
        let direction = strand_to_direction(data[i]['strand']);
        display_name_to_format_name[data[i]['locus']['display_name']] = data[i]['locus']['format_name'];
        if(direction == "5'") {
            data_array.push([direction, data[i]['locus']['display_name'], start, end]);
        }
        else {
            data_array.push([direction, data[i]['locus']['display_name'], start, end]);
        }
    }
    data_array.push(["5'", '', contig['residues'].length, contig['residues'].length]);
    data_array.push(["3'", '', contig['residues'].length, contig['residues'].length]);

    dataTable.addRows(data_array);
    let myColors = ['#A4A4A4'];

    let options = {
        'height': 1,
        'timeline': {'hAxis': {'position': 'none'}},
        'colors': myColors,
        'tooltip': {'isHTML': true}
    }

    // options['height'] = 250;
    chart.draw(dataTable, options);
    google.visualization.events.addListener(chart, 'ready', make_ready_handler(chart_id, chart, 1, contig['residues'].length,
        display_name_to_format_name, data_array));
    let height = $("#" + chart_id + " > div > div > div > div > svg").height() + 60;
    options['height'] = height;
    chart.draw(dataTable, options);
}

function create_feature_table(data) {
	let datatable = [];

    for (let i=0; i < data.length; i++) {
        datatable.push([null, data[i]['locus']['id'],
                        create_link(data[i]['locus']['display_name'], data[i]['locus']['link']),
                        data[i]['locus']['format_name'],
                        data[i]['locus']['locus_type'],
                        data[i]['start'] + '-' + data[i]['end'],
                        data[i]['strand']
                        ]);
    }
    set_up_header('chromosomal_coord_table', datatable.length, 'feature', 'features');

    set_up_range_sort();

    let options = {};
    options["bPaginate"] = true;
    options["aaSorting"] = [[5, "asc"]];
    options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, null, null, { "sType": "range" }, null]
    options["aaData"] = datatable;
    options["oLanguage"] = {"sEmptyTable": "No features for " + contig['display_name'] + '.'};

    return create_table("chromosomal_coord_table", options);
}

function draw_overview(data) {
    google.load("visualization", "1", {packages:["corechart"]});
    google.setOnLoadCallback(drawChart);
    function drawChart() {
        let dataTable = google.visualization.arrayToDataTable(data);
        let count = 0;
        for (let i=0; i < data.length; i++) {
            if(data[i][1] > 0 ) {
                count = count + 1;
            }
        }

        let size = 14;
        if(count >= 10) {
            size = 10;
        }
        if(count <= 1) {
            $('#piechart').hide();
        }

        let options = {
          title: 'Feature Types',
          pieSliceText: 'none',
          legend: {textStyle: {fontSize: size}}
        };

        let chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(dataTable, options);
    }
}
