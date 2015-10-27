/**
 * chiShootingsListeners.js: listeners and controllers for chi shootings map
 * Author: NiJeL
 */


$( document ).ready(function() {
	// pick the data combo on page load from url
	$( "#monthYear" ).val(monthYear);

	// update map when combo box is picked
	$( "#filter-form" ).change(function() {
		$("body").addClass("loading");
		DNAinfoChiCookCounty.updateMapFromSliderCombo();
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
