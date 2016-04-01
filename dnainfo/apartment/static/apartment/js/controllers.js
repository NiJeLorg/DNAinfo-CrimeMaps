/**
 * fade.js: fade in and out controls
 */


$( document ).ready(function() {

	// fade in main image and search bar
	$(".fadein").fadeIn("slow");

	// listeners for all forms
	$(document).on('click', '#firstMove', function(e) {
		$(".fadein").fadeOut("fast");
		ajaxApplication.firstMove();
	});

	$(document).on('click', '#nextNeighborhood', function(e) {
		e.preventDefault();
		// check if field is empty
		var whenMoved = $('#id_whenMoved').val();
		var checkNull = isNull(whenMoved);
		if (checkNull) {
			return;
		}

		//fade out, submit form, then fade back in
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextNeighborhood();
	});

	$(document).on('click', '#nextLocation', function(e) {
		e.preventDefault();
		// check if field is empty
		var whereMoved = $('#id_whereMoved').val();
		var placeholder = $('#s2id_autogen1').prop("placeholder");
		var checked = $('#id_iDontSeeMyNeighborhood').is(":checked");
		if (!whereMoved && !checked) {
			$(".alert").removeClass("hidden");
			return;
		}

		//fade out, submit form, then fade back in
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextLocation();
	});


	$(document).on('click', '#nextYearMoved', function(e) {
		e.preventDefault();
		// check if field is empty
		var firstApartmentLocation = $('#id_firstApartmentLocation').val();
		var checkNull = isNull(firstApartmentLocation);
		if (checkNull) {
			return;
		}

		//fade out, submit form, then fade back in
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextYearMoved();
	});


	$(document).on('click', '#nextBedrooms', function(e) {
		e.preventDefault();
		// is No checked? if so set submitted value to 0
		var checked = $('#radio02').is(":checked");
		if (checked) {
			$('#id_exactYearMoved').val(0);			
		}
		// check if field is empty
		var exactYearMoved = $('#id_exactYearMoved').val();
		var checkNull = isNull(exactYearMoved);
		if (checkNull) {
			return;
		}

		// check is value is between 1900 and 2016
		if (exactYearMoved == 0) {
			// do nothing
		} else if (exactYearMoved < 1900 || exactYearMoved > 2016) {
			$(".alert").removeClass("hidden");
			return;
		}

		//fade out, submit form, then fade back in
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextBedrooms();
	});


	$(document).on('click', '#nextRentSplit', function(e) {
		e.preventDefault();
		// check if field is empty
		var bedrooms = $('#id_bedrooms').val();
		var checkNull = isNull(bedrooms);
		if (checkNull) {
			return;
		}

		// check is value is between 1900 and 2016
		if (bedrooms < 0 || bedrooms > 20) {
			$(".alert").removeClass("hidden");
			return;
		}

		//fade out, submit form, then fade back in
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextRentSplit();
	});	


	$(document).on('click', '#nextiPaid', function(e) {
		e.preventDefault();
		// check if field is empty
		var rentSplit = $('#id_rentSplit').val();
		var checkNull = isNull(rentSplit);
		if (checkNull) {
			return;
		}

		// check is value is between 1900 and 2016
		if (rentSplit < 1 || rentSplit > 20) {
			$(".alert").removeClass("hidden");
			return;
		}

		//fade out, submit form, then fade back in
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextiPaid();
	});	


	$(document).on('click', '#nextAllPaid', function(e) {
		e.preventDefault();
		// check if field is empty
		var iPaid = $('#id_iPaid').val();
		var checkNull = isNull(iPaid);
		if (checkNull) {
			return;
		}

		// check is value is between 0 and 50000
		if (iPaid < 0 || iPaid > 50000) {
			$(".alert").removeClass("hidden");
			return;
		}

		//fade out, submit form, then fade back in
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextAllPaid();
	});

	$(document).on('click', '#nextCalc', function(e) {
		e.preventDefault();
		// check if field is empty
		var allPaidOut = $('#id_allPaid').val();
		var checkNull = isNull(allPaidOut);
		if (checkNull) {
			return;
		}

		// check is value is between 0 and 50000
		if (allPaidOut < 0 || allPaidOut > 50000) {
			$(".alert").removeClass("hidden");
			return;
		}

		//fade out, submit form, then fade back in
		$(".fadein").fadeOut("fast");
		ajaxApplication.nextCalc();
	});					

	// listen for whereMoved changes and update placeholder text
	$(document).on('change', '#id_whereMoved', function(e) {
		// get placeholder text and place this into the select 2 input
		var placeholder = $(this).find('option:selected').text();
		$('#s2id_autogen1').prop("placeholder", placeholder);
		// remove disabled button for next
		$('#nextLocation').prop("disabled", false);
		// ensure that iDontSeeMyNeighborhood is unchecked
		$('#id_iDontSeeMyNeighborhood').prop("checked", false);
	});

	// ensure that select2-no-results says the correct text
	$(document).on('keydown', '#s2id_autogen1_search', function(e) {
		window.setTimeout(function() {  
	        $(".select2-no-results").html("<em>I don't see my neighborhood.</em>");
	        // set listener
        	$(".select2-no-results").on('click', function(e) {
				$('#s2id_autogen1').prop("placeholder", "I don't see my neighborhood.");
				$('#id_whereMoved').val('');
        		$('#id_iDontSeeMyNeighborhood').prop("checked", true);
				$('#s2id_autogen1').prop("disabled", false);
				$('#select2-drop').select2("close");
				$("#select2-drop-mask").select2("close");
				$('#nextLocation').prop("disabled", false);
			});
	    }, 1);	
	});

	// enable next and check yes if change in input field
	$(document).on('keydown', '#id_exactYearMoved', function(e) {
		$('#nextBedrooms').prop("disabled", false);
		$('#radio01').prop("checked", true);
	});
	

	// if NO radio button is clicked, set val to nothing and enable next
	$(document).on('click', '#radio02', function(e) {
		$('#id_exactYearMoved').val('');
		$('#nextBedrooms').prop("disabled", false);
	});


	// enable next and check yes if change in input field
	$(document).on('keyup', '#id_iPaid', function(e) {
		// check is value is between 0 and 50000
		var iPaid = $('#id_iPaid').val();
		if (iPaid < 0 || iPaid > 50000 || iPaid == '') {
			$(".alert").removeClass("hidden");
			$(".warningIcon").removeClass("hidden");
			$(".verifyIcon").addClass("hidden");
			$('#nextAllPaid').prop("disabled", true);

		} else {
			$(".alert").addClass("hidden");
			$(".warningIcon").addClass("hidden");			
			$(".verifyIcon").removeClass("hidden");
			$('#nextAllPaid').prop("disabled", false);
		}
	});

	// if NO radio button is clicked, set val to nothing and show the form field
	$(document).on('click', '#radio02allPaid', function(e) {
		$('#id_allPaid').val('');
		$(".formField").removeClass("hidden");
		$(".alert").addClass("hidden");
		$(".warningIcon").addClass("hidden");			
		$(".verifyIcon").removeClass("hidden");

	});

	// if Yes radio button is clicked, enable next button
	$(document).on('click', '#radio01allPaid', function(e) {
		$('#nextCalc').prop("disabled", false);
		// set orginal value into field
    	$('#id_allPaid').val(allPaidOrigNum);
    	// hide form field
    	$(".formField").addClass("hidden");

	});

	// enable next and check no if change in input field
	$(document).on('keyup', '#id_allPaid', function(e) {
		// check is value is between 0 and 50000
		var allPaidUpdate = $('#id_allPaid').val();
		if (allPaidUpdate < 0 || allPaidUpdate > 50000 || allPaidUpdate == '') {
			$(".alert").removeClass("hidden");
			$(".warningIcon").removeClass("hidden");
			$(".verifyIcon").addClass("hidden");
			$('#nextCalc').prop("disabled", true);

		} else {
			$(".alert").addClass("hidden");
			$(".warningIcon").addClass("hidden");			
			$(".verifyIcon").removeClass("hidden");
			$('#nextCalc').prop("disabled", false);
		}
	});
	

	// listeners for steppers
	$(document).on('click', '#whenMovedMinus', function(e) {
		// remove disabled next button attribute if there
		$('#nextNeighborhood').prop("disabled", false);
		// get the value of #id_whenMoved
		var whenMoved = $('#id_whenMoved').val();
		// step down based on last value
		switch (whenMoved) {
			case "2010 - 2016":
				$('#id_whenMoved').val('2000 - 2009');
				break;
			case "2000 - 2009":
				$('#id_whenMoved').val('1990 - 1999');
				break;
			case "1990 - 1999":
				$('#id_whenMoved').val('1980 - 1989');
				break;
			case "1980 - 1989":
				$('#id_whenMoved').val('1970 - 1979');
				break;
			case "1970 - 1979":
				$('#id_whenMoved').val('1960 - 1969');
				break;
			case "1960 - 1969":
				$('#id_whenMoved').val('Before 1960');
				break;
			default:
				$('#id_whenMoved').val('2010 - 2016');
				break;
		}

	});	

	$(document).on('click', '#whenMovedPlus', function(e) {
		// remove disabled next button attribute if there
		$('#nextNeighborhood').prop("disabled", false);
		// get the value of #id_whenMoved
		var whenMoved = $('#id_whenMoved').val();
		// step up based on last value
		switch (whenMoved) {
			case "2010 - 2016":
				$('#id_whenMoved').val('Before 1960');
				break;
			case "2000 - 2009":
				$('#id_whenMoved').val('2010 - 2016');
				break;
			case "1990 - 1999":
				$('#id_whenMoved').val('2000 - 2009');
				break;
			case "1980 - 1989":
				$('#id_whenMoved').val('1990 - 1999');
				break;
			case "1970 - 1979":
				$('#id_whenMoved').val('1980 - 1989');
				break;
			case "1960 - 1969":
				$('#id_whenMoved').val('1970 - 1979');
				break;
			case "Before 1960":
				$('#id_whenMoved').val('1960 - 1969');
				break;
			default:
				$('#id_whenMoved').val('Before 1960');
				break;
		}

	});	

	$(document).on('click', '#yearMovedMinus', function(e) {
		// remove disabled next button attribute if there
		$('#nextBedrooms').prop("disabled", false);
		// set radio button yes to checked
		$('#radio01').prop("checked", true);
		// get the value of #id_whenMoved
		var yearMoved = $('#id_exactYearMoved').val();
		if (yearMoved == '') {
			$('#id_exactYearMoved').val(2016);
		} else if (yearMoved == 1900) {
			// don't go below 1900
		} else {
			yearMoved--;
			$('#id_exactYearMoved').val(yearMoved);
		}
	});	

	$(document).on('click', '#yearMovedPlus', function(e) {
		// remove disabled next button attribute if there
		$('#nextBedrooms').prop("disabled", false);
		// set radio button yes to checked
		$('#radio01').prop("checked", true);
		// get the value of #id_whenMoved
		var yearMoved = $('#id_exactYearMoved').val();
		if (yearMoved == '') {
			$('#id_exactYearMoved').val(1900);
		} else if (yearMoved == 2016) {
			// don't go above 2016
		} else {
			yearMoved = parseInt(yearMoved);
			yearMoved++;
			$('#id_exactYearMoved').val(yearMoved);
		}
	});	

	$(document).on('click', '#bedroomsMinus', function(e) {
		// get the value of #id_whenMoved
		var bedrooms = $('#id_bedrooms').val();
		if (bedrooms == 0) {
			// don't go below 0
		} else {
			bedrooms--;
			$('#id_bedrooms').val(bedrooms);
		}
	});	

	$(document).on('click', '#bedroomsPlus', function(e) {
		// get the value of #id_whenMoved
		var bedrooms = $('#id_bedrooms').val();
		if (bedrooms == 20) {
			// don't go above 20
		} else {
			bedrooms++;
			$('#id_bedrooms').val(bedrooms);
		}
	});

	$(document).on('click', '#peopleMinus', function(e) {
		// get the value of #id_whenMoved
		var people = $('#id_rentSplit').val();
		if (people == 0) {
			// don't go below 0
		} else {
			people--;
			$('#id_rentSplit').val(people);
		}
	});

	$(document).on('click', '#peoplePlus', function(e) {
		// get the value of #id_whenMoved
		var people = $('#id_rentSplit').val();
		if (people == 20) {
			// don't go above 20
		} else {
			people++;
			$('#id_rentSplit').val(people);
		}
	});

	// function to check if values are null and create alert if null
	function isNull(value) {
		if (!value) {
			$(".alert").removeClass("hidden");
			return true;
		}
		return false;
	}

});
