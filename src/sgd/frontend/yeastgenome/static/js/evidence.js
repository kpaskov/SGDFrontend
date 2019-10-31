function domain_data_to_table(evidence) {
    let bioent = create_link(evidence['locus']['display_name'], evidence['locus']['link'], false);
    let domain;
    if(evidence['domain']['link'] != null) {
        domain = create_link(evidence['domain']['display_name'], evidence['domain']['link']);
    }
    else {
        domain = evidence['domain']['display_name']
    }

    let coord_range = evidence['start'] + '-' + evidence['end'];

    let description = '';
    if (evidence['domain']['description'] != null) {
        description = evidence['domain']['description'];
    }

    return [evidence['id'], evidence['locus']['id'], bioent, evidence['locus']['format_name'], coord_range, domain, description, evidence['source']['display_name'], '' + evidence['domain']['count']]

}

function dataset_datat_to_table(dataset) {
    let reference = '';
    if(dataset['reference'] != null) {
        reference = create_link(dataset['reference']['display_name'], dataset['reference']['link']);
        if(dataset['reference']['pubmed_id'] != null) {
            reference = reference + ' <small>PMID:' + dataset['reference']['pubmed_id'] + '</small>';
        }
    }

    let dataset_with_link = create_link(dataset['display_name'], dataset['link']);
    let tags = [];
    for(let j=0; j < dataset['tags'].length; j++) {
        tags.push(create_link(dataset['tags'][j]['display_name'], dataset['tags'][j]['link']));
    }

    let hist_values = [];
    if('hist_values' in dataset) {
        for(let j=0; j < dataset['hist_values'].length; j++) {
            let min_range = dataset['hist_values'][j];
            let max_range = min_range + .5;
            if(min_range == -5.5) {
                min_range = '*';
            }
            else {
                min_range = min_range.toFixed(1);
            }
            if(max_range == 5.5) {
                max_range = '*';
            }
            else {
                max_range = max_range.toFixed(1);
            }
            hist_values.push('log2ratio=' + min_range + ':' + max_range)
        }
    }

    return [dataset['id'], dataset['id'], hist_values.join(', '), dataset_with_link, dataset['short_description'], tags.join(', '), dataset['condition_count'].toString(), reference]

}

function downloadable_file_to_table(data) {

    let s3_url = data['s3_url'].split("?versionId").shift();
    let file_with_link = create_link(s3_url.split("/").pop(), s3_url);
    
    return [data['id'], data['id'], file_with_link, data['description']]

}

function phosphorylation_data_to_table(evidence) {
    let bioent = create_link(evidence['locus']['display_name'], evidence['locus']['link'], false);

    let site_index = evidence['site_index'];
    let site_residue = evidence['site_residue'];

    let reference = '';
    if(evidence['reference'] != null) {
        reference = create_link(evidence['reference']['display_name'], evidence['reference']['link']);
    }

    let site_functions = '';
    let kinases = '';
    for(let j=0; j < evidence['properties'].length; j++) {
        if(evidence['properties'][j]['role'] == 'Kinase') {
            if(kinases.length > 0) {
                kinases = kinases + ', ';
            }
            kinases = kinases + '<a href="' + evidence['properties'][j]['bioentity']['link'] + '">' + evidence['properties'][j]['bioentity']['display_name'] + '</a>';
        }
        else {
            if(site_functions.length > 0) {
                site_functions = site_functions + ', ';
            }
            site_functions = site_functions + evidence['properties'][j]['note'];
        }
    }

    let source = evidence['source']['display_name'];
    if(source == "PhosphoGRID") {
        let gene_id = null;
        for(let j=0; j < locus['aliases'].length; j++) {
            if(locus['aliases'][j]['category'] == 'Gene ID' && locus['aliases'][j]['source']['display_name'] == 'BioGRID') {
                gene_id = locus['aliases'][j]['display_name'];
            }
        }
        if(gene_id != null) {
	        source = create_link(source, "http://www.phosphogrid.org/sites/" + gene_id + "/" + evidence['locus']['format_name'] + ".phospho", true);
        }
	}
    let type = evidence['type'];
    let reference = "";
    if (evidence.source.format_name !== "PhosphoGRID") {
        let _r = evidence.reference;
        reference = "<span><a href='" + _r.link + "'>" + _r.display_name + "</a> <small>PMID: " + _r.pubmed_id + "</small></span>";
    } 

    return [evidence['id'], evidence['locus']['id'], bioent, evidence['locus']['format_name'], site_residue + site_index, site_functions, type, kinases, source, reference];
}

