/**
 * controller.js: listeners and controllers for DNAinfo streeteasy map
 * Author: NiJeL
 */


$( document ).ready(function() {

	// update map when combo box is picked
	$( "#filter-form" ).change(function() {
		$("body").addClass("loading");
		DNAinfoNYCStreetEasy.updateMapFromForm();
	});


});
