/**
 * chi_l_half_full_car.js
 * Author: NiJeL
 */


$(document).ready(function () {

    // global vars
    var max;

    // add slide in class to train car when dom is ready
    $(".trainLineImage").addClass("slide-in");

    // get width 
    var w = $('.col-sm-12').width();

    // add scrolling after train pulls in
    if (w <= 1200) {
        setTimeout(function(){
            $(".trainLineImage").addClass("imageOverflow");
        },1500);

    }

    /*
    if (w <= 1200) {
        var elem = document.getElementById("trainLineImage"); 
        var elemWidth = elem.scrollWidth;
        var elemVisibleWidth = elem.offsetWidth;
        elem.scrollLeft = (elemWidth - elemVisibleWidth) / 2;
    }
    */

    // run intitialze function
    initialize();

    function initialize() {

        $.ajax({
            type: "GET",
            url: "/chi-l/resultsapi/?train=" + lineSelected ,
            success: function(data){
                update(data);
            }
        });

    }

    function update(data) {
        var selectedSeats = [];
        var seatKeys = [];
        var findMax = [];

        // create array of slected seats with images for render select
        selectedSeats.push({key: positionOne, render_select: {altImage: altImageFC,altImageOpacity: 0.5}});
        selectedSeats.push({key: positionTwo, render_select: {altImage: altImageSC,altImageOpacity: 0.5}});
        selectedSeats.push({key: positionThree, render_select: {altImage: altImageTC,altImageOpacity: 0.5}});

        // create array for area tooltips
        $.each(data.seats, function( i, d ) {
            var pct = ((d/data.respondents)*100).toFixed(1);
            var tooltip = pct + "% ("+ d +") of respondents picked this spot as their first choice.";
            seatKeys.push({key: i, toolTip: tooltip});
            // piggyback on this loop to create max array
            findMax.push(d);
        }); 

        // set up a d3 color scale
        max = d3.max(findMax, function(d) { return d; });

        var color = d3.scale.linear()
                        .domain([0.99, max])
                        .range(["#4291c3", "#e1344b"]);

        // bind image and set initial selections
        image.mapster({
            mapKey: 'data-key',
            areas: selectedSeats,
            onConfigured: createHeatmap(data),
        });

        // select seats from visitor picked
        image.mapster('set',true,positionOne);
        image.mapster('set',true,positionTwo);
        image.mapster('set',true,positionThree);
        image.mapster('snapshot',true);


        // create array for area tooltips and
        // loop through each seat, rebinding the image and setting the opacity of a selection based on the percentage of people who picked that seat
        /*
        $.each(data.seats, function( i, d ) {
            var frac = d/data.respondents;
            // if 
            var c = color(d);
            // strip hash sign
            c = c.replace("#", "");
            // rebind with the fill opacity
            image.mapster('rebind', {
                mapKey: 'data-key',
                fill: true,
                fillColor: c,
                fillOpacity: 0.7,
                stroke: false,
            });            

            image.mapster('set',true,i);
            image.mapster('snapshot',true);

        }); 
        */
       

        // rebind with the tooltips
        image.mapster('rebind', {
            mapKey: 'data-key',
            fill: false,
            showToolTip: true,
            toolTipContainer: '<div style="max-width: 200px; padding: 3px 8px; margin: 4px; border-radius: 4px; opacity: 1; display: block; position: absolute; left: 31px; top: 328px; z-index: 9999; color: #fff; background-color: #000; text-align: center;"></div>',
            areas: seatKeys
        });   
        
    }

    function createHeatmap(data) {
        // set up heatmap instance
        var heatmapInstance = h337.create({
            // only container is required, the rest will be defaults
            container: document.querySelector('#heatmap'),
            radius: 50,
            maxOpacity: 0.5,
            minOpacity: 0,
            blur: 0.75
        });

        // now create points for heatmap
        var points = [];

        $.each(data.seats, function( i, d ) {
            // look up center
            var area = document.getElementById(i);
            if (typeof area !== "undefined" && area) {
                var center = getAreaCenter(area.getAttribute('shape'), area.getAttribute('coords'));
                var point = {
                    x: center[0],
                    y: center[1],
                    value: d
                };
                points.push(point);
            }
        });

        // heatmap data format
        var data = { 
          max: max, 
          min: 1,
          data: points 
        };
        // if you have a set of datapoints always use setData instead of addData
        // for data initialization
        heatmapInstance.setData(data);         

    }

    function getAreaCenter(shape, coords) {
        var coordsArray = coords.split(','),
            center = [];
        if (shape == 'circle') {
            // For circle areas the center is given by the first two values
            center = [coordsArray[0], coordsArray[1]];
        } else {
            // For rect and poly areas we need to loop through the coordinates
            var coord,
                minX = maxX = parseInt(coordsArray[0], 10),
                minY = maxY = parseInt(coordsArray[1], 10);
            for (var i = 0, l = coordsArray.length; i < l; i++) {
                coord = parseInt(coordsArray[i], 10);
                if (i%2 == 0) { // Even values are X coordinates
                    if (coord < minX) {
                        minX = coord;
                    } else if (coord > maxX) {
                        maxX = coord;
                    }
                } else { // Odd values are Y coordinates
                    if (coord < minY) {
                        minY = coord;
                    } else if (coord > maxY) {
                        maxY = coord;
                    }
                }
            }
            center = [parseInt((minX + maxX) / 2, 10), parseInt((minY + maxY) / 2, 10)];
        }
        return(center);
    }

    // create listener to update image run when the form changes
    $( "#filter-form" ).change(function() {

        // get variables
        var rideTime = $( "#rideTime option:selected" ).val();
        var rideLength = $( "#rideLength option:selected" ).val();
        var capacity = $( "#capacity option:selected" ).val();

        $.ajax({
            type: "GET",
            url: "/chi-l/resultsapi/?train=" + lineSelected + "&rideTime=" + rideTime + "&rideLength=" + rideLength + "&capacity=" + capacity,
            success: function(data){
                // clear the previous image and update
                image.mapster('unbind');
                update(data);
            }
        });

        
    });


    // facebook and twitter link creation and appending
    var app_id = '406014149589534';
    var fbcaption = 'Everyone has a favorite seat or spot to stand on the '+ lineSelected +'. See how your fellow Chicagoans compare to you: http://www.dnainfo.com/chicago/visualizations/where-i-sit-stand-train via https://www.facebook.com/DNAinfoChicago/';
    var fblink = 'http://www.dnainfo.com/chicago/visualizations/where-i-sit-stand-train?results='+ id;
    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
    $('#showShareFB').attr("href", fbUrl);


    var twitterlink = 'http://www.dnainfo.com/chicago/visualizations/where-i-sit-stand-train?results='+ id;
    var via = 'DNAinfoCHI';
    var twittercaption = 'This is how I ride the '+ lineSelected +'. How do you do it?';
    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + encodeURIComponent(twittercaption);
    $('#showShareTwitter').attr("href", twitterUrl);


});
