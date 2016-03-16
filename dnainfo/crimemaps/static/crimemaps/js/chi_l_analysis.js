/**
 * chi_l_analysis.js
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
            // enable double scroll on train
            $('.div20pxtall').addClass('hidden');
            $('.trainLineImage').doubleScroll();
        },1700);
    }

    // add to more link a show 
    $("#more").click(function() {
        $(".subheading").toggleClass("hidden");
    });

    // run intitialze function
    initialize();

    function initialize() {
        // set up image mapster
        image.mapster({
            mapKey: 'data-key'
        });

        // snapshot for rebinding in the update function
        image.mapster('snapshot',true);

        $.ajax({
            type: "GET",
            url: "/chi-l/resultsapi/?train=" + encodeURIComponent(lineSelected) + "&rideTime=" + encodeURIComponent(rideTime) + "&rideLength=" + encodeURIComponent(rideLength) + "&capacity=" + encodeURIComponent(capacity),
            success: function(data){
                update(data);
            }
        });

    }

    function update(data) {
        var seatKeys = [];
        var findMax = [];

        // pick denominator
        if (capacity == 'empty') {
            var respondents = data.respondentsPositionOne;
        } else if (capacity == 'half-full') {
            var respondents = data.respondentsPositionTwo;
        } else {
            var respondents = data.respondentsPositionThree;            
        }

        // if respondents are less than 10, hide train line image and show text asking for participation

        if (respondents < 10) {
            $(".trainLineImage").addClass("hidden");
            $(".subheading").addClass("hidden");
            $(".lessThanTen").removeClass("hidden");
        } else {
            $(".trainLineImage").removeClass("hidden");
            $(".subheading").removeClass("hidden");
            $(".lessThanTen").addClass("hidden");            
        }


        // create array for area tooltips
        $.each(data.seats, function( i, d ) {
            var pct = ((d/respondents)*100).toFixed(1);
            var tooltip = pct + "% ("+ numberWithCommas(d) +") of respondents picked this spot.";
            seatKeys.push({key: i, toolTip: tooltip});                
            
            // piggyback on this loop to create max array
            findMax.push(d);
        }); 

        // calc max value for heatmap
        max = d3.max(findMax, function(d) { return d; });

        // rebind with the tooltips
        image.mapster('rebind', {
            mapKey: 'data-key',
            fill: false,
            stroke: true,
            strokeColor: '545454',
            strokeOpacity: 1,
            strokeWidth: 2,
            isSelectable: false,
            showToolTip: true,
            toolTipContainer: '<div style="max-width: 200px; padding: 3px 8px; margin: 4px; border-radius: 4px; opacity: 1; display: block; position: absolute; left: 31px; top: 328px; z-index: 9999; color: #fff; background-color: #252525; text-align: center;"></div>',
            areas: seatKeys,
            onConfigured: createHeatmap(data),
        }); 
        
    }

    function createHeatmap(data) {
        // clar heatmap if one existed
        $('.heatmap-canvas').remove();
    

        // set up heatmap instance
        var heatmapInstance = h337.create({
            // only container is required, the rest will be defaults
            container: document.querySelector('#heatmap'),
            radius: 50,
            maxOpacity: 1,
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
        var data1 = { 
          max: max, 
          min: 0,
          data: points 
        };
        // if you have a set of datapoints always use setData instead of addData
        // for data initialization
        heatmapInstance.setData(data1);         

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

        // refresh page with new line if the a new line is selected
        var newLineSelected = $( "#lineSelected option:selected" ).val();

        // set rideLength to empty string if shuttle train is selected
        if (newLineSelected == "Yellow Line") {
            rideLength = '';
        }


        if (lineSelected == newLineSelected) {
            // line hasn't changed, so pull new data from api and update train image
            $.ajax({
                type: "GET",
                url: "/chi-l/resultsapi/?train=" + encodeURIComponent(lineSelected) + "&rideTime=" + encodeURIComponent(rideTime) + "&rideLength=" + encodeURIComponent(rideLength) + "&capacity=" + encodeURIComponent(capacity),
                success: function(data){
                    // clear the previous image and update
                    //image.mapster('unbind');
                    update(data);
                }
            });

        } else {
            // line has change, so refresh page with new train line
            var url = "/chi-l/analysis/" + encodeURIComponent(newLineSelected) + "/?rideTime=" + encodeURIComponent(rideTime) + "&rideLength=" + encodeURIComponent(rideLength) + "&capacity=" + encodeURIComponent(capacity);

            $(".trainLineImage").removeClass("imageOverflow");
            $(".trainLineImage").addClass("slide-out");
            // submit the form
            setTimeout(function(){
                window.location = url;
            },1000);  

        }
        
    });

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }


    function createFBandTwitterURLs() {

        // get full url based on what's selected and bind that to the twitter and facebook click
        // get variables
        var rideTime = $( "#rideTime option:selected" ).val();
        var rideLength = $( "#rideLength option:selected" ).val();
        var capacity = $( "#capacity option:selected" ).val();

        $.ajax({
            type: "GET",
            url: "/chi-l/createCHITrainBitlyLink/?train=" + encodeURIComponent(lineSelected) + "&rideTime=" + encodeURIComponent(rideTime) + "&rideLength=" + encodeURIComponent(rideLength) + "&capacity=" + encodeURIComponent(capacity),
            success: function(bitlyURL){

                // facebook and twitter link creation and appending
                var app_id = '406014149589534';
                var fbcaption = "These are the most coveted spots on the "+ lineSelected +". What\'s yours? "+ bitlyURL +" via https://www.facebook.com/DNAinfoChicago/";
                var fblink = "https://www.dnainfo.com/chicago/visualizations/";
                var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(bitlyURL) + '&redirect_uri=' + encodeURIComponent(fblink);
                var fbOnclick = 'window.open("' + fbUrl + '","facebook-share-dialog","width=626,height=436");return false;';
                //$('#showShareFB').attr("href", fbUrl);
                $('#showShareFB').attr("onclick", fbOnclick);


                var twitterlink = bitlyURL;
                var via = 'DNAinfoCHI';
                var twittercaption = "These are the most coveted spots on the "+ lineSelected +". What\'s yours?";
                var twitterUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + encodeURIComponent(twittercaption);
                var twitterOnclick = 'window.open("' + twitterUrl + '","twitter-share-dialog","width=626,height=436");return false;';
                //$('#showShareTwitter').attr("href", twitterUrl);
                $('#showShareTwitter').attr("onclick", twitterOnclick);

            }
        });

    }

    // set FB and twitter urls
    createFBandTwitterURLs();



});
