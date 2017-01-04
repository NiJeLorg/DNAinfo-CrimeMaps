/**
 * return_result.js: Creates OSM Buildings map for viewers returning from facebook and twitter shares
 */

function osmApplication() {}

osmApplication.createDjangoSelect2 = function() {
    // set up select 2
    // remove form labels
    $('label').remove();
    // add a form-control class to the input, disabled attribute and placeholder text
    $('#id_whereBuilding').addClass("form-control");
    // don't allow a blank option
    $('#id_whereBuilding option[value=""]').remove();
    // initialize select 2
    var $select2obj = $('.django-select2').djangoSelect2();
    // update placeholder text
    $('.select2-selection__placeholder').text(neighborhoodName);

    // for iOS, force blur to close keyboard if clicking away from the input field
    $(document).on('click', '#select2-drop', function(e) {
        document.activeElement.blur();
    });

    var dropDownOpen = false;

    $(document).on('click', '.chevron-button', function() {
        if (!dropDownOpen) {
            $select2obj.select2("open");
            dropDownOpen = true;
        } else {
            $select2obj.select2("close");
            dropDownOpen = false;
        }
    });

    // submit the form on change
    $(document).on('change', '#id_whereBuilding', function(e) {
        $(this).closest('form').submit();
    }); 

}

osmApplication.initialize = function() {

    osmApplication.widthFrame = $('#content').width();
    if (osmApplication.widthFrame < 1200) {
        osmApplication.shadows = [];
    } else {
        osmApplication.shadows = ['shadows'];
    }

    osmApplication.osmb = new OSMBuildings({
        baseURL: '/visualizations/static/skyline_chi/css/images',
        minZoom: 14,
        maxZoom: 19,
        tilt: 45,
        zoom: 17,
        position: { latitude: 40.710508, longitude: -73.943825 },
        state: true,
        effects: osmApplication.shadows,
        attribution: '© 3D <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>. Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, under <a href=\"https://creativecommons.org/licenses/by/3.0/\" target=\"_blank\">CC BY 3.0</a>. Data by <a href=\"http://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>, under ODbL.'
    }).appendTo("osmmap");

    osmApplication.osmb.addMapTiles('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', { attribution: 'Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, under <a href=\"https://creativecommons.org/licenses/by/3.0/\" target=\"_blank\">CC BY 3.0</a>. Data by <a href=\"http://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>, under ODbL.' });

    osmApplication.osmb.addGeoJSONTiles('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json', { color: 'rgb(220, 210, 200)' });

    // set initial conditons for share buttons
    osmApplication.updateSocialLinksID(osmApplication.osmb.position.latitude.toFixed(6), osmApplication.osmb.position.longitude.toFixed(6), osmApplication.osmb.zoom.toFixed(1), osmApplication.osmb.tilt.toFixed(1), osmApplication.osmb.rotation.toFixed(1));

    // button controls
    osmApplication.controlButtons = document.querySelectorAll('.control button');

    for (var i = 0, il = osmApplication.controlButtons.length; i < il; i++) {
        osmApplication.controlButtons[i].addEventListener('click', function(e) {

            var button = this;
            var parentClassList = button.parentNode.classList;
            var direction = button.classList.contains('inc') ? 1 : -1;
            var increment;
            var property;

            if (parentClassList.contains('tilt')) {
                property = 'Tilt';
                increment = direction * 10;
            }
            if (parentClassList.contains('rotation')) {
                property = 'Rotation';
                increment = direction * 10;
            }
            if (parentClassList.contains('zoom')) {
                property = 'Zoom';
                increment = direction * 1;
            }
            if (property) {
                if (property == 'Zoom') {
                    var zoomNow = osmApplication.osmb['get' + property]();
                    if (zoomNow <= 14 && direction == -1) {
                        // don't zoom below 14
                    } else if (zoomNow >= 19 && direction == 1) {
                        // don't zoom above 19
                    } else {
                        osmApplication.osmb['set' + property](osmApplication.osmb['get' + property]() + increment);
                    }
                } else {
                    osmApplication.osmb['set' + property](osmApplication.osmb['get' + property]() + increment);
                }
            }
        });
    }

    // listen for osm buidling click events
    osmApplication.osmb.on('click', function(e) {
        if (e.x) {
            var xcoor = e.x;
            var ycoor = e.y;
        } else {
            var xcoor = e.clientX;
            var ycoor = e.clientY;
        }

        osmApplication.onClick(xcoor, ycoor);

    });

    // listen for touch events and doe the same thing as clicking
    osmApplication.osmb.on('touchstart', function(e) {
        var xcoor = e.touches[0].clientX;
        var ycoor = e.touches[0].clientY;
        osmApplication.onClick(xcoor, ycoor);
    });


    // close sponsored tooltip if the map changes
    osmApplication.osmb.on('change', function(e) {
        if (!$('#tooltipPermitted').hasClass('hidden')) {
            $('#tooltipPermitted').addClass('hidden');
        }
        if (!$('#tooltipSponsored').hasClass('hidden')) {
            $('#tooltipSponsored').addClass('hidden');
        }
        if (!$('#tooltipDNA').hasClass('hidden')) {
            $('#tooltipDNA').addClass('hidden');
        }
        if (!$('#tooltipSubmitted').hasClass('hidden')) {
            $('#tooltipSubmitted').addClass('hidden');
        }
    });

    // create listener for closing tooltip
    $(document).on('click', '.tooltip-close', function() {
        $('.tooltip').addClass('hidden');
    });

    // get sponsored content
    osmApplication.getSponsoredGeojsons();

}