function history_data_to_table(evidence) {
    let bioent = create_link(evidence['locus']['display_name'], evidence['locus']['link'], false);

    let references = [];
    for(let j=0; j < evidence['references'].length; j++) {
        let reference = evidence['references'][j];
        let ref_link = create_link(reference['display_name'], reference['link']);
        if(reference['pubmed_id'] != null) {
            ref_link = ref_link + ' <small>PMID:' + reference['pubmed_id'] + '</small>';
        }
        references.push(ref_link)
    }
    return [evidence['id'], evidence['locus']['id'], bioent, evidence['locus']['format_name'], evidence['date_created'], evidence['note'], references.join(', ')];
}

function protein_experiment_data_to_table(evidence) {
    let bioent = create_link(evidence['locus']['display_name'], evidence['locus']['link'], false);

    let reference = '';
    if(evidence['reference'] != null) {
        reference = create_link(evidence['reference']['display_name'], evidence['reference']['link']);
    }

    let experiment = create_link(evidence['experiment']['display_name'], evidence['experiment']['link']);

    return [evidence['id'], evidence['locus']['id'], bioent, evidence['locus']['format_name'], experiment, evidence['data_value'] + ' ' + evidence['data_unit'], reference];
}

function protein_abundance_data_to_table(evidence) {

    let bioent = create_link(evidence['locus']['display_name'], evidence['locus']['link'], false);

    let reference = '';
    if(evidence['reference'] != null) {
        reference = create_link(evidence['reference']['display_name'], evidence['reference']['link']);
    }
    
    let original_reference = '';
    if(evidence['original_reference'] != null) {
        original_reference = create_link(evidence['original_reference']['display_name'], evidence['original_reference']['link']);
    }

    let media = '';
    if (evidence['media'] != null) {
	media = evidence['media']['display_name'];
    }

    let treatment = 'untreated';
    let treatment_time = '';
    if (evidence['treatment']['chemical'] != '') {
	treatment = evidence['treatment']['chemical'];
    }
    else if (evidence['treatment']['process'] != '') {
	treatment = evidence['treatment']['process'];
    }
    if (treatment != 'untreated') {
	if (evidence['treatment']['conc_value'] != null) {
	    let unit = '';
	    if (evidence['treatment']['conc_unit']!= null) {
		unit = evidence['treatment']['conc_unit'];
	    }
	    if (unit == '%') {
	        treatment = evidence['treatment']['conc_value'] + unit + " " + treatment;
	    }
	    else {
		treatment = evidence['treatment']['conc_value'] + " " + unit + " " + treatment;
	    }
	}
	if (evidence['treatment']['time_value']!= null) {
	    let unit = '';
            if (evidence['treatment']['time_unit']!= null) {
		unit = evidence['treatment']['time_unit'];
	    } 
	    treatment_time = evidence['treatment']['time_value'] + " " + unit;
	}
    }
   
    let fold_change = '';
    if (evidence['fold_change'] != null) {
	fold_change = evidence['fold_change'];
    }
    
    let visualization = '';
    if (evidence['visualization'] != null) {
	visualization = evidence['visualization']['display_name'];
    }  

    let strain_background = '';
    if (evidence['strain'] != null) {
	strain_background = create_link(evidence['strain']['display_name'], evidence['strain']['link']);
    }  

    return [evidence['id'], evidence['locus']['id'], bioent, evidence['locus']['format_name'], 
	    evidence['data_value'],
	    media,
	    treatment,
	    treatment_time,
	    fold_change,
	    visualization,
	    strain_background,
	    original_reference,
	    reference];

}

