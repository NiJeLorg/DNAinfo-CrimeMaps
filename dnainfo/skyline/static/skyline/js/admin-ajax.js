/**
 * ajax.js: AJAX queries for apartment
 */

function ajaxApplication() {}


ajaxApplication.submitAdminForm = function () {
	var timeout = window.setTimeout(slow, 200);
	function slow() {
		osmApplication.destroy();
		var f = $("#adminForm");
		//create on submit listener
		f.on('submit', function(e) {
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/skyline/admin/next/",
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

