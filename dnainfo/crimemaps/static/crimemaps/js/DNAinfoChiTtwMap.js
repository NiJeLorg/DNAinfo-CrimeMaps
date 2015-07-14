/* 
* Functions to create the main DNAinfo worked from home
*/

// initialize map
function DNAinfoChiTtwMap() {
	// set zoom and center for this map

	this.center = DNAinfoChiTtwMap.centerBySubdomain();
    //this.center = [40.710508, -73.943825];
    this.zoom = 13;

    this.map = new L.Map('map', {
		minZoom:10,
		maxZoom:15,
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
	this.POLYGONS = null;

}

// get and set bounds based on open wrapper
DNAinfoChiTtwMap.slightPanUp = function (){
	var point = L.point(0, 150);
	MY_MAP.map.panBy(point);
}

DNAinfoChiTtwMap.addCommas = function (nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

DNAinfoChiTtwMap.onEachFeature_POLYGONS = function(feature,layer){	
	var highlight = {
	    weight: 2,
	    opacity: 1,
	    color: '#000'
	};
	var noHighlight = {
        weight: 1,
        opacity: 0.75,
        color: '#f1f1f1'
	};

	var mode = [];
	mode.push({'id':'driving alone', 'value':feature.properties.chi13_hc03_vc28});
	mode.push({'id':'carpooling',  'value':feature.properties.chi13_hc03_vc29});
	mode.push({'id':'taking public transportation', 'value':feature.properties.chi13_hc03_vc30});
	mode.push({'id':'walking', 'value':feature.properties.chi13_hc03_vc31});
	mode.push({'id':'some other mode of transport', 'value':feature.properties.chi13_hc03_vc32});
	mode.push({'id':'working from home', 'value':feature.properties.chi13_hc03_vc33});
	mode.sort(function(a, b) { return b.value - a.value; });

	if (!mode[0].value) {
		var headingText = "No workers in 2013.";
	} else {
		var headingText = mode[0].value + '% of workers reported<br />' + mode[0].id + '<br />to work in 2013.';
	}

	layer.bindLabel(headingText, { direction:'auto' });
	
    layer.on('mouseover', function(ev) {
    	var latLngCenter = L.latLng(MY_MAP.center[0], MY_MAP.center[1]);
		var results = leafletPip.pointInLayer(latLngCenter, MY_MAP.POLYGONS, true);
		var leafletId = results[0]._leaflet_id;
		//was center label moused over?
		if (layer._leaflet_id != leafletId) {
			// don't show center label
			MY_MAP.map._layers[leafletId].label.close();
			MY_MAP.map._layers[leafletId].setStyle(noHighlight);
		} 

		layer.setStyle(highlight);

		if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }

		if (!mode[0].value) {
			var headingText = "No workers in 2013.";
		} else {
			var headingText = mode[0].value + '% of workers reported ' + mode[0].id + ' to work in 2013.';
		}

		// add content to description area
		$('#descriptionTitle').html("<p>"+ headingText +"</p>");

		if (!mode[0].value) {
			$('#description').html('');
		} else {
			DNAinfoChiTtwMap.drawChart(feature,layer);
		}
		

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

		var latLngCenter = L.latLng(MY_MAP.center[0], MY_MAP.center[1]);
		var results = leafletPip.pointInLayer(latLngCenter, MY_MAP.POLYGONS, true);
		var leafletId = results[0]._leaflet_id;
		//was center label moused over?
		if (layer._leaflet_id != leafletId) {
			// don't show center label
			MY_MAP.map._layers[leafletId].label.close();
			MY_MAP.map._layers[leafletId].setStyle(noHighlight);
		} 


		if (!mode[0].value) {
			var headingText = "No workers in 2013.";
		} else {
			var headingText = mode[0].value + '% of workers reported ' + mode[0].id + ' to work in 2013.';
		}

		// add content to description area
		$('#descriptionTitle').html("<p>"+ headingText +"</p>");

		if (!mode[0].value) {
			$('#description').html('');
		} else {
			DNAinfoChiTtwMap.drawChart(feature,layer);
		}

	});	

    // we'll now add an ID to each layer so we can fire the mouseover and click outside of the map
    layer._leaflet_id = 'layerID' + count;
    count++;

}

DNAinfoChiTtwMap.drawChart = function(feature,layer){

	$('#description').html("<p>Distribution by category of the modes of transport to work (2013):</p><div id='barChart'></div>");

	// create object for bar chart
	var chartArray = [];
	chartArray[0] = parseFloat(feature.properties.chi13_hc03_vc28);
	chartArray[1] = parseFloat(feature.properties.chi13_hc03_vc29);
	chartArray[2] = parseFloat(feature.properties.chi13_hc03_vc30);
	chartArray[3] = parseFloat(feature.properties.chi13_hc03_vc31);
	chartArray[4] = parseFloat(feature.properties.chi13_hc03_vc32);
	chartArray[5] = parseFloat(feature.properties.chi13_hc03_vc33);

	var margin = {top: 30, right: 0, bottom: 30, left: 0},
    w = $('#barChart').width() - margin.left - margin.right,
    h = 120 - margin.top - margin.bottom;
	

	var xScale = d3.scale.ordinal()
					.domain(d3.range(chartArray.length))
					.rangeRoundBands([0, w], 0.05);

	if (d3.min(chartArray) <= 0) {
		var chartYmin = d3.min(chartArray);
	} else {
		var chartYmin = 0;
	}

	var y0 = Math.max(chartYmin, Math.abs(d3.max(chartArray))) + 10;

	var yScale = d3.scale.linear()
					.domain([-y0, y0])
					.rangeRound([h, 0]);

	// draw bar chart
	svg = d3.select("#barChart")
		.append("svg")
		.attr("width", w + margin.left + margin.right)
		.attr("height", h + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.selectAll(".bar")
	   .data(chartArray)
	   .enter()
	   .append("rect")
	   .attr("class", "bar")
	   .attr("x", function(d, i) {
	   		return xScale(i);
	   })
	   .attr("y", function(d) {
	   		return yScale(Math.max(0, d));
	   })
	   .attr("width", xScale.rangeBand())
	   .attr("height", function(d) {
	   		return Math.abs(yScale(d) - yScale(0));
	   })
	   .attr("fill", function(d, i) {
	   		return DNAinfoChiTtwMap.fillColor_POLYGONS(i);
	   });

	svg.selectAll(".numbers")
	   .data(chartArray)
	   .enter()
	   .append("text")
	   .attr("class", "numbers")
	   .text(function(d) {
	   		return d + '%';
	   })
	   .attr("text-anchor", "middle")
	   .attr("x", function(d, i) {
	   		return xScale(i) + xScale.rangeBand() / 2;
	   })
	   .attr("y", function(d) {
	   		if (d >= 0) {
	   			return yScale(d) - 2;
	   		} else {
				return yScale(d) + 12;
	   		}
	   })
	   .attr("font-family", "'Titillium Web', Helvetica, Sans-Serif")
	   .attr("font-size", "12px")
	   .attr("fill", "#252525");

	svg.selectAll(".categories")
	   .data(chartArray)
	   .enter()
	   .append("text")
	   .attr("class", "categories")
	   .text(function(d, i) {
	   		return DNAinfoChiTtwMap.ordinalCategories(i);
	   })
	   .attr("text-anchor", "middle")
	   .attr("transform", function(d, i) {
	   		var x = xScale(i) + xScale.rangeBand() / 1.8;
	   		if (d >= 0) {
	   			var y = h;
	   		} else {
	   			var y = h - 40;
	   		}
	   		
	   		return "translate(" + x + "," + y + ")rotate(-45)";
	   })
	   .attr("font-family", "'Titillium Web', Helvetica, Sans-Serif")
	   .attr("font-size", "12px")
	   .attr("fill", "#252525");


	svg.append("g")
		.attr("class", "axis")
		.append('line')
		.attr("x1", 0)
		.attr("x2", w)
		.attr("y1", 0)
		.attr("y2", 0)
		.attr("transform", function(d, i) {
	   		var y = yScale(0);
	   		return "translate(0," + y + ")";
	   	})
	   	.attr("stroke", "#545454");


}



DNAinfoChiTtwMap.prototype.loadPolyLayer = function (){
	// load polygons layer; path defined in index.html
	var thismap = this;

	d3.json(topojsonData, function(data) {
		polyTopojson = topojson.feature(data, data.objects.chi_acs_10_13_commute).features;
		drawPolysWData();
	});

	function drawPolysWData() {
		thismap.POLYGONS = L.geoJson(polyTopojson, {
		    style: DNAinfoChiTtwMap.getStyleFor_POLYGONS,
			onEachFeature: DNAinfoChiTtwMap.onEachFeature_POLYGONS
		});
		thismap.POLYGONS.addTo(thismap.map);
		findCenterandFire();
	}

	function findCenterandFire() {
		var latLngCenter = L.latLng(thismap.center[0], thismap.center[1]);
		var results = leafletPip.pointInLayer(latLngCenter, thismap.POLYGONS, true);
		var leafletId = results[0]._leaflet_id;
		thismap.map._layers[leafletId].fire('click');
		thismap.map._layers[leafletId].fireEvent('mouseover', {
	      latlng: latLngCenter,
	      layerPoint: thismap.map.latLngToLayerPoint(latLngCenter),
	      containerPoint: thismap.map.latLngToContainerPoint(latLngCenter)
	    });

	}

}


DNAinfoChiTtwMap.getStyleFor_POLYGONS = function (feature){
	var mode = [];
	mode.push({'id':0, 'value':feature.properties.chi13_hc03_vc28});
	mode.push({'id':1, 'value':feature.properties.chi13_hc03_vc29});
	mode.push({'id':2, 'value':feature.properties.chi13_hc03_vc30});
	mode.push({'id':3, 'value':feature.properties.chi13_hc03_vc31});
	mode.push({'id':4, 'value':feature.properties.chi13_hc03_vc32});
	mode.push({'id':5, 'value':feature.properties.chi13_hc03_vc33});
	mode.sort(function(a, b) { return b.value - a.value; });
	if (!mode[0].value) {
		mode[0].id = 'undefined';
	} 
    return {
        weight: 1,
        opacity: 0.75,
        color: '#f1f1f1',
        fillOpacity: 0.75,
        fillColor: DNAinfoChiTtwMap.fillColor_POLYGONS(mode[0].id)
    }
}

DNAinfoChiTtwMap.fillColor_POLYGONS = function (d){
    return d == 0 ? '#e41a1c' :
           d == 1 ? '#377eb8' :
           d == 2 ? '#4daf4a' :
           d == 3 ? '#984ea3' :
           d == 4 ? '#ff7f00' :
           d == 5 ? '#ffff33' :
                    '#fff';	
}

DNAinfoChiTtwMap.ordinalCategories = function (d){
    return d == 0 ? 'Drove Alone' :
           d == 1 ? 'Carpool' :
           d == 2 ? 'Pub. Trans.' :
           d == 3 ? 'Walking' :
           d == 4 ? 'Other' :
           d == 5 ? 'Home' :
                    '';	
}


DNAinfoChiTtwMap.centerBySubdomain = function (){
	// Based on a url like the following: 
	// http://www.dnainfo.com/new-york/20150428/mott-haven/man-busted-on-stolen-citi-bike-claimed-he-borrowed-it-from-his-cousin-nypd

	var referrer = document.referrer;
	var urlArray = referrer.split("/");
	var domain = urlArray[2];
	var neighborhood = urlArray[5];
	console.log(urlArray[5]);

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
		"west-loop": [41.882457, -87.644678],
		"heart-of-chicago": [41.856028, -87.676171],
		"heart-of-italy": [41.848614, -87.684616],

	}

	if (domain == "www.dnainfo.com" && lookup[neighborhood]) {			
		return lookup[neighborhood];
	} else {
		return [41.878114, -87.629798];
	}


}
	
	