function complex_subunit_data_to_table(evidence) {
    let subunit = create_link(evidence['display_name'], evidence['link'], false);
    let description = evidence['description'];
    let stoichiometry = evidence['stoichiometry'];
     
    return [subunit, description, stoichiometry];

}


function sublabel_data_to_table(evidence, locus, strand, data_id) {
    let coord_version = evidence['coord_version'];
    let seq_version = evidence['seq_version'];
    if(coord_version == 'None') {
        coord_version = '';
    }
    if(seq_version == 'None') {
        seq_version = '';
    }
    let coords = '';
    if(evidence['chromosomal_start'] < evidence['chromosomal_end']) {
        coords = evidence['chromosomal_start'] + '-' + evidence['chromosomal_end'];
    }
    else {
        coords = evidence['chromosomal_end'] + '-' + evidence['chromosomal_start'];
    }

    let display_name = evidence['display_name'];
    if(evidence['bioentity'] != null) {
        display_name = create_link(display_name, evidence['bioentity']['link']);
    }

    return [data_id, locus['id'], locus['display_name'], locus['format_name'], display_name, evidence['relative_start'] + '-' + evidence['relative_end'], coords, strand, coord_version, seq_version];
}

function regulation_data_to_table(evidence, is_regulator) {
    let bioent1 = create_link(evidence['locus1']['display_name'], evidence['locus1']['link']);
	let bioent2 = create_link(evidence['locus2']['display_name'], evidence['locus2']['link']);

	let experiment = '';
	if(evidence['experiment'] != null) {
        experiment = create_link(evidence['experiment']['display_name'], evidence['experiment']['link']);
	}
	let strain = '';
	if(evidence['strain'] != null) {
	    strain = create_link(evidence['strain']['display_name'], evidence['strain']['link']);
	}
	let reference = '';
	if(evidence['reference'] != null) {
	    reference = create_link(evidence['reference']['display_name'], evidence['reference']['link']);
        if(evidence['reference']['pubmed_id'] != null) {
            reference = reference + ' <small>PMID:' + evidence['reference']['pubmed_id'] + '</small>';
        }
	}
	let analyze_value;
    if(is_regulator == null) {
        analyze_value = evidence['locus1']['id'] + ',' + evidence['locus2']['id'];
    }
	else if(is_regulator) {
	    analyze_value = evidence['locus1']['id'];
	}
	else {
	    analyze_value = evidence['locus2']['id'];
	}
    let direction = evidence['direction'] || '';
    let regulation_type = evidence['regulation_type'] || '';
    let regulator_type= evidence['regulator_type'] || '';
    let happens_during = evidence['happens_during'] || '';
    let evidence_name = evidence['experiment']['display_name'] || '';
    // Evidence ID, Analyze ID, Regulator, Regulator Systematic Name, Target, Target Systematic Name, Direction, Regulation of, Happens During, Regulator type, direction, regulation of, happens during, annotation_type (method),  Evidence, Strain Background, Reference
    return [evidence['id'], analyze_value, bioent1, evidence['locus1']['format_name'], bioent2, evidence['locus2']['format_name'], direction, regulation_type, happens_during, regulator_type, direction, regulation_type, happens_during, evidence['annotation_type'], evidence_name, strain, reference];
  	
}

