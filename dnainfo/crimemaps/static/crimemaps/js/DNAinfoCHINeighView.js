
/* 
* Functions to create the main DNAinfo Crime Map
*/

// initialize map
function DNAinfoCHINeighView() {
	// set zoom and center for this map
	this.center = DNAinfoCHINeighView.center(neighborhood);
	this.zoom = 14;

    this.map = new L.Map('map', {
		minZoom:8,
		maxZoom:17,
    	center: this.center,
   	 	zoom: this.zoom
	});

	//this.stamenLayer = new L.StamenTileLayer("toner-lite");
	this.stamenLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',{
	  attribution: 'Created By <a href="http://nijel.org/">NiJeL</a> | Map tiles by <a href="http://stamen.com/">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
	});
	
	this.map.addLayer(this.stamenLayer);

	//load scale bars
	this.map.addControl(L.control.scale());
	
    // enable events
    this.map.doubleClickZoom.enable();
    this.map.scrollWheelZoom.enable();
	
	// empty containers for layers 
	this.NEIGHBORHOODS = null;
	this.ALLDRAWNGEOJSONS = null;
	this.COUNTGEOJSON = null;

	// set up range for colorScale
	this.colorScale = d3.scale.quantize()
		.range(["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"]);

}

DNAinfoCHINeighView.onEachFeature_ALLDRAWNGEOJSONS = function(feature,layer){

	if (L.Browser.touch) {
		layer.bindPopup('DNAinfo Visitor\'s Drawings of ' + DNAinfoCHINeighView.neighborhoodBabyName(neighborhood));
	} else {
		layer.bindLabel('DNAinfo Visitor\'s Drawings of ' + DNAinfoCHINeighView.neighborhoodBabyName(neighborhood));
	}

	var highlight = {
	    weight: 3,
	    opacity: 1,
	};
	var noHighlight = {
        weight: 1.5,
        opacity: 0.75,
	};

	layer.on('mouseover', function(ev) {
		layer.setStyle(highlight);
    });
		
    layer.on('mouseout', function(ev) {
		layer.setStyle(noHighlight);
		if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToBack();
	    }	
    });	
	
}

DNAinfoCHINeighView.onEachFeature_COUNTGEOJSON = function(feature,layer){	
	var label = DNAinfoCHINeighView.useLabelText(feature);

	if (label) {
		if (L.Browser.touch) {
			layer.bindPopup(label);	
		} else {
			layer.bindLabel(label);	
		}		
	} else {
		if (L.Browser.touch) {
			layer.unbindPopup();
		} else {
			layer.unbindLabel();
		}		
	}


	
	
}

DNAinfoCHINeighView.prototype.loadAllDrawnGeojsons = function (){
	var thismap = this;
	$.ajax({
		type: "GET",
		url: "/getallchidrawngeojson/"+ neighborhood + "/0/" ,
		success: function(data){
			// load the draw tools
			if (data.length > 0) {
				var geojson = [];
				for (var i = data.length - 1; i >= 0; i--) {
					if (data[i]) {
						geojson.push(JSON.parse(data[i]));
					}
				};
				thismap.ALLDRAWNGEOJSONS = L.geoJson(geojson, {
				    style: DNAinfoCHINeighView.getStyleFor_ALLDRAWNGEOJSONS,
					onEachFeature: DNAinfoCHINeighView.onEachFeature_ALLDRAWNGEOJSONS,
				});
				if (countDrawnNeighborhoods < 25) {
					thismap.ALLDRAWNGEOJSONS.addTo(thismap.map);
					//var bounds = thismap.ALLDRAWNGEOJSONS.getBounds();
				    //thismap.map.fitBounds(bounds);			
				} 
			} else {
				thismap.ALLDRAWNGEOJSONS = null;
				//thismap.center = DNAinfoCHINeighView.center(neighborhood);
				//thismap.zoom = 14;
				//thismap.map.setView(thismap.center, thismap.zoom);
			}
        }
	});

}

