/* 
* Functions to create the main DNAinfo zillow map
*/

// initialize map
function DNAinfoCHIZillow() {
	var referrer = document.referrer;
	var urlArray = referrer.split("/");
	var domain = urlArray[2];
	if (urlArray[5]) {
		var neighborhood = urlArray[5];
	} else {
		var neighborhood = 'downtown';      
	} 
	// set zoom and center for this map
	this.center = DNAinfoCHIZillow.center(neighborhood);
    this.zoom = 13;

    this.map = new L.Map('map', {
		minZoom:10,
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

	//load geocoder control
	var geocoder = this.map.addControl(L.Control.geocoder({collapsed: true, placeholder:'Address Search', geocoder:new L.Control.Geocoder.Google()}));
	
    // enable events
    this.map.doubleClickZoom.enable();
    this.map.scrollWheelZoom.enable();
	
	// empty containers for layers 
	this.ZIPS = null;

}



DNAinfoCHIZillow.onEachFeature_ZIPS = function(feature,layer){	

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

	// comma number format
	var commaFormat = d3.format(",.0f");
	var changeFormat = d3.format(",.2f");

	if (activeLayer == 'sale') {

		if (isNaN(feature.properties.mediansaleprice) || feature.properties.mediansaleprice == -99) {
			var price = "</span></strong> in home<br />";
		} else {
			var price = " to $" + commaFormat(feature.properties.mediansaleprice) + " </span></strong>in<br />home ";
		}

		if (isNaN(feature.properties.changeinvaluesquarefootoverpreviousyear) || feature.properties.changeinvaluesquarefootoverpreviousyear == -99) {
			var headingTotalText = "Data not available for home<br />sale price per square foot over<br />the previous year for this zipcode.";
		} else if (feature.properties.changeinvaluesquarefootoverpreviousyear > 0) {
			var headingTotalText = "<strong><span class='increaseTextPopupRE'>"+ Math.abs(feature.properties.changeinvaluesquarefootoverpreviousyear) +"% increase"+ price +"sale price per square foot<br />over the previous year.";
		} else {
			var headingTotalText = "<strong><span class='decreaseTextPopupRE'>"+ Math.abs(feature.properties.changeinvaluesquarefootoverpreviousyear) +"% decrease"+ price +"sale price per square foot<br />over the previous year.";
		}	

		if (L.Browser.touch) {
		} else {
			layer.bindLabel("<strong>Zip Code: " + feature.properties.zip + "</strong><br />​"+ headingTotalText +"<br />Click for more info" , { direction:'auto' });
		}

	    layer.on('mouseover', function(ev) {
	 
			layer.setStyle(highlight);

			if (!L.Browser.ie && !L.Browser.opera) {
		        layer.bringToFront();
		    }

	    });

	    layer.on('mouseout', function(ev) {
			layer.setStyle(noHighlight);		
	    });	

		if (isNaN(feature.properties.percentlivinginsamehouseoneyearago2013censusestimate) || feature.properties.percentlivinginsamehouseoneyearago2013censusestimate == -99) {
			var percentlivinginsamehouseoneyearago2013censusestimate = "";
		} else {
			var percentlivinginsamehouseoneyearago2013censusestimate = "<li><strong>" + feature.properties.percentlivinginsamehouseoneyearago2013censusestimate + "%</strong> of people in zip code " + feature.properties.zip + " live in the same house as they did one year ago.</li>";
		}

		if (isNaN(feature.properties.medianhouseholdincome2013censusestimate) || feature.properties.medianhouseholdincome2013censusestimate == -99) {
			var medianhouseholdincome2013censusestimate = "";
		} else {
			var medianhouseholdincome2013censusestimate = "<li>Median household income here is <strong>$" + commaFormat(feature.properties.medianhouseholdincome2013censusestimate) + "</strong>.</li>";
		}

		if (isNaN(feature.properties.estimatedvaluesquarefoot) || feature.properties.estimatedvaluesquarefoot == -99) {
			var estimatedvaluesquarefoot = "";
		} else {
			var estimatedvaluesquarefoot = "<li>The estimated value for sales is <strong>$" + commaFormat(feature.properties.estimatedvaluesquarefoot) + "</strong> per square foot.</li>";
		}

		if (isNaN(feature.properties.estimatedvalueofallhomes) || feature.properties.estimatedvalueofallhomes == -99) {
			var estimatedvalueofallhomes = "";
		} else {
			var estimatedvalueofallhomes = "<li>The estimated value of all homes is <strong>$" + commaFormat(feature.properties.estimatedvalueofallhomes) + "</strong>.</li>";
		}

		/*
		if (isNaN(feature.properties.medianlistprice) || feature.properties.medianlistprice == -99) {
			var medianlistprice = "";
		} else {
			var medianlistprice = "<li>The median list price of sales is <strong>$" + commaFormat(feature.properties.medianlistprice) + "</strong>.</li>";
		}
		*/

		if (isNaN(feature.properties.percentofhomessoldinpastyear) || feature.properties.percentofhomessoldinpastyear == -99) {
			var percentofhomessoldinpastyear = "";
		} else {
			var percentofhomessoldinpastyear = "<li><strong>" + feature.properties.percentofhomessoldinpastyear + "%</strong> of homes sold in the last year.</li>";
		}


	    layer.bindPopup("<h5>" + feature.properties.neighborhoodscovered + " | Zip Code: " + feature.properties.zip + "</h5><ul>" + percentlivinginsamehouseoneyearago2013censusestimate + medianhouseholdincome2013censusestimate + estimatedvaluesquarefoot + estimatedvalueofallhomes + percentofhomessoldinpastyear + "</ul>");

	} else {

		if (isNaN(feature.properties.avgrentsqfoot) || feature.properties.avgrentsqfoot == -99) {
			var price = "";
		} else {
			var price = " to $" + changeFormat(feature.properties.avgrentsqfoot);
		}

		if (isNaN(feature.properties.changeavgrentsqfootoverpreviousyear) || feature.properties.changeavgrentsqfootoverpreviousyear == -99) {
			var headingTotalText = "Data not available for the change in<br />average rent per square foot over<br />the previous year for this zipcode.";
		} else if (feature.properties.changeavgrentsqfootoverpreviousyear > 0) {
			var headingTotalText = "<strong><span class='increaseTextPopupRE'>"+ Math.abs(feature.properties.changeavgrentsqfootoverpreviousyear) +"% increase" + price + "</span></strong> in<br />average rent per square foot<br />over the previous year.";
		} else {
			var headingTotalText = "<strong><span class='decreaseTextPopupRE'>"+ Math.abs(feature.properties.changeavgrentsqfootoverpreviousyear) +"% decrease" + price + "</span></strong> in<br />average rent per square foot<br />over the previous year.";
		}	

		if (L.Browser.touch) {
		} else {
			layer.bindLabel("<strong>Zip Code: " + feature.properties.zip + "</strong><br />​"+ headingTotalText +"<br />Click for more info" , { direction:'auto' });
		}

	    layer.on('mouseover', function(ev) {
	 
			layer.setStyle(highlight);

			if (!L.Browser.ie && !L.Browser.opera) {
		        layer.bringToFront();
		    }

	    });

	    layer.on('mouseout', function(ev) {
			layer.setStyle(noHighlight);		
	    });	

		if (isNaN(feature.properties.percentlivinginsamehouseoneyearago2013censusestimate) || feature.properties.percentlivinginsamehouseoneyearago2013censusestimate == -99) {
			var percentlivinginsamehouseoneyearago2013censusestimate = "";
		} else {
			var percentlivinginsamehouseoneyearago2013censusestimate = "<li><strong>" + feature.properties.percentlivinginsamehouseoneyearago2013censusestimate + "%</strong> of people in zip code " + feature.properties.zip + " live in the same house as they did one year ago.</li>";
		}

		if (isNaN(feature.properties.medianhouseholdincome2013censusestimate) || feature.properties.medianhouseholdincome2013censusestimate == -99) {
			var medianhouseholdincome2013censusestimate = "";
		} else {
			var medianhouseholdincome2013censusestimate = "<li>Median household income here is <strong>$" + commaFormat(feature.properties.medianhouseholdincome2013censusestimate) + "</strong>.</li>";
		}

		if (isNaN(feature.properties.avgrentsqfoot) || feature.properties.avgrentsqfoot == -99) {
			var avgrentsqfoot = "";
		} else {
			var avgrentsqfoot = "<li>The average price for rentals is <strong>$" + changeFormat(feature.properties.avgrentsqfoot) + "</strong> per square foot.</li>";
		}


	    layer.bindPopup("<h5>" + feature.properties.neighborhoodscovered + " | Zip Code: " + feature.properties.zip + "</h5><ul>" + percentlivinginsamehouseoneyearago2013censusestimate + medianhouseholdincome2013censusestimate + avgrentsqfoot + "</ul>");


	}


		
}


DNAinfoCHIZillow.prototype.loadZillow = function (){
	var thismap = this;

	d3.json('/chizillowzipapi/?quarter=' + quarter, function(data) {
		polygonData = data;
		attachDataToTopojson(polygonData);
	});

	function attachDataToTopojson(polygonData) {
		var dateFormat = d3.time.format("%Y-%m-%d");
		d3.json(CHI_Zipcodes, function(data) {
			polyTopojson = topojson.feature(data, data.objects.zipcodes_chi4326).features;
			$.each(polyTopojson, function(i, feature) {
				$.each(polygonData, function(zip, value) {
					if (feature.properties.ZIP == zip) {
						value.zip = zip;
						value.quarter = dateFormat.parse(value.quarter);
						feature.properties = value;
					}
				});
			}); 
			drawPolysWData();
		});
	}

	function drawPolysWData() {
		thismap.ZIPS = L.geoJson(polyTopojson, {
		    style: DNAinfoCHIZillow.getStyleFor_ZIPS,
			onEachFeature: DNAinfoCHIZillow.onEachFeature_ZIPS,
		});

		thismap.map.addLayer(thismap.ZIPS);

		// draw time slider
		DNAinfoCHIZillow.drawTimeSlider();

	}


}


DNAinfoCHIZillow.getStyleFor_ZIPS = function (feature){
	if (activeLayer == "sale") {
		var property = feature.properties.changeinvaluesquarefootoverpreviousyear;
	} else {
		var property = feature.properties.changeavgrentsqfootoverpreviousyear;
	}
    return {
        weight: 1,
        opacity: 0.75,
        color: '#f1f1f1',
        fillOpacity: 0.75,
        fillColor: DNAinfoCHIZillow.fillColor_ZIPS(property)
    }
}

DNAinfoCHIZillow.fillColor_ZIPS = function (d){
    return d > 10   ? '#4291c3' :
           d > 5    ? '#77beea' :
           d > 0    ? '#a4d4f2' :
           d > -5   ? '#e0e0e0' :
           d > -10  ? '#999999' :
           d == -99 ? '#ffffff' :
           isNaN(d) ? '#ffffff' :
                      '#4d4d4d';	
}


DNAinfoCHIZillow.drawTimeSlider = function (){
	var minDate = new Date(2012,0,1);
	var maxDate = moment().toDate();

	// three month calc
	var threemonthsago = moment().subtract(3, "months").toDate();
	var threemonthdifference = maxDate - threemonthsago;

	mapSlider = d3.slider()
					.axis(
						d3.svg.axis()
							.orient("top")
							.scale(
								d3.time.scale()
									.domain([minDate, maxDate])
							)
							.ticks(d3.time.year)
							.tickSize(24, 0)
							.tickFormat(d3.time.format("%Y"))
					)
					.axis2(
						d3.svg.axis()
							.orient("top")
							.scale(
								d3.time.scale()
									.domain([minDate, maxDate])
							)
							.ticks(d3.time.month, 3)
							.tickFormat('')						
					)
					.scale(
						d3.time.scale()
							.domain([minDate, maxDate])
					)
					.step(threemonthdifference)
					.value(selectedQ)
					.on("slide", function(evt, value) {
						// run a function to update map layers with new dates
						selectedQ = value;
						// add formated dates selected to area right below slider
						$('.printQuarterM1').html(moment(selectedQ).format("MMM"));
						var addtwomonths = moment(selectedQ).add(2, 'months').format("MMM");
						$('.printQuarterM2').html(addtwomonths);
						$('.printQuarterY').html(moment(selectedQ).format("YYYY"));

						DNAinfoCHIZillow.updateMapFromForm();

					});

	d3.select('#timeSlider').call(mapSlider);

	// add formated dates selected to area right below slider
	$('.printQuarterM1').html(moment(quarter, "MMM. DD, YYYY").format("MMM"));
	var addtwomonths = moment(quarter, "MMM. DD, YYYY").add(2, 'months').format("MMM");
	$('.printQuarterM2').html(addtwomonths);
	$('.printQuarterY').html(moment(quarter, "MMM. DD, YYYY").format("YYYY"));

}


DNAinfoCHIZillow.updateMapFromForm = function (){
	// close popups
	MY_MAP.map.closePopup();

	// change selectedQ into something we can pass to the api
	var apidate = moment(selectedQ).startOf('month').format("MMMM D, YYYY");

	// which radio button is checked?
	if ($('#optionsRadios1').is(':checked')) {
		activeLayer = 'sale';
		$("#legend-title").html("Change in Value for Home Sale Price per Square Foot Over Previous Year")
	} else {
		activeLayer = 'rent';
		$("#legend-title").html("Change in Average Rent per Square Foot Over Previous Year")
	}


	d3.json('/chizillowzipapi/?quarter=' + apidate, function(data) {
		polygonData = data;
		attachDataToTopojson(polygonData);
	});

	function attachDataToTopojson(polygonData) {
		var dateFormat = d3.time.format("%Y-%m-%d");
		d3.json(CHI_Zipcodes, function(data) {
			polyTopojson = topojson.feature(data, data.objects.zipcodes_chi4326).features;
			$.each(polyTopojson, function(i, feature) {
				$.each(polygonData, function(zip, value) {
					if (feature.properties.ZIP == zip) {
						value.zip = zip;
						value.quarter = dateFormat.parse(value.quarter);
						feature.properties = value;
					}
				});
			});
			updatePolysWData();
		});
	}

	function updatePolysWData() {
		MY_MAP.ZIPS.clearLayers();

		MY_MAP.ZIPS.addData(polyTopojson);

		$("body").removeClass("loading");
	}

}




DNAinfoCHIZillow.center = function (neighborhood){

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




	
	