function interaction_data_to_table(evidence, index) {
	let icon;
	if(evidence['note'] != null) {
		icon = create_note_icon(index, evidence['note']);
	}
	else {
		icon = null;
	}

	let bioent1_key = 'locus1';
	let bioent2_key = 'locus2';
	let direction = evidence['bait_hit'];
    let analyze_key;

	if(typeof(locus) !== 'undefined') {
	    if(locus['id'] == evidence['locus1']['id']) {
            if(direction == 'Hit-Bait') {
                direction = 'Hit';
            }
            else {
                direction = 'Bait';
            }
        }
        else {
            bioent1_key = 'locus2';
            bioent2_key = 'locus1';
            if(direction == 'Hit-Bait') {
                direction = 'Bait';
            }
            else {
                direction = 'Hit';
            }
        }
        analyze_key = evidence[bioent2_key]['id']
	}
    else {
        analyze_key = evidence[bioent1_key]['id'] + ',' + evidence[bioent2_key]['id'];
    }

	let experiment = '';
	if(evidence['experiment'] != null) {
		experiment = create_link(evidence['experiment']['display_name'], evidence['experiment']['link']);
	}
	let phenotype = '';
	if(evidence['phenotype'] != null) {
		phenotype = create_link(evidence['phenotype']['display_name'], evidence['phenotype']['link']) + '<br><strong>Mutant Type:</strong> ' + evidence['mutant_type'];
	}
	let modification = '';
	if(evidence['modification'] != null) {
		modification = evidence['modification'];
  	}

     bioent1 = create_link(evidence[bioent1_key]['display_name'], evidence[bioent1_key]['link']);
	 bioent2 = create_link(evidence[bioent2_key]['display_name'], evidence[bioent2_key]['link']);

  	let reference = create_link(evidence['reference']['display_name'], evidence['reference']['link']);
    if(evidence['reference']['pubmed_id'] != null) {
        reference = reference + ' <small>PMID:' + evidence['reference']['pubmed_id'] + '</small>';
    }

    return [evidence['id'], analyze_key, icon, bioent1, evidence[bioent1_key]['format_name'], bioent2, evidence[bioent2_key]['format_name'], evidence['interaction_type'], experiment, evidence['annotation_type'], direction, modification, phenotype, evidence['source']['display_name'], reference, evidence['note']]
}

function gene_data_to_table(bioent) {
	let bioent_name = create_link(bioent['display_name'], bioent['link']);
  	return [bioent['id'], bioent['id'], bioent['format_name'], bioent_name, bioent['description']];
}

function dataset_data_to_table(dataset) {
    let dataset_link = create_link(dataset['geo_id'], dataset['link']);
    return [dataset['display_name'], dataset_link];
}