DNAinfoCHINeighView.prototype.loadCountGeojson = function (){
	var thismap = this;
	var polyTopojson;
	/* For geojsons
	d3.json(countGeojson, function(data) {
		thismap.COUNTGEOJSON = L.geoJson(data, {
			style: DNAinfoCHINeighView.getStyleFor_COUNTGEOJSON,
			onEachFeature: DNAinfoCHINeighView.onEachFeature_COUNTGEOJSON,
		});
		thismap.COUNTGEOJSON.addTo(thismap.map);
		var bounds = thismap.COUNTGEOJSON.getBounds();
	    thismap.map.fitBounds(bounds);
	});
	*/

	// set countGeojson
	var neighborhoodNoNyphen = neighborhood.replace(/-/g, '');
	var geojsonPath = "/crimemaps/neigh_drawn_geojsons/chi-" + neighborhood + "/polys_chi" + neighborhoodNoNyphen + "_25.topojson";
	var countGeojson = STATIC_URL + geojsonPath;

	/* grab topojson and show only if more than 25 drawings were done in the hood  */
	if (countDrawnNeighborhoods >= 25) {
		d3.json(countGeojson, function(data) {
			polyTopojson = topojson.feature(data, eval("data.objects.polys_chi" + neighborhoodNoNyphen + "_25")).features;
			setUpMaxAndColorDomains();
			applyMaxValue();
			drawPolysWData();
		});		
	}


	function setUpMaxAndColorDomains() {
		thismap.totalMax = d3.max(polyTopojson, function(d) { 
				total_count = d.properties.count_under5 + d.properties.count_5 + d.properties.count_10_15 + d.properties.count_20greater;
				return total_count; 
			});
		thismap.totalDomain = [1, thismap.totalMax];
		thismap.underFiveMax = d3.max(polyTopojson, function(d) { return d.properties.count_under5; });
		thismap.underFiveDomain = [1, thismap.underFiveMax];
		thismap.fiveToTenMax = d3.max(polyTopojson, function(d) { return d.properties.count_5; });
		thismap.fiveToTenDomain = [1, thismap.fiveToTenMax];
		thismap.tenToTwentyMax = d3.max(polyTopojson, function(d) { return d.properties.count_10_15; });
		thismap.tenToTwentyDomain = [1, thismap.tenToTwentyMax];
		thismap.overTwentyMax = d3.max(polyTopojson, function(d) { return d.properties.count_20greater; });
		thismap.overTwentyDomain = [1, thismap.overTwentyMax];

	}

	function applyMaxValue() {
		$('.maxWithBreaks').text(thismap.totalMax);
		// calculate breaks
		var units = parseInt(thismap.totalMax)/6;
		$('.first').text(parseInt(units));
		$('.second').text(parseInt(units*2));
		$('.third').text(parseInt(units*3));
		$('.fourth').text(parseInt(units*4));
		$('.fifth').text(parseInt(units*5));
	}

	function drawPolysWData() {

		//Set input domain for color scale
		thismap.colorScale.domain(thismap.totalDomain);

		//set color based on
		thismap.useCount = 'total';

		thismap.COUNTGEOJSON = L.geoJson(polyTopojson, {
			style: DNAinfoCHINeighView.getStyleFor_COUNTGEOJSON,
			onEachFeature: DNAinfoCHINeighView.onEachFeature_COUNTGEOJSON,
		});
		thismap.COUNTGEOJSON.addTo(thismap.map);
		//var bounds = thismap.COUNTGEOJSON.getBounds();
	    //thismap.map.fitBounds(bounds);			
	}

	/*
	$.ajax({
		type: "GET",
		url: "/getchidrawngeojson/"+ id +"/",
		success: function(data){
			// load the draw tools
			if (data) {
				var geojson = JSON.parse(data);
				thismap.COUNTGEOJSON = L.geoJson(geojson, {
				    style: DNAinfoCHINeighView.getStyleFor_COUNTGEOJSON,
					onEachFeature: DNAinfoCHINeighView.onEachFeature_COUNTGEOJSON,
				});
				thismap.map.addLayer(thismap.COUNTGEOJSON);
					var bounds = thismap.COUNTGEOJSON.getBounds();
	    			thismap.map.fitBounds(bounds);
				}

			} else {
				thismap.COUNTGEOJSON = null;
			}
        }
	});
	*/

}


