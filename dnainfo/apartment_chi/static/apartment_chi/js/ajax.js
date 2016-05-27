/**
 * ajax.js: AJAX queries for apartment
 */

function ajaxApplication() {}


ajaxApplication.firstMove = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/mfa-chi/firstMove/",
			success: function(data){
				$('#content').html(data);
				// remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_whenMoved').addClass("form-control");
				$('#id_whenMoved').val('2010 - Present');
				$('#id_whenMoved').prop("disabled", true);
				// disable plus stepper
				$('.plusStepper').addClass('disabled');
				$(".fadein").fadeIn("slow");
				// scroll to top
				window.scrollTo(0,0);
	        }
		});
	}
}

ajaxApplication.nextNeighborhood = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		// enable id_whenMoved so we can include it in from submission
		$('#id_whenMoved').prop("disabled", false);
		var f = $("#firstMoveForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/mfa-chi/firstMove/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					// remove labels
					$('label').remove();
					// add a form-control class to the input, disabled attribute and placeholder text
					$('#id_whereMoved').addClass("form-control");
					var selected = $('#id_whereMoved option:selected').val();
					if (!selected) {
						$('.select2-chosen').text("Neighborhood");						
					}

					$('#id_whereMoved option[value=""]').remove();
					//$('.select2-input').prop("placeholder", "Neighborhood");
					//$('.select2-choice').addClass('hidden');
					//$('.select2-focusser').removeClass("select2-offscreen");
					//$('.select2-focusser').addClass("form-control");
					//$('.select2-focusser').prop("placeholder", "Neighborhood");
					$('#id_iDontSeeMyNeighborhood').addClass("hidden");
					$(".fadein").fadeIn("slow");
					// scroll to top
					window.scrollTo(0,0);
		        }
			});
		});

		//trigger form submit
		f.submit();

	}
}


ajaxApplication.nextLocation = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		// enable id_whenMoved so we can include it in from submission
		var f = $("#whatNeighborhoodForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/mfa-chi/whatNeighborhood/"+ objectID +"/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					$(".fadein").fadeIn("slow");
					// scroll to top
					window.scrollTo(0,0);
		        }
			});
		});

		//trigger form submit
		f.submit();

	}
}


ajaxApplication.nextYearMoved = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		var f = $("#exactLocationForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/mfa-chi/exactLocation/"+ objectID +"/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					// remove label
					$("label[for='id_exactYearMoved']").remove();
					// add a form-control class to the input, disabled attribute and placeholder text
					$('#id_exactYearMoved').addClass("form-control");
					$('#id_exactYearMoved').val('');
					$('#id_exactYearMoved').prop("disabled", true);
					$('#id_exactYearMoved').prop("min", 1900);
					$('#id_exactYearMoved').prop("max", 2016);
					$(".fadein").fadeIn("slow");
					// scroll to top
					window.scrollTo(0,0);
		        }
			});
		});

		//trigger form submit
		f.submit();

	}
}


ajaxApplication.nextBedrooms = function (checked) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		if (checked) {
			$('#id_exactYearMoved').val(0);			
		}
		// enable id_whenMoved so we can include it in from submission
		$('#id_exactYearMoved').prop("disabled", false);
		var f = $("#yearMovedForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/mfa-chi/yearMoved/"+ objectID +"/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					// remove labels
					$('label').remove();
					// add a form-control class to the input, disabled attribute and placeholder text
					$('#id_bedrooms').addClass("form-control");
					$('#id_bedrooms').prop("disabled", true);
					$('#id_bedrooms').prop("type", "text");
					$('#id_bedrooms').val("0");
					$('.minusStepper').addClass('disabled');
					$(".fadein").fadeIn("slow");
					// scroll to top
					window.scrollTo(0,0);
		        }
			});
		});

		//trigger form submit
		f.submit();

	}
}


ajaxApplication.nextRentSplit = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		// enable id_bedrooms so we can include it in from submission
		$('#id_bedrooms').prop("disabled", false);
		var f = $("#bedroomsForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/mfa-chi/bedrooms/"+ objectID +"/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					// remove labels
					$('label').remove();
					// add a form-control class to the input, disabled attribute and placeholder text
					$('#id_rentSplit').addClass("form-control");
					$('#id_rentSplit').prop("disabled", true);
					$('#id_rentSplit').prop("type", "text");
					$('#id_rentSplit').val("1");
					$('.minusStepper').addClass('disabled');
					$(".fadein").fadeIn("slow");
					// scroll to top
					window.scrollTo(0,0);
		        }
			});
		});

		//trigger form submit
		f.submit();

	}
}

ajaxApplication.nextiPaid = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		// enable id_rentSplit so we can include it in from submission
		$('#id_rentSplit').prop("disabled", false);
		var f = $("#rentSplitForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/mfa-chi/rentSplit/"+ objectID +"/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					//remove labels
					$('label').remove();
					// add a form-control class to the input, disabled attribute and placeholder text
					$('#id_iPaid').addClass("form-control");
					$('#id_iPaid').val('');
					$('#id_iPaid').prop("min", 0);
					$('#id_iPaid').prop("max", 50000);
					$(".fadein").fadeIn("slow");
					// scroll to top
					window.scrollTo(0,0);
		        }
			});
		});

		//trigger form submit
		f.submit();

	}
}

ajaxApplication.nextAllPaid = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		var f = $("#iPaidForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/mfa-chi/iPaid/"+ objectID +"/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					//remove labels
					$("label[for='id_allPaid']").remove();
					// add a form-control class to the input, disabled attribute and placeholder text
					$('#id_allPaid').addClass("form-control");
					$('#id_allPaid').prop("min", 0);
					$('#id_allPaid').prop("max", 50000);
					$(".fadein").fadeIn("slow");
					// scroll to top
					window.scrollTo(0,0);
		        }
			});
		});

		//trigger form submit
		f.submit();

	}
}


