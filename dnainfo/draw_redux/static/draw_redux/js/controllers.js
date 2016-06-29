/**
 * controllers.js: javascript controllers for all pages
 */

$( document ).ready(function() {

	// fade in main image and search bar
	$(".fadein").fadeIn("slow");


	// listeners for all forms
	$(document).on('click', '#nextNeighborhood', function(e) {
		e.preventDefault();
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextNeighborhood();
	});

	$(document).on('click', '#nextPick', function(e) {
		e.preventDefault();
		//fade out, submit form, then fade back in
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextPick();
	});


	$(document).on('click', '#nextEnd', function(e) {
		e.preventDefault();
		//fade out, submit form, then fade back in
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextEnd();
	});



	// listeners for back buttons
	$(document).on('click', '#backIntro', function(e) {
		e.preventDefault();
		$(".fadein").fadeOut("fast");
		ajaxApplication.backIntro();
	});

	$(document).on('click', '#backNeighborhood', function(e) {
		e.preventDefault();
		$(".fadein").fadeOut("fast");
		ajaxApplication.backNeighborhood();
	});




	// listen for whereBuilding changes and ensure next location button is enabled 
	$(document).on('change', '#id_whatNeighborhood', function(e) {
		// close keyboard
		$('.select2-focusser').blur();
		// remove disabled button for next
		$('#nextPick').prop("disabled", false);
	});

	// for iOS, force blur to close keyboard if clicking away from the input field
	$(document).on('click', '#select2-drop', function(e) {
		document.activeElement.blur();
	});	


	// function to check if values are null and create alert if null
	function isNull(value) {
		if (!value) {
			$(".text-danger").removeClass("hidden");
			return true;
		}
		return false;
	}



});
