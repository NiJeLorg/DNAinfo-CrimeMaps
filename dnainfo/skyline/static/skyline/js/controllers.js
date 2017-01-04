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

	// listen for keyboard enter clicks to submit forms 
	$(document).on('click', '#nextNeighborhood', function(e) {
		e.preventDefault();
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextNeighborhood();
	});	

	$(document).keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			if ($("#nextHeight").length) {
				console.log('here');
				// check if field is empty
				var whereBuilding = $('#id_whereBuilding').val();
				var checkNull = isNull(whereBuilding);
				if (checkNull) {
					return;
				}

				//fade out, submit form, then fade back in
				$(".fadein").fadeOut("fast");
				ajaxApplication.nextHeight();
			}
			if ($("#nextLocation").length) {
				// check if field is empty
				var buildingStories = $('#id_buildingStories').val();
				var checkNull = isNull(buildingStories);
				if (checkNull) {
					return;
				}

				//fade out, submit form, then fade back in
				$(".fadein").fadeOut("fast");
				ajaxApplication.nextLocation();
			}
			if ($("#nextEnd").length) {
				// check if field is empty
				var buildingFootprint = $('#id_buildingFootprint').val();
				var checkNull = isNull(buildingFootprint);
				if (checkNull) {
					return;
				}

				//fade out, submit form, then fade back in
				$(".fadein").fadeOut("fast");
				ajaxApplication.nextEnd();
			}
		}
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


	// listen for whereBuilding changes and ensure next location button is emabled 
	$(document).on('change', '#id_whereBuilding', function(e) {
		// close keyboard
		$('.select2-focusser').blur();
		// remove disabled button for next
		$('#nextHeight').prop("disabled", false);
		// sneak in disabling next building height
		$('#sponsoredNextBuildingHeight').prop("disabled", false);
	});

	// for iOS, force blur to close keyboard if clicking away from the input field
	$(document).on('click', '#select2-drop', function(e) {
		document.activeElement.blur();
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

	// listeners for radio button clicks to show or hide document/image/url UGC form
	$(document).on('click', '#id_imageDocOrURL_1', function(e) {
		// check if hidden and unhide
		if ($('#div_id_buildingImage').hasClass('hidden') && $('#div_id_buildingDoc').hasClass('hidden')) {
			$('#div_id_buildingImage').removeClass('hidden');
			$('#div_id_buildingDoc').removeClass('hidden');
			$('#div_id_buildingURL').addClass('hidden');
		} 
	});

	$(document).on('click', '#id_imageDocOrURL_2', function(e) {
		// check if hidden and unhide
		if ($('#div_id_buildingURL').hasClass('hidden')) {
			$('#div_id_buildingImage').addClass('hidden');
			$('#div_id_buildingDoc').addClass('hidden');
			$('#div_id_buildingURL').removeClass('hidden');
		} 
	});

	// if a document has been uploaded, release the next button
	$(document).on('change', '#id_buildingImage', function(e) {
		if ($('#id_buildingImage').val() === '' && $('#id_buildingDoc').val() === '' && $('#id_buildingURL').val() === '') {
			$('#nextLocation').prop("disabled", true);
		} else {
			$('#nextLocation').prop("disabled", false);
		}
	});
	$(document).on('change', '#id_buildingDoc', function(e) {
		if ($('#id_buildingImage').val() === '' && $('#id_buildingDoc').val() === '' && $('#id_buildingURL').val() === '') {
			$('#nextLocation').prop("disabled", true);
		} else {
			$('#nextLocation').prop("disabled", false);
		}		
	});

	// if any value exists in id_buildingURL, release the next button
	$(document).on('keyup', '#id_buildingURL', function(e) {
		if ($('#id_buildingImage').val() === '' && $('#id_buildingDoc').val() === '' && $('#id_buildingURL').val() === '') {
			$('#nextLocation').prop("disabled", true);
		} else {
			$('#nextLocation').prop("disabled", false);
		}
	});	

});
