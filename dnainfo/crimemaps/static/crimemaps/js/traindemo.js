/**
 * traindemo.js: Quick demo of mouseovers and seat selection for train project
 * Author: NiJeL
 */


$(document).ready(function () {

	// get width 
	var w = $('.col-md-12').width();
 
 	// bind image
 	var image = $('#chi_redline_subway_A_car');

 	// bind image and set initial selections
	image.mapster({
        
		mapKey: 'data-key',
		render_select: {
            altImage: '/static/crimemaps/css/images/chi_redline_subway_A_car_full.png',
            fillOpacity: 1
        },
	});
	// resize image
    image.mapster('resize', w, 0, 0);

    // set select some
    image.mapster('set',true,'door-seat');

    // snapshot image with selected areas
    image.mapster('snapshot');

    // rebind image with new options
    image.mapster('rebind', {
    	singleSelect: true,
		mapKey: 'data-key',
		render_select: {
            altImage: '/static/crimemaps/css/images/chi_redline_subway_A_car_where_you_sit.png',
            fillOpacity: 1
        },
        render_highlight : {
        	altImage: '/static/crimemaps/css/images/chi_redline_subway_A_car_where_you_sit.png',
            fillOpacity: 0.5
        },
        areas: [
        	{
	          key: '46',
	          isMask: true
	      	},
        	{
	          key: '47',
	          isMask: true
	      	},
        	{
	          key: '48',
	          isMask: true
	      	},
        ]
    });




});