osmApplication.onClick = function (xcoor, ycoor) {
    osmApplication.osmb.getTarget(parseInt(xcoor), parseInt(ycoor), function(id) {

        // hide any open tooltips first
        if (!$('#tooltipPermitted').hasClass('hidden')) {
            $('#tooltipPermitted').addClass('hidden');
        }
        if (!$('#tooltipSponsored').hasClass('hidden')) {
            $('#tooltipSponsored').addClass('hidden');
        }
        if (!$('#tooltipDNA').hasClass('hidden')) {
            $('#tooltipDNA').addClass('hidden');
        }
        if (!$('#tooltipSubmitted').hasClass('hidden')) {
            $('#tooltipSubmitted').addClass('hidden');
        }

        // get lat lon of where the person clicked
        osmApplication.latLonClicked = osmApplication.osmb.unproject(xcoor, ycoor);

        if (id) {
            splitId = id.split('_');
            console.log(splitId, 'splitId');

            if (splitId[0] == 'sponsored') {
                // clear out previous data
                $('#property-name').text('');
                $('#property-image').html('');
                $('#property-description').text('');
                $('#property-address').text('');
                // look up properties
                properties = osmApplication.sponsoredGeojsons[id].features[0].properties;
                $('#property-name').text(properties.name);
                var imgSrc = '/visualizations/media/' + properties.image;
                $('#property-image').html('<img class="property-image" src="' + imgSrc + '" />');
                $('#property-description').text(properties.text);
                $('#property-address').text(properties.printAddress);

                $('#tooltipSponsored').removeClass('hidden');
                var height = $('#tooltipSponsored').height();
                var x = parseInt(xcoor) - 150;
                var y = parseInt(ycoor) - (height+50);

                // keep the tooltip on the screen
                if (x < 10) {
                    x = 10;
                } else if (x > (osmApplication.widthFrame - 310)) {
                    x = osmApplication.widthFrame - 310;
                }

                if (y < 10) {
                    y = 10;
                }

                // show div with data populated at that screen location
                $('#tooltipSponsored').css('left', x);
                $('#tooltipSponsored').css('top', y);

                 // update share buttons
                osmApplication.updateSocialLinksClass(osmApplication.latLonClicked.latitude.toFixed(12), osmApplication.latLonClicked.longitude.toFixed(12), osmApplication.osmb.zoom.toFixed(1), osmApplication.osmb.tilt.toFixed(1), osmApplication.osmb.rotation.toFixed(1), 'true');

            } else if (splitId[0] == 'permitted') {
                // clear out previous data
                $('#property-projectName-permitted').text('');
                $('#property-image-permitted').html('');
                $('#property-description-permitted').html('');
                $('#property-address-permitted').html('');
                $('#property-stories-permitted').html('');
                $('#property-story1-permitted').html('');
                $('#property-pdf-permitted').html('');
                // look up properties
                var properties = osmApplication.permittedGeojsons[id].features[0].properties;
                // projectName
                if (typeof properties.projectName !== 'undefined' && properties.projectName) {
                    $('#property-projectName-permitted').text(properties.projectName);
                } else if (typeof properties.address !== 'undefined' && properties.address) {
                    $('#property-projectName-permitted').text(properties.address);
                }
                // image
                if (typeof properties.buildingImage !== 'undefined' && properties.buildingImage != 'visualizations/media/') {
                    $('#property-image-permitted').html('<img class="property-image" src="/' + properties.buildingImage + '" />');
                }
                // description
                if (typeof properties.description !== 'undefined' && properties.description) {
                    $('#property-description-permitted').html(properties.description + '<br />');
                }
                // address
                if (typeof properties.address !== 'undefined' && properties.address) {
                    $('#property-address-permitted').html(properties.address + '<br />');
                }
                // stories
                if (typeof properties.stories !== 'undefined' && properties.stories) {
                    if (properties.stories == '1') {
                        var suffix = ' story tall';
                    } else {
                        var suffix = ' stories tall';
                    }
                    $('#property-stories-permitted').html(properties.stories + suffix + '<br />');
                }
                // DNAinfo stories
                if (typeof properties.story1 !== 'undefined' && properties.story1) {
                    $('#property-story1-permitted').html('<a href="' + properties.story1 + '" target="_blank">Read More</a><br />');
                }
                // documents
                if (typeof properties.zoning_pdfs !== 'undefined' && properties.zoning_pdfs) {
                    $('#property-pdf-permitted').html('<a href="' + properties.zoning_pdfs + '" target="_blank">See Documents</a><br />');
                }

                $('#tooltipPermitted').removeClass('hidden');
                var height = $('#tooltipPermitted').height();
                var x = parseInt(xcoor) - 150;
                var y = parseInt(ycoor) - (height+50);

                // keep the tooltip on the screen
                if (x < 10) {
                    x = 10;
                } else if (x > (osmApplication.widthFrame - 310)) {
                    x = osmApplication.widthFrame - 310;
                }

                if (y < 10) {
                    y = 10;
                }

                // show div with data populated at that screen location
                $('#tooltipPermitted').css('left', x);
                $('#tooltipPermitted').css('top', y);

                 // update share buttons
                osmApplication.updateSocialLinksClass(osmApplication.latLonClicked.latitude.toFixed(12), osmApplication.latLonClicked.longitude.toFixed(12), osmApplication.osmb.zoom.toFixed(1), osmApplication.osmb.tilt.toFixed(1), osmApplication.osmb.rotation.toFixed(1), 'true');

            } else if (splitId[0] == 'dna') {
                // clear out previous data
                $('#property-projectName-dna').text('');
                $('#property-image-dna').html('');
                $('#property-description-dna').html('');
                $('#property-address-dna').html('');
                $('#property-stories-dna').html('');
                $('#property-story1-dna').html('');
                $('#property-pdf-dna').html('');
                $('#property-edit-dna').prop('href', '#');
                $('#property-remove-dna').prop('href', '#');
                // look up properties
                var properties = osmApplication.dnaGeojsons[id].features[0].properties;
                // projectName
                if (typeof properties.projectName !== 'undefined' && properties.projectName) {
                    $('#property-projectName-dna').text(properties.projectName);
                } else if (typeof properties.address !== 'undefined' && properties.address) {
                    $('#property-projectName-dna').text(properties.address);
                }
                // image
                if (typeof properties.buildingImage !== 'undefined' && properties.buildingImage != 'visualizations/media/') {
                    $('#property-image-dna').html('<img class="property-image" src="/' + properties.buildingImage + '" />');
                }
                // description
                if (typeof properties.description !== 'undefined' && properties.description) {
                    $('#property-description-dna').html(properties.description + '<br />');
                }
                // address
                if (typeof properties.address !== 'undefined' && properties.address) {
                    $('#property-address-dna').html(properties.address + '<br />');
                }
                // stories
                if (typeof properties.stories !== 'undefined' && properties.stories) {
                    if (properties.stories == '1') {
                        var suffix = ' story tall';
                    } else {
                        var suffix = ' stories tall';
                    }
                    $('#property-stories-dna').html(properties.stories + suffix + '<br />');
                }
                // DNAinfo stories
                if (typeof properties.story1 !== 'undefined' && properties.story1) {
                    $('#property-story1-dna').html('<a href="' + properties.story1 + '" target="_blank">Read More</a><br />');
                }
                // documents
                if (typeof properties.zoning_pdfs !== 'undefined' && properties.zoning_pdfs) {
                    $('#property-pdf-dna').html('<a href="' + properties.zoning_pdfs + '" target="_blank">See Documents</a><br />');
                }

                $('#tooltipDNA').removeClass('hidden');
                var height = $('#tooltipDNA').height();
                var x = parseInt(xcoor) - 150;
                var y = parseInt(ycoor) - (height+50);

                // keep the tooltip on the screen
                if (x < 10) {
                    x = 10;
                } else if (x > (osmApplication.widthFrame - 310)) {
                    x = osmApplication.widthFrame - 310;
                }

                if (y < 10) {
                    y = 10;
                }

                // show div with data populated at that screen location
                $('#tooltipDNA').css('left', x);
                $('#tooltipDNA').css('top', y);

                 // update share buttons
                osmApplication.updateSocialLinksClass(osmApplication.latLonClicked.latitude.toFixed(12), osmApplication.latLonClicked.longitude.toFixed(12), osmApplication.osmb.zoom.toFixed(1), osmApplication.osmb.tilt.toFixed(1), osmApplication.osmb.rotation.toFixed(1), 'true');

            } else if (splitId[0] == 'ugcApproved') {
                // clear out previous data
                $('#property-projectName-dna').text('');
                $('#property-image-dna').html('');
                $('#property-description-dna').html('');
                $('#property-address-dna').html('');
                $('#property-stories-dna').html('');
                $('#property-story1-dna').html('');
                $('#property-pdf-dna').html('');
                // look up properties
                var properties = osmApplication.ugcApprovedGeojsons[id].features[0].properties;
                console.log(properties);
                // projectName
                if (typeof properties.projectName !== 'undefined' && properties.projectName) {
                    $('#property-projectName-dna').text(properties.projectName);
                } else if (typeof properties.address !== 'undefined' && properties.address) {
                    $('#property-projectName-dna').text(properties.address);
                }
                // image
                if (typeof properties.buildingImage !== 'undefined' && properties.buildingImage != 'visualizations/media/') {
                    $('#property-image-dna').html('<img class="property-image" src="/' + properties.buildingImage + '" />');
                }
                // address
                if (typeof properties.address !== 'undefined' && properties.address) {
                    $('#property-address-dna').html(properties.address + '<br />');
                }
                // stories
                if (typeof properties.buildingStories !== 'undefined' && properties.buildingStories) {
                    if (properties.buildingStories == '1') {
                        var suffix = ' story tall';
                    } else {
                        var suffix = ' stories tall';
                    }
                    $('#property-stories-dna').html(properties.buildingStories + suffix + '<br />');
                }
                // URL
                if (typeof properties.buildingURL !== 'undefined' && properties.buildingURL) {
                    $('#property-story1-dna').html('<a href="' + properties.buildingURL + '" target="_blank">Read More</a><br />');
                }
                // documents
                if (typeof properties.buildingDoc !== 'undefined' && properties.buildingDoc) {
                    $('#property-pdf-dna').html('<a href="' + properties.buildingDoc + '" target="_blank">See Documents</a><br />');
                }

                // update share buttons
                osmApplication.updateSocialLinksClass(osmApplication.latLonClicked.latitude.toFixed(12), osmApplication.latLonClicked.longitude.toFixed(12), osmApplication.osmb.zoom.toFixed(1), osmApplication.osmb.tilt.toFixed(1), osmApplication.osmb.rotation.toFixed(1), 'true');

                $('#tooltipDNA').removeClass('hidden');
                var height = $('#tooltipDNA').height();
                var x = parseInt(xcoor) - 150;
                var y = parseInt(ycoor) - (height+50);

                // keep the tooltip on the screen
                if (x < 10) {
                    x = 10;
                } else if (x > (osmApplication.widthFrame - 310)) {
                    x = osmApplication.widthFrame - 310;
                }

                if (y < 10) {
                    y = 10;
                }

                // show div with data populated at that screen location
                $('#tooltipDNA').css('left', x);
                $('#tooltipDNA').css('top', y);


            } else if (splitId[0] == 'submitted') {
                // clear out previous data
                $('#property-address-submitted').html('');
                $('#property-stories-submitted').html('');

                let properties = osmApplication.submittedGeojsons[id].features[0].properties;


                if (typeof properties.address !== 'undefined' && properties.address) {
                    $('#property-address-submitted').text(properties.address);
                }

                $('#tooltipSubmitted').removeClass('hidden');
                var height = $('#tooltipSubmitted').height();
                var x = parseInt(xcoor) - 150;
                var y = parseInt(ycoor) - (height+50);

                // keep the tooltip on the screen
                if (x < 10) {
                    x = 10;
                } else if (x > (osmApplication.widthFrame - 310)) {
                    x = osmApplication.widthFrame - 310;
                }

                if (y < 10) {
                    y = 10;
                }

                // show div with data populated at that screen location
                $('#tooltipSubmitted').css('left', x);
                $('#tooltipSubmitted').css('top', y);

                 // update share buttons
                osmApplication.updateSocialLinksClass(osmApplication.latLonClicked.latitude.toFixed(12), osmApplication.latLonClicked.longitude.toFixed(12), osmApplication.osmb.zoom.toFixed(1), osmApplication.osmb.tilt.toFixed(1), osmApplication.osmb.rotation.toFixed(1), 'true');

            } else {
                if (!$('#tooltipPermitted').hasClass('hidden')) {
                    $('#tooltipPermitted').addClass('hidden');
                }
                if (!$('#tooltipSponsored').hasClass('hidden')) {
                    $('#tooltipSponsored').addClass('hidden');
                }
                if (!$('#tooltipDNA').hasClass('hidden')) {
                    $('#tooltipDNA').addClass('hidden');
                }
                if (!$('#tooltipSubmitted').hasClass('hidden')) {
                    $('#tooltipSubmitted').addClass('hidden');
                }
            }
        } else {

            if (!$('#tooltipPermitted').hasClass('hidden')) {
                $('#tooltipPermitted').addClass('hidden');
            }
            if (!$('#tooltipSponsored').hasClass('hidden')) {
                $('#tooltipSponsored').addClass('hidden');
            }
            if (!$('#tooltipDNA').hasClass('hidden')) {
                $('#tooltipDNA').addClass('hidden');
            }
            if (!$('#tooltipSubmitted').hasClass('hidden')) {
                $('#tooltipSubmitted').addClass('hidden');
            }
        }

    });

}


