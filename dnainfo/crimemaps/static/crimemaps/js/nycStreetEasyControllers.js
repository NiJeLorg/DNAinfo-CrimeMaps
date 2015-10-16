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

	// expand/contract lower tray
	$('#popup-expand').click(function() {
		$( ".popup-wrapper" ).toggleClass("popup-wrapper-open");
		$( ".popup-wrapper" ).toggleClass("popup-wrapper-75pct");
		$( ".map" ).toggleClass("map-popup-wrapper-open");
		$( ".map" ).toggleClass("map-popup-wrapper-75pct");
		var text = $('#popup-expand').text();
		$('#popup-expand').text(text == "Expand this window" ? "Contract this window" : "Expand this window");
	});


});
