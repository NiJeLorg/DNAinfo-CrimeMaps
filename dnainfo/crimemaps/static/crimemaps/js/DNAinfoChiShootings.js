/* 
* Functions to create the main DNAinfo Crime Map
*/

// initialize map
function DNAinfoChiShootings() {
	// set zoom and center for this map
	if (center) {
		centerArray = center.split(',');
		this.center = [centerArray[0], centerArray[1]];
		console.log(this.center);
	} else {
		this.center = DNAinfoChiShootings.centerBySubdomain();	
	}
	center = this.center;
    //this.center = [40.710508, -73.943825];
    this.zoom = 14;

    this.map = new L.Map('map', {
		minZoom:10,
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
	this.CHISHOOTINGS = null;
	this.COMMUNITIES = null;


}

// get and set bounds based on open wrapper
DNAinfoChiShootings.slightPanUp = function (){
	var point = L.point(0, 150);
	MY_MAP.map.panBy(point);
}

DNAinfoChiShootings.onEachFeature_CHISHOOTINGS = function(feature,layer){	
	var highlight = {
	    weight: 2,
	    color: '#000'
	};
	var noHighlight = {
        weight: 1,
        color: '#f1f1f1'
	};
	var dateFormat = d3.time.format("%a %b %e, %Y %I:%M %p ");


	if (feature.properties.District) {
		if (feature.properties.District == 'SP') {
			var district = "<br /> State Police"
		} else {
			var district = "<br />" + DNAinfoChiShootings.districtNumbers(feature.properties.District) + " District";			
		}
	} else {
		var district = '';
	}

	if (feature.properties.Beat && feature.properties.Beat != 'SP') {
		var beat = "<br />Beat Number " + feature.properties.Beat;
	} else {
		var beat = '';
	}

	if (feature.properties.Location) {
		var location = "<br />Crime Scene Type: " + feature.properties.Location;
	} else {
		var location = '';
	}

	if (feature.properties.URL) {
		var url = "<a href='" + feature.properties.URL + "' target='_top'>Read about this shooting.</a><br />";
	} else {
		var url = '';
	}

	if (feature.properties.TotalVict > 1) {
		var TotalVict = feature.properties.TotalVict + ' shooting victims'
	} else if (feature.properties.TotalVict == 1) {
		var TotalVict = feature.properties.TotalVict + ' shooting victim'		
	} else {
		var TotalVict = 'No shooting victims'		
	}

	if (feature.properties.HomVics > 1) {
		var HomVics = feature.properties.HomVics + ' homicide victims';
	} else if (feature.properties.HomVics == 1) {
		var HomVics = feature.properties.HomVics + ' homicide victim';		
	} else {
		var HomVics = 'No homicide victims';
	}

	layer.bindLabel("<strong>" + feature.properties.Address + "</strong><br />" + dateFormat(feature.properties.Date) + "<br />" + TotalVict + "<br />" + HomVics , { direction:'auto' });
	
    layer.on('mouseover', function(ev) {	

		if (layer._leaflet_id != nearestCenterId) {
			// don't show center label
			//check for existence first
			if (MY_MAP.map._layers[nearestCenterId]) {
				MY_MAP.map._layers[nearestCenterId].label.close();
				MY_MAP.map._layers[nearestCenterId].setStyle(noHighlight);
			}
		} 

		layer.setStyle(highlight);

		/*
		if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }
	    */

		// add content to description area
		$('#descriptionTitle').html("<p><strong>Shooting at " + feature.properties.Address + "</strong></p>");

		$('#description').html("<p>" + url + dateFormat(feature.properties.Date) + "<br />" + TotalVict + "<br />" + HomVics + district + beat + location + "</p></div>");

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

		if (layer._leaflet_id != nearestCenterId) {
			// don't show center label
			//check for existence first
			if (MY_MAP.map._layers[nearestCenterId]) {
				MY_MAP.map._layers[nearestCenterId].label.close();
				MY_MAP.map._layers[nearestCenterId].setStyle(noHighlight);
			}
		} 


		// add content to description area
		$('#descriptionTitle').html("<p><strong>Shooting at " + feature.properties.Address + "</strong></p>");

		$('#description').html("<p>" + url + dateFormat(feature.properties.Date) + "<br />" + TotalVict + "<br />" + HomVics + district + beat + location + "</p></div>");

		DNAinfoChiShootings.drawChart(feature,layer);

	});

	// we'll now add an ID to each layer so we can fire the mouseover and click outside of the map
    layer._leaflet_id = feature.properties.leafletId;

}


DNAinfoChiShootings.onEachFeature_COMMUNITIES = function(feature,layer){	
	var highlight = {
	    color: '#000'
	};
	var noHighlight = {
        color: '#bdbdbd'
	};

	layer.bindLabel("<strong>" + feature.properties.comm_name + "</strong>", { direction:'auto' });
	
    layer.on('mouseover', function(ev) {

		layer.setStyle(highlight);
		if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	        MY_MAP.CHISHOOTINGS.bringToFront();
	    }


    });
		
    layer.on('mouseout', function(ev) {
		layer.setStyle(noHighlight);		
    });	

    layer.on('click', function(ev) {
		layer.setStyle(highlight);
		if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	        MY_MAP.CHISHOOTINGS.bringToFront();
	    }

	    DNAinfoChiShootings.drawChart(feature,layer);
    });	


}

