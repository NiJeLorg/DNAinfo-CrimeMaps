/**
 * chi_l_half_full_car.js
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

    // run intitialze function
    initialize();


    function initialize() {

        $.ajax({
            type: "GET",
            url: "/chi-l/resultsapi/" ,
            success: function(data){
                update(data);
            }
        });

    }

    function update(data) {
        var seatKeys = [];

        // create array for area tooltips
        $.each(data.seats, function( i, d ) {
            var pct = ((d/data.respondents)*100).toFixed(1);
            var tooltip = pct + "% ("+ d +") of respondents picked this spot.";
            seatKeys.push({key: i, toolTip: tooltip});
        }); 

        // bind image and set initial selections
        image.mapster({
            mapKey: 'data-key',
            render_select: {
                altImage: '/static/crimemaps/css/images/chi_redline_subway_A_car_where_you_sit.png',
                fillOpacity: 1
            },
        });

        // select seats from visitor picked
        image.mapster('set',true,positionOne);
        image.mapster('set',true,positionTwo);
        image.mapster('set',true,positionThree);

        image.mapster('snapshot',true);

        // create array for area tooltips and
        // loop through each seat, rebinding the image and setting the opacity of a selection based on the percentage of people who picked that seat
        $.each(data.seats, function( i, d ) {
            var frac = d/data.respondents;
            // rebind with the fill opacity based on 
            image.mapster('rebind', {
                mapKey: 'data-key',
                fill: true,
                fillColor:'e1344b',
                fillOpacity: frac,
                stroke: false,
            });            

            image.mapster('set',true,i);
            image.mapster('snapshot',true);

            // create tooltip content while we're at it.
            var pct = ((frac)*100).toFixed(1);
            var tooltip = pct + "% of respondents picked this seat.";
            seatKeys.push({key: i, toolTip: tooltip});
        }); 

        // rebind with the tooltips
        image.mapster('rebind', {
            mapKey: 'data-key',
            fill: false,
            showToolTip: true,
            toolTipContainer: '<div style="max-width: 200px; padding: 3px 8px; margin: 4px; border-radius: 4px; opacity: 1; display: block; position: absolute; left: 31px; top: 328px; z-index: 9999; color: #fff; background-color: #000; text-align: center;"></div>',
            areas: seatKeys,

        });   
        
    }

    // create listener to update image run when the form changes
    $( "#filter-form" ).change(function() {

        // get variables
        var rideTime = $( "#rideTime option:selected" ).val();
        var rideLength = $( "#rideLength option:selected" ).val();
        var capacity = $( "#capacity option:selected" ).val();

        $.ajax({
            type: "GET",
            url: "/chi-l/resultsapi/?rideTime=" + rideTime + "&rideLength=" + rideLength + "&capacity=" + capacity,
            success: function(data){
                // clear the previous image and update
                image.mapster('unbind');
                update(data);
            }
        });

        
    });


    // facebook and twitter link creation and appending
    var app_id = '406014149589534';
    var fbcaption = 'Everyone has a favorite seat or spot to stand on the '+ lineSelected +'. See how your fellow Chicagoans compare to you: https://visualizations.dnainfo.com/nycneigh/ via https://www.facebook.com/DNAinfoChicago/';
    var fblink = 'https://visualizations.dnainfo.com/chi-l/results/'+ id +'/';
    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
    $('#showShareFB').attr("href", fbUrl);


    var twitterlink = 'https://visualizations.dnainfo.com/chi-l/results/'+ id +'/';
    var via = 'DNAinfoCHI';
    var twittercaption = 'This is how I ride the '+ lineSelected +'. How do you do it?';
    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + encodeURIComponent(twittercaption);
    $('#showShareTwitter').attr("href", twitterUrl);





});