ajaxApplication.nextCalc = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		var f = $("#allPaidForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/mfa-chi/allPaid/"+ objectID +"/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					$(".fadein").fadeIn("slow");
					// scroll to top
					window.scrollTo(0,0);
		        }
			});
		});

		//trigger form submit
		f.submit();

	}
}

ajaxApplication.nextResults = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/mfa-chi/end/"+id+"/",
			success: function(data){
				$('#content').html(data);
				$(".fadein").fadeIn("slow");
				// scroll to top
				window.scrollTo(0,0);
	        }
		});
	}
}




// back buttons
ajaxApplication.backIntro = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/mfa-chi/",
			success: function(data){
				$('#content').html(data);
				$(".fadein").fadeIn("slow");
				// scroll to top
				window.scrollTo(0,0);
	        }
		});
	}
}

ajaxApplication.backFirstMove = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/mfa-chi/firstMove/"+id+"/",
			success: function(data){
				$('#content').html(data);
				// remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_whenMoved').addClass("form-control");
				$('#id_whenMoved').prop("disabled", true);
				if ($('#id_whenMoved').val() == "2010 - Present") {
					$('.plusStepper').addClass('disabled');
				} else if ($('#id_whenMoved').val() == "Before 1960") {
					$('.minusStepper').addClass('disabled');
				}
				$(".fadein").fadeIn("slow");
				// scroll to top
				window.scrollTo(0,0);
	        }
		});
	}
}

ajaxApplication.backNeighborhood = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/mfa-chi/whatNeighborhood/"+id+"/",
			success: function(data){
		 		$('#content').html(data);
				// remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_whereMoved').addClass("form-control");
				var selected = $('#id_whereMoved option:selected').val();
				if (!selected) {
					$('.select2-chosen').text("Neighborhood");						
				}

				$('#id_whereMoved option[value=""]').remove();
				//$('.select2-input').prop("placeholder", "Neighborhood");
				//$('.select2-choice').addClass('hidden');
				//$('.select2-focusser').removeClass("select2-offscreen");
				//$('.select2-focusser').addClass("form-control");
				//$('.select2-focusser').prop("placeholder", "Neighborhood");
				$('#id_iDontSeeMyNeighborhood').addClass("hidden");
				$(".fadein").fadeIn("slow");    
				// scroll to top
				window.scrollTo(0,0);
	        }
		});
	}
}

ajaxApplication.backLocation = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/mfa-chi/exactLocation/"+id+"/",
			success: function(data){
				$('#content').html(data);
				$(".fadein").fadeIn("slow");
				// scroll to top
				window.scrollTo(0,0);
	        }
		});
	}
}

ajaxApplication.backYearMoved = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/mfa-chi/yearMoved/"+id+"/",
			success: function(data){
				$('#content').html(data);
				// remove label
				$("label[for='id_exactYearMoved']").remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_exactYearMoved').addClass("form-control");
				$('#id_exactYearMoved').prop("disabled", true);
				$('#id_exactYearMoved').prop("min", 1900);
				$('#id_exactYearMoved').prop("max", 2016);
				$('#nextBedrooms').prop("disabled", false);
				if ($('#id_exactYearMoved').val() == 0) {
					$('#radio02').prop("checked", true);
					$('#id_exactYearMoved').val('');
				} else {
					$('#radio01').prop("checked", true);			
				}
				$(".fadein").fadeIn("slow");
				// scroll to top
				window.scrollTo(0,0);
	        }
		});
	}
}

ajaxApplication.backBedrooms = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/mfa-chi/bedrooms/"+id+"/",
			success: function(data){
				$('#content').html(data);
				// remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_bedrooms').addClass("form-control");
				$('#id_bedrooms').prop("disabled", true);
				$('#id_bedrooms').prop("type", "text");
				if ($('#id_bedrooms').val() == 5) {
					$('#id_bedrooms').val("5 or more");
					$('.plusStepper').addClass('disabled');
				} else if ($('#id_bedrooms').val() == 0) {
					$('.minusStepper').addClass('disabled');
				}
				$(".fadein").fadeIn("slow");
				// scroll to top
				window.scrollTo(0,0);
	        }
		});
	}
}

ajaxApplication.backRentSplit = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/mfa-chi/rentSplit/"+id+"/",
			success: function(data){
				$('#content').html(data);
				// remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_rentSplit').addClass("form-control");
				$('#id_rentSplit').prop("disabled", true);
				$('#id_rentSplit').prop("type", "text");
				if ($('#id_rentSplit').val() == 20) {
					$('#id_rentSplit').val("20 or more");
					$('.plusStepper').addClass('disabled');
				} else if ($('#id_rentSplit').val() == 1) {
					$('.minusStepper').addClass('disabled');
				}
				$(".fadein").fadeIn("slow");
				// scroll to top
				window.scrollTo(0,0);
	        }
		});
	}
}

ajaxApplication.backiPaid = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/mfa-chi/iPaid/"+id+"/",
			success: function(data){
				$('#content').html(data);
				//remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_iPaid').addClass("form-control");
				$('#id_iPaid').prop("min", 0);
				$('#id_iPaid').prop("max", 50000);
				var value = $('#id_iPaid').val();
				value = parseFloat(value).toFixed(2);
				$('#id_iPaid').val(value);
				$('#nextAllPaid').prop("disabled", false);
				$(".fadein").fadeIn("slow");
				// scroll to top
				window.scrollTo(0,0);
	        }
		});
	}
}







