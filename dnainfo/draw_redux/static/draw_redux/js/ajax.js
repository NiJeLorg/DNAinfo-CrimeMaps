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
				$('#id_whatNeighborhood option[value=""]').remove();
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
				$('#id_whereMoved option[value=""]').remove();
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