osmApplication.getSponsoredGeojsons = function() {
    $.ajax({
        type: "GET",
        url: "/skyline/chi/getSponsoredGeojsons/",
        success: function(data) {
            // load the draw tools
            if (data) {
                osmApplication.sponsoredGeojsons = {};
                for (var i = 0; i < data.length; i++) {
                    if (data[i]) {
                        var geojson = JSON.parse(data[i]);
                        var idNum = "sponsored_" + i;
                        osmApplication.sponsoredGeojsons[idNum] = geojson;
                        osmApplication.osmb.addGeoJSON(geojson, { id: idNum });
                    }
                }
            }
            // get permitted geojsons
            osmApplication.getPermittedGeojsons();
        }
    });
}

osmApplication.getPermittedGeojsons = function() {
    $.ajax({
        type: "GET",
        url: "/skyline/chi/getPermittedGeojsons/",
        success: function(data) {
            // load the draw tools
            if (data) {
                osmApplication.permittedGeojsons = {};
                for (var i = 0; i < data.length; i++) {
                    if (data[i]) {
                        var geojson = JSON.parse(data[i]);
                        var idNum = "permitted_" + i;
                        osmApplication.permittedGeojsons[idNum] = geojson;
                        osmApplication.osmb.addGeoJSON(geojson, { id: idNum });
                    }
                }
            }
            // get reporter geojsons
            osmApplication.getDNAGeojsons();
        }
    });
}

