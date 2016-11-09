/**
 * browse.js: Creates OSM Buildings map browse view 
 */

function osmApplication() {}

osmApplication.initialize = function() {

    osmApplication.widthFrame = $('#content').width();
    if (osmApplication.widthFrame < 1200) {
        osmApplication.shadows = [];
    } else {
        osmApplication.shadows = ['shadows'];
    }

    osmApplication.osmb = new OSMBuildings({
        baseURL: '/visualizations/static/skyline/css/images',
        minZoom: 14,
        maxZoom: 19,
        tilt: 45,
        zoom: 17,
        position: { latitude: this.center[0], longitude: this.center[1] },
        state: true,
        effects: osmApplication.shadows,
        attribution: '© 3D <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>. Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, under <a href=\"https://creativecommons.org/licenses/by/3.0/\" target=\"_blank\">CC BY 3.0</a>. Data by <a href=\"http://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>, under ODbL.'
    }).appendTo("osmmap");

    osmApplication.osmb.addMapTiles('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', { attribution: 'Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, under <a href=\"https://creativecommons.org/licenses/by/3.0/\" target=\"_blank\">CC BY 3.0</a>. Data by <a href=\"http://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>, under ODbL.' });

    osmApplication.osmb.addGeoJSONTiles('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');

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

    // osm building click
    osmApplication.osmb.on('click', function(e) {
        console.log(e);
        if (e.x) {
            var xcoor = e.x;
            var ycoor = e.y;
        } else {
            var xcoor = e.clientX;
            var ycoor = e.clientY;
        }
        osmApplication.osmb.getTarget(xcoor, ycoor, function(id) {
            console.log(id);
            if (id) {
                splitId = id.split('_');

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
                    var y = parseInt(ycoor) - height;

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

                } else if (splitId[0] == 'permitted') {
                    // clear out previous data
                    $('#property-projectName-permitted').text('');
                    $('#property-image-permitted').html('');
                    $('#property-description-permitted').html('');
                    $('#property-address-permitted').html('');
                    $('#property-stories-permitted').html('');
                    $('#property-story1-permitted').html('');
                    $('#property-pdf-permitted').html('');
                    $('#property-edit-permitted').prop('href', '#');
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
                        $('#property-pdf-permitted').html('<a href="/' + properties.zoning_pdfs + '" target="_blank">See Documents</a><br />');
                    }
                    // links for editing

                    // edit link /skyline/admin/nyc/permitted/buildingHeight/ID/
                    var editHref = '/skyline/admin/nyc/permitted/buildingHeight/' + properties.objectID
                    $('#property-edit-permitted').prop('href', editHref);

                    $('#tooltipPermitted').removeClass('hidden');
                    var height = $('#tooltipPermitted').height();
                    var x = parseInt(xcoor) - 150;
                    var y = parseInt(ycoor) - height;

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

                    // links for editing and deleting 

                    // edit link /skyline/admin/nyc/reporter/buildingHeight/ID/
                    var editHref = '/skyline/admin/nyc/reporter/buildingHeight/' + properties.objectID + '/'
                    $('#property-edit-dna').prop('href', editHref);
                    // remove link /skyline/admin/nyc/reporter/remove/ID/
                    var removeHref = '/skyline/admin/nyc/reporter/remove/' + properties.objectID + '/'
                    $('#property-remove-dna').prop('href', removeHref);


                    $('#tooltipDNA').removeClass('hidden');
                    var height = $('#tooltipDNA').height();
                    var x = parseInt(xcoor) - 150;
                    var y = parseInt(ycoor) - height;

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
            }

        });
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
    });

    // create listener for closing tooltip
    $('.tooltip-close').click(function() {
        $('.tooltip').addClass('hidden');
    });

    // get geojson
    osmApplication.getGeojson();

    // get sponsored content
    osmApplication.getSponsoredGeojsons();

    // get permitted buildings from DOB
    osmApplication.getPermittedGeojsons();

    // get permitted buildings from DOB
    osmApplication.getDNAGeojsons();

}

osmApplication.getGeojson = function () {
    $.ajax({
        type: "GET",
        url: "/skyline/nyc/getGeojson/"+ objectID +"/",
        success: function(data){
            // load the draw tools
            if (data) {
                var geojson = JSON.parse(data);
                if (typeof geojson.features[0].geometry.coordinates[0][0][0][0] != 'undefined') {
                    var lat = geojson.features[0].geometry.coordinates[0][0][0][1];
                    var lon = geojson.features[0].geometry.coordinates[0][0][0][0]; 
                } else {
                    var lat = geojson.features[0].geometry.coordinates[0][0][1];
                    var lon = geojson.features[0].geometry.coordinates[0][0][0];
                }
                // pan map
                osmApplication.osmb.setPosition({ latitude:lat, longitude:lon });
                osmApplication.osmb.addGeoJSON(geojson, {id: 'userGeojson'});

            } 
        }
    });
}

osmApplication.getSponsoredGeojsons = function() {
    $.ajax({
        type: "GET",
        url: "/skyline/nyc/getSponsoredGeojsons/",
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
        }
    });
}

osmApplication.getPermittedGeojsons = function() {
    $.ajax({
        type: "GET",
        url: "/skyline/nyc/getPermittedGeojsons/" + boro + "/",
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
        }
    });
}

osmApplication.getDNAGeojsons = function() {
    $.ajax({
        type: "GET",
        url: "/skyline/nyc/getReporterGeojsons/",
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
        }
    });
}

osmApplication.destroy = function() {
    osmApplication.osmb.destroy();
}