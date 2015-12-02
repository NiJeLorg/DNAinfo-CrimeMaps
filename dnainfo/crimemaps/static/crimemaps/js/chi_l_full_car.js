/**
 * chi_l_full_car.js
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
            altImage: altImageFull,
            fillOpacity: 1
        },
        onConfigured: getKeys
	});

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
        $('#formButton').removeClass('disabled');

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
