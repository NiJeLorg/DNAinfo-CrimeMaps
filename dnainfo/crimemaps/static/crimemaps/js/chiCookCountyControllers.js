/**
 * chiShootingsListeners.js: listeners and controllers for chi shootings map
 * Author: NiJeL
 */


$( document ).ready(function() {

	// update map when combo box is picked
	$( "#filter-form" ).change(function() {
		$("body").addClass("loading");
		DNAinfoChiCookCounty.updateMapFromSliderCombo();
	});

});
