/**
 * controller.js: listeners and controllers for DNAinfo crime map
 * Author: NiJeL
 */


$( document ).ready(function() {

	// close popup tray
	$('#popup-close').click(function() {
		$( ".popup-wrapper" ).toggleClass("popup-wrapper-open");
		$( ".map" ).toggleClass("map-popup-wrapper-open");
	});


});
