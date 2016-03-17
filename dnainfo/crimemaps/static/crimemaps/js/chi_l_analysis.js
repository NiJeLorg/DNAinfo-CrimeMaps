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
                setText(data);
            }
        });

    }

    function setText(data) {
        // which capacity do we care about
        // pick denominator
        if (capacity == 'empty') {
            var respondents = data.respondentsPositionOne;
        } else if (capacity == 'half-full') {
            var respondents = data.respondentsPositionTwo;
        } else {
            var respondents = data.respondentsPositionThree;            
        } 

        // invert dataset to set up for key access
        var inverted = _.invert(data.seats); 
        // get modal value
        var mode = _.max(data.seats);
        // get key of modal value
        var mode_key = inverted[mode]; 
        // get percent that perferred to ride in this seat
        var locationPct = ((mode/respondents)*100).toFixed(1);

        // set standers and doorers to 0
        var standers = 0;
        var doorers = 0;

        // which train?
        if (lineSelected == "Brown Line") {
            // set "location" text depending on modal seat selected
            switch (mode_key) {
                case "8":
                case "10":
                    var location = "a backward-facing aisle seat in the middle of the train car";
                    break;
                case "18":
                case "20":
                    var location = "a backward-facing aisle seat near the front of the train car";
                    break;
                case "12":
                    var location = "a backward-facing single seat in the middle of the car";
                    break;
                case "11":
                    var location = "a backward-facing single seat in the middle of the train car";
                    break;
                case "23":
                case "24":
                    var location = "a backward-facing single seat near the front of the train car";
                    break;
                case "7":
                case "9":
                    var location = "a backward-facing window seat in the middle of the train car";
                    break;
                case "17":
                case "19":
                    var location = "a backward-facing window seat near the front of the train car";
                    break;
                case "2":
                case "36":
                    var location = "a forward-facing aisle seat near the back of the train car";
                    break;
                case "1":
                case "37":
                    var location = "a forward-facing window seat near the back of the train car";
                    break;
                case "29":
                case "31":
                    var location = "a front-facing aisle seat in the middle of the train car";
                    break;
                case "29":
                case "31":
                    var location = "a front-facing aisle seat in the middle of the train car";
                    break;
                case "33":
                case "34":
                    var location = "a front-facing single seat in the middle of the train car";
                    break;
                case "30":
                case "32":
                    var location = "a front-facing window seat in the middle of the train car";
                    break;
                case "4":
                case "5":
                    var location = "a sideways-facing seat by the back door";
                    break;
                case "13":
                case "16":
                case "25":
                case "28":
                    var location = "a sideways-facing seat next to a seat by a front door";
                    break;
                case "14":
                case "15":
                    var location = "a sideways-facing seat next to the closed front door";
                    break;
                case "26":
                case "27":
                    var location = "a sideways-facing seat next to the open front door";
                    break;
                case "3":
                case "6":
                    var location = "a sideways-facing seat next to the seat by the back door";
                    break;
                case "3":
                case "6":
                    var location = "a sideways-facing seat next to the seat by the back door";
                    break;
                case "21":
                case "22":
                    var location = "a sideways-facing single seat near the front of the train car";
                    break;
                case "44":
                case "45":
                case "46":
                case "47":
                    var location = "a standing area in the middle of the train car";
                    break;
                case "50":
                case "51":
                    var location = "a standing area near the front of the train car";
                    break;
                case "38":
                    var location = "the alcove aisle seat";
                    break;
                case "40":
                    var location = "the alcove standing area";
                    break;
                case "39":
                    var location = "the alcove window seat";
                    break;
                case "35":
                    var location = "the sideways-facing single seat by the back door";
                    break;
                case "41":
                    var location = "the sizable standing area next to the back doors";
                    break;
                case "52":
                    var location = "the standing area at the front end of the train car";
                    break;
                case "48":
                    var location = "the standing area right at the closed front door";
                    break;
                case "49":
                    var location = "the standing area right at the open front door";
                    break;
                case "42":
                    var location = "the standing area right in front of the closed back door";
                    break;
                case "43":
                    var location = "the standing area right in front of the open back door";
                    break;
                default:
                    var location = "unknown";

            }

            // loop through each seat type and count the number that elected to stand in the doorway
            $.each(data.seat_types, function( i, d ) {
                // add doorers
                if (i == "1-seat" || i == "6-seat" || i == "3-side-standing" || i == "5-door-standing" || i == "7-door-standing") {
                    doorers = doorers + d;
                }
                // add standers
                if (i == "1-end-standing" || i == "2-middle-standing" || i == "3-side-standing" || i == "5-door-standing" || i == "7-door-standing" || i == "4-middle-standing") {
                    standers = standers + d;
                }
            }); 

            var doorPct = ((doorers/respondents)*100).toFixed(1);
            var standPct = ((standers/respondents)*100).toFixed(1);


        } else if (lineSelected == "Blue Line" || lineSelected == "Orange Line") {

            switch (mode_key) {
                case "6":
                case "8":
                case "10":
                case "12":
                    var location = "a backward-facing aisle seat in the middle of the train car";
                    break;
                case "18":
                case "20":
                case "22":
                case "24":
                    var location = "a backward-facing aisle seat near the front train car";
                    break;
                case "5":
                case "7":
                case "9":
                case "11":
                    var location = "a backward-facing window seat in the middle of the train car";
                    break;
                case "17":
                case "19":
                case "23":
                case "25":
                    var location = "a backward-facing window seat near the front train car";
                    break;
                case "42":
                    var location = "a front-facing aisle seat near the back end of the train car";
                    break;
                case "30":
                case "32":
                case "34":
                case "36":
                    var location = "a front-facing aisle seat on a two-person bench in the middle of the train";
                    break;
                case "31":
                case "33":
                case "35":
                case "37":
                    var location = "a front-facing window seat on a two-person bench in the middle of the train";
                    break;
                case "31":
                case "33":
                case "35":
                case "37":
                    var location = "a front-facing window seat on a two-person bench in the middle of the train";
                    break;
                case "4":
                case "38":
                    var location = "a sideways seat next to one next to the back doors";
                    break;
                case "13":
                case "16":
                case "26":
                case "29":
                    var location = "a sideways seat next to one next to the front doors";
                    break;
                case "3":
                case "39":
                    var location = "a sideways seat next to the back doors";
                    break;
                case "14":
                case "15":
                case "27":
                case "28":
                    var location = "a sideways seat next to one next to the front doors";
                    break;
                case "49":
                    var location = "a standing area in front of the door";
                    break;
                case "44":
                    var location = "the alcove aisle seat";
                    break;
                case "46":
                    var location = "the alcove standing area";
                    break;
                case "45":
                    var location = "the alcove window seat";
                    break;
                case "58":
                    var location = "the corner standing area near the front of the train car";
                    break;
                case "2":
                    var location = "the front-facing aisle seat, with leg room, near the back end of the train car";
                    break;
                case "43":
                    var location = "the front-facing window seat near the back end of the train car";
                    break;
                case "1":
                    var location = "the front-facing window seat, with leg room, near the back end of the train car";
                    break;
                case "40":
                    var location = "the sideways seat near the back of the train car that's next to the door";
                    break;
                case "41":
                    var location = "the sideways seat near the back of the train car that's not next to the door";
                    break;
                case "21":
                    var location = "the sideways single seat near the front of the train car";
                    break;
                case "57":
                    var location = "the standing area in the aisle near the front of the train car";
                    break;
                case "56":
                    var location = "the standing area in the front of the train car near the doors";
                    break;
                case "52":
                    var location = "the standing area in the middle of the train";
                    break;
                case "47":
                    var location = "the standing area leading to the alcove";
                    break;
                case "54":
                    var location = "the standing area opposite the open doors in the front of the train car";
                    break;
                case "50":
                    var location = "the standing area right inside the open doors in the back of the train car";
                    break;
                case "55":
                    var location = "the standing area right inside the open doors in the front of the train car";
                    break;
                case "48":
                    var location = "the standing area sectioned off from the door";
                    break;
                case "51":
                    var location = "the standing area toward the middle of the car closer to the back doors";
                    break;
                case "53":
                    var location = "the standing area toward the middle of the car closer to the front doors";
                    break;
                default:
                    var location = "unknown";
            }

            // loop through each seat type and count the number that elected to stand in the doorway
            $.each(data.seat_types, function( i, d ) {
                // add doorers
                if (i == "1-seat" || i == "3-side-standing" || i == "5-door-standing" || i == "7-door-standing") {
                    doorers = doorers + d;
                }
                // add standers
                if (i == "1-end-standing" || i == "2-middle-standing" || i == "3-side-standing" || i == "5-door-standing" || i == "7-door-standing" || i == "4-middle-standing") {
                    standers = standers + d;
                }
            }); 

            var doorPct = ((doorers/respondents)*100).toFixed(1);
            var standPct = ((standers/respondents)*100).toFixed(1);

        } else {

            switch (mode_key) {
                case "4":
                case "35":
                    var location = "a corner seat by one of the back doors";
                    break;
                case "14":
                case "25":
                    var location = "a corner seat by the front doors";
                    break;
                case "1":
                case "38":
                    var location = "a corner seat in the back of the train car";
                    break;
                case "19":
                case "20":
                    var location = "a corner seat in the front of the train car";
                    break;
                case "7":
                case "13":
                case "26":
                case "32":
                    var location = "a corner seat in the middle of the train car";
                    break;
                case "45":
                    var location = "a standing area reserved for people who are handicapped";
                    break;
                case "46":
                case "49":
                    var location = "a standing area toward the middle of the train";
                    break;
                case "6":
                case "33":
                    var location = "backward-facing aisle seat reserved for people who are handicapped";
                    break;
                case "5":
                case "34":
                    var location = "backward-facing window seat reserved for people who are handicapped";
                    break;
                case "2":
                case "3":
                case "36":
                case "37":
                    var location = "one of the middle seats in the back of the train car";
                    break;
                case "15":
                case "16":
                case "17":
                case "18":
                case "21":
                case "22":
                case "23":
                case "24":
                    var location = "one of the middle seats in the front of the train car";
                    break;
                case "8":
                case "9":
                case "10":
                case "11":
                case "12":
                case "27":
                case "28":
                case "29":
                case "30":
                case "31":
                    var location = "one of the middle seats in the middle of the train car";
                    break;
                case "39":
                    var location = "the corner standing area in the alcove";
                    break;
                case "43":
                    var location = "the standing area halfway between the back doors";
                    break;
                case "51":
                    var location = "the standing area halfway between the front doors";
                    break;
                case "40":
                    var location = "the standing area in the entrance of the alcove";
                    break;
                case "48":
                    var location = "the standing area in the middle of the train car";
                    break;
                case "41":
                    var location = "the standing area near the back of the train car";
                    break;
                case "41":
                    var location = "the standing area near the back of the train car";
                    break;
                case "54":
                    var location = "the standing area near the front of the train car";
                    break;
                case "42":
                    var location = "the standing area next to the closed back door";
                    break;
                case "50":
                    var location = "the standing area next to the closed front door";
                    break;
                case "47":
                    var location = "the standing area reserved for people who are handicapped next to the open back door";
                    break;
                case "44":
                    var location = "the standing area right inside the open back door";
                    break;
                case "52":
                    var location = "the standing area right inside the open front door";
                    break;
                case "53":
                    var location = "the standing area toward the front of the train car";
                    break;
                default:
                    var location = "unknown";
            }

            // loop through each seat type and count the number that elected to stand in the doorway
            $.each(data.seat_types, function( i, d ) {
                // add doorers
                if (i == "edge-seat" || i == "3-side-standing" || i == "5-door-standing" || i == "7-door-standing" || i == "6-middle-door-standing") {
                    doorers = doorers + d;
                }
                // add standers
                if (i == "1-end-standing" || i == "2-middle-standing" || i == "3-side-standing" || i == "5-door-standing" || i == "7-door-standing" || i == "4-middle-standing" || i == "6-middle-door-standing") {
                    standers = standers + d;
                }
            }); 

            var doorPct = ((doorers/respondents)*100).toFixed(1);
            var standPct = ((standers/respondents)*100).toFixed(1);


        }


        // set text
        console.log(capacity);
        if (capacity == "empty" || capacity == "half-full") {
            $('.subheadingSmall').html("<em>The most popular spot is "+ location +", with "+ locationPct +" percent of commuters preferring to ride here. "+ doorPct +" percent of riders choose to stand or sit right by the doors. "+ standPct +" percent of riders would stand anywhere on this train.</em>");
        } else {
            $('.subheadingSmall').html("<em>The most popular spot to stand is "+ location +", with "+ locationPct +" percent of commuters preferring to ride here. "+ doorPct +" percent of riders choose to stand right by the doors.</em>");            
        }

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
            $(".subheadingSmall").addClass("hidden");
            $(".lessThanTen").removeClass("hidden");
        } else {
            $(".trainLineImage").removeClass("hidden");
            $(".subheadingSmall").removeClass("hidden");
            $(".lessThanTen").addClass("hidden");            
            tenOrMore();
        }

        function tenOrMore() {

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
        rideTime = $( "#rideTime option:selected" ).val();
        rideLength = $( "#rideLength option:selected" ).val();
        capacity = $( "#capacity option:selected" ).val();

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
                    setText(data);
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
        rideTime = $( "#rideTime option:selected" ).val();
        rideLength = $( "#rideLength option:selected" ).val();
        capacity = $( "#capacity option:selected" ).val();

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
