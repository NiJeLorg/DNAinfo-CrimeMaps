/* 
* Functions to create the main DNAinfo Crime Map
*/

// initialize map
function DNAinfoCrimeMap() {
	// set zoom and center for this map
	// TODO: Set zoom and center based on URL
    this.center = [40.710508, -73.943825];
    this.zoom = 11;

    this.map = new L.Map('map', {
		minZoom:10,
		maxZoom:17,
    	center: this.center,
   	 	zoom: this.zoom,
	});
	
	// add CartoDB tiles
	this.CartoDBLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',{
	  attribution: 'Created By <a href="http://nijel.org/">NiJeL</a> | Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
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
	this.GRADPOINT = null;
	this.BLOTTER = null;

	// marker cluster options
	clusterLocations = L.markerClusterGroup({ 
		showCoverageOnHover: false, 
		maxClusterRadius: 40
	});

	thismap = this;
	this.map.on('zoomend', swapLayersOnZoom);
	function swapLayersOnZoom(e) {
		var zoom = thismap.map.getZoom();

		if (zoom >= 14 && thismap.map.hasLayer( thismap.POLYGONS )) {
			thismap.map.removeLayer( thismap.POLYGONS );
			thismap.GRADPOINT.addTo(thismap.map).bringToBack();	

			// update description
			$('#description').html("<p><strong>Description</strong></p><p>Click on a polygon or point on the map to see more information here.</p>");

			// update legend
			$("#legend").html('<div class="legend-category"><p>Major Crime Categories</p><div class="col-sm-6"><ul><li><div class="bullet" style="background: #66c2a5"></div> Murder</li><li><div class="bullet" style="background: #fc8d62"></div> Rape</li><li><div class="bullet" style="background: #8da0cb"></div> Robbery</li><li><div class="bullet" style="background: #e78ac3"></div> Felony Assault</li></ul></div><div class="col-sm-6"><ul><li><div class="bullet" style="background: #a6d854"></div> Burglary</li><li><div class="bullet" style="background: #ffd92f"></div> Grand Larceny</li><li><div class="bullet" style="background: #e5c494"></div> Grand Larceny Auto</li></ul></div></div><div class="clearfix"></div><div class="legend-bubbles"><p>Number of Major Crimes</p><ul><li>0</li><li class="graph" style="background: #66c2a5;"><div class="bubbles"></div></li><li>&gt;5</li></ul></div>');

		} else if ( zoom < 14 && thismap.map.hasLayer( thismap.GRADPOINT ) ) {
			thismap.map.removeLayer( thismap.GRADPOINT );
			thismap.POLYGONS.addTo(thismap.map).bringToBack();

			// update description
			$('#description').html("<p><strong>Description</strong></p><p>Click on a polygon or point on the map to see more information here.</p>");

			// draw legend
	        $("#legend").html('<div class="legend-category"><p>Major Crime Categories</p><div class="col-sm-6"><ul><li><div class="bullet" style="background: #66c2a5"></div> Murder</li><li><div class="bullet" style="background: #fc8d62"></div> Rape</li><li><div class="bullet" style="background: #8da0cb"></div> Robbery</li><li><div class="bullet" style="background: #e78ac3"></div> Felony Assault</li></ul></div><div class="col-sm-6"><ul><li><div class="bullet" style="background: #a6d854"></div> Burglary</li><li><div class="bullet" style="background: #ffd92f"></div> Grand Larceny</li><li><div class="bullet" style="background: #e5c494"></div> Grand Larceny Auto</li></ul></div></div><div class="clearfix"></div><div class="legend-cloropleth"><p>Number of Major Crimes</p><ul><li class="min">0</li><li class="max">&gt;50</li><li class="graph"><div class="colors"><div class="quartile" style="background-color:#f0f9e8"></div><div class="quartile" style="background-color:#ccebc5"></div><div class="quartile" style="background-color:#a8ddb5"></div><div class="quartile" style="background-color:#7bccc4"></div><div class="quartile" style="background-color:#43a2ca"></div><div class="quartile" style="background-color:#0868ac"></div></div></li></ul></div>');

		} else { 
			// do nothing 
		}
	}


}

