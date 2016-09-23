/**
 * map.js: Creates map for selecting which pluto plot to use
 */

function osmApplication() {}

osmApplication.initialize = function () {

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
		minZoom: 16,
		maxZoom: 19,
		tilt: 45,
		zoom: 18,
		position: { latitude:40.710508, longitude:-73.943825 },
		state: false,
		fastMode: osmApplication.fastMode,
		effects: osmApplication.shadows,
		attribution: '© 3D <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>. Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, under <a href=\"https://creativecommons.org/licenses/by/3.0/\" target=\"_blank\">CC BY 3.0</a>. Data by <a href=\"http://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>, under ODbL.'
	}).appendTo('osmmap');

	osmApplication.osmb.addMapTiles('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', { attribution: 'Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, under <a href=\"https://creativecommons.org/licenses/by/3.0/\" target=\"_blank\">CC BY 3.0</a>. Data by <a href=\"http://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>, under ODbL.' }
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
	  osmApplication.osmb.getTarget(e.x, e.y, function(id) {
	  	if (id) {
		  	splitId = id.split('_');

		    if (splitId[0] == 'sponsored') {
		    	// look up properties
		    	var lookupId = parseInt(splitId[1]);
		    	var properties = osmApplication.sponsoredGeojsons[lookupId].features[0].properties;
		    	console.log(properties);
		    	$('#property-name').text(properties.name);
		    	var imgSrc = '/visualizations/media/' + properties.image
		    	$('#property-image').prop('src', imgSrc);
		    	$('#property-description').text(properties.text);
		    	$('#property-address').text(properties.printAddress);
		    	var x = parseInt(e.x) - 150;
		    	var y = parseInt(e.y) - 250; 
			    // show div with data populated at that screen location
			    $('#tooltipSponsored').css('left', x);
			    $('#tooltipSponsored').css('top', y);
			    $('#tooltipSponsored').removeClass('hidden');

		    } else if (splitId[0] == 'permitted') {
		    	// look up properties
		    	var lookupId = parseInt(splitId[1]);
		    	var properties = osmApplication.permittedGeojsons[lookupId].features[0].properties;
		    	console.log(properties);
		    	$('#property-address-permitted').text(properties.address);
		    	$('#property-stories-permitted').text(properties.stories+ ' Stories');
		    	if (properties.pdf != 'visualizations/media/') {
		    		$('#property-pdf-permitted').html('Read More: <a href="/' + properties.pdf +'" target="_blank">DOB Records</a>');
		    	} 
		    	var x = parseInt(e.x) - 150;
		    	var y = parseInt(e.y) - 250; 
			    // show div with data populated at that screen location
			    $('#tooltipPermitted').css('left', x);
			    $('#tooltipPermitted').css('top', y);
			    $('#tooltipPermitted').removeClass('hidden');


			} else {
			  	if(!$('#tooltipPermitted').hasClass('hidden')) {
			  		$('#tooltipPermitted').addClass('hidden');
			  	}
			  	if(!$('#tooltipSponsored').hasClass('hidden')) {
			  		$('#tooltipSponsored').addClass('hidden');
			  	}
		    }	  		
	  	} else {
	  		
		  	if(!$('#tooltipPermitted').hasClass('hidden')) {
		  		$('#tooltipPermitted').addClass('hidden');
		  	}	  		
		  	if(!$('#tooltipSponsored').hasClass('hidden')) {
		  		$('#tooltipSponsored').addClass('hidden');
		  	}
	  	}

	  });
	});

	// close sponsored tooltip if the map changes
	osmApplication.osmb.on('change', function(e) {
	  	if(!$('#tooltipPermitted').hasClass('hidden')) {
	  		$('#tooltipPermitted').addClass('hidden');
	  	}	  		
	  	if(!$('#tooltipSponsored').hasClass('hidden')) {
	  		$('#tooltipSponsored').addClass('hidden');
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

osmApplication.getSponsoredGeojsons = function () {
	$.ajax({
		type: "GET",
		url: "/skyline/nyc/getSponsoredGeojsons/",
		success: function(data){
			// load the draw tools
			if (data) {
				osmApplication.sponsoredGeojsons = [];
				for (var i = 0; i < data.length; i++) {
					var geojson = JSON.parse(data[i]);
					osmApplication.sponsoredGeojsons.push(geojson);
					var idNum = "sponsored_" + i;
					osmApplication.osmb.addGeoJSON(geojson, {id: idNum});
				}
				
			} 
        }
	});
}

osmApplication.getPermittedGeojsons = function () {
	$.ajax({
		type: "GET",
		url: "/skyline/nyc/getPermittedGeojsons/",
		success: function(data){
			// load the draw tools
			if (data) {
				osmApplication.permittedGeojsons = [];
				for (var i = 0; i < data.length; i++) {
					var geojson = JSON.parse(data[i]);
					osmApplication.permittedGeojsons.push(geojson);
					var idNum = "permitted_" + i;
					osmApplication.osmb.addGeoJSON(geojson, {id: idNum});
				}
				
			} 
        }
	});
}

osmApplication.destroy = function () {
	osmApplication.osmb.destroy();
}


