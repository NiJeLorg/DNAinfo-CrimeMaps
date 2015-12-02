/**
 * chi_l_empty_car.js
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

    // bind image
    image.mapster({
        singleSelect: true,
        mapKey: 'data-key',
        render_select: {
            altImage: altImage,
            fillOpacity: 1
        },
        render_highlight : {
            altImage: altImage,
            fillOpacity: 0.5
        },
        onClick: click,
    });

    // select a seat if user came back and alredy picked one
    if (seatSelectedAlready > 0) {
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
