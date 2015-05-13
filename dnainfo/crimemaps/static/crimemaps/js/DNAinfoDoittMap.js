/* 
* Functions to create the main DNAinfo Crime Map
*/

// initialize map
function DNAinfoDoittMap() {
	// set zoom and center for this map

	this.center = DNAinfoDoittMap.centerBySubdomain();
    //this.center = [40.710508, -73.943825];
    this.zoom = 15;

    this.map = new L.Map('map', {
		minZoom:13,
		maxZoom:17,
    	center: this.center,
   	 	zoom: this.zoom,
	});
	
	// add CartoDB tiles
	this.CartoDBLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',{
	  attribution: 'Created By <a href="http://nijel.org/">NiJeL</a> | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
	});
	this.map.addLayer(this.CartoDBLayer);
	
	//load geocoder control
	var geocoder = this.map.addControl(L.Control.geocoder({collapsed: true, placeholder:'Address Search', geocoder:new L.Control.Geocoder.Google()}));
	
	//load scale bars
	this.map.addControl(L.control.scale());
	
    // enable events
    this.map.doubleClickZoom.enable();
    this.map.scrollWheelZoom.enable();
	
	// empty containers for layers 
	this.GRADPOINT = null;

}

// get and set bounds based on open wrapper
DNAinfoDoittMap.slightPanUp = function (){
	var point = L.point(0, 150);
	MY_MAP.map.panBy(point);
}


DNAinfoDoittMap.onEachFeature_GRADPOINT = function(feature,layer){	
	var highlight = {
	    weight: 2,
	    color: '#000'
	};
	var noHighlight = {
        weight: 1,
        color: '#f1f1f1'
	};
	var dateFormat = d3.time.format("%Y");

	if (feature.properties.TOT > 1) {
		feature.properties.CR = DNAinfoDoittMap.DOITTpluralCatName(feature.properties.CR);
	}

	layer.bindLabel(feature.properties.TOT + " <span class='text-lowercase'>" + feature.properties.CR + "</span>", { direction:'auto' });
	
    layer.on('mouseover', function(ev) {		
		if (layer._leaflet_id != nearestCenterId) {
			// don't show center label
			MY_MAP.map._layers[nearestCenterId].label.close();
			MY_MAP.map._layers[nearestCenterId].setStyle(noHighlight);
		} 

		layer.setStyle(highlight);

		if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }

	    // add content to description area
		$('#descriptionTitle').html("<p><strong>Type of Crimes at a Location </strong></p>");

		var month = moment(feature.properties.MO, "MM").format("MMMM");

		$('#description').html("<p>" + feature.properties.TOT + " <span class='text-lowercase'>" + feature.properties.CR + "</span> at this location in " + month + " " + feature.properties.YR +".</p><div id='barChart'></div>");

    });
		
    layer.on('mouseout', function(ev) {
		layer.setStyle(noHighlight);		
    });	

    // onclick set content in bottom bar and open doc if not open already 
	layer.on("click",function(ev){				
		if ($( ".popup-wrapper" ).hasClass( "popup-wrapper-open" )) {
			// don't toggle classes
		} else {
			$( ".popup-wrapper" ).toggleClass("popup-wrapper-open");
			$( ".map" ).toggleClass("map-popup-wrapper-open");		
		}

		// add content to description area
		$('#descriptionTitle').html("<p><strong>Type of Crimes at a Location </strong></p>");

		var month = moment(feature.properties.MO, "MM").format("MMMM");

		$('#description').html("<p>" + feature.properties.TOT + " <span class='text-lowercase'>" + feature.properties.CR + "</span> at this location in " + month + " " + feature.properties.YR +".</p><div id='barChart'></div>");


	});

	// we'll now add an ID to each layer so we can fire the mouseover and click outside of the map
    layer._leaflet_id = 'layerID' + count;
    count++;

}

DNAinfoDoittMap.onEachFeature_POLYGONS = function(feature,layer){	
	var highlight = {
	    color: '#000'
	};
	var noHighlight = {
        color: '#bdbdbd'
	};

	var precinct = DNAinfoDoittMap.precinctNumbers(feature.id);
	layer.bindLabel("<strong>" + precinct + " Precinct</strong>", { direction:'auto' });
	
    layer.on('mouseover', function(ev) {

    	layer.setStyle(highlight);
		if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	        MY_MAP.GRADPOINT.bringToFront();
	    }


    });
		
    layer.on('mouseout', function(ev) {
		layer.setStyle(noHighlight);		
    });	

}



