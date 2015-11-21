/**
 * traindemo.js: Quick demo of mouseovers and seat selection for train project
 * Author: NiJeL
 */


$(document).ready(function () {

	// get width 
	var w = $('body').width();

    if (w <= 1200) {
        var elem = document.getElementById("trainLineImage"); 
        var elemWidth = elem.scrollWidth;
        var elemVisibleWidth = elem.offsetWidth;
        elem.scrollLeft = (elemWidth - elemVisibleWidth) / 2;
    }


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

    // select a seat if user came back and alredy picked one
    if (seatSelectedAlready > 0) {
        console.log("hello!");
        image.mapster('set',true,seatSelectedAlready);
        // show continue button
        $('#formButton').removeClass('disabled');
    }


    function click(data) {
        // set form data based on click
        var keys = image.mapster('keys',data.key,true);
        splitKeys = keys.split(',');
        $('#id_positionOne').val(data.key);        
        $('#id_positionOneType').val(splitKeys[1]);

        // show continue button
        $('#formButton').removeClass('disabled');

    }

});