DNAinfoChiShootings.prototype.loadPointLayers = function (){
	// load points layers
	var thismap = this;
	var dateFormat = d3.time.format("%Y-%m-%dT%X");
	d3.json('/chishootingsapi/?startDate=' + startDate + '&endDate=' + endDate, function(data) {
		geojsonData = data;
		$.each(geojsonData.features, function(i, d){
			d.properties.Date = dateFormat.parse(d.properties.Date);
			d.properties.leafletId = 'layerID' + i;
		});

		thismap.CHISHOOTINGS = L.geoJson(geojsonData, {
		    pointToLayer: DNAinfoChiShootings.getStyleFor_CHISHOOTINGS,
			onEachFeature: DNAinfoChiShootings.onEachFeature_CHISHOOTINGS
		}).addTo(thismap.map);

		findCenterandFire();

		// draw time slider after points are added
		// DNAinfoChiShootings.drawTimeSlider();
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
		//thismap.map._layers[nearestCenterId].fire('click');
		thismap.map._layers[nearestCenterId].fireEvent('mouseover', {
	      latlng: pointLatLng,
	      layerPoint: thismap.map.latLngToLayerPoint(pointLatLng),
	      containerPoint: thismap.map.latLngToContainerPoint(pointLatLng)
	    });

	}



}


DNAinfoChiShootings.prototype.loadCommuninities = function (){
	var thismap = this;
	d3.json(chiCommunities, function(data) {
		polyTopojson = topojson.feature(data, data.objects.chi_acs_2013_commareas_commute).features;
		drawPolys();
	});

	function drawPolys() {
		thismap.COMMUNITIES = L.geoJson(polyTopojson, {
		    style: DNAinfoChiShootings.getStyleFor_COMMUNITIES,
			onEachFeature: DNAinfoChiShootings.onEachFeature_COMMUNITIES
		});
		thismap.COMMUNITIES.addTo(thismap.map).bringToBack();
	}

}


DNAinfoChiShootings.getStyleFor_CHISHOOTINGS = function (feature, latlng){

	var pointMarker = L.circleMarker(latlng, {
		radius: DNAinfoChiShootings.CountRadius(feature.properties.TotalVict),
		color: '#bdbdbd',
		weight: 1,
		opacity: 1,
		fillColor: DNAinfoChiShootings.FillColor(feature.properties.HomVics),
		fillOpacity: 1
	});
	
	return pointMarker;
	
}

DNAinfoChiShootings.getStyleFor_COMMUNITIES = function (feature){
    return {
        weight: 2,
        opacity: 1,
        color: '#bdbdbd',
        fillOpacity: 0,
        fillColor: '#fff'
    }
}

DNAinfoChiShootings.CountRadius = function (d){
    return d > 5 ? 20 :
           d > 4 ? 15 :
           d > 3 ? 10 :
           d > 2 ? 8 :
           d > 1 ? 6 :
                   4 ;	
}

DNAinfoChiShootings.FillColor = function (d){
    return d > 0 ? "#931212" :
                   "#4d4d4d" ;	

}

// commented out -- removed slider
/*
DNAinfoChiShootings.drawTimeSlider = function (){
	var minDate = new Date(2010,0,1);
	var maxDate = moment().toDate();
	var sixMonthsAgo = moment().subtract(6, 'months').startOf('month').toDate();
	if (startDate) {
		selectedMin = moment(startDate).toDate();
	} else {
		selectedMin = sixMonthsAgo;
	}

	if (endDate) {
		selectedMax = moment(endDate).toDate();
	} else {
		selectedMax = maxDate;
	}

	mapSlider = d3.slider()
					.axis(
						d3.svg.axis()
							.orient("top")
							.scale(
								d3.time.scale()
									.domain([minDate, maxDate])
							)
							.ticks(d3.time.years)
							.tickSize(24, 0)
							.tickFormat(d3.time.format("%Y"))
					)
					.scale(
						d3.time.scale()
							.domain([minDate, maxDate])
					)
					.value( [ selectedMin, selectedMax ] )
					.on("slideend", function(evt, value) {
						$("body").addClass("loading");
						// run a function to update map layers with new dates
						selectedMin = value[0];
						selectedMax = value[1];
						DNAinfoChiShootings.updateMap();

					})
					.on("slide", function(evt, value) {
						// run a function to update map layers with new dates
						selectedMin = value[0];
						selectedMax = value[1];
						// add formated dates selected to area right below slider
						$('#printStartDate').html(moment(selectedMin).format("MMM D, YYYY"));
						$('#printEndDate').html(moment(selectedMax).format("MMM D, YYYY"));
					});

	d3.select('#timeSlider').call(mapSlider);

	// add formated dates selected to area right below slider
	$('#printStartDate').html(moment(selectedMin).format("MMM D, YYYY"));
	$('#printEndDate').html(moment(selectedMax).format("MMM D, YYYY"));

}
*/

DNAinfoChiShootings.drawChart = function(feature,layer){
	// remove any charts if they exist
	d3.select('#barChart').selectAll("*").remove();

	// remove chart title
	$('#chartTitle').html("");

	// query the API based on neighborhood selected
	if (feature.properties.comm_num) {
		var communityno = feature.properties.comm_num;
		var communityname = feature.properties.comm_name;
	} else {
		var communityno = feature.properties.CommunityNo;
		var communityname = feature.properties.CommunityName;
	}

	// don't bother attempting if neighborhood is undefined
	if (communityno != '') {
		d3.json('/chishootingsaggregateapi/?communityno=' + communityno, function(data) {
			var dataset = data;
			console.log(dataset);
			DNAinfoChiShootings.updateChart(dataset, communityno, communityname);

		});			
	}


}


DNAinfoChiShootings.updateChart = function(dataset, communityno, communityname){

	communityname = communityname.toLowerCase();
	// add chart title
	$('#chartTitle').html("<p class='text-capitalize'><strong>" + communityname + " </strong><button type=\"button\" class=\"btn btn-default btn-xs\" id=\"viewCitywide\">View Citywide</button></p>");

		
	var yearData = {};
	yearData.labels = [];
	yearData.series = [{label: 'Shootings', values: []}, {label: 'Shooting Victims', values: []}, {label: 'Homicide Victims', values: []}];

	// this year
	var thisYear = parseInt(moment().format("YYYY"));

	for (var i = thisYear; i >= 2010; i--) {
		if (dataset[communityno][i]) {
			var num_shootings = parseInt(dataset[communityno][i]['num_shootings']);
			var sum_victims = parseInt(dataset[communityno][i]['sum_victims']);
			var sum_homicide = parseInt(dataset[communityno][i]['sum_homicide']);
		} else {
			var num_shootings = 0;
			var sum_victims = 0;
			var sum_homicide = 0;
		}
		yearData.labels.push(i);
		yearData.series[0].values.push(num_shootings);
		yearData.series[1].values.push(sum_victims);
		yearData.series[2].values.push(sum_homicide);
	};

	drawHorizBarchart(yearData, 'year')


	// this month
	var monthData = {};
	monthData.labels = [];
	monthData.series = [{label: 'Shootings', values: []}, {label: 'Victims', values: []}, {label: 'Homicides', values: []}];

	var evaluateDate = moment().startOf('month');
	var beginningMonth = moment().subtract(6, 'months');
	while (evaluateDate >= beginningMonth) {
		var month = evaluateDate.month() + 1;
		var year = evaluateDate.year();
		if (dataset[communityno][month]) {
			var num_shootings = parseInt(dataset[communityno][month][year]['num_shootings']);
			var sum_victims = parseInt(dataset[communityno][month][year]['sum_victims']);
			var sum_homicide = parseInt(dataset[communityno][month][year]['sum_homicide']);
		} else {
			var num_shootings = 0;
			var sum_victims = 0;
			var sum_homicide = 0;
		}
		var monthLabel = evaluateDate.format("MMM YYYY");
		monthData.labels.push(monthLabel);
		monthData.series[0].values.push(num_shootings);
		monthData.series[1].values.push(sum_victims);
		monthData.series[2].values.push(sum_homicide);

		evaluateDate.subtract(1, 'months');
	
	}

	drawHorizBarchart(monthData, 'month')


	function drawHorizBarchart (data, type) {
		// Zip the series data together (first values, second values, etc.)
		var zippedData = [];
		for (var i=0; i<data.labels.length; i++) {
		  for (var j=0; j<data.series.length; j++) {
		    zippedData.push(data.series[j].values[i]);
		  }
		}

		if (type == 'year') {
			var	chartWidth       = ($('#barChart').width()/2)/3,
			    spaceForLabels   = 30,
			    spaceForLegend   = 24;
		} else {
			var chartWidth       = ($('#barChart').width()/2)/3,
			    spaceForLabels   = 50,
			    spaceForLegend   = 90;
		}

		var margin 			 = {top: 30, right: 0, bottom: 30, left: 0},
		    barHeight        = 10,
		    groupHeight      = barHeight * data.series.length,
		    gapBetweenGroups = 10;

	    var color = [ "#ad1515", "#377EB8", "#4DAF4A" ];
	    var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

		var x = d3.scale.linear()
		    .domain([0, d3.max(zippedData)])
		    .range([0, chartWidth]); 

		var y = d3.scale.linear()
		    .range([chartHeight + gapBetweenGroups, 0]);

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .tickFormat('')
		    .tickSize(0)
		    .orient("left");

		// draw bar chart
		var chart = d3.select('#barChart')
			.append("svg")
		    .attr("width", spaceForLabels + chartWidth + spaceForLegend)
		    .attr("height", chartHeight);

		// Create bars
		var bar = chart.selectAll("g")
		    .data(zippedData)
		    .enter().append("g")
		    .attr("transform", function(d, i) {
		      return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
		    });

		// Create rectangles of the correct width
		bar.append("rect")
		    .attr("fill", function(d,i) { return color[i % data.series.length]; })
		    .attr("class", "bar")
		    .attr("width", x)
		    .attr("height", barHeight - 1);

		// Add text label in bar
		bar.append("text")
			.attr("class", "label")
		    .attr("x", function(d) { return x(d) + 3; })
		    .attr("y", barHeight / 2)
		    .attr("dy", ".25em")
		    .text(function(d) { return d; });

		// Draw labels
		bar.append("text")
		    .attr("class", "label")
		    .attr("text-anchor", "end")
		    .attr("x", function(d) { return - 4; })
		    .attr("y", groupHeight / 2)
		    .attr("dy", ".25em")
		    .text(function(d,i) {
		      if (i % data.series.length === 0)
		        return data.labels[Math.floor(i/data.series.length)];
		      else
		        return ""});

		chart.append("g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
		      .call(yAxis);

		// Draw legend
		var legendRectSize = 10,
		    legendSpacing  = 2;

		var legend = chart.selectAll('.legend')
		    .data(data.series)
		    .enter()
		    .append('g')
		    .attr('transform', function (d, i) {
		        var height = legendRectSize + legendSpacing;
		        var offset = -gapBetweenGroups/2;
		        var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
		        var vert = i * height - offset;
		        return 'translate(' + horz + ',' + vert + ')';
		    });

		legend.append('rect')
		    .attr('width', legendRectSize)
		    .attr('height', legendRectSize)
		    .style('fill', function (d, i) { return color[i]; })
		    .style('stroke', function (d, i) { return color[i]; });

		legend.append('text')
		    .attr('class', 'label')
		    .attr('x', legendRectSize + legendSpacing)
		    .attr('y', legendRectSize - legendSpacing)
		    .text(function (d) { return d.label; });


	}

}


DNAinfoChiShootings.drawCitywideChart = function(){
	// remove any charts if they exist
	d3.select('#barChart').selectAll("*").remove();

	// remove chart title
	$('#chartTitle').html("");

	// don't bother attempting if neighborhood is undefined
	d3.json('/chishootingcitywidesaggregateapi/', function(data) {
		var dataset = data;
		DNAinfoChiShootings.updateCitywideChart(dataset);
	});			

}


DNAinfoChiShootings.updateCitywideChart = function(dataset){

	// add chart title
	$('#chartTitle').html("<p class='text-capitalize'><strong>Citywide</strong></p>");

		
	var yearData = {};
	yearData.labels = [];
	yearData.series = [{label: 'Shootings', values: []}, {label: 'Shooting Victims', values: []}, {label: 'Homicide Victims', values: []}];

	// this year
	var thisYear = parseInt(moment().format("YYYY"));

	for (var i = thisYear; i >= 2010; i--) {
		if (dataset[i]) {
			var num_shootings = parseInt(dataset[i]['num_shootings']);
			var sum_victims = parseInt(dataset[i]['sum_victims']);
			var sum_homicide = parseInt(dataset[i]['sum_homicide']);
		} else {
			var num_shootings = 0;
			var sum_victims = 0;
			var sum_homicide = 0;
		}
		yearData.labels.push(i);
		yearData.series[0].values.push(num_shootings);
		yearData.series[1].values.push(sum_victims);
		yearData.series[2].values.push(sum_homicide);
	};

	drawHorizBarchart(yearData, 'year')


	// this month
	var monthData = {};
	monthData.labels = [];
	monthData.series = [{label: 'Shootings', values: []}, {label: 'Victims', values: []}, {label: 'Homicides', values: []}];

	var evaluateDate = moment().startOf('month');
	var beginningMonth = moment().subtract(6, 'months');
	while (evaluateDate >= beginningMonth) {
		var month = evaluateDate.month() + 1;
		var year = evaluateDate.year();
		if (dataset[month]) {
			var num_shootings = parseInt(dataset[month][year]['num_shootings']);
			var sum_victims = parseInt(dataset[month][year]['sum_victims']);
			var sum_homicide = parseInt(dataset[month][year]['sum_homicide']);
		} else {
			var num_shootings = 0;
			var sum_victims = 0;
			var sum_homicide = 0;
		}
		var monthLabel = evaluateDate.format("MMM YYYY");
		monthData.labels.push(monthLabel);
		monthData.series[0].values.push(num_shootings);
		monthData.series[1].values.push(sum_victims);
		monthData.series[2].values.push(sum_homicide);

		evaluateDate.subtract(1, 'months');
	
	}

	drawHorizBarchart(monthData, 'month')


	function drawHorizBarchart (data, type) {
		// Zip the series data together (first values, second values, etc.)
		var zippedData = [];
		for (var i=0; i<data.labels.length; i++) {
		  for (var j=0; j<data.series.length; j++) {
		    zippedData.push(data.series[j].values[i]);
		  }
		}

		if (type == 'year') {
			var	chartWidth       = ($('#barChart').width()/2)/3,
			    spaceForLabels   = 30,
			    spaceForLegend   = 30;
		} else {
			var chartWidth       = ($('#barChart').width()/2)/3,
			    spaceForLabels   = 50,
			    spaceForLegend   = 90;
		}

		var margin 			 = {top: 30, right: 0, bottom: 30, left: 0},
		    barHeight        = 10,
		    groupHeight      = barHeight * data.series.length,
		    gapBetweenGroups = 10;

	    var color = [ "#ad1515", "#377EB8", "#4DAF4A" ];
	    var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

		var x = d3.scale.linear()
		    .domain([0, d3.max(zippedData)])
		    .range([0, chartWidth]); 

		var y = d3.scale.linear()
		    .range([chartHeight + gapBetweenGroups, 0]);

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .tickFormat('')
		    .tickSize(0)
		    .orient("left");

		// draw bar chart
		var chart = d3.select('#barChart')
			.append("svg")
		    .attr("width", spaceForLabels + chartWidth + spaceForLegend)
		    .attr("height", chartHeight);

		// Create bars
		var bar = chart.selectAll("g")
		    .data(zippedData)
		    .enter().append("g")
		    .attr("transform", function(d, i) {
		      return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
		    });

		// Create rectangles of the correct width
		bar.append("rect")
		    .attr("fill", function(d,i) { return color[i % data.series.length]; })
		    .attr("class", "bar")
		    .attr("width", x)
		    .attr("height", barHeight - 1);

		// Add text label in bar
		bar.append("text")
			.attr("class", "label")
		    .attr("x", function(d) { return x(d) + 3; })
		    .attr("y", barHeight / 2)
		    .attr("dy", ".25em")
		    .text(function(d) { return d; });

		// Draw labels
		bar.append("text")
		    .attr("class", "label")
		    .attr("text-anchor", "end")
		    .attr("x", function(d) { return - 4; })
		    .attr("y", groupHeight / 2)
		    .attr("dy", ".25em")
		    .text(function(d,i) {
		      if (i % data.series.length === 0)
		        return data.labels[Math.floor(i/data.series.length)];
		      else
		        return ""});

		chart.append("g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
		      .call(yAxis);

		// Draw legend
		var legendRectSize = 10,
		    legendSpacing  = 2;

		var legend = chart.selectAll('.legend')
		    .data(data.series)
		    .enter()
		    .append('g')
		    .attr('transform', function (d, i) {
		        var height = legendRectSize + legendSpacing;
		        var offset = -gapBetweenGroups/2;
		        var horz = spaceForLabels + chartWidth + 42 - legendRectSize;
		        var vert = i * height - offset;
		        return 'translate(' + horz + ',' + vert + ')';
		    });

		legend.append('rect')
		    .attr('width', legendRectSize)
		    .attr('height', legendRectSize)
		    .style('fill', function (d, i) { return color[i]; })
		    .style('stroke', function (d, i) { return color[i]; });

		legend.append('text')
		    .attr('class', 'label')
		    .attr('x', legendRectSize + legendSpacing)
		    .attr('y', legendRectSize - legendSpacing)
		    .text(function (d) { return d.label; });


	}

}


DNAinfoChiShootings.updateMap = function (){
	// close popups
	MY_MAP.map.closePopup();

	// moment parses unix offsets and javascript date objects in the same way
	console.log(selectedMax);
	var startDate = moment(selectedMin, "M/D/YYYY").format("YYYY-MM-DD");
	var endDate = moment(selectedMax, "M/D/YYYY").format("YYYY-MM-DD");
	var dateFormat = d3.time.format("%Y-%m-%dT%X");

	// combo box selections
	//var district = $( "#district option:selected" ).val();
	var communityno = $( "#communityno option:selected" ).val();
	//var location = $( "#location option:selected" ).val();
	var dayofweek = $( "#dayofweek option:selected" ).val();
	var hour = $( "#hour option:selected" ).val();
	//var minhour = $( "#minhour option:selected" ).val();
	//var maxhour = $( "#maxhour option:selected" ).val();
	//var mintotalvict = $( "#mintotalvict option:selected" ).val();
	//var maxtotalvict = $( "#maxtotalvict option:selected" ).val();
	//var minhomvics = $( "#minhomvics option:selected" ).val();
	//var maxhomvics = $( "#maxhomvics option:selected" ).val();

	// create comma seperated range of hours
	/*
	var hours = [];
	// ensure that min and max hours have a value if none is selected
	if (minhour == '') {
		minhour = 0;
	} else {
		minhour = parseInt(minhour);
	}
	if (maxhour == '') {
		maxhour = 23;
	} else {
		maxhour = parseInt(maxhour);
	}
	// determine which is bigger, min or max hour
	if (minhour <= maxhour) {
		for (var i = minhour; i <= maxhour; i++) {
		    hours.push(i);
		}		
	} else {
		// when maxhour is bigger than minhour, we need to puse from min to the end of the day (23) and then from 0 to maxhour 
		for (var i = minhour; i <= 23; i++) {
		    hours.push(i);
		}
		for (var i = 0; i <= maxhour; i++) {
		    hours.push(i);
		}
	}

	hours = hours.join(','); 
	*/

	d3.json('/chishootingsapi/?startDate=' + startDate + '&endDate=' + endDate + '&communityno=' + communityno + '&dayofweek=' + dayofweek + '&hour=' + hour, function(data) {
		geojsonData = data;
		$.each(geojsonData.features, function(i, d){
			d.properties.Date = dateFormat.parse(d.properties.Date);
			d.properties.leafletId = 'layerID' + i;
		});

		// clear layer
		MY_MAP.CHISHOOTINGS.clearLayers();
		// add new data
		MY_MAP.CHISHOOTINGS.addData(geojsonData);

		$("body").removeClass("loading");

	});

	// update printed start and end dates
	//$('#printStartDate').html(moment(selectedMin).format("MMM D, YYYY"));
	//$('#printEndDate').html(moment(selectedMax).format("MMM D, YYYY"));


}




DNAinfoChiShootings.districtNumbers = function (d){
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


DNAinfoChiShootings.centerBySubdomain = function (){
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
	
