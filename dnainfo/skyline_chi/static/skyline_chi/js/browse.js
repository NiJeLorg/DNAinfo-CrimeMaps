/**
 * browse.js: Creates OSM Buildings map browse view
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

    this.center = center(dnaUrl);

    osmApplication.osmb = new OSMBuildings({
        baseURL: '/visualizations/static/skyline_chi/css/images',
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

    osmApplication.osmb.addGeoJSONTiles('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json', { color: 'rgb(220, 210, 200)' });

    // set initial conditons for share buttons
    osmApplication.updateSocialLinks(osmApplication.osmb.position.latitude.toFixed(6), osmApplication.osmb.position.longitude.toFixed(6), osmApplication.osmb.zoom.toFixed(1), osmApplication.osmb.tilt.toFixed(1), osmApplication.osmb.rotation.toFixed(1), 'false');

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

    // listen for touch events and doe the same thing as clicking
    osmApplication.osmb.on('touchstart', function(e) {
        var xcoor = e.touches[0].clientX;
        var ycoor = e.touches[0].clientY;
        osmApplication.onClick(xcoor, ycoor);
    });

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


    // close sponsored tooltip if the map changes
    osmApplication.osmb.on('change', function(e) {
        // close all of the tooltips
        if (!$('#tooltipPermitted').hasClass('hidden')) {
            $('#tooltipPermitted').addClass('hidden');
        }
        if (!$('#tooltipSponsored').hasClass('hidden')) {
            $('#tooltipSponsored').addClass('hidden');
        }
        if (!$('#tooltipDNA').hasClass('hidden')) {
            $('#tooltipDNA').addClass('hidden');
        }

        $(".browseNavTitle").fadeOut( "slow" );

        // check browser with and set top of .select-parent if width > 500
        if ($("body").width() > 500) {
            $(".select-parent").css( "top", "20px" );
        }

        // send lat, lon, zoom, tilt, rotation to social share buttons
        osmApplication.updateSocialLinks(osmApplication.osmb.position.latitude.toFixed(6), osmApplication.osmb.position.longitude.toFixed(6), osmApplication.osmb.zoom.toFixed(1), osmApplication.osmb.tilt.toFixed(1), osmApplication.osmb.rotation.toFixed(1), 'false');

    });

    // create listener for closing tooltip
    $(document).on('click', '.tooltip-close', function() {
        $('.tooltip').addClass('hidden');
    });

    // get sponsored content
    osmApplication.getSponsoredGeojsons();


    function center(neighborhood) {
        var lookup = {
            "austin-belmont-cragin": [41.932598, -87.770290],
            "pullman-roseland": [41.702316, -87.615280],
            "bridgeport-chinatown-mckinley-park": [41.838321, -87.645348],
            "downtown-south-loop-river-north": [41.892778, -87.632561],
            "englewood-auburn-gresham-chatham": [41.745867, -87.641716],
            "hyde-park-kenwood": [41.802759, -87.594252],
            "jefferson-park-portage-park-norwood-park": [41.987104, -87.783508],
            "lakeview-wrigleyville": [41.941026, -87.649441],
            "lincoln-park-old-town": [41.913823, -87.639656],
            "lincoln-square-albany-park-irving-park": [41.952500, -87.729722],
            "logan-square-humboldt-park": [41.929534, -87.707688],
            "midway-chicago-lawn-ashburn": [41.741667, -87.7125],
            "pilsen-little-village-near-west-side": [41.855678, -87.665943],
            "rogers-park-edgewater": [42.009444, -87.675556],
            "south-chicago-east-side": [41.726667, -87.547778],
            "wicker-park-bucktown": [41.907163, -87.674595],
            "back-of-yards-brighton-park": [41.807533, -87.666163],
            "beverly-mt-greenwood-morgan-park": [41.691732, -87.692883],
            "bronzeville-washington-park": [41.803932, -87.615016],
            "garfield-park-north-lawndale": [41.910094, -87.718854],
            "uptown-andersonville": [41.971923, -87.669718],
            "austin": [41.892953, -87.761562],
            "humboldt-park": [41.901704, -87.702482],
            "garfield-park": [41.881308, -87.714772],
            "east-garfield-park": [41.881858, -87.702482],
            "montclare": [41.929385, -87.798165],
            "beverly": [41.717120, -87.67618],
            "morgan-park": [41.687840, -87.669003],
            "washington-heights": [41.715964, -87.650631],
            "roseland": [41.710205, -87.620571],
            "pullman": [41.689521, -87.606081],
            "west-pullman": [41.671640, -87.633445],
            "mt-greenwood": [41.693154, -87.712335],
            "riverdale": [41.661064, -87.603826],
            "bridgeport": [41.836544, -87.649508],
            "back-of-yards": [41.806677, -87.667977],
            "chinatown": [41.850691, -87.634049],
            "armour-square": [41.840755, -87.634019],
            "fuller-park": [41.809120, -87.632351],
            "brighton-park": [41.819380, -87.699025],
            "mckinley-park": [41.831618, -87.672907],
            "new-city": [41.808692, -87.659917],
            "gage-park": [41.795436, -87.696226],
            "canaryville": [41.813579, -87.640847],
            "gold-coast": [41.905825, -87.627304],
            "river-north": [41.892385, -87.634075],
            "streeterville": [41.892736, -87.620042],
            "loop": [41.883734, -87.628858],
            "south-loop": [41.856545, -87.627184],
            "englewood": [41.775305, -87.641642],
            "west-englewood": [41.775792, -87.666617],
            "auburn-gresham": [41.743377, -87.6562],
            "grand-crossing": [41.763414, -87.595383],
            "chatham": [41.740994, -87.613882],
            "hyde-park": [41.794295, -87.590701],
            "south-shore-above-79th": [41.760787, -87.574189],
            "kenwood": [41.809477, -87.593266],
            "oakland": [41.822682, -87.601355],
            "washington-park": [41.793204, -87.617598],
            "woodlawn": [41.780228, -87.593909],
            "bronzeville": [41.825105, -87.617602],
            "douglas": [41.834674, -87.617939],
            "jefferson-park": [41.971389, -87.763333],
            "portage-park": [41.953662, -87.76449],
            "edison-park": [42.005449, -87.81329],
            "norwood-park": [41.985631, -87.806928],
            "dunning": [41.947285, -87.806512],
            "ohare": [41.977298, -87.836891],
            "sauganash": [41.978009, -87.743039],
            "lakeview": [41.941527, -87.662232],
            "boystown": [41.943998, -87.647385],
            "wrigleyville": [41.949062, -87.656516],
            "lincoln-park": [41.921438, -87.651304],
            "old-town": [41.907657, -87.637414],
            "lincoln-square": [41.969948, -87.688678],
            "north-center": [41.950891, -87.682768],
            "ravenswood": [41.968185, -87.680303],
            "roscoe-village": [41.942560, -87.680155],
            "albany-park": [41.968972, -87.719724],
            "irving-park": [41.952500, -87.729722],
            "north-park": [41.984320, -87.725986],
            "logan-square": [41.923060, -87.709291],
            "belmont-cragin": [41.926392, -87.765942],
            "hermosa": [41.921508, -87.734383],
            "avondale": [41.941501, -87.702502],
            "marquette-park": [41.765650, -87.699073],
            "gage-park": [41.795436, -87.696226],
            "garfield-ridge": [41.794149, -87.770607],
            "clearing": [41.778385, -87.769239],
            "archer-heights": [41.810847, -87.726356],
            "west-lawn": [41.772966, -87.722187],
            "west-elsdon": [41.792862, -87.722168],
            "ashburn": [41.741667, -87.7125],
            "greektown": [41.878564, -87.64705],
            "little-italy": [41.868607, -87.660579],
            "pilsen": [41.856228, -87.656346],
            "little-village": [41.845816, -87.705823],
            "north-lawndale": [41.858485, -87.713864],
            "south-lawndale": [41.837922, -87.713569],
            "rogers-park": [42.009444, -87.675556],
            "edgewater": [41.987245, -87.661233],
            "andersonville": [41.979572, -87.670077],
            "uptown": [41.966542, -87.653323],
            "west-ridge": [42.000580, -87.692577],
            "south-chicago": [41.739653, -87.554462],
            "avalon-park": [41.747774, -87.590882],
            "calumet-heights": [41.729815, -87.570401],
            "burnside": [41.728130, -87.596418],
            "hegewisch": [41.655496, -87.545862],
            "east-side": [41.708035, -87.535195],
            "south-deering": [41.685246, -87.569246],
            "wicker-park": [41.908803, -87.679598],
            "bucktown": [41.922707, -87.680275],
            "ukrainian-village": [41.899413, -87.684485],
            "west-town": [41.893595, -87.672167],
            "west-rogers-park": [42.000580, -87.692577],
            "bush": [41.743233, -87.545766],
            "south-shore": [41.760787, -87.574189],
            "east-village": [41.899811, -87.672294],
            "south-austin": [41.882538, -87.760174],
            "noble-square": [41.899331, -87.663851],
            "west-beverly": [41.705689, -87.686675],
            "brainerd": [41.727335, -87.653292],
            "altgeld-gardens": [41.654165, -87.599686],
            "downtown": [41.878114, -87.629798],
            "river-west": [41.894433, -87.649481],
            "pill-hill": [41.726253, -87.575775],
            "jackson-highlands": [41.768781, -87.577894],
            "gap": [41.834294, -87.619915],
            "grand-boulevard": [41.813168, -87.617756],
            "gladstone-park": [41.979722, -87.778056],
            "forest-glen": [41.978185, -87.755561],
            "edgebrook": [41.997778, -87.765556],
            "north-edgebrook": [42.008533, -87.780023],
            "old-edgebrook": [41.994802, -87.767687],
            "ravenswood-manor": [41.964889, -87.70125],
            "mayfair": [41.959722, -87.745833],
            "west-humboldt-park": [41.902545, -87.735291],
            "chicago-lawn": [41.771942, -87.69541],
            "midway": [41.786610, -87.737875],
            "ford-city": [41.758665, -87.731114],
            "university-village": [41.868607, -87.660579],
            "tri-taylor": [41.870321, -87.684],
            "medical-district": [41.870551, -87.665753],
            "near-west-side": [41.881064, -87.663045],
            "near-north-side": [41.900361, -87.633348],
            "west-loop": [41.882457, -87.644678],
            "heart-of-chicago": [41.856028, -87.676171],
            "heart-of-italy": [41.848614, -87.684616],
            "old-irving-park": [41.952751, -87.736583],
            "ravenswood-gardens": [41.964741, -87.693858],
            "galewood": [41.915978, -87.798465],
            "independence-park": [41.952637, -87.723726],
            "buena-park": [41.957676, -87.650714],

        }

        if (lookup[neighborhood]) {         
            return lookup[neighborhood];
        } else {
            return [41.848614, -87.684616];
        }
    }

}

osmApplication.onClick = function (xcoor, ycoor) {
    osmApplication.osmb.getTarget(parseInt(xcoor), parseInt(ycoor), function(id) {
        console.log(id, 'ID');
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

        // get lat lon of where the person clicked
        osmApplication.latLonClicked = osmApplication.osmb.unproject(xcoor, ycoor);
 
        if (id) {
            splitId = id.split('_');

            if (splitId[0] == 'sponsored') {
                // clear out previous data
                $('#property-name').html('');
                $('#property-image').html('');
                $('#property-description').html('');
                $('#property-address').html('');
                // look up properties
                properties = osmApplication.sponsoredGeojsons[id].features[0].properties;
                $('#property-name').html(properties.name);
                var imgSrc = '/visualizations/media/' + properties.image;
                $('#property-image').html('<img class="property-image" src="' + imgSrc + '" />');
                $('#property-description').html(properties.text);
                $('#property-address').html(properties.printAddress);

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
                osmApplication.updateSocialLinks(osmApplication.latLonClicked.latitude.toFixed(12), osmApplication.latLonClicked.longitude.toFixed(12), osmApplication.osmb.zoom.toFixed(1), osmApplication.osmb.tilt.toFixed(1), osmApplication.osmb.rotation.toFixed(1), 'true');
               


            } else if (splitId[0] == 'permitted') {
                // clear out previous data
                $('#property-projectName-permitted').html('');
                $('#property-image-permitted').html('');
                $('#property-description-permitted').html('');
                $('#property-address-permitted').html('');
                $('#property-stories-permitted').html('');
                $('#property-story1-permitted').html('');
                $('#property-pdf-permitted').html('');

                // look up properties
                var properties = osmApplication.permittedGeojsons[id].features[0].properties;
                console.log(properties);
                // projectName
                if (typeof properties.projectName !== 'undefined' && properties.projectName) {
                    $('#property-projectName-permitted').html(properties.projectName);
                } else if (typeof properties.address !== 'undefined' && properties.address) {
                    $('#property-projectName-permitted').html(properties.address);
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

                // update share buttons

                osmApplication.updateSocialLinks(osmApplication.latLonClicked.latitude.toFixed(12), osmApplication.latLonClicked.longitude.toFixed(12), osmApplication.osmb.zoom.toFixed(1), osmApplication.osmb.tilt.toFixed(1), osmApplication.osmb.rotation.toFixed(1), 'true');

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


            } else if (splitId[0] == 'dna') {
                // clear out previous data
                $('#property-projectName-dna').html('');
                $('#property-image-dna').html('');
                $('#property-description-dna').html('');
                $('#property-address-dna').html('');
                $('#property-stories-dna').html('');
                $('#property-story1-dna').html('');
                $('#property-pdf-dna').html('');
                // look up properties
                var properties = osmApplication.dnaGeojsons[id].features[0].properties;
                                
                // projectName
                if (typeof properties.projectName !== 'undefined' && properties.projectName) {
                    $('#property-projectName-dna').html(properties.projectName);
                } else if (typeof properties.buildingAddress !== 'undefined' && properties.buildingAddress) {
                    $('#property-projectName-dna').html(properties.buildingAddress);
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
                if (typeof properties.buildingAddress !== 'undefined' && properties.buildingAddress) {
                    $('#property-address-dna').html(properties.buildingAddress + '<br />');
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

                // update share buttons
                osmApplication.updateSocialLinks(osmApplication.latLonClicked.latitude.toFixed(12), osmApplication.latLonClicked.longitude.toFixed(12), osmApplication.osmb.zoom.toFixed(1), osmApplication.osmb.tilt.toFixed(1), osmApplication.osmb.rotation.toFixed(1), 'true');

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

            } else if (splitId[0] == 'ugcApproved') {
                // clear out previous data
                $('#property-projectName-dna').html('');
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
                    $('#property-projectName-dna').html(properties.projectName);
                } else if (typeof properties.address !== 'undefined' && properties.address) {
                    $('#property-projectName-dna').html(properties.address);
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
                osmApplication.updateSocialLinks(osmApplication.latLonClicked.latitude.toFixed(12), osmApplication.latLonClicked.longitude.toFixed(12), osmApplication.osmb.zoom.toFixed(1), osmApplication.osmb.tilt.toFixed(1), osmApplication.osmb.rotation.toFixed(1), 'true');

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
            // get permitted buildings from DOB
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
            // get UGC submitted buildings
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
                        geojson.features[0].properties.color = '#0073a2'
                        geojson.features[0].properties.roofColor = '#0073a2'
                        var idNum = "ugcApproved_" + i;
                        osmApplication.ugcApprovedGeojsons[idNum] = geojson;
                        osmApplication.osmb.addGeoJSON(geojson, { id: idNum });
                    }
                }
            }
            // get reporter submitted buildings
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
            // fire a click in osmx and osmy are set
            setTimeout(function() {
                pos = osmApplication.osmb.project(getlat, getlon, 0)
                //Object {x: 617.5, y: 231.62057088852146, z: 0.9995772461863411}
                if (buildingShared == 'true') {
                    osmApplication.onClick(pos.x, pos.y);
                }
            }, 1000);
            
        }
    });
}

osmApplication.destroy = function() {
    osmApplication.osmb.destroy();
}


osmApplication.updateSocialLinks = function (lat, lon, zoom, tilt, rotation, buildingShared) {
    // set up facebook and twitter buttons
    osmApplication.fbdescription = "Every new building affects the character of a neighborhood, so DNAinfo created this 3-D map that helps you understand how high new buildings could be going up near you: ";
    // https://hzdl3dry-data-viz-future-map.build.qa.dnainfo.com/new-york/visualizations/skyline?browse&hood=58&lat=40.772543&lon=-73.980238&zoom=15.2&tilt=45.0&rotation=0.0&building=true
    osmApplication.sharelink = 'https://www.dnainfo.com/chicago/visualizations/skyline?browse&hood='+hoodID+'?lat='+lat+'&lon='+lon+'&zoom='+zoom+'&tilt='+tilt+'&rotation='+rotation+'&building='+buildingShared;
    osmApplication.fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + osmApplication.app_id + '&display=popup&description='+ encodeURIComponent(osmApplication.fbdescription) + '&link=' + encodeURIComponent(osmApplication.sharelink) + '&redirect_uri=' + encodeURIComponent(osmApplication.fblink) + '&name=' + encodeURIComponent(osmApplication.fbname) + '&caption=' + encodeURIComponent(osmApplication.fbcaption) + '&picture=' + encodeURIComponent(osmApplication.fbpicture);
    osmApplication.fbOnclick = 'window.open("' + osmApplication.fbUrl + '","facebook-share-dialog","width=626,height=436");return false;';
    $('.showShareFB').attr("onclick", osmApplication.fbOnclick);

    osmApplication.twitterUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(osmApplication.sharelink) + '&via='+ encodeURIComponent(osmApplication.via) + '&text=' + encodeURIComponent(osmApplication.twittercaption);
    osmApplication.twitterOnclick = 'window.open("' + osmApplication.twitterUrl + '","twitter-share-dialog","width=626,height=436");return false;';
    $('.showShareTwitter').attr("onclick", osmApplication.twitterOnclick);
}

// standard facebook and twitter variables
osmApplication.app_id = '406014149589534';
osmApplication.fblink = "https://visualizations.dnainfo.com/";
osmApplication.fbpicture = "https://visualizations.dnainfo.com/visualizations/static/skyline_chi/css/images/FUTURE_SKYLINE_SOCIAL_SHARE.jpeg";
//osmApplication.fbname = "Going Up! How Tall Will New Buildings in My Neighborhood Be?";
osmApplication.fbname = "How Tall Will New Buildings in My Chicago Neighborhood Be?";    
osmApplication.fbcaption = "DNAinfo Chicago";
osmApplication.via = 'DNAinfoCHI';
osmApplication.twittercaption = "This 3-D map shows what construction will do to my neighborhood's skyline: ";




