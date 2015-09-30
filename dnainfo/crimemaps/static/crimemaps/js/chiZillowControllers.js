/**
 * controller.js: listeners and controllers for DNAinfo zillow map
 * Author: NiJeL
 */


$( document ).ready(function() {

	// update map when combo box is picked
	$( "#filter-form" ).change(function() {
		$("body").addClass("loading");
		DNAinfoCHIZillow.updateMapFromForm();
	});


});
