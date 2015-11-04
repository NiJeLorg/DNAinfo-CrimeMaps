/**
 * chi_l_half_full_car.js
 * Author: NiJeL
 */


$(document).ready(function () {

	// get width 
	var w = $('.col-sm-12').width();
 
 	// bind image
 	var image = $('#chi_redline_subway_A_car');

    // catch keys
    var maskAreas = [];
    var maskKeys = [];

    // add chosen areas to mask keys
    maskKeys.push({key: positionOne, isMask: true});
    maskKeys.push({key: positionTwo, isMask: true});

    // mask all seating areas
    maskAreas.push("asile-seat");
    maskAreas.push("edge-seat");
    maskAreas.push("window-seat");
    maskAreas.push("middle-seat");
   
 	// bind image and set initial selections
	image.mapster({
        mapKey: 'data-key',
        render_select: {
            altImage: '/static/crimemaps/css/images/chi_redline_subway_A_car_full_standing.png',
            fillOpacity: 1
        },
        onConfigured: getKeys
	});

	// resize image
    image.mapster('resize', w, 0, 0);

    // select seats from the last two rounds
    image.mapster('set',true,positionOne);
    image.mapster('set',true,positionTwo);

    // select all seats
    image.mapster('set',true,"asile-seat");
    image.mapster('set',true,"edge-seat");
    image.mapster('set',true,"window-seat");
    image.mapster('set',true,"middle-seat");

    // snapshot image with selected areas
    image.mapster('snapshot');

    function click(data) {
        // set form data based on click
        var keys = image.mapster('keys',data.key,true);
        splitKeys = keys.split(',');
        $('#id_positionThree').val(data.key);        
        $('#id_positionThreeType').val(splitKeys[1]);

        // hide text in platform, show continue button
        $('.platformText').addClass('hidden');
        $('#formButton').removeClass('hidden');

    }

    function getKeys() {
        console.log(maskAreas);
        $.each(maskAreas, function( i, d ) {
            var keys = image.mapster('keys',d,true);
            var keysArray = keys.split(',');
            $.each(keysArray, function( j, f ) {
                maskKeys.push({key: f, isMask: true});
            });           
        });
        setTimeout(function(){rebind()},100);
        
    }

    function rebind() {

        image.mapster('rebind', {
            singleSelect: true,
            mapKey: 'data-key',
            render_select: {
                altImage: '/static/crimemaps/css/images/chi_redline_subway_A_car_where_you_sit.png',
                fillOpacity: 1
            },
            render_highlight: {
                altImage: '/static/crimemaps/css/images/chi_redline_subway_A_car_where_you_sit.png',
                fillOpacity: 0.5
            },
            onClick: click,
            areas: maskKeys
        });       
    }

});
