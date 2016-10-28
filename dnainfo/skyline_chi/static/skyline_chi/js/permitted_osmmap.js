/**
 * map.js: Creates map for selecting which pluto plot to use
 */

function osmApplication() {}

osmApplication.initialize = function() {

    var widthFrame = $('#content').width();
    if (widthFrame < 1200) {
        osmApplication.fastMode = true;
        osmApplication.shadows = [];
    } else {
        osmApplication.fastMode = false;
        osmApplication.shadows = ['shadows'];
    }


    osmApplication.osmb = new OSMBuildings({
        baseURL: '/visualizations/static/skyline/css/images',
        minZoom: 14,
        maxZoom: 19,
        tilt: 45,
        zoom: 18,
        position: { latitude: 40.710508, longitude: -73.943825 },
        state: osmApplication.fastMode,
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

    // get geojson
    osmApplication.getGeojson();

}


osmApplication.getGeojson = function() {
    $.ajax({
        type: "GET",
        url: "/skyline/admin/chi/permitted/getGeojson/" + objectID + "/",
        success: function(data) {
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
                osmApplication.osmb.setPosition({ latitude: lat, longitude: lon });
                osmApplication.addedLayer = osmApplication.osmb.addGeoJSON(geojson, { id: 'permitted_geojson' });

            }
        }
    });
}

osmApplication.destroy = function() {
    osmApplication.osmb.destroy();
}
