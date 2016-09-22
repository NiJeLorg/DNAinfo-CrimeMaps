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

	$(document).on('click', '#nextHeight', function(e) {
		e.preventDefault();
		// check if field is empty
		var whereBuilding = $('#id_whereBuilding').val();
		var checkNull = isNull(whereBuilding);
		if (checkNull) {
			return;
		}

		//fade out, submit form, then fade back in
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextHeight();
	});

	$(document).on('click', '#nextLocation', function(e) {
		e.preventDefault();
		// check if field is empty
		var buildingStories = $('#id_buildingStories').val();
		var checkNull = isNull(buildingStories);
		if (checkNull) {
			return;
		}

		//fade out, submit form, then fade back in
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextLocation();
	});

	$(document).on('click', '#nextEnd', function(e) {
		e.preventDefault();
		// check if field is empty
		var buildingFootprint = $('#id_buildingFootprint').val();
		var checkNull = isNull(buildingFootprint);
		if (checkNull) {
			return;
		}

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
		ajaxApplication.backNeighborhood(objectID);
	});

	$(document).on('click', '#backHeight', function(e) {
		e.preventDefault();
		$(".fadein").fadeOut("fast");
		ajaxApplication.backHeight(objectID);
	});


	// listen for whereBuilding changes and ensure next location button is emabled and i don't see my neighborhood is unchecked
	$(document).on('change', '#id_whereBuilding', function(e) {
		// close keyboard
		$('.select2-focusser').blur();
		// remove disabled button for next
		$('#nextHeight').prop("disabled", false);
		// sneak in disabling next building height
		$('#sponsoredNextBuildingHeight').prop("disabled", false);
		// ensure that iDontSeeMyNeighborhood is unchecked
		$('#id_iDontSeeMyNeighborhood').prop("checked", false);
	});

	// for iOS, force blur to close keyboard if clicking away from the input field
	$(document).on('click', '#select2-drop', function(e) {
		document.activeElement.blur();
	});	


	// ensure that select2-no-results says the correct text
	$(document).on('keydown', '.select2-search__field', function(e) {
		window.setTimeout(function() {  
	        $(".select2-results__message").html("<em>I don't see my neighborhood.</em>");
	        // set listener
        	$(".select2-results__message").on('click', function(e) {
				$('.select2-selection__placeholder').text("I don't see my neighborhood.");
				$('.select2-selection__rendered').text("I don't see my neighborhood.");
				$('#id_whereBuilding').val('');
        		$('#id_iDontSeeMyNeighborhood').prop("checked", true);
				$('#nextHeight').prop("disabled", false);
				$('#sponsoredNextBuildingHeight').prop("disabled", false);
			});
	    }, 1);	
	});


	$(document).on('click', '#storiesMinus', function(e) {
		// get the value of #id_whenMoved
		var stories = $('#id_buildingStories').val();
		if (stories == "0") {
			// don't go below 0
			$('.minusStepper').addClass('disabled');
		} else if (stories == "1") {
			// disable minus stepper
			$('.minusStepper').addClass('disabled');
			$('#id_buildingStories').val("0");
		} else {
			stories = parseInt(stories);
			stories--;
			$('#id_buildingStories').val(stories);
		}
		// remove plus stepper disabled class
		$('.plusStepper').removeClass('disabled');
	});	

	$(document).on('click', '#storiesPlus', function(e) {
		// get the value of #id_whenMoved
		var stories = $('#id_buildingStories').val();
		if (stories == "120") {
			// don't go above 120
			$('.plusStepper').addClass('disabled');
		} else if (stories == "119") {
			$('.plusStepper').addClass('disabled');
			$('#id_buildingStories').val("120");
		} else {
			stories = parseInt(stories);
			stories++;
			$('#id_buildingStories').val(stories);
		}
		// remove minus stepper disabled class
		$('.minusStepper').removeClass('disabled');
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