function phenotype_data_to_table(evidence, index) {
	let bioent = create_link(evidence['locus']['display_name'], evidence['locus']['link']);

	let experiment = '';
	if(evidence['experiment'] != null) {
		experiment = create_link(evidence['experiment']['display_name'], evidence['experiment']['link']);
		if(evidence['experiment_details'] != null) {
			experiment = experiment + ' ' + create_note_icon('experiment_icon' + index, evidence['experiment_details']);
		}
	}

	let strain = '';
	if(evidence['strain'] != null) {
		strain = create_link(evidence['strain']['display_name'], evidence['strain']['link']);
	}

    let allele = '';
    let chemical = '';
	let reporter = '';
    let note = '';
    for (let j=0; j < evidence['properties'].length; j++) {
        let entry = evidence['properties'][j];
        if(evidence['properties'][j]['class_type'] == 'CHEMICAL') {
            let newChemical = '';
            if(evidence['properties'][j]['concentration'] != null) {
                let temp_unit = evidence["properties"][j]["unit"] ? evidence["properties"][j]["unit"] : "";
                temp_unit = temp_unit.match(/%/) ? temp_unit : ' '+ temp_unit;
                newChemical = evidence['properties'][j]['concentration'] + temp_unit +' ' + create_link(evidence['properties'][j]['bioitem']['display_name'], evidence['properties'][j]['bioitem']['link']);
            }
            else {
                newChemical = create_link(evidence['properties'][j]['bioitem']['display_name'], evidence['properties'][j]['bioitem']['link']);
            }
            let chemical_icon = create_note_icon('chemical_icon' + index, evidence['properties'][j]['note']);
            if(chemical_icon != '') {
                newChemical = newChemical + ' ' + chemical_icon;
            } 
            if (j == evidence["properties"].length - 1 || evidence["properties"].length == 1) {
                chemical = chemical + newChemical;
                
              }
             else {
                chemical = chemical + newChemical + ", ";
              }
    
           
            
        }
        else if(evidence['properties'][j]['role'] == 'Allele') {
            allele = '<br><strong>Allele: </strong>' + evidence['properties'][j]['bioitem']['display_name'];
            let allele_icon = create_note_icon('allele_icon' + index, evidence['properties'][j]['note']);
            if(allele_icon != '') {
                allele = allele + ' ' + allele_icon;
            }
        }
        else if(evidence['properties'][j]['role'] == 'Reporter') {
            reporter = '<strong>Reporter: </strong>' + evidence['properties'][j]['bioitem']['display_name'];
            let reporter_icon = create_note_icon('reporter_icon' + index, evidence['properties'][j]['note']);
            if(reporter_icon != '') {
                reporter = reporter + ' ' + reporter_icon;
            }
        }
        else {
	    let classType = evidence['properties'][j]['class_type'];
	    let label = classType.charAt(0).toUpperCase() + classType.slice(1) + ": ";
	    note = note + '<strong>' + label + '</strong>' + evidence['properties'][j]['note'] + '<br>';
        }
    }
    chemical = chemical.replace(/,\s$/,'');

    if(evidence['note'] != null) {
        note = note + '<strong>Details: </strong>' + evidence['note'] + '<br>';
    }

	let biocon = create_link(evidence['phenotype']['display_name'], evidence['phenotype']['link']);
	biocon = biocon + '<br>' + reporter;

  	let reference = create_link(evidence['reference']['display_name'], evidence['reference']['link']);
    if(evidence['reference']['pubmed_id'] != null) {
        reference = reference + ' <small>PMID:' + evidence['reference']['pubmed_id'] + '</small>';
    }

  	return [evidence['id'], evidence['locus']['id'], bioent, evidence['locus']['format_name'], biocon, experiment, evidence['experiment']['category'], evidence['mutant_type'] + allele, strain, chemical, note, reference];
}

function go_data_to_table(evidence, index) {
	let bioent = create_link(evidence['locus']['display_name'], evidence['locus']['link']);
	let biocon = create_link(evidence['go']['display_name'], evidence['go']['link']);
  	let reference = create_link(evidence['reference']['display_name'], evidence['reference']['link']);
    if(evidence['reference']['pubmed_id'] != null) {
        reference = reference + ' <small>PMID:' + evidence['reference']['pubmed_id'] + '</small>';
    }

    let evidence_code = null;
    if(evidence['experiment'] != null) {
        evidence_code = create_link(evidence['experiment']['display_name'], evidence['experiment']['link']);;
    }
    else {
        evidence_code = evidence['go_evidence'];
    }

  	let with_entry = null;
	let relationship_entry = null;

  	for(let j=0; j < evidence['properties'].length; j++) {
  		let condition = evidence['properties'][j];
        let obj = null;
        if('bioitem' in condition) {
            obj = condition['bioitem'];
        }
        else if('bioentity' in condition) {
            obj = condition['bioentity'];
        }
        else if('bioconcept' in condition) {
            obj = condition['bioconcept'];
        }

  		if(condition['role'] == 'With' || condition['role'] == 'From') {
  			let new_with_entry;
            if(obj['link'] == null) {
                new_with_entry = obj['display_name'];
            }
            else {
                new_with_entry = create_link(obj['display_name'], obj['link'], obj['class_type'] != 'GO' && obj['class_type'] != 'LOCUS');
            }
	  		if(with_entry == null) {
	  			with_entry = new_with_entry
	  		}
	  		else {
	  			with_entry = with_entry + ', ' + new_with_entry
	  		}
	  	}
	  	else if(obj != null) {

	  		let new_rel_entry = condition['role'] + ' ';
            if(obj['link'] == null) {
                new_rel_entry = new_rel_entry + obj['display_name'];
            }
            else {
                new_rel_entry = new_rel_entry + create_link(obj['display_name'], obj['link']);
            }
	  		if(relationship_entry == null) {
  				relationship_entry = new_rel_entry
  			}
  			else {
  				relationship_entry = relationship_entry + ', ' + new_rel_entry
  			}
	  	}
        

  	}
  	if(with_entry != null) {
  		evidence_code = evidence_code + ' with ' + with_entry;
  	}

    let qualifier = evidence['qualifier'];
    if(qualifier == 'involved in' || qualifier == 'enables' || qualifier == 'part of') {
        qualifier = '';
    }
    relationship_entry = relationship_entry || ''; // prevent null value so that GO table can sort
  	return [evidence['id'], evidence['locus']['id'], bioent, evidence['locus']['format_name'], biocon, evidence['go']['go_id'], qualifier, evidence['go']['go_aspect'], evidence_code, evidence['annotation_type'], evidence['source']['display_name'], evidence['date_created'], relationship_entry, reference];
}

