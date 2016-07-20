/**
 * map.js: Creates map for selecting which pluto plot to use
 */

function osmApplication() {}

osmApplication.initialize = function () {

	osmApplication.osmb = new OSMBuildings({
		baseURL: '/static/skyline/css/images',
		minZoom: 16,
		maxZoom: 19,
		tilt: 45,
		zoom: 18,
		position: { latitude:40.710508, longitude:-73.943825 },
		state: false,
		effects: ['shadows'],
		attribution: '© 3D <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>. Map tiles by <a href=\"http://cartodb.com/attributions#basemaps\">CartoDB</a>, under <a href=\"https://creativecommons.org/licenses/by/3.0/\" target=\"_blank\">CC BY 3.0</a>. Data by <a href=\"http://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>, under ODbL.'
	}).appendTo("osmmap");

	osmApplication.osmb.addMapTiles('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png', { attribution: 'Map tiles by <a href=\"http://cartodb.com/attributions#basemaps\">CartoDB</a>, under <a href=\"https://creativecommons.org/licenses/by/3.0/\" target=\"_blank\">CC BY 3.0</a>. Data by <a href=\"http://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>, under ODbL.' }
	);

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
		  	if (property == 'Zoom') {
		  		var zoomNow = osmApplication.osmb['get'+ property]();
		  		if (zoomNow <= 17 && direction == -1) {
		  			// don't zoom below 17
		  		} else if (zoomNow >= 19 && direction == 1) {
		  			// don't zoom above 19
		  		} else {
		  			osmApplication.osmb['set'+ property](osmApplication.osmb['get'+ property]()+increment);			  			
		  		}
		  	} else {
		  		osmApplication.osmb['set'+ property](osmApplication.osmb['get'+ property]()+increment);	
		  	} 
		  }

		});
	}

	// osm building click
	osmApplication.osmb.on('click', function(e) {
	  console.log(e);
	  osmApplication.osmb.getTarget(e.x, e.y, function(id) {
	  	console.log(id);
	  	splitId = id.split('_');
	    if (splitId[0] == 'sponsored') {
	    	var x = parseInt(e.x) - 150;
	    	var y = parseInt(e.y) - 250; 
		    // show div with data populated at that screen location
		    $('#tooltip').css('left', x);
		    $('#tooltip').css('top', y);
		    $('#tooltip').removeClass('hidden');

	    } else {
		  	if(!$('#tooltip').hasClass('hidden')) {
		  		$('#tooltip').addClass('hidden');
		  	}
	    }
	  });
	});

	// close sponsored tooltip if the map changes
	osmApplication.osmb.on('change', function(e) {
		if(!$('#tooltip').hasClass('hidden')) {
	  		$('#tooltip').addClass('hidden');
	  	}
	});

	// create listener for closing tooltip
	$('.sponsored-close').click(function() {
		$('#tooltip').addClass('hidden');
	});

	// get geojson
	osmApplication.getGeojson();

}


osmApplication.getGeojson = function () {
	$.ajax({
		type: "GET",
		url: "/skyline/admin/nyc/sponsored/getGeojson/"+ objectID +"/",
		success: function(data){
			// load the draw tools
			if (data) {
				var geojson = JSON.parse(data);
				var lat = geojson.features[0].geometry.coordinates[0][0][1];
				var lon = geojson.features[0].geometry.coordinates[0][0][0];
				// pan map
				osmApplication.osmb.setPosition({ latitude:lat, longitude:lon });
				osmApplication.addedLayer = osmApplication.osmb.addGeoJSON(geojson, {id: 'sponsored_geojson'});

			} 
        }
	});
}

osmApplication.destroy = function () {
	osmApplication.osmb.destroy();
}

