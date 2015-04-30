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

}

DNAinfoCompstatMap.onEachFeature_POLYGONS = function(feature,layer){	
	var highlight = {
	    weight: 2,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: 0.75
	};
	var dateFormat = d3.time.format("%x");

	var precinct = DNAinfoCompstatMap.precinctNumbers(feature.id);

	layer.bindLabel("<strong>" + precinct + " Precinct</strong><br />" + feature.properties.total + " major crimes between<br />" + dateFormat(feature.properties.start_date) + " and " + dateFormat(feature.properties.end_date) + ".", { direction:'auto' });
	
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
		$('#descriptionTitle').html("<p><strong>" + precinct + " Precinct</strong></p>");

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
		var h = 130;

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
		   		return DNAinfoCompstatMap.COMPSTATordinalCategoryColors(i);
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
		   		return DNAinfoCompstatMap.ordinalCategories(i);
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
						feature.properties = value;
					}
				});
			});
			drawPolysWData();
		});
	}

	function drawPolysWData () {
		thismap.POLYGONS = L.geoJson(polyTopojson, {
		    style: DNAinfoCompstatMap.getStyleFor_POLYGONS,
			onEachFeature: DNAinfoCompstatMap.onEachFeature_POLYGONS
		});
		thismap.POLYGONS.addTo(thismap.map);		
	}

}

DNAinfoCompstatMap.getStyleFor_POLYGONS = function (feature){
    return {
        weight: 1,
        opacity: 0.75,
        color: '#f1f1f1',
        fillOpacity: 0.75,
        fillColor: DNAinfoCompstatMap.fillColor_POLYGONS(feature.properties.total)
    }
}

DNAinfoCompstatMap.fillColor_POLYGONS = function (d){
    return d > 50 ? '#0868ac' :
           d > 25 ? '#43a2ca' :
           d > 10 ? '#7bccc4' :
           d > 5  ? '#a8ddb5' :
           d > 1  ? '#ccebc5' :
                    '#f0f9e8';	
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
	
	
