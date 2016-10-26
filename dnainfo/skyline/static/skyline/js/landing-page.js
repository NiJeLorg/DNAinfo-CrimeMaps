/**
 * landing-page.js: basic JS for the landing page
 */

$( document ).ready(function() {

	// fade in main image and search bar
	$(".fadein").fadeIn("slow");

	// set up select 2
	// remove form labels
    $('label').remove();
    // add a form-control class to the input, disabled attribute and placeholder text
    $('#id_whereBuilding').addClass("form-control");
    // don't allow a blank option
    $('#id_whereBuilding option[value=""]').remove();
    // initialize select 2
    $('.django-select2').djangoSelect2();
    // update placeholder text
    $('.select2-selection__placeholder').text("Select a Neighborhood");

	// for iOS, force blur to close keyboard if clicking away from the input field
	$(document).on('click', '#select2-drop', function(e) {
		document.activeElement.blur();
	});	

});