DNAinfoDoittMap.prototype.loadPointLayers = function (){
	// load points layers
	var thismap = this;

	d3.json('/doittapi/?monthYear=' + monthYear, function(data) {
		geojsonData = data;

		$.each(geojsonData.features, function(i, d){
			d.properties.leafletId = 'layerID' + i;
		});

		thismap.GRADPOINT = L.geoJson(geojsonData, {
		    pointToLayer: DNAinfoDoittMap.getStyleFor_GRADPOINT,
			onEachFeature: DNAinfoDoittMap.onEachFeature_GRADPOINT
		}).addTo(thismap.map);

		findCenterandFire();
	});

	function findCenterandFire() {
		var centerLat = thismap.center[0];
		var centerLon = thismap.center[1];
		var centerFeature = {
		  "type": "Feature",
		  "properties": {},
		  "geometry": {
		    "type": "Point",
		    "coordinates": [centerLon, centerLat]
		  }
		};
		var nearest = turf.nearest(centerFeature, geojsonData);
		nearestCenterId = nearest.properties.leafletId;
		var pointLatLng = L.latLng(nearest.geometry.coordinates[1], nearest.geometry.coordinates[0]);
		thismap.map._layers[nearestCenterId].fire('click');
		thismap.map._layers[nearestCenterId].fireEvent('mouseover', {
	      latlng: pointLatLng,
	      layerPoint: thismap.map.latLngToLayerPoint(pointLatLng),
	      containerPoint: thismap.map.latLngToContainerPoint(pointLatLng)
	    });

	}

}

DNAinfoDoittMap.prototype.loadPrecincts = function (){
	var thismap = this;
	d3.json(NYC_Precincts, function(data) {
		polyTopojson = topojson.feature(data, data.objects.NYC_Precincts).features;
		drawPolys();
	});

	function drawPolys() {
		thismap.POLYGONS = L.geoJson(polyTopojson, {
		    style: DNAinfoDoittMap.getStyleFor_POLYGONS,
			onEachFeature: DNAinfoDoittMap.onEachFeature_POLYGONS
		});
		thismap.POLYGONS.addTo(thismap.map).bringToBack();
	}

}

DNAinfoDoittMap.getStyleFor_GRADPOINT = function (feature, latlng){

	var gradPointMarker = L.circleMarker(latlng, {
		radius: DNAinfoDoittMap.DOITTCountRadius(feature.properties.TOT),
		color: '#bdbdbd',
		weight: 1,
		opacity: 1,
		fillColor: DNAinfoDoittMap.DOITTordinalCategoryColors(feature.properties.CR),
		fillOpacity: 1
	});
	
	return gradPointMarker;
	
}

DNAinfoDoittMap.getStyleFor_POLYGONS = function (feature){
    return {
        weight: 2,
        opacity: 1,
        color: '#bdbdbd',
        fillOpacity: 0,
        fillColor: '#fff'
    }
}


DNAinfoDoittMap.DOITTordinalCategoryColors = function (d){
    return d == "MURDER" ? '#e41a1c' :
           d == "RAPE" ? '#377eb8' :
           d == "ROBBERY" ? '#4daf4a' :
           d == "FELONY ASSAULT" ? '#984ea3' :
           d == "BURGLARY" ? '#ff7f00' :
           d == "GRAND LARCENY" ? '#ffff33' :
           d == "GRAND LARCENY OF MOTOR VEHICLE" ? '#a65628' :
                    '#000';	
}

DNAinfoDoittMap.DOITTpluralCatName = function (d){
    return d == "MURDER" ? 'murders' :
           d == "RAPE" ? 'rapes' :
           d == "ROBBERY" ? 'robberies' :
           d == "FELONY ASSAULT" ? 'felony assaults' :
           d == "BURGLARY" ? 'burglaries' :
           d == "GRAND LARCENY" ? 'grand larcenies' :
           d == "GRAND LARCENY OF MOTOR VEHICLE" ? 'auto grand larcenies' :
                    '';	
}

DNAinfoDoittMap.DOITTCountRadius = function (d){
    return d > 5 ? 20 :
           d > 4 ? 15 :
           d > 3 ? 10 :
           d > 2 ? 8 :
           d > 1 ? 6 :
                   4 ;	
}

DNAinfoDoittMap.precinctNumbers = function (d){
    return d == 1  ? d+'st' :
    	   d == 2  ? d+'nd' :
           d == 3  ? d+'rd' :
    	   d == 21 ? d+'st' :
           d == 22 ? d+'nd' :
           d == 23 ? d+'rd' :
    	   d == 31 ? d+'st' :
           d == 32 ? d+'nd' :
           d == 33 ? d+'rd' :
    	   d == 41 ? d+'st' :
           d == 42 ? d+'nd' :
           d == 43 ? d+'rd' :
    	   d == 51 ? d+'st' :
           d == 52 ? d+'nd' :
           d == 53 ? d+'rd' :
    	   d == 61 ? d+'st' :
           d == 62 ? d+'nd' :
           d == 63 ? d+'rd' :
    	   d == 71 ? d+'st' :
           d == 72 ? d+'nd' :
           d == 73 ? d+'rd' :
    	   d == 81 ? d+'st' :
           d == 82 ? d+'nd' :
           d == 83 ? d+'rd' :
    	   d == 91 ? d+'st' :
           d == 92 ? d+'nd' :
           d == 93 ? d+'rd' :
    	   d == 101 ? d+'st' :
           d == 102 ? d+'nd' :
           d == 103 ? d+'rd' :
    	   d == 121 ? d+'st' :
           d == 122 ? d+'nd' :
           d == 123 ? d+'rd' :
                      d+'th';	
}


