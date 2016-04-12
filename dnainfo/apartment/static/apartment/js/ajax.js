/**
 * ajax.js: AJAX queries for apartment
 */

function ajaxApplication() {}


ajaxApplication.firstMove = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/firstMove/",
			success: function(data){
				$('#content').html(data);
				// remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_whenMoved').addClass("form-control");
				$('#id_whenMoved').val('2010 - Present');
				$('#id_whenMoved').prop("disabled", true);
				$(".fadein").fadeIn("slow");
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
				url: "/firstMove/",
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
				url: "/whatNeighborhood/"+ objectID +"/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					$(".fadein").fadeIn("slow");
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
				url: "/exactLocation/"+ objectID +"/",
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
				url: "/yearMoved/"+ objectID +"/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					// remove labels
					$('label').remove();
					// add a form-control class to the input, disabled attribute and placeholder text
					$('#id_bedrooms').addClass("form-control");
					$('#id_bedrooms').prop("disabled", true);
					$('#id_bedrooms').val(0);
					$('#id_bedrooms').prop("min", 0);
					$('#id_bedrooms').prop("max", 5);
					$(".fadein").fadeIn("slow");
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
				url: "/bedrooms/"+ objectID +"/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					// remove labels
					$('label').remove();
					// add a form-control class to the input, disabled attribute and placeholder text
					$('#id_rentSplit').addClass("form-control");
					$('#id_rentSplit').prop("disabled", true);
					$('#id_rentSplit').val(1);
					$('#id_rentSplit').prop("min", 1);
					$('#id_rentSplit').prop("max", 20);
					$(".fadein").fadeIn("slow");
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
				url: "/rentSplit/"+ objectID +"/",
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
				url: "/iPaid/"+ objectID +"/",
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
				url: "/allPaid/"+ objectID +"/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					$(".fadein").fadeIn("slow");
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
			url: "/my-first-apartment/end/"+id+"/",
			success: function(data){
				$('#content').html(data);
				$(".fadein").fadeIn("slow");
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
			url: "/my-first-apartment/",
			success: function(data){
				$('#content').html(data);
				$(".fadein").fadeIn("slow");
	        }
		});
	}
}

ajaxApplication.backFirstMove = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/firstMove/"+id+"/",
			success: function(data){
				$('#content').html(data);
				// remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_whenMoved').addClass("form-control");
				$('#id_whenMoved').prop("disabled", true);
				$(".fadein").fadeIn("slow");
	        }
		});
	}
}

ajaxApplication.backNeighborhood = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/whatNeighborhood/"+id+"/",
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
	        }
		});
	}
}

ajaxApplication.backLocation = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/exactLocation/"+id+"/",
			success: function(data){
				$('#content').html(data);
				$(".fadein").fadeIn("slow");
	        }
		});
	}
}

ajaxApplication.backYearMoved = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/yearMoved/"+id+"/",
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
	        }
		});
	}
}

ajaxApplication.backBedrooms = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/bedrooms/"+id+"/",
			success: function(data){
				$('#content').html(data);
				// remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_bedrooms').addClass("form-control");
				$('#id_bedrooms').prop("disabled", true);
				$('#id_bedrooms').prop("min", 0);
				$('#id_bedrooms').prop("max", 20);
				$(".fadein").fadeIn("slow");
	        }
		});
	}
}

ajaxApplication.backRentSplit = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/rentSplit/"+id+"/",
			success: function(data){
				$('#content').html(data);
				// remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_rentSplit').addClass("form-control");
				$('#id_rentSplit').prop("disabled", true);
				$('#id_rentSplit').prop("min", 1);
				$('#id_rentSplit').prop("max", 20);
				$(".fadein").fadeIn("slow");
	        }
		});
	}
}

ajaxApplication.backiPaid = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/iPaid/"+id+"/",
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
	        }
		});
	}
}







