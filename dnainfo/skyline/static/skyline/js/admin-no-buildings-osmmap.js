/**
 * map.js: Creates map for selecting which pluto plot to use
 */

function osmApplication() {}

osmApplication.initialize = function () {

	osmApplication.map = new GLMap('osmmap', {
		position: { latitude:40.710508, longitude:-73.943825 },
		zoom: 18,
		minZoom: 12,
		maxZoom: 20,
		tilt: 45,
		state: false // stores map position/rotation in url
	});

	osmApplication.osmb = new OSMBuildings({
		baseURL: '../static/skyline/css/images',
		minZoom: 15,
		maxZoom: 22,
		style: { color: 'rgb(0, 0, 0)' },
		effects: ['shadows'],
		attribution: '© 3D <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>. Map tiles by <a href=\"http://cartodb.com/attributions#basemaps\">CartoDB</a>, under <a href=\"https://creativecommons.org/licenses/by/3.0/\" target=\"_blank\">CC BY 3.0</a>. Data by <a href=\"http://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>, under ODbL.'
	}).addTo(osmApplication.map);

	osmApplication.osmb.addMapTiles('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png', { attribution: 'Map tiles by <a href=\"http://cartodb.com/attributions#basemaps\">CartoDB</a>, under <a href=\"https://creativecommons.org/licenses/by/3.0/\" target=\"_blank\">CC BY 3.0</a>. Data by <a href=\"http://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>, under ODbL.' }
	);

	osmApplication.osmb.addGeoJSONTiles('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json', { color: 'rgb(220, 210, 200)' });


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
		    increment = direction*10;
		  }
		  if (parentClassList.contains('rotation')) {
		    property = 'Rotation';
		    increment = direction*10;
		  }
		  if (parentClassList.contains('zoom')) {
		    property = 'Zoom';
		    increment = direction*1;
		  }
		  if (property) {
		    osmApplication.map['set'+ property](osmApplication.map['get'+ property]()+increment);
		  }
		});
	}

}




