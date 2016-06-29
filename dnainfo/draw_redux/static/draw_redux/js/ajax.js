/**
 * ajax.js: AJAX queries for apartment
 */

function ajaxApplication() {}


ajaxApplication.nextNeighborhood = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/in-or-out/nyc/whatNeighborhood/",
			success: function(data){
				$('#content').html(data);
				// remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_whatNeighborhood').addClass("form-control");
				var selected = $('#id_whatNeighborhood option:selected').val();
				if (!selected) {
					$('.select2-chosen').text("Neighborhood");						
				}

				$('#id_whatNeighborhood option[value=""]').remove();
				$(".fadein").fadeIn("slow");
				// scroll to top
				$('#content').scrollTop(0);		
	        }
		});
	}
}


ajaxApplication.nextPick = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		var f = $("#whatNeighborhoodForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/in-or-out/nyc/whatNeighborhood/",
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

		var f = $("#pickForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/in-or-out/nyc/pick/"+ objectID +"/",
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




// back buttons
ajaxApplication.backIntro = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		$.ajax({
			type: "GET",
			url: "/in-or-out/nyc/",
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
			url: "/in-or-out/nyc/whatNeighborhood/"+objectID+"/",
			success: function(data){
		 		$('#content').html(data);
				// remove labels
				$('label').remove();
				// add a form-control class to the input, disabled attribute and placeholder text
				$('#id_whatNeighborhood').addClass("form-control");
				var selected = $('#id_whatNeighborhood option:selected').val();
				if (!selected) {
					$('.select2-chosen').text("Neighborhood");						
				}
				$('#id_whereMoved option[value=""]').remove();
				$(".fadein").fadeIn("slow");    
				// scroll to top
				$('#content').scrollTop(0);
	        }
		});
	}
}