osmApplication.getDNAGeojsons = function() {
    $.ajax({
        type: "GET",
        url: "/skyline/chi/getReporterGeojsons/",
        success: function(data) {
            // load the draw tools
            if (data) {
                osmApplication.dnaGeojsons = {};
                for (var i = 0; i < data.length; i++) {
                    if (data[i]) {
                        var geojson = JSON.parse(data[i]);
                        var idNum = "dna_" + i;
                        osmApplication.dnaGeojsons[idNum] = geojson;
                        osmApplication.osmb.addGeoJSON(geojson, { id: idNum });
                    }
                }
            }
            // get UGC geojsons
            osmApplication.getUGCApprovedGeojsons();
        }
    });
}

osmApplication.getUGCApprovedGeojsons = function() {
    $.ajax({
        type: "GET",
        url: "/skyline/chi/getUGCApprovedGeojsons/",
        success: function(data) {
            // load the draw tools
            if (data) {
                osmApplication.ugcApprovedGeojsons = {};
                for (var i = 0; i < data.length; i++) {
                    if (data[i]) {
                        var geojson = JSON.parse(data[i]);
                        // change color of building
                        console.log(geojson);
                        geojson.features[0].properties.color = '#0073a2'
                        geojson.features[0].properties.roofColor = '#0073a2'
                        var idNum = "ugcApproved_" + i;
                        osmApplication.ugcApprovedGeojsons[idNum] = geojson;
                        osmApplication.osmb.addGeoJSON(geojson, { id: idNum });
                    }
                }
            }
            // if geojson is approved, skip adding and fire click at lat lon,
            osmApplication.getSubmittedGeojson();   
        }
    });
}