DNAinfoCHINeighView.useCount = function (feature){
	if (MY_MAP) {
		thismap = MY_MAP;
	} else {
		thismap = this;
	}

	if (thismap.useCount == 'total') {
		var count = feature.properties.count_under5 + feature.properties.count_5 + feature.properties.count_10_15 + feature.properties.count_20greater;
	} else if (thismap.useCount == 'count_under5') {
		var count = feature.properties.count_under5;
	} else if (thismap.useCount == 'count_5') {
		var count = feature.properties.count_5;
	} else if (thismap.useCount == 'count_10_15') {
		var count = feature.properties.count_10_15;
	} else if (thismap.useCount == 'count_20greater') {
		var count = feature.properties.count_20greater;
	}

	return count;

}

DNAinfoCHINeighView.useLabelText = function (feature){
	if (MY_MAP) {
		thismap = MY_MAP;
	} else {
		thismap = this;
	}

	var count = DNAinfoCHINeighView.useCount(feature);

	if (count) {

		if (thismap.useCount == 'total') {
			var label = count + ' DNAinfo visitors drew<br />' + DNAinfoCHINeighView.neighborhoodBabyName(neighborhood) + ' here.';
		} else if (thismap.useCount == 'count_under5') {
			var label = count + ' DNAinfo visitors who have<br />lived here less than 5 years<br />drew ' + DNAinfoCHINeighView.neighborhoodBabyName(neighborhood) + ' here.';
		} else if (thismap.useCount == 'count_5') {
			var label = count + ' DNAinfo visitors who have lived<br />here between 5 and 10 years<br />drew ' + DNAinfoCHINeighView.neighborhoodBabyName(neighborhood) + ' here.';
		} else if (thismap.useCount == 'count_10_15') {
			var label = count + ' DNAinfo visitors who have lived<br />here between 10 and 20 years<br />drew ' + DNAinfoCHINeighView.neighborhoodBabyName(neighborhood) + ' here.';
		} else if (thismap.useCount == 'count_20greater') {
			var label = count + ' DNAinfo visitors who have<br />lived here over 20 years<br />drew ' + DNAinfoCHINeighView.neighborhoodBabyName(neighborhood) + ' here.';
		}

		return label;

	} else {
		return false;
	}



}

DNAinfoCHINeighView.setMaxValue = function (feature){
	if (MY_MAP) {
		thismap = MY_MAP;
	} else {
		thismap = this;
	}

	if (thismap.useCount == 'total') {
		$('.maxWithBreaks').text(thismap.totalMax);
		var units = parseInt(thismap.totalMax)/6;
	} else if (thismap.useCount == 'count_under5') {
		$('.maxWithBreaks').text(thismap.underFiveMax);
		var units = parseInt(thismap.underFiveMax)/6;
	} else if (thismap.useCount == 'count_5') {
		$('.maxWithBreaks').text(thismap.fiveToTenMax);
		var units = parseInt(thismap.fiveToTenMax)/6;
	} else if (thismap.useCount == 'count_10_15') {
		$('.maxWithBreaks').text(thismap.tenToTwentyMax);
		var units = parseInt(thismap.tenToTwentyMax)/6;
	} else if (thismap.useCount == 'count_20greater') {
		$('.maxWithBreaks').text(thismap.overTwentyMax);
		var units = parseInt(thismap.overTwentyMax)/6;
	}

	$('.first').text(parseInt(units));
	$('.second').text(parseInt(units*2));
	$('.third').text(parseInt(units*3));
	$('.fourth').text(parseInt(units*4));
	$('.fifth').text(parseInt(units*5));

}



DNAinfoCHINeighView.setColorDomain = function (feature){
	if (MY_MAP) {
		thismap = MY_MAP;
	} else {
		thismap = this;
	}

	if (thismap.useCount == 'total') {
		thismap.colorScale.domain(thismap.totalDomain);
	} else if (thismap.useCount == 'count_under5') {
		thismap.colorScale.domain(thismap.underFiveDomain);
	} else if (thismap.useCount == 'count_5') {
		thismap.colorScale.domain(thismap.fiveToTenDomain);
	} else if (thismap.useCount == 'count_10_15') {
		thismap.colorScale.domain(thismap.tenToTwentyDomain);
	} else if (thismap.useCount == 'count_20greater') {
		thismap.colorScale.domain(thismap.overTwentyDomain);
	}

}


