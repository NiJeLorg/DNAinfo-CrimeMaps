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

    maskAreas.push(positionOneType);

    // set others closely alligned
    if (positionOneType == "side-standing" || positionOneType == "door-standing" || positionOneType == "middle-door-standing" || positionOneType == "end-standing" || positionOneType == "middle-standing") {
        maskAreas.push("asile-seat");
        maskAreas.push("edge-seat");
    }

    if (positionOneType == "asile-seat") {
        maskAreas.push("window-seat");
        maskAreas.push("edge-seat");
    }

    if (positionOneType == "window-seat") {
        maskAreas.push("asile-seat");
        maskAreas.push("edge-seat");
    }

    if (positionOneType == "edge-seat") {
        maskAreas.push("window-seat");
    }

    if (positionOneType == "middle-seat") {
        maskAreas.push("asile-seat");
    }
   

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

    // set selection based on the seat the user selected last round
    image.mapster('set',true,positionOneType);

    // set others closely alligned
    if (positionOneType == "side-standing" || positionOneType == "door-standing" || positionOneType == "middle-door-standing" || positionOneType == "end-standing" || positionOneType == "middle-standing") {
        image.mapster('set',true,"asile-seat");
        image.mapster('set',true,"edge-seat");
    }

    if (positionOneType == "asile-seat") {
        image.mapster('set',true,"window-seat");
        image.mapster('set',true,"edge-seat");
    }

    if (positionOneType == "window-seat") {
        image.mapster('set',true,"asile-seat");
        image.mapster('set',true,"edge-seat");
    }

    if (positionOneType == "edge-seat") {
        image.mapster('set',true,"window-seat");
    }

    if (positionOneType == "middle-seat") {
        image.mapster('set',true,"asile-seat");
    }

    // snapshot image with selected areas
    image.mapster('snapshot');

    function click(data) {
        // set form data based on click
        var keys = image.mapster('keys',data.key,true);
        splitKeys = keys.split(',');
        $('#id_positionTwo').val(data.key);        
        $('#id_positionTwoType').val(splitKeys[1]);

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
        rebind();
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
