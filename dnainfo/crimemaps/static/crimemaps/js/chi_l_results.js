/**
 * chi_l_half_full_car.js
 * Author: NiJeL
 */


$(document).ready(function () {

	// get width 
	var w = $('.col-sm-12').width();
 
 	// bind image
 	var image = $('#chi_redline_subway_A_car');
   
 	// bind image and set initial selections
	image.mapster({
        mapKey: 'data-key',
        render_select: {
            altImage: '/static/crimemaps/css/images/chi_redline_subway_A_car_where_you_sit.png',
            fillOpacity: 1
        }
	});

	// resize image
    image.mapster('resize', w, 0, 0);

    // select seats from the last two rounds
    image.mapster('set',true,positionOne);
    image.mapster('set',true,positionTwo);
    image.mapster('set',true,positionThree);

    // snapshot image with selected areas
    image.mapster('unbind',true);


});
