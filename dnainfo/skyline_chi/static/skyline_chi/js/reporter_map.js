/**
 * map.js: Creates map for selecting which pluto plot to use
 */

function mapApplication() {}

mapApplication.initialize = function () {
	// set zoom and center for this map
	this.center = center(neighborhoodName);
	if (iDontSeeMyNeighborhood == "True"){
		this.zoom = 11;
		this.minZoom = 11;
	} else {
		this.zoom = 17;
		this.minZoom = 14;
	}    
    this.map = new L.Map('map', {
		minZoom:this.minZoom,
		maxZoom:18,
    	center: this.center,
   	 	zoom: this.zoom
	});

	mapApplication.map = this.map;

	// get bounds and set maxBounds so user can't pan outside of a certain extent
	//this.bounds = this.map.getBounds().pad(1);
	//this.map.setMaxBounds(this.bounds);

	// set a tile layer
	var tiles = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', { attribution: 'Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, under <a href=\"https://creativecommons.org/licenses/by/3.0/\" target=\"_blank\">CC BY 3.0</a>. Data by <a href=\"http://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>, under ODbL.'
	});

	// add these tiles to our map
	this.map.addLayer(tiles);

	
    // enable events
    this.map.doubleClickZoom.enable();
    this.map.scrollWheelZoom.enable();

	//load geocoder control
	var geocoder = this.map.addControl(L.Control.geocoder({collapsed: true, placeholder:'Address Search', geocoder:new L.Control.Geocoder.Google()}));
	

	//add CARTO Parcel data to map
	mapApplication.loadParcelData();

	// load already picked parcel if editing
	mapApplication.loadParcel();


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


mapApplication.loadParcelData = function () {

	mapApplication.CARTO_url_1 = 'https://chidata3d.carto.com/api/v2/viz/9e04291e-8580-11e6-b112-0ee66e2c9693/viz.json'; 
	mapApplication.CARTO_tableName_1 = 'chi_parcels_north_third';
	mapApplication.CARTO_sql_1 = new cartodb.SQL({ user: 'chidata3d', format: 'geojson' });

	mapApplication.CARTO_url_2 = 'https://chidata3d-1.carto.com/api/v2/viz/49dc5f4a-8581-11e6-834f-0ee66e2c9693/viz.json'; 
	mapApplication.CARTO_tableName_2 = 'chi_parcels_central_third';
	mapApplication.CARTO_sql_2 = new cartodb.SQL({ user: 'chidata3d-1', format: 'geojson' });

	mapApplication.CARTO_url_3 = 'https://chidata3d-2.carto.com/api/v2/viz/a4c957aa-8581-11e6-baec-0e3ff518bd15/viz.json'; 
	mapApplication.CARTO_tableName_3 = 'chi_parcels_south_third';
	mapApplication.CARTO_sql_3 = new cartodb.SQL({ user: 'chidata3d-2', format: 'geojson' });

	mapApplication.PARCEL_1 = cartodb.createLayer(mapApplication.map, mapApplication.CARTO_url_1, { https: true })
		.addTo(mapApplication.map)
		.on('done', function(layer) {
			var subLayerOptions = {
		      	query: 'SELECT cartodb_id, pin10 from ' + mapApplication.CARTO_tableName_1,
            	interactivity: 'cartodb_id, pin10'
        	}
			var sublayer = layer.getSubLayer(0);
			sublayer.set(subLayerOptions);
			
			// mouse over any layer call
			layer.on('mouseover', function() {
				$('#map').css( 'cursor', 'pointer' );
			});

			layer.on('mouseout', function() {
				$('#map').css( 'cursor', 'auto' );
			});

			// feature interaction
			sublayer.on('featureClick', function(e, latlng, pos, data, layerIndex) {
                if (data.cartodb_id != mapApplication.clicked_cartodb_id) {
					mapApplication.featureClick(data.cartodb_id, mapApplication.CARTO_sql_1, mapApplication.CARTO_tableName_1, latlng);
				}
			});

		})
		.on('error', function(err) {
		  	console.log("some error occurred: " + err);
		});

	mapApplication.PARCEL_2 = cartodb.createLayer(mapApplication.map, mapApplication.CARTO_url_2, { https: true })
		.addTo(mapApplication.map)
		.on('done', function(layer) {
			var subLayerOptions = {
		      	query: 'SELECT cartodb_id, pin10 from ' + mapApplication.CARTO_tableName_2,
            	interactivity: 'cartodb_id, pin10'
        	}
			var sublayer = layer.getSubLayer(0);
			sublayer.set(subLayerOptions);
			
			// mouse over any layer call
			layer.on('mouseover', function() {
				$('#map').css( 'cursor', 'pointer' );
			});

			layer.on('mouseout', function() {
				$('#map').css( 'cursor', 'auto' );
			});

			// feature interaction
			sublayer.on('featureClick', function(e, latlng, pos, data, layerIndex) {
                if (data.cartodb_id != mapApplication.clicked_cartodb_id) {
					mapApplication.featureClick(data.cartodb_id, mapApplication.CARTO_sql_2, mapApplication.CARTO_tableName_2, latlng);
				}
			});

		})
		.on('error', function(err) {
		  	console.log("some error occurred: " + err);
		});

	mapApplication.PARCEL_3 = cartodb.createLayer(mapApplication.map, mapApplication.CARTO_url_3, { https: true })
		.addTo(mapApplication.map)
		.on('done', function(layer) {
			var subLayerOptions = {
		      	query: 'SELECT cartodb_id, pin10 from ' + mapApplication.CARTO_tableName_3,
            	interactivity: 'cartodb_id, pin10'
        	}
			var sublayer = layer.getSubLayer(0);
			sublayer.set(subLayerOptions);
			
			// mouse over any layer call
			layer.on('mouseover', function() {
				$('#map').css( 'cursor', 'pointer' );
			});

			layer.on('mouseout', function() {
				$('#map').css( 'cursor', 'auto' );
			});

			// feature interaction
			sublayer.on('featureClick', function(e, latlng, pos, data, layerIndex) {
                if (data.cartodb_id != mapApplication.clicked_cartodb_id) {
					mapApplication.featureClick(data.cartodb_id, mapApplication.CARTO_sql_3, mapApplication.CARTO_tableName_3, latlng);
				}
			});

		})
		.on('error', function(err) {
		  	console.log("some error occurred: " + err);
		});


}