DNAinfoCHINeighView.getStyleFor_ALLDRAWNGEOJSONS = function (feature){
    return {
        weight: 1,
        opacity: 0.75,
        color: '#191975',
        fillOpacity: 0,
        fillColor: '#bdbdbd'
    }
}

DNAinfoCHINeighView.getStyleFor_COUNTGEOJSON = function (feature){
    return {
        weight: 0,
        opacity: 0.25,
        color: '#ccc',
        fillOpacity: 0.75,
        fillColor: DNAinfoCHINeighView.fillColor_COUNTGEOJSON(feature)
    }
}

DNAinfoCHINeighView.fillColor_COUNTGEOJSON = function (feature){
	var count = DNAinfoCHINeighView.useCount(feature);
	if (count) {
		return thismap.colorScale(count);
	} else {
		return "none";
	}

	

}

DNAinfoCHINeighView.addLayers = function (layer){
	if (layer == "count") {
		MY_MAP.COUNTGEOJSON.addTo(MY_MAP.map);
	}
	if (layer == "all") {
		MY_MAP.ALLDRAWNGEOJSONS.addTo(MY_MAP.map);
	}
}

DNAinfoCHINeighView.removeLayers = function (layer){
	if (layer == "count") {
		MY_MAP.map.removeLayer(MY_MAP.COUNTGEOJSON);
	}
	if (layer == "all") {
		MY_MAP.map.removeLayer(MY_MAP.ALLDRAWNGEOJSONS);
	}
}

DNAinfoCHINeighView.updateGeojson = function (){
	// get selection
	var drawnCount = $( "#drawnCount option:selected" ).val();

	// set selection
	MY_MAP.useCount = drawnCount;

	// update max values and color domains
	DNAinfoCHINeighView.setMaxValue();
	DNAinfoCHINeighView.setColorDomain();

	// iterate over each layer and set new style and labels
	MY_MAP.COUNTGEOJSON.eachLayer(function (layer) {
		var label = DNAinfoCHINeighView.useLabelText(layer.feature);
		if (label) {
			if (L.Browser.touch) {
				layer.bindPopup(label);	
			} else {
				layer.bindLabel(label);	
			}		
		} else {
			if (L.Browser.touch) {
				layer.unbindPopup();
			} else {
				layer.unbindLabel();
			}		
		}
		layer.setStyle(DNAinfoCHINeighView.getStyleFor_COUNTGEOJSON(layer.feature));
	});

}