osmApplication.getSubmittedGeojson = function() {
    $.ajax({
        type: "GET",
        url: "/skyline/chi/getGeojson/" + objectID + "/",
        success: function(data) {
            // load the draw tools
            var lat, lon;
            if (data) {
                var geojson = JSON.parse(data);
                if (typeof geojson.features[0].geometry.coordinates[0][0][0][0] != 'undefined') {
                    lat = geojson.features[0].geometry.coordinates[0][0][0][1];
                    lon = geojson.features[0].geometry.coordinates[0][0][0][0];
                } else {
                    lat = geojson.features[0].geometry.coordinates[0][0][1];
                    lon = geojson.features[0].geometry.coordinates[0][0][0];
                }
                console.log(approved);  
                if (approved != 'True') {
                    // add to map 
                    var idNum = 'submitted_' + objectID;
                    osmApplication.submittedGeojsons = {};
                    // pan map
                    osmApplication.osmb.setPosition({ latitude: lat, longitude: lon });
                    osmApplication.osmb.addGeoJSON(geojson, { id: idNum });
                    osmApplication.submittedGeojsons[idNum] = geojson;                    
                } 


                // fire a click on lat lon, should open popup for both the approved and not yet approved geojsons
                setTimeout(function() {
                    pos = osmApplication.osmb.project(lat, lon, 0)
                    //Object {x: 617.5, y: 231.62057088852146, z: 0.9995772461863411}
                    osmApplication.onClick(pos.x, pos.y);
                }, 1000);

            }
        }
    });
};


