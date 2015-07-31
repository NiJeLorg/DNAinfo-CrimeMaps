/* 
* Functions to create the main DNAinfo Crime Map
*/

// initialize map
function DNAinfoCHINeighDraw() {
	// set zoom and center for this map
	this.center = DNAinfoCHINeighDraw.center(neighborhoodLive);
	if (neighborhoodLive == 'other'){
		this.zoom = 11;
	} else {
		this.zoom = 13;
	}

    this.map = new L.Map('map', {
		minZoom:11,
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

	// initiate drawing tools
	this.FEATURELAYER = new L.FeatureGroup();
	this.map.addLayer(this.FEATURELAYER);

	// Initialise the draw control and pass it the FeatureGroup of editable layers
	this.drawControl = new L.Control.Draw({
		draw: {
			polyline: false,
			rectangle: false,
			circle: false,
			marker: false,
			polygon: {
				allowIntersection: false,
				guidelineDistance: 10,
				metric: false,
				shapeOptions: {
		            color: '#ad1515'
		        }
			},
		},
	    edit: {
	        featureGroup: this.FEATURELAYER,
	        edit: false,
	        remove: false,
	    },
	});
	this.map.addControl(this.drawControl);

	var thismap = this;
	this.map.on('draw:created', function (e) {
	    thismap.DRAWNLAYER = e.layer;

	    // add layer to map
	    thismap.map.addLayer(thismap.DRAWNLAYER);
	    thismap.DRAWNLAYER.bindLabel('My version of ' + DNAinfoCHINeighDraw.neighborhoodBabyName(neighborhoodLive));

	    // zoom map to drawn layer
	    var bounds = thismap.DRAWNLAYER.getBounds();
	    thismap.map.fitBounds(bounds);

	    // turn off polygon draw tools so they can only draw one polygon
	   	thismap.map.removeControl(thismap.drawControl);

	   	// add finished start over buttons
	   	$('#imFinished').removeClass('hidden');
	   	$('#startOver').removeClass('hidden');

	});

}


DNAinfoCHINeighDraw.startOver = function () {
	// remove buttons
	$('#imFinished').addClass('hidden');
	$('#startOver').addClass('hidden');

	// remove drawn layer from map
	MY_MAP.map.removeLayer(MY_MAP.DRAWNLAYER);

	// add drawing controls
	MY_MAP.map.addControl(MY_MAP.drawControl);

	// add glyphicon to draw polygon tool
    $('.leaflet-draw-draw-polygon').append("<span class=\"glyphicon glyphicon-pencil red-pencil\" aria-hidden=\"true\"></span>");

	// reset map to original zoom and center
	MY_MAP.map.setView(MY_MAP.center, MY_MAP.zoom);

}


DNAinfoCHINeighDraw.imFinished = function () {
	// remove these buttons
	$('#imFinished').addClass('hidden');
	$('#startOver').addClass('hidden');

	// add these buttons
	$('#showShareFB').removeClass('hidden');
	$('#showShareTwitter').removeClass('hidden');
	$('#viewOnDNA').removeClass('hidden');

	// ajax call to save the geojson
	MY_MAP.DRAWNGEOJSON = MY_MAP.DRAWNLAYER.toGeoJSON();
	var geojson = MY_MAP.DRAWNGEOJSON;
	var url = '/chineighdrawsave/'+ id + '/';
	var csrftoken = $.cookie('csrftoken');

	function csrfSafeMethod(method) {
	    // these HTTP methods do not require CSRF protection
	    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}
	$.ajaxSetup({
	    beforeSend: function(xhr, settings) {
	        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
	            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	        }
	    }
	});

	$.post( url, {'geojson': JSON.stringify(geojson)},  function(data){ console.log(data); }, "json");

	// show neighborhoods
	if (neighborhoodLive != 'other' && MY_MAP.ALLDRAWNGEOJSONS){
		MY_MAP.map.addLayer(MY_MAP.ALLDRAWNGEOJSONS);
		MY_MAP.ALLDRAWNGEOJSONS.bringToBack();

		// zoom map to neighborhood layer
	    var bounds = MY_MAP.ALLDRAWNGEOJSONS.getBounds();
	    MY_MAP.map.fitBounds(bounds);
	}


    setTimeout(function(){
    	if (firstOne) {
    		$('#shareFirstOne').modal('show');
    	} else {
    		$('#share').modal('show');
    	}	
    },1000);

}

DNAinfoCHINeighDraw.onEachFeature_ALLDRAWNGEOJSONS = function(feature,layer){	

	layer.bindLabel('Other DNAinfo Visitor\'s Drawings of ' + DNAinfoCHINeighDraw.neighborhoodBabyName(neighborhoodLive));
	
}

DNAinfoCHINeighDraw.prototype.loadAllDrawnGeojsons = function (){
	var thismap = this;
	$.ajax({
		type: "GET",
		url: "/getallchidrawngeojson/"+ neighborhoodLive + "/" + id + "/" ,
		success: function(data){
			// load the draw tools
			if (data.length > 0) {
				firstOne = false;
				var geojson = [];
				for (var i = data.length - 1; i >= 0; i--) {
					if (data[i]) {
						geojson.push(JSON.parse(data[i]));
					}
				};
				thismap.ALLDRAWNGEOJSONS = L.geoJson(geojson, {
				    style: DNAinfoCHINeighDraw.getStyleFor_ALLDRAWNGEOJSONS,
					onEachFeature: DNAinfoCHINeighDraw.onEachFeature_ALLDRAWNGEOJSONS,
				});
			} else {
				firstOne = true;
				thismap.ALLDRAWNGEOJSONS = null;
			}
        }
	});

}

DNAinfoCHINeighDraw.getStyleFor_ALLDRAWNGEOJSONS = function (feature){
    return {
        weight: 4,
        opacity: 1,
        color: '#000',
        fillOpacity: 0.5,
        fillColor: '#bdbdbd'
    }
}


DNAinfoCHINeighDraw.onEachFeature_NEIGHBORHOODS = function(feature,layer){	
	layer.bindLabel("<strong>" + feature.properties.comm_name + "</strong>", { direction:'auto' });
	
    layer.on('mouseover', function(ev) {
		if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToBack();
	    }
    });
		
}


