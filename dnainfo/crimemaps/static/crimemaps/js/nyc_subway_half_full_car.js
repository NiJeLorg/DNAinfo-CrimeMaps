/**
 * nyc_subway_half_full_car.js
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

    // set masks and selected seats by train car type
    if (carType == "C_Type") {
        // set others closely alligned
        if (positionOneType == "2-middle" || positionOneType == "1-middle" || positionOneType == "2-door" || positionOneType == "1-door" || positionOneType == "2-end" || positionOneType == "1-end") {
            maskAreas.push("1-seat");
            maskAreas.push("3-seat");
            maskAreas.push(positionOneType);
        } else {
            maskAreas.push(positionOneType);
        }

        if (positionOneType == "1-seat") {
            maskAreas.push("3-seat");
        }

        if (positionOneType == "2-seat") {
            maskAreas.push("1-seat");
        }

        if (positionOneType == "3-seat") {
            maskAreas.push("2-seat");
        }

        if (positionOneType == "4-seat") {
            maskAreas.push("1-seat");
        }

    } else if (carType == "D_Type") {

        // set others closely alligned
        if (positionOneType == "3-middle" || positionOneType == "2-middle" || positionOneType == "1-middle" || positionOneType == "2-door" || positionOneType == "1-door" || positionOneType == "2-end" || positionOneType == "1-end") {
            maskAreas.push("5-seat");
            maskAreas.push("1-seat");
            maskAreas.push(positionOneType);
        } else {
            // set selection based on the seat the user selected last round
            maskAreas.push(positionOneType);
        }

        if (positionOneType == "1-seat") {
            maskAreas.push("2-seat");
            maskAreas.push("3-seat");
        }

        if (positionOneType == "2-seat") {
            maskAreas.push("1-seat");
            maskAreas.push("3-seat");
        }

        if (positionOneType == "3-seat") {
            maskAreas.push("1-seat");
            maskAreas.push("2-seat");
        }

        if (positionOneType == "4-seat") {
            maskAreas.push("2-seat");
            maskAreas.push("3-seat");
        }

        if (positionOneType == "5-seat") {
            maskAreas.push("2-seat");
            maskAreas.push("4-seat");
        }

    } else {

        // set others closely alligned
        if (positionOneType == "2-middle" || positionOneType == "1-middle" || positionOneType == "2-door" || positionOneType == "1-door" || positionOneType == "2-end" || positionOneType == "1-end" || positionOneType == "2-doormiddle" || positionOneType == "1-doormiddle") {
            maskAreas.push("4-seat");
            maskAreas.push("2-seat");
            maskAreas.push(positionOneType);
        } else {
            // set selection based on the seat the user selected last round
            maskAreas.push(positionOneType);
        }

        if (positionOneType == "1-seat") {
            maskAreas.push("3-seat");
        }

        if (positionOneType == "2-seat") {
            maskAreas.push("4-seat");
        }

        if (positionOneType == "3-seat") {
            maskAreas.push("1-seat");
        }

        if (positionOneType == "4-seat") {
            maskAreas.push("2-seat");
        }


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


    if (carType == "C_Type") {

        // set others closely alligned
        if (positionOneType == "2-middle" || positionOneType == "1-middle" || positionOneType == "2-door" || positionOneType == "1-door" || positionOneType == "2-end" || positionOneType == "1-end") {
            image.mapster('set',true,"1-seat");
            image.mapster('set',true,"3-seat");
            image.mapster('set',true,positionOneType);
        } else {
            image.mapster('set',true,positionOneType);
        }

        if (positionOneType == "1-seat") {
            image.mapster('set',true,"3-seat");
        }

        if (positionOneType == "2-seat") {
            image.mapster('set',true,"1-seat");
        }

        if (positionOneType == "3-seat") {
            image.mapster('set',true,"2-seat");
        }

        if (positionOneType == "4-seat") {
            image.mapster('set',true,"1-seat");
        }

    } else if (carType == "D_Type") {

        // set others closely alligned
        if (positionOneType == "3-middle" || positionOneType == "2-middle" || positionOneType == "1-middle" || positionOneType == "2-door" || positionOneType == "1-door" || positionOneType == "2-end" || positionOneType == "1-end") {
            image.mapster('set',true,"5-seat");
            image.mapster('set',true,"1-seat");
            image.mapster('set',true,positionOneType);
        } else {
            // set selection based on the seat the user selected last round
            image.mapster('set',true,positionOneType);
        }

        if (positionOneType == "1-seat") {
            image.mapster('set',true,"2-seat");
            image.mapster('set',true,"3-seat");
        }

        if (positionOneType == "2-seat") {
            image.mapster('set',true,"1-seat");
            image.mapster('set',true,"3-seat");
        }

        if (positionOneType == "3-seat") {
            image.mapster('set',true,"1-seat");
            image.mapster('set',true,"2-seat");
        }

        if (positionOneType == "4-seat") {
            image.mapster('set',true,"2-seat");
            image.mapster('set',true,"3-seat");
        }

        if (positionOneType == "5-seat") {
            image.mapster('set',true,"2-seat");
            image.mapster('set',true,"4-seat");
        }


    } else {

        // set others closely alligned
        if (positionOneType == "2-middle" || positionOneType == "1-middle" || positionOneType == "2-door" || positionOneType == "1-door" || positionOneType == "2-end" || positionOneType == "1-end" || positionOneType == "2-doormiddle" || positionOneType == "1-doormiddle") {
            image.mapster('set',true,"4-seat");
            image.mapster('set',true,"2-seat");
            image.mapster('set',true,positionOneType);
        } else {
            // set selection based on the seat the user selected last round
            image.mapster('set',true,positionOneType);
        }

        if (positionOneType == "1-seat") {
            image.mapster('set',true,"3-seat");
        }

        if (positionOneType == "2-seat") {
            image.mapster('set',true,"4-seat");
        }

        if (positionOneType == "3-seat") {
            image.mapster('set',true,"1-seat");
        }

        if (positionOneType == "4-seat") {
            image.mapster('set',true,"2-seat");
        }
        
    }


    // snapshot image with selected areas
    image.mapster('snapshot');

    function click(data) {
        var clicked = this;
        // set form data based on click
        var keys = image.mapster('keys',data.key,true);
        splitKeys = keys.split(',');
        $('#id_positionTwo').val(data.key);        
        $('#id_positionTwoType').val(splitKeys[1]);

        // hide text in platform, show continue button
        //$('#formButton').removeClass('disabled');

        // remove all other clicks to submit overlays unless this one has a click to submit class
        if (!$(this).hasClass('clickToSubmit')) {
            $('.clickToSubmit').removeClass('clickToSubmit');
        }

        // add clickable overlay that submits on click
        setTimeout(function(){
            $(clicked).addClass('clickToSubmit');
        },100); 

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
            var renderHighlight = { fill: false, stroke: false }; 
            $('#largeHeadingDesktop').addClass('hidden'); 
        } else {
            var highLight = true;
            var renderHighlight = { altImage: altImage, fillOpacity: 0.5 };
            $('#largeHeadingTouch').addClass('hidden'); 
        }

        

        image.mapster('rebind', {
            singleSelect: true,
            mapKey: 'data-key',
            render_select: {
                altImage: altImage,
                fillOpacity: 1
            },
            highlight: highLight,
            render_highlight: renderHighlight,
            onClick: click,
            areas: maskKeys
        });  

        // select a seat if user came back and alredy picked one
        if (seatSelectedAlready > 0) {
            image.mapster('set',true,seatSelectedAlready);
            // show continue button
            //$('#formButton').removeClass('disabled');
            // set this seat ready to click to submit
            $('#'+seatSelectedAlready).addClass('clickToSubmit');
        }

    }

    // // have train slide out then submit form
    // $('#formButton').click(function(event){
    //     event.preventDefault();
    //     $(".trainLineImage").removeClass("imageOverflow");
    //     $(".trainLineImage").addClass("slide-out");
    //     // submit the form
    //     setTimeout(function(){
    //         $( "#target" ).submit();
    //     },1000);        
    // });

    $(document).on('click', '.clickToSubmit', function(e) {
        e.preventDefault();
        $(".trainLineImage").removeClass("imageOverflow");
        $(".trainLineImage").addClass("slide-out");
        // submit the form
        setTimeout(function(){
            $( "#target" ).submit();
        },1000); 
    });


});