DNAinfoDoittMap.centerBySubdomain = function (){
	// Based on a url like the following: 
	// http://www.dnainfo.com/new-york/20150428/mott-haven/man-busted-on-stolen-citi-bike-claimed-he-borrowed-it-from-his-cousin-nypd

	var referrer = document.referrer;
	var urlArray = referrer.split("/");
	var domain = urlArray[2];
	var neighborhood = urlArray[5];

	var lookup = {
		"washington-heights-inwood": [40.846719, -73.935156],
		"harlem": [40.811550, -73.946477],
		"upper-west-side-morningside-heights": [40.793327, -73.970261],
		"upper-east-side-roosevelt-island": [40.772141, -73.957386],
		"midtown-theater-district": [40.757709, -73.982105],
		"murray-hill-gramercy-midtown-east": [40.753288, -73.973866],
		"chelsea-hells-kitchen": [40.765380, -73.992062],
		"greenwich-village-soho": [40.726340, -73.995924],
		"east-village-lower-east-side": [40.719770, -73.985109],
		"downtown": [40.711508, -74.007339],
		"riverdale-kingsbridge": [40.888649, -73.908463],
		"fordham-tremont": [40.861500, -73.89058],
		"woodlawn-wakefield": [40.895361, -73.862916],
		"pelham-parkway-baychester": [40.861651, -73.843918],
		"morris-park-parkchester": [40.845161, -73.853874],
		"soundview-castle-hill": [40.817755, -73.857307],
		"throgs-neck-country-club": [40.817496, -73.817482],
		"astoria-long-island-city": [40.756019, -73.938847],
		"jackson-heights-elmhurst": [40.748996, -73.882713],
		"flushing-whitestone": [40.780899, -73.822975],
		"bayside-douglaston": [40.763140, -73.77125],
		"forest-hills-rego-park-jamaica": [40.711402, -73.828468],
		"maspeth-middle-village-ridgewood": [40.713094, -73.888378],
		"fresh-meadows-jamaica-estates": [40.727324, -73.775597],
		"jamaica-hollis": [40.705677, -73.779888],
		"queens-village-hollis-st-albans": [40.703855, -73.745728],
		"howard-beach-richmond-hill": [40.679694, -73.827095],
		"rockaways": [40.584431, -73.821945],
		"williamsburg-greenpoint-bushwick": [40.708930, -73.943138],
		"fort-greene-dumbo": [40.692402, -73.975582],
		"park-slope-windsor-terrace-gowanus": [40.665845, -73.983307],
		"crown-heights-prospect-heights-prospect-lefferts-gardens": [40.666496, -73.951721],
		"bay-ridge-bensonhurst": [40.618741, -74.012489],
		"coney-island-brighton-beach": [40.576510, -73.972321],
		"sheepshead-bay-marine-park": [40.604407, -73.945885],
		"borough-park-midwood": [40.624735, -73.978500],
		"kensington-flatbush-ditmas-park": [40.639277, -73.968029],
		"east-new-york-brownsville": [40.661287, -73.896618],
		"canarsie-mill-basin": [40.629164, -73.910179],
		"st-george-port-richmond": [40.644548, -74.080141],
		"new-dorp-south-beach": [40.579199, -74.097290],
		"great-kills-tottenville": [40.508341, -74.23554],
		"south-bronx": [40.817670, -73.918426],
		"norwood-bedford-park": [40.871328, -73.88697],
		"norwood-bedford-park": [40.871328, -73.88697],
		"sunset-park-greenwood-heights": [40.645789, -74.002876],
		"cobble-hill-carroll-gardens-red-hook": [40.681728, -74.001160],
		"south-jamaica-springfield-gardens-rosedale": [40.670320, -73.764267],
		"bedford-stuyvesant": [40.685243, -73.939877],
		"brooklyn-heights-downtown-brooklyn": [40.696176, -73.991032],
		"east-flatbush-prospect-lefferts-gardens": [40.650999, -73.939705],	
	}

	if (domain == "www.dnainfo.com" && lookup[neighborhood]) {			
		return lookup[neighborhood];
	} else {
		return [40.710508, -73.943825];
	}


}
	
	