osmApplication.destroy = function() {
    osmApplication.osmb.destroy();
}


osmApplication.updateSocialLinksClass = function (lat, lon, zoom, tilt, rotation, buildingShared) {
    // standard facebook and twitter variables
    osmApplication.app_id = '406014149589534';
    osmApplication.fblink = "https://visualizations.dnainfo.com/";
    osmApplication.fbpicture = "https://visualizations.dnainfo.com/visualizations/static/skyline_chi/css/images/FUTURE_SKYLINE_SOCIAL_SHARE.jpeg";
    osmApplication.fbname = "Going Up! How Tall Will New Buildings in My Neighborhood Be?";
    osmApplication.fbcaption = "DNAinfo Chicago";

    osmApplication.via = 'DNAinfoCHI';
    osmApplication.twittercaption = "This 3-D map shows what construction will do to my neighborhood's skyline: ";
    // set up facebook and twitter buttons
    osmApplication.fbdescription = "Every new building affects the character of a neighborhood, so DNAinfo created this 3-D map that helps you understand how high new buildings could be going up near you: ";
    // https://hzdl3dry-data-viz-future-map.build.qa.dnainfo.com/new-york/visualizations/skyline
    // http://localhost:8000/skyline/chi/browse/282/?lat=40.863743&lon=-73.862489
    osmApplication.sharelink = 'https://hzdl3dry-data-viz-future-map.build.qa.dnainfo.com/chicago/visualizations/skyline?browse&hood='+hoodID+'/?lat='+lat+'&lon='+lon+'&zoom='+zoom+'&tilt='+tilt+'&rotation='+rotation+'&buildingShared='+buildingShared;
    osmApplication.fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + osmApplication.app_id + '&display=popup&description='+ encodeURIComponent(osmApplication.fbdescription) + '&link=' + encodeURIComponent(osmApplication.sharelink) + '&redirect_uri=' + encodeURIComponent(osmApplication.fblink) + '&name=' + encodeURIComponent(osmApplication.fbname) + '&caption=' + encodeURIComponent(osmApplication.fbcaption) + '&picture=' + encodeURIComponent(osmApplication.fbpicture);
    osmApplication.fbOnclick = 'window.open("' + osmApplication.fbUrl + '","facebook-share-dialog","width=626,height=436");return false;';
    $('.showShareFB').attr("onclick", osmApplication.fbOnclick);

    osmApplication.twitterUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(osmApplication.sharelink) + '&via='+ encodeURIComponent(osmApplication.via) + '&text=' + encodeURIComponent(osmApplication.twittercaption);
    osmApplication.twitterOnclick = 'window.open("' + osmApplication.twitterUrl + '","twitter-share-dialog","width=626,height=436");return false;';
    $('.showShareTwitter').attr("onclick", osmApplication.twitterOnclick);
}

