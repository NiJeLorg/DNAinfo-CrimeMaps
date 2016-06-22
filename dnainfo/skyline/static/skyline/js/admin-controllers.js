/**
 * admin-controllers.js: javascript controllers for all pages
 */

$( document ).ready(function() {

	// fade in main image and search bar
	$(".fadein").fadeIn("slow");


	// listeners for all forms
	$(document).on('click', '#reject', function(e) {
		e.preventDefault();
		$("#id_approved").val(3);
		$(".fadein").fadeOut("fast");
		ajaxApplication.submitAdminForm();
	});

	$(document).on('click', '#approve', function(e) {
		e.preventDefault();
		$("#id_approved").val(2);
		$(".fadein").fadeOut("fast");
		ajaxApplication.submitAdminForm();
	});


});