mapApplication.featureClick = function (cartodb_id, sql, tableName, latlng) {
	mapApplication.removeAllClickShapes();

	// query DB for geometry
	sql.execute("SELECT * FROM {{tableName}} WHERE cartodb_id= {{cartodb_id}}", { tableName: tableName, cartodb_id: cartodb_id })
		.done(function(geojson) {
			mapApplication.CLICKGEOJSON = L.geoJson(geojson, {
			        style: mapApplication.clicked
			    }).addTo(mapApplication.map);
			mapApplication.clicked_cartodb_id = cartodb_id;

			// reverse geocode lat lon
			mapApplication.reverseGeocode(latlng);

			// add properties to geojson
			geojson.features[0].properties.objectID = objectID;
			geojson.features[0].properties.color = "#0073a2";
		    geojson.features[0].properties.roofColor = "#0073a2";
		    geojson.features[0].properties.height = buildingHeight;
		    geojson.features[0].properties.minHeight = 0;
		    geojson.features[0].properties.projectName = projectName;
		    geojson.features[0].properties.buildingImage = 'visualizations/media/' + buildingImage;
		    geojson.features[0].properties.description = description;
		    geojson.features[0].properties.buildingAddress = buildingAddress;
		    geojson.features[0].properties.buildingZip = buildingZip;
		    geojson.features[0].properties.stories = buildingStories;
		    geojson.features[0].properties.story1 = story1;
		    geojson.features[0].properties.zoning_pdfs = 'visualizations/media/' + zoning_pdfs;

			// add data to form
			$('#id_buildingFootprint').val(JSON.stringify(geojson));
		   	$('#id_buildingPIN').val(geojson.features[0].properties.pin10);
		    // remove disable from next button
		    if ($('#reporterNextEnd').prop("disabled")) {
		        $('#reporterNextEnd').prop("disabled", false);
		    }

		})
		.error(function(errors) {
			// errors contains a list of errors
			console.log("errors:" + errors);
		});

}

mapApplication.reverseGeocode = function (latlng) {
	// https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyBQxrEbrvIkajyXTw4fR6mXoP5HwmZPlaA
	// create URL
	var trunkURL = 'https://maps.googleapis.com/maps/api/geocode/json'
	if (latlng) {
		var params = '?latlng='+latlng[0]+','+latlng[1]+'&key=AIzaSyBQxrEbrvIkajyXTw4fR6mXoP5HwmZPlaA'

		$.ajax({
			type: "GET",
			url: trunkURL + params,
			success: function(data){
				if (data.status == 'OK') {
					$('.cartodb-popup-content').html('<p>' + data.results[0].formatted_address + '</p>');
				} else {
					$('.cartodb-popup-content').html('<p>No Address</p>');
				}

	        },
	        error: function(e){ 
				$('.cartodb-popup-content').html('<p>No Address</p>');
	        }
		});

	} else {
		$('.cartodb-popup-content').html('<p>No Address</p>');
	}

}

mapApplication.removeAllClickShapes = function () {
	if (mapApplication.map.hasLayer(mapApplication.CLICKGEOJSON)) {
		mapApplication.map.removeLayer(mapApplication.CLICKGEOJSON);
		mapApplication.clicked_cartodb_id = null;		
	}
}


mapApplication.loadParcel = function () {
	$.ajax({
		type: "GET",
		url: "/skyline/admin/chi/reporter/getGeojson/"+ objectID +"/",
		success: function(data){
			// load the draw tools
			if (data) {
				var geojson = JSON.parse(data);
				mapApplication.CLICKGEOJSON = L.geoJson(geojson, {
			        style: mapApplication.clicked
			    }).addTo(mapApplication.map);

			    mapApplication.map.panTo(mapApplication.CLICKGEOJSON.getBounds().getCenter());
			    // remove disable from next button
			    if ($('#reporterNextEnd').prop("disabled")) {
			        $('#reporterNextEnd').prop("disabled", false);
			    }

			} 
        }
	});

}


/* Style states */
mapApplication.hovered = {
        weight: 0,
        opacity: 0,
        color: '#bdbdbd',
        fillOpacity: 0.8,
        fillColor: '#fc5158'
    };

mapApplication.clicked = {
		weight: 3,
		opacity: 1,
	    color: '#555',		
        fillOpacity: 0.8,
        fillColor: '#fc5158'
    };



/* Vars */
mapApplication.map;
// create a feature layer to use to write geojson to 
mapApplication.HOVERGEOJSON;
mapApplication.hovered = [];
mapApplication.CLICKGEOJSON;
mapApplication.clicked_cartodb_id = null;




