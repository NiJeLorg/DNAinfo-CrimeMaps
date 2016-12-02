/**
 * ajax.js: AJAX queries for apartment
 */

function ajaxApplication() {}


ajaxApplication.nextNeighborhood = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/skyline/chi/whatNeighborhood/",
			success: function(data){
				$('#content').html(data);
				// remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_whereBuilding').addClass("form-control");
				var selected = $('#id_whereBuilding option:selected').val();
				$('#id_whereBuilding option[value=""]').remove();
				$(".fadein").fadeIn("slow");
				// scroll to top
				$('#content').scrollTop(0);
				// initialize select 2
				$('.django-select2').djangoSelect2();
				if (!selected) {
					$('.select2-selection__placeholder').text("Neighborhood");						
				}
	        }
		});
	}
}


ajaxApplication.nextHeight = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		var f = $("#whatNeighborhoodForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/skyline/chi/whatNeighborhood/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					$('#id_buildingStories').val(1);
					$('#id_buildingStories').prop('min', 1);
					$('#id_buildingStories').prop('max', 150);
					$('#div_id_buildingImage').addClass('hidden');
					$('#div_id_buildingDoc').addClass('hidden');
					$('#div_id_buildingURL').addClass('hidden');
					$(".fadein").fadeIn("slow");
					// scroll to top
					$('#content').scrollTop(0);

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
		// enable id_buildingStories so we can include it in from submission
		$('#id_buildingStories').prop("disabled", false);

		var f = $("#buildingHeightForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/skyline/chi/buildingHeight/"+ objectID +"/",
				data: f.serialize(),
				success: function(data){
					$('#content').html(data);
					$(".fadein").fadeIn("slow");
					// scroll to top
					$('#content').scrollTop(0);

		        }
			});
		});

		//trigger form submit
		f.submit();

	}
}


ajaxApplication.nextEnd = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		// enable id_buildingStories so we can include it in from submission
		$('#id_buildingFootprint').prop("disabled", false);

		var f = $("#exactLocationForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/skyline/chi/exactLocation/"+ objectID +"/",
				data: f.serialize(),
				success: function(data){
					window.location.href = "/skyline/chi/return_result/"+ objectID +"/";
		        }
			});
		});

		//trigger form submit
		f.submit();

	}
}




// back buttons
ajaxApplication.backIntro = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/skyline/chi/",
			success: function(data){
				$('#content').html(data);
				$(".fadein").fadeIn("slow");
				// scroll to top
				$('#content').scrollTop(0);
	        }
		});
	}
}

ajaxApplication.backNeighborhood = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/skyline/chi/whatNeighborhood/"+id+"/",
			success: function(data){
				$('#content').html(data);
				// remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_whereBuilding').addClass("form-control");
				var selected = $('#id_whereBuilding option:selected').val();
				$('#id_whereBuilding option[value=""]').remove();
				$('#id_iDontSeeMyNeighborhood').addClass("hidden");
				$(".fadein").fadeIn("slow");
				// scroll to top
				$('#content').scrollTop(0);
				// initialize select 2
				$('.django-select2').djangoSelect2();
				if (!selected) {
					$('.select2-selection__placeholder').text("Neighborhood");						
				}
	        }
		});
	}
}

ajaxApplication.backHeight = function (id) {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/skyline/chi/buildingHeight/"+id+"/",
			success: function(data){
				mapApplication.destroy();
				$('#content').html(data);
				$('#id_buildingStories').prop('min', 1);
				$('#id_buildingStories').prop('max', 150);
				$(".fadein").fadeIn("slow");
				// scroll to top
				$('#content').scrollTop(0);
	        }
		});
	}
}







