/**
 * traindemo.js: Quick demo of mouseovers and seat selection for train project
 * Author: NiJeL
 */


$(document).ready(function () {

	// get width 
	var w = $('.col-sm-12').width();
 
 	// bind image
 	var image = $('#chi_redline_subway_A_car');

 	// bind image
	image.mapster({
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
        onClick: click,
	});
	// resize image
    image.mapster('resize', w, 0, 0);

    function click(data) {
        // set form data based on click
        var keys = image.mapster('keys',data.key,true);
        splitKeys = keys.split(',');
        $('#id_positionOne').val(data.key);        
        $('#id_positionOneType').val(splitKeys[1]);

        // hide text in platform, show continue button
        $('.platformText').addClass('hidden');
        $('#formButton').removeClass('hidden');

    }

});
