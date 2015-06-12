/**
 * chiShootingsListeners.js: listeners and controllers for chi shootings map
 * Author: NiJeL
 */


$( document ).ready(function() {

	$( ".form-inline" ).change(function() {
		$("body").addClass("loading");
		DNAinfoChiShootings.updateMapFromSliderCombo();
	});

});
