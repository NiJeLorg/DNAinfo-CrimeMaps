/* 
* Functions to create the main DNAinfo Crime Map
*/

// initialize map
function DNAinfoCompstatMap() {
	// set zoom and center for this map

	this.center = DNAinfoCompstatMap.centerBySubdomain();
    //this.center = [40.710508, -73.943825];
    this.zoom = 13;

    this.map = new L.Map('map', {
		minZoom:10,
		maxZoom:14,
    	center: this.center,
   	 	zoom: this.zoom,
	});

	
	// add CartoDB tiles
	this.CartoDBLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
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
DNAinfoCompstatMap.slightPanUp = function (){
	var point = L.point(0, 150);
	MY_MAP.map.panBy(point);
}

DNAinfoCompstatMap.onEachFeature_POLYGONS = function(feature,layer){	
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
	var dateFormat = d3.time.format("%x");

	var precinct = DNAinfoCompstatMap.precinctNumbers(feature.id);

	var percentChange = ((Math.abs(feature.properties.total - feature.properties.last_month_total) / feature.properties.last_month_total) * 100).toFixed(0);

	if (feature.properties.diff_total > 0) {
		var headingTotalText = "<strong><span class='increaseTextPopup'>"+ percentChange +"% increase</span></strong> in major<br />crimes from previous<br />four weeks.";
	} else {
		var headingTotalText = "<strong><span class='decreaseTextPopup'>"+ percentChange +"% decrease</span></strong> in major<br />crimes from previous<br />four weeks.";
	}


	layer.bindLabel("<strong>" + precinct + " Precinct</strong><br />" + headingTotalText, { direction:'auto' });
	
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

		DNAinfoCompstatMap.drawChart(feature,layer);

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

		DNAinfoCompstatMap.drawChart(feature,layer);
	});	

    // we'll now add an ID to each layer so we can fire the mouseover and click outside of the map
    layer._leaflet_id = 'layerID' + count;
    count++;

}


DNAinfoCompstatMap.drawChart = function(feature,layer){
	var dateFormat = d3.time.format("%x");
	var precinct = DNAinfoCompstatMap.precinctNumbers(feature.id);

	var headingTotalText = feature.properties.total + " major crimes from " + dateFormat(feature.properties.start_date) + " to " + dateFormat(feature.properties.end_date);

	var headingTotalTextLastMonth = feature.properties.last_month_total + " major crimes from " + dateFormat(feature.properties.last_month_start_date) + " to " + dateFormat(feature.properties.last_month_end_date);

	// add content to description area
	$('#descriptionTitle').html("<p><strong>" + precinct + " Precinct</strong><br />"+ headingTotalText + "<br />" + headingTotalTextLastMonth + "</p>");

	/*
	$('#description').html("<p>Distribution of the change in major crimes committed in the four weeks from " + dateFormat(feature.properties.start_date) + " to " + dateFormat(feature.properties.end_date) + " compared with the previous four weeks from " + dateFormat(feature.properties.last_month_start_date) + " to " + dateFormat(feature.properties.last_month_end_date) + ".</p><div id='barChart'></div>");
	*/

	$('#description').html("<p>Distribution by category of the change in major crimes committed:</p><div id='barChart'></div>");

	// create object for bar chart
	var chartArray = [];
	chartArray[0] = parseInt(feature.properties.diff_murder);
	chartArray[1] = parseInt(feature.properties.diff_rape);
	chartArray[2] = parseInt(feature.properties.diff_robbery);
	chartArray[3] = parseInt(feature.properties.diff_felony_assault);
	chartArray[4] = parseInt(feature.properties.diff_burglary);
	chartArray[5] = parseInt(feature.properties.diff_grand_larceny);
	chartArray[6] = parseInt(feature.properties.diff_grand_larceny_auto);

	var margin = {top: 30, right: 10, bottom: 30, left: 10},
    w = $('#barChart').width() - margin.left - margin.right,
    h = 100 - margin.top - margin.bottom;
	

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
	   .attr("fill", function(d) {
	   		return DNAinfoCompstatMap.fillColor_POLYGONS(d);
	   });

	svg.selectAll(".numbers")
	   .data(chartArray)
	   .enter()
	   .append("text")
	   .attr("class", "numbers")
	   .text(function(d) {
	   		return d;
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
	   		return DNAinfoCompstatMap.ordinalCategories(i);
	   })
	   .attr("text-anchor", "middle")
	   .attr("transform", function(d, i) {
	   		var x = xScale(i) + xScale.rangeBand() / 1.8;
	   		if (d >= 0) {
	   			var y = h + 10;
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


DNAinfoCompstatMap.prototype.loadPolyLayer = function (){
	// load polygons layer; path defined in index.html
	var thismap = this;

	d3.json('/compstatapi/?startDate=' + startDate + '&endDate=' + endDate, function(data) {
		polygonData = data;
		attachDataToTopojson(polygonData);
	});

	function attachDataToTopojson(polygonData) {
		var dateFormat = d3.time.format("%Y-%m-%d");
		d3.json(NYC_Precincts, function(data) {
			polyTopojson = topojson.feature(data, data.objects.NYC_Precincts).features;
			$.each(polyTopojson, function(i, feature) {
				$.each(polygonData, function(precinct, value) {
					if (feature.id == precinct) {
						value.start_date = dateFormat.parse(value.start_date);
						value.end_date = dateFormat.parse(value.end_date);
						value.last_month_start_date = dateFormat.parse(value.last_month_start_date);
						value.last_month_end_date = dateFormat.parse(value.last_month_end_date);
						feature.properties = value;
					}
				});
			});
			drawPolysWData();
		});
	}

	function drawPolysWData() {
		thismap.POLYGONS = L.geoJson(polyTopojson, {
		    style: DNAinfoCompstatMap.getStyleFor_POLYGONS,
			onEachFeature: DNAinfoCompstatMap.onEachFeature_POLYGONS
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


DNAinfoCompstatMap.getStyleFor_POLYGONS = function (feature){
	var percentChange = (((feature.properties.total - feature.properties.last_month_total) / feature.properties.last_month_total) * 100).toFixed(0);
    return {
        weight: 1,
        opacity: 0.75,
        color: '#f1f1f1',
        fillOpacity: 0.75,
        fillColor: DNAinfoCompstatMap.fillColor_POLYGONS(percentChange)
    }
}

DNAinfoCompstatMap.fillColor_POLYGONS = function (d){
    return d > 20  ? '#b2182b' :
           d > 10  ? '#ef8a62' :
           d > 0   ? '#fddbc7' :
           d > -10 ? '#e0e0e0' :
           d > -20 ? '#999999' :
                      '#4d4d4d';	
}

DNAinfoCompstatMap.COMPSTATordinalCategoryColors = function (d){
    return d == 0 ? '#66c2a5' :
           d == 1 ? '#fc8d62' :
           d == 2 ? '#8da0cb' :
           d == 3 ? '#e78ac3' :
           d == 4 ? '#a6d854' :
           d == 5 ? '#ffd92f' :
           d == 6 ? '#e5c494' :
                    '#000';	
}

DNAinfoCompstatMap.ordinalCategories = function (d){
    return d == 0 ? 'Murder' :
           d == 1 ? 'Rape' :
           d == 2 ? 'Robbery' :
           d == 3 ? 'Assault' :
           d == 4 ? 'Burglary' :
           d == 5 ? 'Gr. Larceny' :
           d == 6 ? 'G.L.A' :
                    '';	
}

DNAinfoCompstatMap.precinctNumbers = function (d){
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


DNAinfoCompstatMap.centerBySubdomain = function (){
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
	
	
