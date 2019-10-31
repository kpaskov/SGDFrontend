
if(locus['interaction_overview']['num_gen_interactors'] + locus['interaction_overview']['num_phys_interactors'] > 0){
  	let r = locus['interaction_overview']['gen_circle_size'];
    let s = locus['interaction_overview']['phys_circle_size'];
	let x = locus['interaction_overview']['circle_distance'];
    let A = locus['interaction_overview']['num_gen_interactors'];
	let B = locus['interaction_overview']['num_phys_interactors'];
	let C = locus['interaction_overview']['num_both_interactors'];

	//Colors chosen as colorblind safe from http://colorbrewer2.org/.
	let stage = draw_venn_diagram("venn_diagram", r, s, x, A, B, C, "#762A83", "#1B7837");
}
else {
  	document.getElementById("summary_message").style.display = "block";
  	document.getElementById("summary_wrapper").style.display = "none";
}