DNAinfoCrimeMap.onEachFeature_POLYGONS = function(feature,layer){	
	var highlight = {
	    weight: 2,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: 0.75
	};
	var dateFormat = d3.time.format("%x");

	layer.bindLabel("<strong>Precinct " + feature.properties.precinct + "</strong><br />" + feature.properties.total + " major crimes between<br />" + dateFormat(feature.properties.start_date) + " and " + dateFormat(feature.properties.end_date) + ".", { direction:'auto' });
	
    layer.on('mouseover', function(ev) {		
		layer.setStyle(highlight);				
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
		$('#descriptionTitle').html("<p><strong>Precinct " + feature.properties.precinct + "</strong></p>");

		$('#description').html("<p>Distribution of the " + feature.properties.total + " major crimes committed between " + dateFormat(feature.properties.start_date) + " and " + dateFormat(feature.properties.end_date) + ".</p><div id='barChart'></div>");

		// create object for bar chart
		var chartArray = [];
		chartArray[0] = parseInt(feature.properties.murder);
		chartArray[1] = parseInt(feature.properties.rape);
		chartArray[2] = parseInt(feature.properties.robbery);
		chartArray[3] = parseInt(feature.properties.felony_assault);
		chartArray[4] = parseInt(feature.properties.burglary);
		chartArray[5] = parseInt(feature.properties.grand_larceny);
		chartArray[6] = parseInt(feature.properties.grand_larceny_auto);


		var w = $('#barChart').width();
		var h = 150;

		var xScale = d3.scale.ordinal()
						.domain(d3.range(chartArray.length))
						.rangeRoundBands([0, w], 0.05);

		var yScale = d3.scale.linear()
						.domain([0, d3.max(chartArray)])
						.rangeRound([0, h-60]);

		// draw bar chart
		svg = d3.select("#barChart")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

		svg.selectAll(".bar")
		   .data(chartArray)
		   .enter()
		   .append("rect")
		   .attr("class", "bar")
		   .attr("x", function(d, i) {
		   		return xScale(i);
		   })
		   .attr("y", function(d) {
		   		return (h-50) - yScale(d);
		   })
		   .attr("width", xScale.rangeBand())
		   .attr("height", function(d) {
		   		return yScale(d);
		   })
		   .attr("fill", function(d, i) {
		   		return DNAinfoCrimeMap.COMPSTATordinalCategoryColors(i);
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
		   		if (d == 0) {
		   			return h - 52;
		   		} else {
		   			return h - yScale(d) - 52;
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
		   		return DNAinfoCrimeMap.ordinalCategories(i);
		   })
		   .attr("text-anchor", "end")
		   .attr("transform", function(d, i) {
		   		var x = xScale(i) + xScale.rangeBand() / 1.5;
		   		var y = h-40;
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
		   		var y = h-50;
		   		return "translate(0," + y + ")";
		   	})
		   	.attr("stroke", "#545454");


		// draw legend
        $("#legend").html('<div class="legend-category"><p>Major Crime Categories</p><div class="col-sm-6"><ul><li><div class="bullet" style="background: #66c2a5"></div> Murder</li><li><div class="bullet" style="background: #fc8d62"></div> Rape</li><li><div class="bullet" style="background: #8da0cb"></div> Robbery</li><li><div class="bullet" style="background: #e78ac3"></div> Felony Assault</li></ul></div><div class="col-sm-6"><ul><li><div class="bullet" style="background: #a6d854"></div> Burglary</li><li><div class="bullet" style="background: #ffd92f"></div> Grand Larceny</li><li><div class="bullet" style="background: #e5c494"></div> Grand Larceny Auto</li></ul></div></div><div class="clearfix"></div><div class="legend-cloropleth"><p>Number of Major Crimes</p><ul><li class="min">0</li><li class="max">&gt;50</li><li class="graph"><div class="colors"><div class="quartile" style="background-color:#f0f9e8"></div><div class="quartile" style="background-color:#ccebc5"></div><div class="quartile" style="background-color:#a8ddb5"></div><div class="quartile" style="background-color:#7bccc4"></div><div class="quartile" style="background-color:#43a2ca"></div><div class="quartile" style="background-color:#0868ac"></div></div></li></ul></div>');


	});	
	
}

DNAinfoCrimeMap.onEachFeature_GRADPOINT = function(feature,layer){	
	var highlight = {
	    weight: 2
	};
	var noHighlight = {
        weight: 1
	};
	var dateFormat = d3.time.format("%Y");

	if (feature.properties.TOT > 1) {
		feature.properties.CR = DNAinfoCrimeMap.DOITTpluralCatName(feature.properties.CR);
	}

	layer.bindLabel(feature.properties.TOT + " <span class='text-lowercase'>" + feature.properties.CR + "</span>", { direction:'auto' });
	
    layer.on('mouseover', function(ev) {		
		layer.setStyle(highlight);				
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

		// update legend
		$("#legend").html('<div class="legend-category"><p>Major Crime Categories</p><div class="col-sm-6"><ul><li><div class="bullet" style="background: #66c2a5"></div> Murder</li><li><div class="bullet" style="background: #fc8d62"></div> Rape</li><li><div class="bullet" style="background: #8da0cb"></div> Robbery</li><li><div class="bullet" style="background: #e78ac3"></div> Felony Assault</li></ul></div><div class="col-sm-6"><ul><li><div class="bullet" style="background: #a6d854"></div> Burglary</li><li><div class="bullet" style="background: #ffd92f"></div> Grand Larceny</li><li><div class="bullet" style="background: #e5c494"></div> Grand Larceny Auto</li></ul></div></div><div class="clearfix"></div><div class="legend-bubbles"><p>Number of Major Crimes</p><ul><li>0</li><li class="graph" style="background: #66c2a5;"><div class="bubbles"></div></li><li>&gt;5</li></ul></div>');

	});

}

DNAinfoCrimeMap.onEachFeature_BLOTTER = function(feature,layer){	

	var highlight = {
	    weight: 4,
	    opacity: 1
	};
	var noHighlight = {
        weight: 2,
        opacity: 0.75
	};

	layer.bindLabel(feature.id, { direction:'auto' });
	
    layer.on('mouseover', function(ev) {
		layer.setStyle(highlight);				
    });
		
    layer.on('mouseout', function(ev) {
		layer.setStyle(noHighlight);		
    });	

    // onclick set content in bottom bar and open doc if not open already 
	layer.on("click",function(ev){				
		// update popup content based on click
		$( "#popout-info-content" ).html("<div class='info-title-bar text-capitalize'>" + feature.properties.Organization_Name + "</div><div class='info-content-titles'>ORGANIZATION ACRONYM</div><p class='info-content'>" + feature.properties.Organizaton_Acronym + "</p>");
									
		if ($( ".popout-banner" ).hasClass( "popout-banner-open" )) {
			// don't toggle classes
		} else {
			$( ".popout-banner" ).toggleClass("popout-banner-open");		
			$( ".popout-content" ).toggleClass("popout-content-open");
		}
	});
	
}

DNAinfoCrimeMap.prototype.loadPolyLayer = function (){
	// load polygons layer; path defined in index.html
	var thismap = this;

	d3.csv(compstat_dummy_data, function(data) {
		polygonData = data;
		attachDataToTopojson(polygonData);
	});

	function attachDataToTopojson(polygonData) {
		var dateFormat = d3.time.format("%Y-%m-%d");
		d3.json(NYC_Precincts, function(data) {
			polyTopojson = topojson.feature(data, data.objects.NYC_Precincts).features;
			$.each(polyTopojson, function(i, feature) {
				$.each(polygonData, function(j, value) {
					if (feature.id == value.precinct) {
						value.start_date = dateFormat.parse(value.start_date);
						value.end_date = dateFormat.parse(value.end_date);
						feature.properties = value;
					}
				});
			});
			drawPolysWData();
		});
	}

	function drawPolysWData () {
		thismap.POLYGONS = L.geoJson(polyTopojson, {
		    style: DNAinfoCrimeMap.getStyleFor_POLYGONS,
			onEachFeature: DNAinfoCrimeMap.onEachFeature_POLYGONS
		});
		thismap.POLYGONS.addTo(thismap.map);		
	}

}

DNAinfoCrimeMap.prototype.loadPointLayers = function (){
	// load points layers; paths defined in index.html
	this.GRADPOINT_style = L.geoJson(null, {
		filter: DNAinfoCrimeMap.filterDataFor_GRADPOINT,
	    pointToLayer: DNAinfoCrimeMap.getStyleFor_GRADPOINT,
		onEachFeature: DNAinfoCrimeMap.onEachFeature_GRADPOINT
	});
	/*
	MY_MAP.BLOTTER_style = L.geoJson(null, {
	    pointToLayer: DNAinfoCrimeMap.getStyleFor_BLOTTER,
		onEachFeature: DNAinfoCrimeMap.onEachFeature_BLOTTER
	});
	*/
			
	// load layers
	this.GRADPOINT = omnivore.csv(doitt_dummy_data, null, this.GRADPOINT_style);
	//MY_MAP.BLOTTER = omnivore.topojson(nblayer, null, MY_MAP.BLOTTER_style);

	// maybe?? add grad point to marker clusterer
	//clusterLocations.addLayer(MY_MAP.BLOTTER);

}

DNAinfoCrimeMap.fillColor_POLYGONS = function (d){
    return d > 50 ? '#0868ac' :
           d > 25 ? '#43a2ca' :
           d > 10 ? '#7bccc4' :
           d > 5  ? '#a8ddb5' :
           d > 1  ? '#ccebc5' :
                    '#f0f9e8';	
}

DNAinfoCrimeMap.COMPSTATordinalCategoryColors = function (d){
    return d == 0 ? '#66c2a5' :
           d == 1 ? '#fc8d62' :
           d == 2 ? '#8da0cb' :
           d == 3 ? '#e78ac3' :
           d == 4 ? '#a6d854' :
           d == 5 ? '#ffd92f' :
           d == 6 ? '#e5c494' :
                    '#000';	
}

DNAinfoCrimeMap.DOITTordinalCategoryColors = function (d){
    return d == "MURDER" ? '#66c2a5' :
           d == "RAPE" ? '#fc8d62' :
           d == "ROBBERY" ? '#8da0cb' :
           d == "FELONY ASSAULT" ? '#e78ac3' :
           d == "BURGLARY" ? '#a6d854' :
           d == "GRAND LARCENY" ? '#ffd92f' :
           d == "GRAND LARCENY OF MOTOR VEHICLE" ? '#e5c494' :
                    '#000';	
}

DNAinfoCrimeMap.DOITTpluralCatName = function (d){
    return d == "MURDER" ? 'murders' :
           d == "RAPE" ? 'rapes' :
           d == "ROBBERY" ? 'robberies' :
           d == "FELONY ASSAULT" ? 'felony assaults' :
           d == "BURGLARY" ? 'burglaries' :
           d == "GRAND LARCENY" ? 'grand larcenies' :
           d == "GRAND LARCENY OF MOTOR VEHICLE" ? 'auto grand larcenies' :
                    '';	
}

DNAinfoCrimeMap.ordinalCategories = function (d){
    return d == 0 ? 'Murder' :
           d == 1 ? 'Rape' :
           d == 2 ? 'Robbery' :
           d == 3 ? 'Assault' :
           d == 4 ? 'Burglary' :
           d == 5 ? 'Gr. Larceny' :
           d == 6 ? 'G.L.A' :
                    '';	
}

DNAinfoCrimeMap.DOITTCountRadius = function (d){
    return d > 5 ? 20 :
           d > 4 ? 15 :
           d > 3 ? 10 :
           d > 2 ? 8 :
           d > 1 ? 6 :
                   4 ;	
}

DNAinfoCrimeMap.getStyleFor_POLYGONS = function (feature){
    return {
        weight: 1,
        opacity: 0.75,
        color: '#f1f1f1',
        fillOpacity: 0.75,
        fillColor: DNAinfoCrimeMap.fillColor_POLYGONS(feature.properties.total)
    }
}

DNAinfoCrimeMap.getStyleFor_GRADPOINT = function (feature, latlng){

	var gradPointMarker = L.circleMarker(latlng, {
		radius: DNAinfoCrimeMap.DOITTCountRadius(feature.properties.TOT),
		color: '#bdbdbd',
		weight: 1,
		opacity: 1,
		fillColor: DNAinfoCrimeMap.DOITTordinalCategoryColors(feature.properties.CR),
		fillOpacity: 1
	});
	
	return gradPointMarker;
	
}

DNAinfoCrimeMap.getStyleFor_BLOTTER = function (feature, latlng){
	var blotterPointMarker = L.circleMarker(latlng, {
		radius: 4,
		stroke: false,
		fillColor: '#eb4a42',
		fillOpacity: 1
	});
	
	return blotterPointMarker;
	
}

DNAinfoCrimeMap.filterDataFor_GRADPOINT = function (feature, layer) {
	var checkDate = moment().startOf('month').subtract(1, 'months'); 
	var date = moment(feature.properties.YR + '-' + feature.properties.MO, "YYYY-MM");
	var isLastMonth = date.isSame(checkDate);
	return isLastMonth;
}

DNAinfoCrimeMap.loadFilteredLocations = function(data){
	
	MY_MAP.GRADPOINT.addData(data);
	// add media to cluster library
	clusterLocations.addLayer(MY_MAP.GRADPOINT);

}

DNAinfoCrimeMap.loadLayerFor = function(layerId){
    if(layerId == "POLYGONS"){
		MY_MAP.POLYGONS.addTo(MY_MAP.map).bringToBack();
	}	

    if(layerId == "GRADPOINT"){
		MY_MAP.GRADPOINT.addTo(MY_MAP.map).bringToBack();
	}	

    if(layerId == "BLOTTER"){
		MY_MAP.BLOTTER.addTo(MY_MAP.map).bringToBack();
	}	

}

DNAinfoCrimeMap.removeLayerFor = function(layerId){
	if (layerId == 'POLYGONS') {
		MY_MAP.map.removeLayer( MY_MAP.POLYGONS ); 		
	}

	if (layerId == 'GRADPOINT') {
		MY_MAP.map.removeLayer( MY_MAP.GRADPOINT); 		
	}

	if (layerId == 'BLOTTER') {
		MY_MAP.map.removeLayer( MY_MAP.BLOTTER ); 		
	}

}

DNAinfoCrimeMap.removeLocationsLayers = function(){
	MY_MAP.map.removeLayer(clusterLocations); 
}

DNAinfoCrimeMap.clearLocationsLayers = function(){
	// clear data out of clusterer when users select filters
	MY_MAP.GRADPOINT.clearLayers();	
	clusterLocations.clearLayers();	
	
}
	
	
