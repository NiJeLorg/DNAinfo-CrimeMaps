/**
 * controllerTrayClosed.js: listeners and controllers for DNAinfo -- tray closed
 * Author: NiJeL
 */


$( document ).ready(function() {

	// close popup tray
	$('#popup-close').click(function() {
		$( ".popup-wrapper" ).toggleClass("popup-wrapper-open");
		$( ".map" ).toggleClass("map-popup-wrapper-open");
	});


});