DNAinfoCHINeighView.center = function (neighborhood){

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


DNAinfoCHINeighView.neighborhoodBabyName = function (neighborhood){

	var lookup = {
		'austin': 'Austin',
		'albany-park': 'Albany Park',
		'altgeld-gardens': 'Altgeld Gardens',
		'andersonville': 'Andersonville',
		'archer-heights': 'Archer Heights',
		'armour-square': 'Armour Square',
		'ashburn': 'Ashburn',
		'auburn-gresham': 'Auburn Gresham',
		'avalon-park': 'Avalon Park',
		'avondale': 'Avondale',
		'back-of-yards': 'Back of the Yards',
		'belmont-cragin': 'Belmont Cragin',
		'beverly': 'Beverly',
		'boystown': 'Boystown',
		'brainerd': 'Brainerd',
		'bridgeport': 'Bridgeport',
		'brighton-park': 'Brighton Park',
		'bronzeville': 'Bronzeville',
		'bucktown': 'Bucktown',
		'burnside': 'Burnside',
		'bush': 'The Bush',
		'calumet-heights': 'Calumet Heights',
		'canaryville': 'Canaryville',
		'chatham': 'Chatham',
		'chicago-lawn': 'Chicago Lawn',
		'chinatown': 'Chinatown',
		'clearing': 'Clearing',
		'douglas': 'Douglas',
		'downtown': 'Downtown',
		'dunning': 'Dunning',
		'east-garfield-park': 'East Garfield Park',
		'east-side': 'East Side',
		'east-village': 'East Village',
		'edgebrook': 'Edgebrook',
		'edgewater': 'Edgewater',
		'edison-park': 'Edison Park',
		'englewood': 'Englewood',
		'ford-city': 'Ford City',
		'forest-glen': 'Forest Glen',
		'fuller-park': 'Fuller Park',
		'gage-park': 'Gage Park',
		'gap': 'The Gap',
		'garfield-park': 'Garfield Park',
		'garfield-ridge': 'Garfield Ridge',
		'gladstone-park': 'Gladstone Park',
		'gold-coast': 'Gold Coast',
		'grand-boulevard': 'Grand Boulevard',
		'grand-crossing': 'Grand Crossing',
		'greektown': 'Greektown',
		'heart-of-chicago': 'Heart of Chicago',
		'heart-of-italy': 'Heart of Italy',
		'hegewisch': 'Hegewisch',
		'hermosa': 'Hermosa',
		'humboldt-park': 'Humboldt Park',
		'hyde-park': 'Hyde Park',
		'irving-park': 'Irving Park',
		'jackson-highlands': 'Jackson Highlands',
		'jefferson-park': 'Jefferson Park',
		'kenwood': 'Kenwood',
		'lakeview': 'Lakeview',
		'lincoln-park': 'Lincoln Park',
		'lincoln-square': 'Lincoln Square',
		'little-italy': 'Little Italy',
		'little-village': 'Little Village',
		'logan-square': 'Logan Square',
		'loop': 'Loop',
		'marquette-park': 'Marquette Park',
		'mayfair': 'Mayfair',
		'mckinley-park': 'McKinley Park',
		'medical-district': 'Medical District',
		'midway': 'Midway',
		'montclare': 'Montclare',
		'morgan-park': 'Morgan Park',
		'mt-greenwood': 'Mt. Greenwood',
		'near-west-side': 'Near West Side',
		'new-city': 'New City',
		'noble-square': 'Noble Square',
		'north-center': 'North Center',
		'north-edgebrook': 'North Edgebrook',
		'north-lawndale': 'North Lawndale',
		'north-park': 'North Park',
		'norwood-park': 'Norwood Park',
		'oakland': 'Oakland',
		'ohare': 'O\'Hare',
		'old-edgebrook': 'Old Edgebrook',
		'old-town': 'Old Town',
		'pill-hill': 'Pill Hill',
		'pilsen': 'Pilsen',
		'portage-park': 'Portage Park',
		'pullman': 'Pullman',
		'ravenswood-manor': 'Ravenswood Manor',
		'ravenswood': 'Ravenswood',
		'river-north': 'River North',
		'river-west': 'River West',
		'riverdale': 'Riverdale',
		'rogers-park': 'Rogers Park',
		'roscoe-village': 'Roscoe Village',
		'roseland': 'Roseland',
		'sauganash': 'Sauganash',
		'south-austin': 'South Austin',
		'south-chicago': 'South Chicago',
		'south-deering': 'South Deering',
		'south-lawndale': 'South Lawndale',
		'south-loop': 'South Loop',
		'south-shore': 'South Shore',
		'streeterville': 'Streeterville',
		'tri-taylor': 'Tri Taylor',
		'ukrainian-village': 'Ukrainian Village',
		'university-village': 'University Village',
		'uptown': 'Uptown',
		'washington-heights': 'Washington Heights',
		'washington-park': 'Washington Park',
		'west-beverly': 'West Beverly',
		'west-elsdon': 'West Elsdon',
		'west-englewood': 'West Englewood',
		'west-humboldt-park': 'West Humboldt Park',
		'west-lawn': 'West Lawn',
		'west-loop': 'West Loop',
		'west-pullman': 'West Pullman',
		'west-ridge': 'West Ridge',
		'west-rogers-park': 'West Rogers Park',
		'west-town': 'West Town',
		'wicker-park': 'Wicker Park',
		'woodlawn': 'Woodlawn',
		'wrigleyville': 'Wrigleyville',
		"old-irving-park": "Old Irving Park",
		"ravenswood-gardens": "Ravenswood Gardens",
		"galewood": "Galewood",
		"independence-park": "Independence Park",
		"buena-park": "Buena Park",

	}

	if (lookup[neighborhood]) {			
		return lookup[neighborhood];
	} else {
		if (neighborhood == 'other') {
			return otherNeighborhood;
		} else {
			return '';
		}

	}


}
	
	
