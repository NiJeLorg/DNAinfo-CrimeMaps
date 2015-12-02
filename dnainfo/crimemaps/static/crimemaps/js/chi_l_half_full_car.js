/**
 * chi_l_half_full_car.js
 * Author: NiJeL
 */


$(document).ready(function () {

    // get width 
    var w = $('body').width();

    /*
    if (w <= 1200) {
        var elem = document.getElementById("trainLineImage"); 
        var elemWidth = elem.scrollWidth;
        var elemVisibleWidth = elem.offsetWidth;
        elem.scrollLeft = (elemWidth - elemVisibleWidth) / 2;
    }
    */

    // catch keys
    var maskAreas = [];
    var maskKeys = [];

    // set others closely alligned
    if (positionOneType == "side-standing" || positionOneType == "door-standing" || positionOneType == "middle-door-standing" || positionOneType == "end-standing" || positionOneType == "middle-standing") {
        maskAreas.push("asile-seat");
        maskAreas.push("edge-seat");
    } else {
        maskAreas.push(positionOneType);
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
            altImage: altImageFull,
            fillOpacity: 1
        },
        onConfigured: getKeys
	});


    // set others closely alligned
    if (positionOneType == "side-standing" || positionOneType == "door-standing" || positionOneType == "middle-door-standing" || positionOneType == "end-standing" || positionOneType == "middle-standing") {
        image.mapster('set',true,"asile-seat");
        image.mapster('set',true,"edge-seat");
    } else {
        // set selection based on the seat the user selected last round
        image.mapster('set',true,positionOneType);
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
        $('#formButton').removeClass('disabled');

    }

    function getKeys() {
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
                altImage: altImage,
                fillOpacity: 1
            },
            render_highlight: {
                altImage: altImage,
                fillOpacity: 0.5
            },
            onClick: click,
            areas: maskKeys
        });  

        // select a seat if user came back and alredy picked one
        if (seatSelectedAlready > 0) {
            image.mapster('set',true,seatSelectedAlready);
            // show continue button
            $('#formButton').removeClass('disabled');
        }

    }

    // add scrolling after train pulls in
    setTimeout(function(){
        $(".trainLineImage").addClass("imageOverflow");
    },1200);

    // have train slide out then submit form
    $('#formButton').click(function(event){
        event.preventDefault();
        $(".trainLineImage").removeClass("imageOverflow");
        $(".trainLineImage").addClass("slide-out");
        // submit the form
        setTimeout(function(){
            $( "#target" ).submit();
        },1000);        
    });


});