DNAinfoCHINeighDraw.prototype.loadNeighborhoods = function (){
	var thismap = this;
	d3.json(CHI_Neighborhoods, function(data) {
		polyTopojson = topojson.feature(data, data.objects.chi_acs_2013_commareas_commute).features;
		drawPolys();
	});

	function drawPolys() {
		thismap.NEIGHBORHOODS = L.geoJson(polyTopojson, {
		    style: DNAinfoCHINeighDraw.getStyleFor_NEIGHBORHOODS,
			onEachFeature: DNAinfoCHINeighDraw.onEachFeature_NEIGHBORHOODS,
			filter: function(feature, layer) {
				return (feature.properties.comm_name == DNAinfoCHINeighDraw.neighborhoodName(neighborhoodLive));
			}
		});
	}

}

DNAinfoCHINeighDraw.getStyleFor_NEIGHBORHOODS = function (feature){
    return {
        weight: 4,
        opacity: 1,
        color: '#000',
        fillOpacity: 0.5,
        fillColor: '#bdbdbd'
    }
}




DNAinfoCHINeighDraw.center = function (neighborhood){

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

	}

	if (lookup[neighborhood]) {			
		return lookup[neighborhood];
	} else {
		return [41.848614, -87.684616];
	}


}


DNAinfoCHINeighDraw.neighborhoodName = function (neighborhood){

	var lookup = {
		'austin': 'Austin',
		'albany-park': 'Albany Park',
		'altgeld-gardens': 'Riverdale',
		'andersonville': 'Edgewater',
		'archer-heights': 'Archer Heights',
		'armour-square': 'Armour Square',
		'ashburn': 'Ashburn',
		'auburn-gresham': 'Auburn Gresham',
		'avalon-park': 'Avalon Park',
		'avondale': 'Avondale',
		'back-of-yards': 'New City',
		'belmont-cragin': 'Belmont Cragin',
		'beverly': 'Beverly',
		'boystown': 'Lakeview',
		'brainerd': 'Washington Heights',
		'bridgeport': 'Bridgeport',
		'brighton-park': 'Brighton Park',
		'bronzeville': 'Douglas',
		'bucktown': 'Logan Square',
		'burnside': 'Burnside',
		'bush': 'South Chicago',
		'calumet-heights': 'Calumet Heights',
		'canaryville': 'New City',
		'chatham': 'Chatham',
		'chicago-lawn': 'Chicago Lawn',
		'chinatown': 'Armour Square',
		'clearing': 'Clearing',
		'douglas': 'Douglas ',
		'downtown': 'Loop',
		'dunning': 'Dunning',
		'east-garfield-park': 'East Garfield Park',
		'east-side': 'East Side',
		'east-village': 'West Town',
		'edgebrook': 'Forest Glen',
		'edgewater': 'Edgewater',
		'edison-park': 'Edison Park',
		'englewood': 'Englewood',
		'ford-city': 'West Lawn',
		'forest-glen': 'Forest Glen',
		'fuller-park': 'Fuller Park',
		'gage-park': 'Gage Park',
		'gap': 'Douglas',
		'garfield-park': 'West Garfield Park',
		'garfield-ridge': 'Garfield Ridge',
		'gladstone-park': 'Jefferson Park',
		'gold-coast': 'Near North Side',
		'grand-boulevard': 'Grand Boulevard',
		'grand-crossing': 'Greater Grand Crossing',
		'greektown': 'Near West Side',
		'heart-of-chicago': 'Lower West Side',
		'heart-of-italy': 'Lower West Side',
		'hegewisch': 'Hegewisch',
		'hermosa': 'Hermosa',
		'humboldt-park': 'Humboldt Park',
		'hyde-park': 'Hyde Park',
		'irving-park': 'Irving Park',
		'jackson-highlands': 'South Shore',
		'jefferson-park': 'Jefferson Park',
		'kenwood': 'Kenwood',
		'lakeview': 'Lakeview',
		'lincoln-park': 'Lincoln Park',
		'lincoln-square': 'Lincoln Square',
		'little-italy': 'Near West Side',
		'little-village': 'South Lawndale',
		'logan-square': 'Logan Square',
		'loop': 'Loop',
		'marquette-park': 'Chicago Lawn',
		'mayfair': 'Irving Park',
		'mckinley-park': 'McKinley Park',
		'medical-district': 'Near West Side',
		'midway': 'West Elsdon',
		'montclare': 'Montclare',
		'morgan-park': 'Morgan Park',
		'mt-greenwood': 'Mount Greenwood',
		'near-west-side': 'Near West Side',
		'new-city': 'New City ',
		'noble-square': 'West Town',
		'north-center': 'North Center',
		'north-edgebrook': 'Forest Glen',
		'north-lawndale': 'North Lawndale',
		'north-park': 'North Park',
		'norwood-park': 'Norwood Park',
		'oakland': 'Oakland',
		'ohare': 'O\'Hare',
		'old-edgebrook': 'Forest Glen',
		'old-town': 'Near North Side',
		'pill-hill': 'Calumet Heights',
		'pilsen': 'Lower West Side',
		'portage-park': 'Portage Park',
		'pullman': 'Pullman',
		'ravenswood-manor': 'Albany Park',
		'ravenswood': 'Lincoln Square',
		'river-north': 'Near North Side',
		'river-west': 'West Town',
		'riverdale': 'Riverdale',
		'rogers-park': 'Rogers Park',
		'roscoe-village': 'North Center',
		'roseland': 'Roseland',
		'sauganash': 'North Park',
		'south-austin': 'Austin',
		'south-chicago': 'South Chicago',
		'south-deering': 'South Deering',
		'south-lawndale': 'Little Village',
		'south-loop': 'South Loop',
		'south-shore-above-79th': 'South Shore',
		'south-shore': 'South Shore',
		'streeterville': 'Near North Side',
		'tri-taylor': 'Near West Side',
		'ukrainian-village': 'West Town',
		'university-village': 'Near West Side',
		'uptown': 'Uptown',
		'washington-heights': 'Washington Heights',
		'washington-park': 'Washington Park',
		'west-beverly': 'Beverly',
		'west-elsdon': 'West Elsdon',
		'west-englewood': 'West Englewood',
		'west-humboldt-park': 'Humboldt Park',
		'west-lawn': 'West Lawn',
		'west-loop': 'Near West Side',
		'west-pullman': 'West Pullman',
		'west-ridge': 'West Ridge',
		'west-rogers-park': 'West Ridge',
		'west-town': 'West Town',
		'wicker-park': 'West Town',
		'woodlawn': 'Woodlawn',
		'wrigleyville': 'Lakeview',


	}

	if (lookup[neighborhood]) {			
		return lookup[neighborhood];
	} else {
		return '';
	}


}





DNAinfoCHINeighDraw.neighborhoodBabyName = function (neighborhood){

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
		'south-shore-above-79th': 'South Shore above 79th',
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

	
	
