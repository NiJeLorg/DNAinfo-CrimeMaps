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
				$('#id_whenMoved').prop("disabled", true);
				$('#id_whenMoved').prop("placeholder", "Click the plus/minus buttons to pick a year range.");
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
					$('#s2id_autogen1_search').prop("placeholder", "Neighborhood");
					$('.select2-choice').remove();
					$('#s2id_autogen1').removeClass("select2-offscreen");
					$('#s2id_autogen1').addClass("form-control");
					$('#s2id_autogen1').prop("placeholder", "Neighborhood");
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
		// enable id_whenMoved so we can include it in from submission
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
					$('#id_exactYearMoved').prop("placeholder", "Click the plus/minus buttons to pick an exact year.");
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


ajaxApplication.nextBedrooms = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		// enable id_whenMoved so we can include it in from submission
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
					$('#id_bedrooms').prop("max", 20);
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
					$('#content').html("<h1>Stopping Here</h1>");
					$(".fadein").fadeIn("slow");
		        }
			});
		});

		//trigger form submit
		f.submit();

	}
}