osmApplication.updateSocialLinksID = function (lat, lon, zoom, tilt, rotation, buildingShared) {
    // standard facebook and twitter variables
    osmApplication.app_id = '406014149589534';
    osmApplication.fblink = "https://visualizations.dnainfo.com/";
    osmApplication.fbpicture = "https://visualizations.dnainfo.com/visualizations/static/skyline_chi/css/images/FUTURE_SKYLINE_SOCIAL_SHARE.jpeg";
    osmApplication.fbname = "Going Up! How Tall Will New Buildings in My Neighborhood Be?";
    osmApplication.fbcaption = "DNAinfo Chicago";

    osmApplication.via = 'DNAinfoCHI';
    osmApplication.twittercaption = "This 3-D map shows what construction will do to my neighborhood's skyline: ";
    // set up facebook and twitter buttons
    osmApplication.fbdescription = "Every new building affects the character of a neighborhood, so DNAinfo created this 3-D map that helps you understand how high new buildings could be going up near you: ";
    // https://hzdl3dry-data-viz-future-map.build.qa.dnainfo.com/new-york/visualizations/skyline?result&hood=301&lat=40.772543&lon=-73.980238&zoom=15.2&tilt=45.0&rotation=0.0
    osmApplication.sharelink = 'https://hzdl3dry-data-viz-future-map.build.qa.dnainfo.com/chicago/visualizations/skyline?result&hood='+objectID+'?lat='+lat+'&lon='+lon+'&zoom='+zoom+'&tilt='+tilt+'&rotation='+rotation;
    osmApplication.fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + osmApplication.app_id + '&display=popup&description='+ encodeURIComponent(osmApplication.fbdescription) + '&link=' + encodeURIComponent(osmApplication.sharelink) + '&redirect_uri=' + encodeURIComponent(osmApplication.fblink) + '&name=' + encodeURIComponent(osmApplication.fbname) + '&caption=' + encodeURIComponent(osmApplication.fbcaption) + '&picture=' + encodeURIComponent(osmApplication.fbpicture);
    osmApplication.fbOnclick = 'window.open("' + osmApplication.fbUrl + '","facebook-share-dialog","width=626,height=436");return false;';
    $('#showShareFB').attr("onclick", osmApplication.fbOnclick);

    osmApplication.twitterUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(osmApplication.sharelink) + '&via='+ encodeURIComponent(osmApplication.via) + '&text=' + encodeURIComponent(osmApplication.twittercaption);
    osmApplication.twitterOnclick = 'window.open("' + osmApplication.twitterUrl + '","twitter-share-dialog","width=626,height=436");return false;';
    $('#showShareTwitter').attr("onclick", osmApplication.twitterOnclick);
}






