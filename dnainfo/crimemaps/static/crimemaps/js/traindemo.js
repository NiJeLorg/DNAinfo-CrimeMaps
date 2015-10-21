/**
 * traindemo.js: Quick demo of mouseovers and seat selection for train project
 * Author: NiJeL
 */


$(document).ready(function () {

	// get width 
	var w = $('.col-md-12').width();
 
 	// bind image
 	var image = $('#chi_redline_subway_A_car');

	image.mapster({
		fill: true,
        fillColor: 'f08b9d',
        fillOpacity: 0.5,
        singleSelect: true,
		mapKey: 'data-key',
		render_select: {
            altImage: '/static/crimemaps/css/images/chi_redline_subway_A_car_where_you_sit.png',
            fillOpacity: 1
        }

	});

	// resize image
    image.mapster('resize', w, 0, 0);


});