function disease_data_to_table(evidence, index) {
	let bioent = create_link(evidence['locus']['display_name'], evidence['locus']['link']);
	let biocon = create_link(evidence['disease']['display_name'], evidence['disease']['link']);
  	let reference = create_link(evidence['reference']['display_name'], evidence['reference']['link']);
    if(evidence['reference']['pubmed_id'] != null) {
        reference = reference + ' <small>PMID:' + evidence['reference']['pubmed_id'] + '</small>';
    }

    let evidence_code = null;
    if(evidence['experiment'] != null) {
        evidence_code = create_link(evidence['experiment']['display_name'], evidence['experiment']['link']);;
    }
    else {
        evidence_code = evidence['do_evidence'];
    }

  	let with_entry = null;
	let relationship_entry = null;

  	for(let j=0; j < evidence['properties'].length; j++) {
  		let condition = evidence['properties'][j];
        let obj = null;
        if('bioitem' in condition) {
            obj = condition['bioitem'];
        }
        else if('bioentity' in condition) {
            obj = condition['bioentity'];
        }
        else if('bioconcept' in condition) {
            obj = condition['bioconcept'];
        }


        if(condition['role'] == 'With' || condition['role'] == 'From') {
  			let new_with_entry;
            if(obj['link'] == null) {
                new_with_entry = obj['display_name'];
            }
            else {
                new_with_entry = create_link(obj['display_name'], obj['link'], obj['class_type'] != 'GO' && obj['class_type'] != 'LOCUS');
            }
	  		if(with_entry == null) {
	  			with_entry = new_with_entry
	  		}
	  		else {
	  			with_entry = with_entry + ', ' + new_with_entry
	  		}
	  	}
	  	else if(obj != null) {

	  		let new_rel_entry = condition['role'] + ' ';
            if(obj['link'] == null) {
                new_rel_entry = new_rel_entry + obj['display_name'];
            }
            else {
                new_rel_entry = new_rel_entry + create_link(obj['display_name'], obj['link']);
            }
	  		if(relationship_entry == null) {
  				relationship_entry = new_rel_entry
  			}
  			else {
  				relationship_entry = relationship_entry + ', ' + new_rel_entry
  			}
	  	}

  	}

  	if(with_entry != null && evidence['experiment']['display_name'] != 'IMP') {
  		evidence_code = evidence_code + ' with ' + with_entry;
  	}

    let qualifier = evidence['qualifier'];
    if(qualifier == 'involved in' || qualifier == 'enables' || qualifier == 'part of') {
        qualifier = '';
    }
    relationship_entry = relationship_entry || ''; // prevent null value so that GO table can sort
  	return [evidence['id'], evidence['locus']['id'], bioent, evidence['locus']['format_name'], biocon, evidence['disease']['disease_id'], qualifier, evidence_code, evidence['annotation_type'], evidence['source']['display_name'], evidence['date_created'], relationship_entry, reference];
}
