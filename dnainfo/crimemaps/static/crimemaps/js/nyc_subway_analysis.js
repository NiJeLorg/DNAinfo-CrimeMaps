/**
 * nyc_subway_analysis.js
 * Author: NiJeL
 */


$(document).ready(function () {

    // global vars
    var max;

    // add slide in class to train car when dom is ready
    $(".trainLineImage").addClass("slide-in");

    // get width 
    var w = $('#mainContent').width();

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
            url: "/nyc-subway/resultsapi/?train=" + encodeURIComponent(lineSelected) + "&rideTime=" + encodeURIComponent(rideTime) + "&rideLength=" + encodeURIComponent(rideLength) + "&capacity=" + encodeURIComponent(capacity),
            success: function(data){
                var check = checkRespondents(data);
                if (check) {
                    setText(data);
                    setTimeout(function(){
                        tenOrMore(data);
                    },1700);                    
                }
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
        if (carType == "C_Type") {
            // set "location" text depending on modal seat selected
            switch (mode_key) {
                case "38":
                case "41":
                case "20":
                case "21":
                case "22":
                case "23":
                case "26":
                case "27":
                case "28":
                case "29":
                    var location = "a corner seat in the front of the car";
                    break;
                case "2":
                case "3":
                case "4":
                case "5":
                case "8":
                case "9":
                case "10":
                case "11":
                case "14":
                case "15":
                case "16":
                case "17":
                case "32":
                case "33":
                case "34":
                case "35":
                    var location = "a middle seat in the middle of the car";
                    break;
                case "24":
                case "30":
                case "37":
                case "40":
                    var location = "a seat by the doors in the front of the car";
                    break;
                case "13":
                case "18":
                case "19":
                case "25":
                case "31":
                case "36":
                    var location = "a seat by the doors in the middle of the car";
                    break;
                case "1":
                case "6":
                case "7":
                case "12":
                    var location = "a seat by the doors in the rear of the car";
                    break;
                case "54":
                case "56":
                    var location = "a standing corner in the rear of the car";
                    break;
                case "45":
                case "49":
                    var location = "a standing spot in front of the doors in the front of the car";
                    break;
                case "43":
                case "44":
                case "47":
                case "48":
                    var location = "a standing spot in front of the doors in the middle of the car";
                    break;
                case "42":
                case "46":
                    var location = "a standing spot in front of the doors in the rear of the car";
                    break;
                case "69":
                case "70":
                case "71":
                case "72":
                case "73":
                case "74":
                case "75":
                case "76":
                case "77":
                    var location = "a standing spot in the front of the car";
                    break;
                case "63":
                case "64":
                case "65":
                case "66":
                case "67":
                case "68":
                    var location = "a standing spot in the middle of the car";
                    break;
                case "55":
                case "57":
                case "58":
                case "59":
                case "60":
                case "61":
                case "62":
                    var location = "a standing spot in the rear of the car";
                    break;
                case "53":
                    var location = "a standing spot near the doors in the front of the car";
                    break;
                case "51":
                case "52":
                    var location = "a standing spot near the doors in the middle of the car";
                    break;
                case "50":
                    var location = "a standing spot near the doors in the rear of the car";
                    break;
                default:
                    var location = "unknown";

            }

            // loop through each seat type and count the number that elected to stand in the doorway
            $.each(data.seat_types, function( i, d ) {
                // add doorers
                if (i == "1-seat" || i == "1-door" || i == "1-middle" || i == "2-doors") {
                    doorers = doorers + d;
                }
                // add standers
                if (i == "1-door" || i == "1-end" || i == "1-middle" || i == "2-middle" || i == "2-end" || i == "2-door") {
                    standers = standers + d;
                }
            }); 

            var doorPct = ((doorers/respondents)*100).toFixed(1);
            var standPct = ((standers/respondents)*100).toFixed(1);


        } else if (carType == "D_Type") {

            switch (mode_key) {
                case "41":
                case "43":
                case "45":
                case "50":
                case "87":
                case "92":
                    var location = "a corner seat in the front of the car";
                    break;
                case "51":
                case "56":
                case "93":
                case "98":
                    var location = "a corner seat in the middle of the car";
                    break;
                case "99":
                case "102":
                case "108":
                case "110":
                    var location = "a corner seat in the rear of the car";
                    break;
                case "59":
                case "62":
                    var location = "a corner seat toward the rear of the car";
                    break;
                case "47":
                case "48":
                case "88":
                case "91":
                    var location = "a middle seat in the front of the car";
                    break;
                case "53":
                case "54":
                case "94":
                case "97":
                    var location = "a middle seat in the middle of the car";
                    break;
                case "100":
                case "103":
                    var location = "a middle seat in the rear of the car";
                    break;
                case "57":
                case "61":
                    var location = "a middle seat toward the rear of the car";
                    break;
                case "63":
                case "65":
                case "67":
                case "69":
                case "70":
                    var location = "a perpendicular ailse seat in the front of the car";
                    break;
                case "71":
                case "74":
                case "76":
                case "78":
                    var location = "a perpendicular ailse seat in the middle of the car";
                    break;
                case "83":
                case "84":
                case "85":
                case "86":
                case "106":
                    var location = "a perpendicular aisle seat in the rear of the car";
                    break;
                case "64":
                case "66":
                case "68":
                    var location = "a perpendicular corner seat in the front of the car";
                    break;
                case "72":
                case "73":
                case "75":
                case "77":
                    var location = "a perpendicular corner seat in the middle of the car";
                    break;
                case "79":
                case "80":
                case "81":
                case "82":
                case "105":
                    var location = "a perpendicular corner seat in the rear of the car";
                    break;
                case "42":
                case "44":
                case "46":
                case "49":
                    var location = "a seat by the doors in the front of the car";
                    break;
                case "52":
                case "55":
                case "95":
                case "96":
                    var location = "a seat by the doors in the middle of the car";
                    break;
                case "101":
                case "104":
                case "107":
                case "109":
                    var location = "a seat by the doors in the rear of the car";
                    break;
                case "89":
                case "90":
                    var location = "a seat by the doors toward the front of the car";
                    break;
                case "58":
                case "60":
                    var location = "a seat by the doors toward the rear of the car";
                    break;
                case "1":
                    var location = "a standing spot between the perpendicular seats in the front of the car";
                    break;
                case "2":
                    var location = "a standing spot between the perpendicular seats in the middle of the car";
                    break;
                case "3":
                    var location = "a standing spot between the perpendicular seats in the rear of the car";
                    break;
                case "32":
                case "33":
                    var location = "a standing spot in front of the doors in the front of the car";
                    break;
                case "30":
                case "31":
                case "34":
                case "35":
                    var location = "a standing spot in front of the doors in the middle of the car";
                    break;
                case "29":
                case "36":
                    var location = "a standing spot in front of the doors in the rear of the car";
                    break;
                case "37":
                case "38":
                case "39":
                    var location = "a standing spot in the front of the car";
                    break;
                case "14":
                case "15":
                case "16":
                case "17":
                case "18":
                case "19":
                    var location = "a standing spot in the middle of the car";
                    break;
                case "26":
                case "27":
                case "28":
                case "40":
                    var location = "a standing spot in the rear of the car";
                    break;
                case "4":
                    var location = "a standing spot near the doors in the front of the car";
                    break;
                case "5":
                case "6":
                    var location = "a standing spot near the doors in the middle of the car";
                    break;
                case "7":
                    var location = "a standing spot near the doors in the rear of the car";
                    break;
                case "8":
                case "9":
                case "10":
                case "11":
                case "12":
                case "13":
                    var location = "a standing spot toward the front of the car";
                    break;
                case "20":
                case "21":
                case "22":
                case "23":
                case "24":
                case "25":
                    var location = "a standing spot toward the rear of the train";
                    break;
                default:
                    var location = "unknown";
            }

            // loop through each seat type and count the number that elected to stand in the doorway
            $.each(data.seat_types, function( i, d ) {
                // add doorers
                if (i == "1-seat" || i == "1-door" || i == "1-middle" || i == "2-door") {
                    doorers = doorers + d;
                }
                // add standers
                if (i == "1-door" || i == "1-end" || i == "1-middle" || i == "2-middle" || i == "2-end" || i == "2-door" || i == "3-middle") {
                    standers = standers + d;
                }
            }); 

            var doorPct = ((doorers/respondents)*100).toFixed(1);
            var standPct = ((standers/respondents)*100).toFixed(1);

        } else {

            switch (mode_key) {
                case "25":
                case "30":
                    var location = "a corner seat in the front of the car";
                    break;
                case "60":
                case "64":
                    var location = "a corner seat in the rear of the car";
                    break;
                case "26":
                case "27":
                    var location = "a middle seat in the front of the car";
                    break;
                case "46":
                case "47":
                case "48":
                case "49":
                case "51":
                case "53":
                case "54":
                case "55":
                case "56":
                case "58":
                case "62":
                case "63":
                    var location = "a middle seat in the rear of the car";
                    break;
                case "32":
                case "33":
                case "34":
                case "35":
                case "37":
                case "38":
                case "40":
                case "41":
                case "42":
                case "43":
                    var location = "a middle seat toward the front of the car";
                    break;
                case "39":
                    var location = "a seat by the doors in the front of the car";
                    break;
                case "31":
                case "44":
                case "50":
                case "52":
                    var location = "a seat by the doors in the middle of the car";
                    break;
                case "45":
                case "57":
                case "59":
                case "61":
                    var location = "a seat by the doors in the rear of the car";
                    break;
                case "28":
                case "29":
                case "36":
                    var location = "a seat in front of the doors in the front of the car";
                    break;
                case "19":
                case "22":
                    var location = "a standing spot in front of the doors in the front of the car";
                    break;
                case "20":
                case "23":
                    var location = "a standing spot in front of the doors in the middle of the cars";
                    break;
                case "21":
                case "24":
                    var location = "a standing spot in front of the doors in the rear of the car";
                    break;
                case "16":
                case "17":
                    var location = "a standing spot in the front of the car";
                    break;
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                    var location = "a standing spot in the middle of the car";
                    break;
                case "15":
                case "18":
                    var location = "a standing spot in the rear of the car";
                    break;
                case "11":
                case "12":
                    var location = "a standing spot near the doors in the front of the car";
                    break;
                case "10":
                case "13":
                    var location = "a standing spot near the doors in the middle of the car";
                    break;
                case "9":
                case "14":
                    var location = "a standing spot near the doors in the rear of the car";
                    break;

                default:
                    var location = "unknown";
            }

            // loop through each seat type and count the number that elected to stand in the doorway
            $.each(data.seat_types, function( i, d ) {
                // add doorers
                if (i == "1-seat" || i == "1-door" || i == "1-doormiddle" || i == "2-door" || i == "2-doormiddle") {
                    doorers = doorers + d;
                }
                // add standers
                if (i == "1-door" || i == "1-end" || i == "1-middle" || i == "1-doormiddle" || i == "2-middle" || i == "2-doormiddle" || i == "2-end" || i == "2-door") {
                    standers = standers + d;
                }
            }); 

            var doorPct = ((doorers/respondents)*100).toFixed(1);
            var standPct = ((standers/respondents)*100).toFixed(1);


        }

        // set text
        if (capacity == "empty" || capacity == "half-full") {
            $('.subheadingSmall').html("<em>The most popular spot is "+ location +", with "+ locationPct +" percent of commuters preferring to ride here. "+ doorPct +" percent of riders choose to stand or sit right by the doors. "+ standPct +" percent of riders would stand anywhere on this train.</em>");
        } else {
            $('.subheadingSmall').html("<em>The most popular spot to stand is "+ location +", with "+ locationPct +" percent of commuters preferring to ride here. "+ doorPct +" percent of riders choose to stand right by the doors.</em>");            
        }

    }

    function checkRespondents(data) {

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
            return false;
        } else {
            $(".trainLineImage").removeClass("hidden");
            $(".subheadingSmall").removeClass("hidden");
            $(".lessThanTen").addClass("hidden");            
            return true;
        }
        return false;
    }
    
    function tenOrMore(data) {

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
        $(".heatmap-canvas").fadeIn("slow");        

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
        if (newLineSelected == "S - 42nd St. Shuttle" || newLineSelected == "S - Rockaway Shuttle" || newLineSelected == "S - Franklin Ave. Shuttle") {
            rideLength = '';
        }

        if (lineSelected == newLineSelected) {
            // line hasn't changed, so pull new data from api and update train image
            $.ajax({
                type: "GET",
                url: "/nyc-subway/resultsapi/?train=" + encodeURIComponent(lineSelected) + "&rideTime=" + encodeURIComponent(rideTime) + "&rideLength=" + encodeURIComponent(rideLength) + "&capacity=" + encodeURIComponent(capacity),
                success: function(data){
                    var check = checkRespondents(data);
                    if (check) {
                        tenOrMore(data);
                        setText(data);
                    }
                }
            });

        } else {
            // line has change, so refresh page with new train line
            var url = "/nyc-subway/analysis/" + encodeURIComponent(newLineSelected) + "/?rideTime=" + encodeURIComponent(rideTime) + "&rideLength=" + encodeURIComponent(rideLength) + "&capacity=" + encodeURIComponent(capacity);

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
        // rideTime = $( "#rideTime option:selected" ).val();
        // rideLength = $( "#rideLength option:selected" ).val();
        // capacity = $( "#capacity option:selected" ).val();

        if (lineSelected == "S - Rockaway Shuttle") {
            var lineSelectedShareURL = "s-rockaway";
        } else if (lineSelected == "S - Franklin Ave. Shuttle") {
            var lineSelectedShareURL = "s-franklin-avenue";
        } else if (lineSelected == "S - 42nd St. Shuttle") {
            var lineSelectedShareURL = "s-42nd-street";
        } else {
            var lineSelectedShareURL = lineSelected;
        }

        $.ajax({
            type: "GET",
            url: "/nyc-subway/createNYCTrainBitlyLink/?train=" + encodeURIComponent(lineSelectedShareURL),
            success: function(bitlyURL){

                // facebook and twitter link creation and appending
                var app_id = '406014149589534';
                var fbcaption = "Survey Results: This is the most popular spot on the "+ lineSelected +" train. "+ bitlyURL +" via https://www.facebook.com/DNAinfo/";
                var fblink = "https://sprnt-2180-chrome-new-visualizations.build.qa.dnainfo.com/new-york/visualizations/where-i-sit-stand-train/analysis";
                var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(bitlyURL) + '&redirect_uri=' + encodeURIComponent(fblink);
                var fbOnclick = 'window.open("' + fbUrl + '","facebook-share-dialog","width=626,height=436");return false;';
                //$('#showShareFB').attr("href", fbUrl);
                $('#showShareFB').attr("onclick", fbOnclick);


                var twitterlink = bitlyURL;
                var via = 'DNAinfo';
                var twittercaption = "Survey Results: This is the most popular spot on the "+ lineSelected +" train.";
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
