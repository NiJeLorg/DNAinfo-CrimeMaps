/**
 * chi_l_full_car.js
 * Author: NiJeL
 */


$(document).ready(function () {

    // add slide in class to train car when dom is ready
    $(".trainLineImage").addClass("slide-in");

    // get width 
    var w = $('body').width();

    // add scrolling after train pulls in
    if (w <= 1200) {
        setTimeout(function(){
            $(".trainLineImage").addClass("imageOverflow");
            // enable double scroll on train
            $('.div20pxtall').addClass('hidden');
            $('.trainLineImage').doubleScroll();
        },1700);
    }


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

    // add chosen areas to mask keys
    //maskKeys.push({key: positionOne, isMask: true});
    //maskKeys.push({key: positionTwo, isMask: true});

    // mask all seating areas
    if (carType == "GPRYP") {
        maskAreas.push("asile-seat");
        maskAreas.push("edge-seat");
        maskAreas.push("window-seat");
        maskAreas.push("middle-seat");
    } else if (carType == "BO") {
        maskAreas.push("1-seat");
        maskAreas.push("2-seat");
        maskAreas.push("3-seat");
        maskAreas.push("4-seat");
        maskAreas.push("5-seat");
        maskAreas.push("6-seat");
        maskAreas.push("7-seat");
        maskAreas.push("8-seat");
        maskAreas.push("9-seat");
    } else {
        maskAreas.push("1-seat");
        maskAreas.push("2-seat");
        maskAreas.push("3-seat");
        maskAreas.push("4-seat");
        maskAreas.push("5-seat");
        maskAreas.push("6-seat");
        maskAreas.push("7-seat");
        maskAreas.push("8-seat");
        maskAreas.push("9-seat");
        maskAreas.push("10-seat");

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

    // select seats from the last two rounds
    //image.mapster('set',true,positionOne);
    //image.mapster('set',true,positionTwo);

    // select all seats
    if (carType == "GPRYP") {
        image.mapster('set',true,"asile-seat");
        image.mapster('set',true,"edge-seat");
        image.mapster('set',true,"window-seat");
        image.mapster('set',true,"middle-seat");
    } else if (carType == "BO") {
        image.mapster('set',true,"1-seat");
        image.mapster('set',true,"2-seat");
        image.mapster('set',true,"3-seat");
        image.mapster('set',true,"4-seat");
        image.mapster('set',true,"5-seat");
        image.mapster('set',true,"6-seat");
        image.mapster('set',true,"7-seat");
        image.mapster('set',true,"8-seat");
        image.mapster('set',true,"9-seat");
    } else {
        image.mapster('set',true,"1-seat");
        image.mapster('set',true,"2-seat");
        image.mapster('set',true,"3-seat");
        image.mapster('set',true,"4-seat");
        image.mapster('set',true,"5-seat");
        image.mapster('set',true,"6-seat");
        image.mapster('set',true,"7-seat");
        image.mapster('set',true,"8-seat");
        image.mapster('set',true,"9-seat");
        image.mapster('set',true,"10-seat");
    }
    // snapshot image with selected areas
    image.mapster('snapshot');

    function click(data) {
        // set form data based on click
        var keys = image.mapster('keys',data.key,true);
        splitKeys = keys.split(',');
        $('#id_positionThree').val(data.key);        
        $('#id_positionThreeType').val(splitKeys[1]);

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

        if (Modernizr.touchevents || Modernizr.pointerevents) {
            // if we detect touch or pointer events, disable hover
            var highLight = false;
            var renderHighlight = {};    
        } else {
            var highLight = true;
            var renderHighlight = { altImage: altImage, fillOpacity: 0.5 };
        }

        image.mapster('rebind', {
            singleSelect: true,
            mapKey: 'data-key',
            render_select: {
                altImage: altImage,
                fillOpacity: 1
            },
            highLight: highLight,
            render_highlight: renderHighlight,
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
