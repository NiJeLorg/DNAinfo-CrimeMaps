/* 
* Functions to create the main DNAinfo Crime Map
*/

// initialize map
function DNAinfoNYCNeighShow() {
	// set zoom and center for this map
	this.center = DNAinfoNYCNeighShow.center(neighborhoodLive);
	this.zoom = 14;

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
	this.DRAWNGEOJSON = null;

}

DNAinfoNYCNeighShow.onEachFeature_ALLDRAWNGEOJSONS = function(feature,layer){	

	layer.bindLabel('Other DNAinfo Visitor\'s Drawings of ' + DNAinfoNYCNeighShow.neighborhoodBabyName(neighborhoodLive));

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

DNAinfoNYCNeighShow.onEachFeature_NEIGHBORHOODS = function(feature,layer){	

	layer.bindLabel("<strong>" + feature.properties.NTAName + "</strong>", { direction:'auto' });
	
    layer.on('mouseover', function(ev) {
		if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToBack();
	    }
    });
		
}

DNAinfoNYCNeighShow.onEachFeature_DRAWNGEOJSON = function(feature,layer){	

	layer.bindLabel('My version of ' + DNAinfoNYCNeighShow.neighborhoodBabyName(neighborhoodLive));
	
}

DNAinfoNYCNeighShow.prototype.loadAllDrawnGeojsons = function (){
	var thismap = this;
	$.ajax({
		type: "GET",
		url: "/getallnycdrawngeojson/"+ neighborhoodLive + "/" + id + "/" ,
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
				    style: DNAinfoNYCNeighShow.getStyleFor_ALLDRAWNGEOJSONS,
					onEachFeature: DNAinfoNYCNeighShow.onEachFeature_ALLDRAWNGEOJSONS,
				});
				thismap.map.addLayer(thismap.ALLDRAWNGEOJSONS);
				thismap.ALLDRAWNGEOJSONS.bringToBack();
			} else {
				thismap.ALLDRAWNGEOJSONS = null;
			}
        }
	});

}

DNAinfoNYCNeighShow.prototype.loadNeighborhoods = function (){
	var thismap = this;
	d3.json(NYC_Neighborhoods, function(data) {
		polyTopojson = topojson.feature(data, data.objects.nyc_acs_2013_neighareas_commute).features;
		drawPolys();
	});

	function drawPolys() {
		thismap.NEIGHBORHOODS = L.geoJson(polyTopojson, {
		    style: DNAinfoNYCNeighShow.getStyleFor_NEIGHBORHOODS,
			onEachFeature: DNAinfoNYCNeighShow.onEachFeature_NEIGHBORHOODS,
			filter: function(feature, layer) {
				return (feature.properties.NTAName == DNAinfoNYCNeighShow.neighborhoodName(neighborhoodLive));
			}
		});

		thismap.map.addLayer(thismap.NEIGHBORHOODS);
	}

}

DNAinfoNYCNeighShow.prototype.loadDrawnGeojson = function (){
	var thismap = this;
	$.ajax({
		type: "GET",
		url: "/getnycdrawngeojson/"+ id +"/",
		success: function(data){
			// load the draw tools
			if (data) {
				var geojson = JSON.parse(data);
				thismap.DRAWNGEOJSON = L.geoJson(geojson, {
				    style: DNAinfoNYCNeighShow.getStyleFor_DRAWNGEOJSON,
					onEachFeature: DNAinfoNYCNeighShow.onEachFeature_DRAWNGEOJSON,
				});
				thismap.map.addLayer(thismap.DRAWNGEOJSON);
				if (neighborhoodLive == 'other'){
					var bounds = thismap.DRAWNGEOJSON.getBounds();
	    			thismap.map.fitBounds(bounds);
				}

			} else {
				thismap.DRAWNGEOJSON = null;
			}
        }
	});

}

DNAinfoNYCNeighShow.getStyleFor_ALLDRAWNGEOJSONS = function (feature){
    return {
        weight: 1,
        opacity: 0.75,
        color: '#191975',
        fillOpacity: 0,
        fillColor: '#bdbdbd'
    }
}

DNAinfoNYCNeighShow.getStyleFor_NEIGHBORHOODS = function (feature){
    return {
        weight: 4,
        opacity: 1,
        color: '#000',
        fillOpacity: 0.5,
        fillColor: '#bdbdbd'
    }
}

DNAinfoNYCNeighShow.getStyleFor_DRAWNGEOJSON = function (feature){
    return {
        weight: 4,
        opacity: 1,
        color: '#ad1515',
        fillOpacity: 0.5,
        fillColor: '#ad1515'
    }
}




DNAinfoNYCNeighShow.center = function (neighborhood){

	var lookup = {
		"allerton": [40.863743, -73.862489],
		"annandale": [40.540460, -74.178217],
		"arden-heights": [40.556795, -74.173906],
		"arrochar": [40.596731, -74.070423],
		"arverne": [40.592658, -73.797793],
		"astoria": [40.764357, -73.923462],
		"auburndale": [40.761430, -73.78996],
		"bath-beach": [40.602196, -74.003571],
		"battery-park-city": [40.712217, -74.016058],
		"bay-ridge": [40.626164, -74.03295],
		"bay-terrace": [40.782883, -73.780145],
		"bay-terrace-staten-island": [40.556400, -74.136907],
		"baychester": [40.869386, -73.833084],
		"bayside": [40.763140, -73.77125],
		"bayswater": [40.606781, -73.766908],
		"bed-stuy": [40.687218, -73.941774],
		"bedford-park": [40.870100, -73.885691],
		"beechhurst": [40.790355, -73.797793],
		"belle-harbor": [40.575485, -73.850728],
		"bellerose": [40.724371, -73.715401],
		"belmont": [40.852320, -73.88601],
		"bensonhurst": [40.611269, -73.997695],
		"bergen-beach": [40.617705, -73.903649],
		"bloomfield": [40.620814, -74.188582],
		"boerum-hill": [40.684869, -73.984472],
		"borough-park": [40.632301, -73.98888],
		"breezy-point": [40.556494, -73.926248],
		"briarwood": [40.708949, -73.815439],
		"brighton-beach": [40.577621, -73.961376],
		"broad-channel": [40.608382, -73.815925],
		"brooklyn-heights": [40.696010, -73.993287],
		"brookville": [40.659079, -73.752199],
		"brownsville": [40.663080, -73.909528],
		"bulls-heads": [40.609682, -74.162163],
		"bushwick": [40.694428, -73.921286],
		"cambria-heights": [40.692158, -73.733075],
		"canarsie": [40.640233, -73.906058],
		"carnegie-hill": [40.784465, -73.955086],
		"carroll-gardens": [40.679533, -73.999164],
		"castle-hill": [40.817683, -73.850728],
		"castleton-corners": [40.613371, -74.1216],
		"central-harlem": [40.811550, -73.946477],
		"charleston": [40.528197, -74.23554],
		"chelsea": [40.746500, -74.001374],
		"chelsea-staten-island": [40.589011, -74.191518],
		"chinatown": [40.715751, -73.997031],
		"city-island": [40.846820, -73.787498],
		"civic-center": [40.714052, -74.002836],
		"claremont": [40.840047, -73.903649],
		"claremont-village": [40.834814, -73.905853],
		"clason-point": [40.814434, -73.862489],
		"clifton": [40.621319, -74.071402],
		"clinton-hill": [40.689367, -73.963902],
		"co-op-city": [40.874970, -73.828187],
		"cobble-hill": [40.686536, -73.996225],
		"college-point": [40.786395, -73.838966],
		"columbia-street-waterfront-district": [40.687369, -74.002102],
		"columbus-circle": [40.768044, -73.982372],
		"concord": [40.603080, -74.079947],
		"concourse": [40.831676, -73.922755],
		"concourse-village": [40.828371, -73.916877],
		"coney-island": [40.574926, -73.985941],
		"corona": [40.744986, -73.864261],
		"country-club": [40.843054, -73.821321],
		"crown-heights": [40.668103, -73.944799],
		"cypress-hills": [40.683612, -73.88013],
		"ditmars": [40.773366, -73.906788],
		"ditmas-park": [40.640922, -73.962433],
		"dongan-hills": [40.588849, -74.09609],
		"douglaston": [40.768060, -73.74941],
		"downtown-brooklyn": [40.696019, -73.984518],
		"dumbo": [40.703316, -73.988145],
		"dyker-heights": [40.618718, -74.015323],
		"east-elmhurst": [40.773750, -73.87131],
		"east-flatbush": [40.643747, -73.930104],
		"east-harlem": [40.795740, -73.938921],
		"east-new-york": [40.675800, -73.90281],
		"east-village": [40.726477, -73.981534],
		"east-williamsburg": [40.715876, -73.933043],
		"eastchester": [40.883324, -73.827203],
		"edenwald": [40.889938, -73.838966],
		"edgemere": [40.594228, -73.774262],
		"elm-park": [40.631157, -74.138677],
		"elmhurst": [40.737975, -73.88013],
		"eltingville": [40.544601, -74.16457],
		"emerson-hill": [40.607319, -74.096095],
		"far-rockaway": [40.609130, -73.75054],
		"fieldston": [40.894268, -73.903649],
		"financial-district": [40.707491, -74.011276],
		"flatbush": [40.640922, -73.962433],
		"flatiron": [40.741061, -73.989699],
		"flatlands": [40.626843, -73.933043],
		"flushing": [40.767499, -73.833079],
		"fordham": [40.861500, -73.89058],
		"forest-hills": [40.719560, -73.844755],
		"fort-george": [40.859032, -73.933043],
		"fort-greene": [40.692064, -73.974187],
		"fort-hamilton": [40.609445, -74.028543],
		"fort-wadsworth": [40.601212, -74.057919],
		"fresh-meadows": [40.733518, -73.780145],
		"garment-district": [40.754707, -73.991634],
		"gerritsen-beach": [40.587003, -73.922755],
		"glendale": [40.698994, -73.880443],
		"governors-island": [40.689450, -74.016792],
		"gowanus": [40.673336, -73.990349],
		"gramercy": [40.737688, -73.981936],
		"graniteville": [40.618768, -74.156292],
		"grant-city": [40.578965, -74.109704],
		"grasmere": [40.603117, -74.084087],
		"gravesend": [40.591017, -73.977126],
		"great-kills": [40.551231, -74.151399],
		"greenpoint": [40.724545, -73.94186],
		"greenridge": [40.561216, -74.169866],
		"greenwich-village": [40.733572, -74.002742],
		"greenwood-heights": [40.650969, -73.976976],
		"grymes-hill": [40.614643, -74.091694],
		"hamilton-beach": [40.652245, -73.829408],
		"hamilton-heights": [40.825960, -73.949608],
		"heartland-village": [40.580766, -74.168035],
		"hells-kitchen-clinton": [40.758196, -73.992662],
		"high-bridge": [40.838470, -73.927164],
		"hillcrest": [40.721237, -73.797793],
		"hollis": [40.710170, -73.76675],
		"holliswood": [40.732222, -73.754722],
		"homecrest": [40.594223, -73.958372],
		"howard-beach": [40.657122, -73.842999],
		"hudson-heights": [40.853497, -73.937452],
		"hudson-square": [40.726583, -74.007473],
		"huguenot": [40.533674, -74.191794],
		"hunts-point": [40.812025, -73.88013],
		"inwood": [40.867714, -73.921202],
		"jackson-heights": [40.755682, -73.88307],
		"jamaica": [40.699683, -73.807903],
		"jamaica-estates": [40.717854, -73.774262],
		"jamaica-hills": [40.712803, -73.799263],
		"kensington": [40.637642, -73.974187],
		"kew-gardens": [40.709640, -73.83089],
		"kew-gardens-hills": [40.738499, -73.810685],
		"kingsbridge": [40.883391, -73.905119],
		"kingsbridge-heights": [40.869861, -73.898249],
		"kips-bay": [40.742329, -73.980065],
		"laurelton": [40.668470, -73.75175],
		"lenox-hill": [40.767591, -73.967557],
		"lighthouse-hills": [40.577270, -74.134273],
		"lincoln-square": [40.773828, -73.984472],
		"lindenwood": [40.663546, -73.852198],
		"little-italy": [40.719141, -73.997327],
		"little-neck": [40.775040, -73.74065],
		"livingston": [40.602095, -74.128532],
		"long-island-city": [40.741280, -73.95639],
		"longwood": [40.824844, -73.891588],
		"lower-east-side": [40.715033, -73.984272],
		"malba": [40.790666, -73.825733],
		"manhattan-beach": [40.578158, -73.938921],
		"manhattan-valley": [40.800536, -73.961576],
		"marble-hill": [40.876117, -73.910263],
		"marine-park": [40.611991, -73.933043],
		"mariners-harbor": [40.633629, -74.156292],
		"maspeth": [40.729402, -73.906588],
		"meatpacking-district": [40.740986, -74.007611],
		"meiers-corners": [40.607807, -74.137759],
		"melrose": [40.825761, -73.915231],
		"middle-village": [40.717372, -73.87425],
		"midland-beach": [40.571490, -74.093163],
		"midtown": [40.754931, -73.984019],
		"midtown-east": [40.754037, -73.966841],
		"midtown-south": [40.751040, -73.986869],
		"midwood": [40.619063, -73.965372],
		"mill-basin": [40.610089, -73.910998],
		"morningside-heights": [40.808956, -73.962433],
		"morris-heights": [40.854252, -73.919583],
		"morris-park": [40.854364, -73.860495],
		"morrisania": [40.825066, -73.910998],
		"mott-haven": [40.809107, -73.922888],
		"mount-hope": [40.848886, -73.905119],
		"murray-hill": [40.747879, -73.975657],
		"murray-hill-queens": [40.762700, -73.81454],
		"navy-yard": [40.700292, -73.972106],
		"neponsit": [40.570765, -73.861019],
		"new-brighton": [40.640437, -74.090226],
		"new-dorp": [40.573480, -74.11721],
		"new-dorp-beach": [40.565707, -74.104909],
		"new-springville": [40.589035, -74.156292],
		"noho": [40.728659, -73.992553],
		"nolita": [40.722897, -73.995491],
		"norwood": [40.877146, -73.87866],
		"oakland-gardens": [40.740858, -73.758241],
		"oakwood": [40.558475, -74.115187],
		"ocean-breeze": [40.586769, -74.078479],
		"ocean-hill": [40.677473, -73.907046],
		"old-town": [40.596612, -74.087368],
		"olinville": [40.880391, -73.8669],
		"ozone-park": [40.679407, -73.850728],
		"park-slope": [40.668104, -73.980582],
		"parkchester": [40.833226, -73.860816],
		"pelham-bay": [40.849671, -73.833084],
		"pelham-gardens": [40.861216, -73.844847],
		"pelham-parkway": [40.855328, -73.863959],
		"pleasant-plains": [40.522410, -74.217847],
		"pomonok": [40.733644, -73.812404],
		"port-morris": [40.802864, -73.910998],
		"port-richmond": [40.635491, -74.125464],
		"princes-bay": [40.523280, -74.200323],
		"prospect-heights": [40.677420, -73.966841],
		"prospect-park-south": [40.645774, -73.966106],
		"prospect-lefferts-gardens": [40.659045, -73.950677],
		"queens-village": [40.717450, -73.73646],
		"randall-manor": [40.641060, -74.103441],
		"randalls-island": [40.793227, -73.921286],
		"red-hook": [40.677280, -74.009447],
		"rego-park": [40.725572, -73.862489],
		"richmond-hill": [40.695811, -73.827203],
		"richmond-town": [40.570232, -74.145296],
		"ridgewood": [40.710848, -73.897769],
		"riverdale": [40.903981, -73.914126],
		"rochdale-village": [40.676389, -73.773889],
		"rockaway-beach": [40.586725, -73.811499],
		"rockaway-park": [40.579786, -73.837224],
		"roosevelt-island": [40.762161, -73.949964],
		"rosebank": [40.613191, -74.072604],
		"rosedale": [40.665940, -73.73555],
		"rossville": [40.550981, -74.203258],
		"roxbury": [40.567058, -73.890243],
		"schuylerville": [40.834881, -73.833084],
		"sea-gate": [40.576810, -74.007978],
		"seaside": [40.583049, -73.825733],
		"sheepshead-bay": [40.586896, -73.954155],
		"shore-acres": [40.609886, -74.06673],
		"silver-lake": [40.624550, -74.091694],
		"soho": [40.723301, -74.002988],
		"soundview": [40.825141, -73.86837],
		"south-beach": [40.582902, -74.073863],
		"south-jamaica": [40.680859, -73.79191],
		"south-ozone-park": [40.676400, -73.812498],
		"south-street-seaport": [40.706567, -74.003575],
		"springfield-gardens": [40.662644, -73.768378],
		"spuyten-duyvil": [40.881164, -73.915407],
		"st-albans": [40.691180, -73.76551],
		"st.-george": [40.643748, -74.073643],
		"stapleton": [40.627915, -74.075162],
		"starrett-city": [40.649052, -73.880227],
		"stuy-town": [40.718047, -74.014129],
		"sugar-hill": [40.827930, -73.944065],
		"sunnyside": [40.743276, -73.919632],
		"sunnyside-staten-island": [40.612788, -74.104909],
		"sunset-park": [40.645532, -74.012385],
		"sutton-place": [40.757628, -73.961698],
		"throgs-neck": [40.818399, -73.821321],
		"times-square-theater-district": [40.758895, -73.985131],
		"todt-hill": [40.601434, -74.103441],
		"tompkinsville": [40.636949, -74.074835],
		"tottenville": [40.512764, -74.251961],
		"travis": [40.589011, -74.191518],
		"tremont-east-tremont": [40.845378, -73.890969],
		"tribeca": [40.716269, -74.008632],
		"turtle-bay": [40.754037, -73.966841],
		"union-square": [40.735863, -73.991084],
		"unionport": [40.827547, -73.850728],
		"university-heights": [40.862248, -73.91312],
		"upper-east-side": [40.773565, -73.956555],
		"upper-west-side": [40.787011, -73.975368],
		"utopia": [40.735210, -73.79191],
		"van-nest": [40.845889, -73.8669],
		"vinegar-hill": [40.703719, -73.982268],
		"wakefield": [40.905424, -73.854665],
		"washington-heights": [40.841708, -73.939355],
		"wavecrest": [40.598669, -73.758573],
		"west-brighton": [40.627030, -74.109314],
		"west-farms": [40.843061, -73.8816],
		"west-harlem": [40.811550, -73.946477],
		"west-village": [40.735781, -74.003571],
		"westchester-square": [40.841498, -73.844847],
		"westerleigh": [40.616296, -74.138677],
		"whitestone": [40.792045, -73.809557],
		"willets-point": [40.760691, -73.840436],
		"williamsbridge": [40.877686, -73.856609],
		"williamsburg": [40.708116, -73.95707],
		"willowbrook": [40.603160, -74.138476],
		"windsor-terrace": [40.653935, -73.975657],
		"woodhaven": [40.690137, -73.856609],
		"woodlawn": [40.895361, -73.862916],
		"woodrow": [40.539417, -74.191518],
		"woodside": [40.745840, -73.90297],
		"yorkville": [40.776223, -73.949208],
		"park-slope-south": [40.660551, -73.987411],
		"alphabet-city": [40.726060, -73.978595],
		"nomad": [40.744607, -73.987411],
		"tudor-city": [40.748849, -73.971616],


	}

	if (lookup[neighborhood]) {			
		return lookup[neighborhood];
	} else {
		return [40.710508, -73.943825];
	}


}


DNAinfoNYCNeighShow.neighborhoodBabyName = function (neighborhood){

	var lookup = {
		'allerton': 'Allerton',
		'annandale': 'Annadale',
		'arden-heights': 'Arden Heights',
		'arrochar': 'Arrochar',
		'arverne': 'Arverne',
		'astoria': 'Astoria',
		'auburndale': 'Auburndale',
		'bath-beach': 'Bath Beach',
		'battery-park-city': 'Battery Park City',
		'bay-ridge': 'Bay Ridge',
		'bay-terrace': 'Bay Terrace',
		'bay-terrace-staten-island': 'Bay Terrace (Staten Island)',
		'baychester': 'Baychester',
		'bayside': 'Bayside',
		'bayswater': 'Bayswater',
		'bed-stuy': 'Bedford-Stuyvesant',
		'bedford-park': 'Bedford Park ',
		'beechhurst': 'Beechhurst',
		'belle-harbor': 'Belle Harbor',
		'bellerose': 'Bellerose',
		'belmont': 'Belmont',
		'bensonhurst': 'Bensonhurst',
		'bergen-beach': 'Bergen Beach',
		'bloomfield': 'Bloomfield',
		'boerum-hill': 'Boerum Hill',
		'borough-park': 'Borough Park',
		'breezy-point': 'Breezy Point',
		'briarwood': 'Briarwood',
		'brighton-beach': 'Brighton Beach',
		'broad-channel': 'Broad Channel',
		'brooklyn-heights': 'Brooklyn Heights',
		'brookville': 'Brookville',
		'brownsville': 'Brownsville',
		'bulls-heads': 'Bulls Heads',
		'bushwick': 'Bushwick',
		'cambria-heights': 'Cambria Heights',
		'canarsie': 'Canarsie',
		'carnegie-hill': 'Carnegie Hill',
		'carroll-gardens': 'Carroll Gardens',
		'castle-hill': 'Castle Hill',
		'castleton-corners': 'Castleton Corners',
		'central-harlem': 'Central Harlem',
		'charleston': 'Charleston',
		'chelsea': 'Chelsea',
		'chelsea-staten-island': 'Chelsea (Staten Island)',
		'chinatown': 'Chinatown',
		'city-island': 'City Island',
		'civic-center': 'Civic Center',
		'claremont': 'Claremont',
		'claremont-village': 'Claremont Village',
		'clason-point': 'Clason Point',
		'clifton': 'Clifton',
		'clinton-hill': 'Clinton Hill',
		'co-op-city': 'Co-Op City',
		'cobble-hill': 'Cobble Hill',
		'college-point': 'College Point',
		'columbia-street-waterfront-district': 'Columbia Street Waterfront District',
		'columbus-circle': 'Columbus Circle',
		'concord': 'Concord',
		'concourse': 'Concourse',
		'concourse-village': 'Concourse Village',
		'coney-island': 'Coney Island',
		'corona': 'Corona',
		'country-club': 'Country Club',
		'crown-heights': 'Crown Heights',
		'cypress-hills': 'Cypress Hills',
		'ditmars': 'Ditmars',
		'ditmas-park': 'Ditmas Park',
		'dongan-hills': 'Dongan Hills',
		'douglaston': 'Douglaston',
		'downtown-brooklyn': 'Downtown Brooklyn',
		'dumbo': 'DUMBO',
		'dyker-heights': 'Dyker Heights',
		'east-elmhurst': 'East Elmhurst',
		'east-flatbush': 'East Flatbush',
		'east-harlem': 'East Harlem',
		'east-new-york': 'East New York',
		'east-village': 'East Village',
		'east-williamsburg': 'East Williamsburg',
		'eastchester': 'Eastchester',
		'edenwald': 'Edenwald',
		'edgemere': 'Edgemere',
		'elm-park': 'Elm Park',
		'elmhurst': 'Elmhurst',
		'eltingville': 'Eltingville',
		'emerson-hill': 'Emerson Hill',
		'far-rockaway': 'Far Rockaway',
		'fieldston': 'Fieldston',
		'financial-district': 'Financial District',
		'flatbush': 'Flatbush',
		'flatiron': 'Flatiron',
		'flatlands': 'Flatlands',
		'flushing': 'Flushing',
		'fordham': 'Fordham',
		'forest-hills': 'Forest Hills',
		'fort-george': 'Fort George',
		'fort-greene': 'Fort Greene',
		'fort-hamilton': 'Fort Hamilton',
		'fort-wadsworth': 'Fort Wadsworth',
		'fresh-meadows': 'Fresh Meadows',
		'garment-district': 'Garment District',
		'gerritsen-beach': 'Gerritsen Beach',
		'glendale': 'Glendale',
		'gowanus': 'Gowanus',
		'gramercy': 'Gramercy',
		'graniteville': 'Graniteville',
		'grant-city': 'Grant City',
		'grasmere': 'Grasmere',
		'gravesend': 'Gravesend',
		'great-kills': 'Great Kills',
		'greenpoint': 'Greenpoint',
		'greenridge': 'Greenridge',
		'greenwich-village': 'Greenwich Village',
		'greenwood-heights': 'Greenwood Heights',
		'grymes-hill': 'Grymes Hill',
		'hamilton-beach': 'Hamilton Beach',
		'hamilton-heights': 'Hamilton Heights',
		'heartland-village': 'Heartland Village',
		'hells-kitchen-clinton': 'Hell\'s Kitchen / Clinton',
		'high-bridge': 'High Bridge',
		'hillcrest': 'Hillcrest',
		'hollis': 'Hollis',
		'holliswood': 'Holliswood',
		'homecrest': 'Homecrest',
		'howard-beach': 'Howard Beach',
		'hudson-heights': 'Hudson Heights',
		'hudson-square': 'Hudson Square',
		'huguenot': 'Huguenot',
		'hunts-point': 'Hunts Point',
		'inwood': 'Inwood',
		'jackson-heights': 'Jackson Heights',
		'jamaica': 'Jamaica',
		'jamaica-estates': 'Jamaica Estates',
		'jamaica-hills': 'Jamaica Hills',
		'kensington': 'Kensington',
		'kew-gardens': 'Kew Gardens',
		'kew-gardens-hills': 'Kew Gardens Hills',
		'kingsbridge': 'Kingsbridge',
		'kingsbridge-heights': 'Kingsbridge Heights',
		'kips-bay': 'Kips Bay',
		'laurelton': 'Laurelton',
		'lenox-hill': 'Lenox Hill',
		'lighthouse-hills': 'Lighthouse Hill',
		'lincoln-square': 'Lincoln Square',
		'lindenwood': 'Lindenwood',
		'little-italy': 'Little Italy',
		'little-neck': 'Little Neck',
		'livingston': 'Livingston',
		'long-island-city': 'Long Island City',
		'longwood': 'Longwood',
		'lower-east-side': 'Lower East Side',
		'malba': 'Malba',
		'manhattan-beach': 'Manhattan Beach',
		'manhattan-valley': 'Manhattan Valley',
		'marble-hill': 'Marble Hill',
		'marine-park': 'Marine Park',
		'mariners-harbor': 'Mariners Harbor',
		'maspeth': 'Maspeth',
		'meatpacking-district': 'Meatpacking District',
		'meiers-corners': 'Meier\'s Corners',
		'melrose': 'Melrose',
		'middle-village': 'Middle Village',
		'midland-beach': 'Midland Beach',
		'midtown': 'Midtown',
		'midtown-east': 'Midtown East',
		'midtown-south': 'Midtown South',
		'midwood': 'Midwood',
		'mill-basin': 'Mill Basin',
		'morningside-heights': 'Morningside Heights',
		'morris-heights': 'Morris Heights',
		'morris-park': 'Morris Park',
		'morrisania': 'Morrisania',
		'mott-haven': 'Mott Haven',
		'mount-hope': 'Mount Hope',
		'murray-hill': 'Murray Hill',
		'murray-hill-queens': 'Murray Hill (Queens)',
		'neponsit': 'Neponsit',
		'new-brighton': 'New Brighton',
		'new-dorp': 'New Dorp',
		'new-dorp-beach': 'New Dorp Beach',
		'new-springville': 'New Springville',
		'noho': 'NoHo',
		'nolita': 'Nolita',
		'norwood': 'Norwood',
		'oakland-gardens': 'Oakland Gardens',
		'oakwood': 'Oakwood',
		'ocean-breeze': 'Ocean Breeze',
		'ocean-hill': 'Ocean Hill',
		'old-town': 'Old Town',
		'olinville': 'Olinville',
		'ozone-park': 'Ozone Park',
		'park-slope': 'Park Slope',
		'parkchester': 'Parkchester',
		'pelham-bay': 'Pelham Bay',
		'pelham-gardens': 'Pelham Gardens',
		'pelham-parkway': 'Pelham Parkway',
		'pleasant-plains': 'Pleasant Plains',
		'pomonok': 'Pomonok',
		'port-morris': 'Port Morris',
		'port-richmond': 'Port Richmond',
		'princes-bay': 'Prince\'s Bay',
		'prospect-heights': 'Prospect Heights',
		'prospect-park-south': 'Prospect Park South',
		'prospect-lefferts-gardens': 'Prospect-Lefferts Gardens',
		'queens-village': 'Queens Village',
		'randall-manor': 'Randall Manor',
		'red-hook': 'Red Hook',
		'rego-park': 'Rego Park',
		'richmond-hill': 'Richmond Hill',
		'richmond-town': 'Richmondtown',
		'ridgewood': 'Ridgewood',
		'riverdale': 'Riverdale',
		'rochdale-village': 'Rochdale Village',
		'rockaway-beach': 'Rockaway Beach',
		'rockaway-park': 'Rockaway Park',
		'roosevelt-island': 'Roosevelt Island',
		'rosebank': 'Rosebank',
		'rosedale': 'Rosedale',
		'rossville': 'Rossville',
		'roxbury': 'Roxbury',
		'schuylerville': 'Schuylerville',
		'sea-gate': 'Sea Gate',
		'seaside': 'Seaside',
		'sheepshead-bay': 'Sheepshead Bay',
		'shore-acres': 'Shore Acres',
		'silver-lake': 'Silver Lake',
		'soho': 'SoHo',
		'soundview': 'Soundview',
		'south-beach': 'South Beach',
		'south-jamaica': 'South Jamaica',
		'south-ozone-park': 'South Ozone Park',
		'south-street-seaport': 'South Street Seaport',
		'springfield-gardens': 'Springfield Gardens',
		'spuyten-duyvil': 'Spuyten Duyvil',
		'st-albans': 'St. Albans',
		'st.-george': 'St. George',
		'stapleton': 'Stapleton',
		'starrett-city': 'Starrett City',
		'stuy-town': 'Stuyvesant Town',
		'sugar-hill': 'Sugar Hill',
		'sunnyside': 'Sunnyside',
		'sunnyside-staten-island': 'Sunnyside (Staten Island)',
		'sunset-park': 'Sunset Park',
		'sutton-place': 'Sutton Place',
		'throgs-neck': 'Throgs Neck',
		'times-square-theater-district': 'Times Square/ Theater District',
		'todt-hill': 'Todt Hill',
		'tompkinsville': 'Tompkinsville',
		'tottenville': 'Tottenville',
		'travis': 'Travis',
		'tremont-east-tremont': 'Tremont & East Tremont',
		'tribeca': 'TriBeCa',
		'turtle-bay': 'Turtle Bay',
		'union-square': 'Union Square',
		'unionport': 'Unionport',
		'university-heights': 'University Heights',
		'upper-east-side': 'Upper East Side',
		'upper-west-side': 'Upper West Side',
		'utopia': 'Utopia',
		'van-nest': 'Van Nest',
		'vinegar-hill': 'Vinegar Hill',
		'wakefield': 'Wakefield',
		'washington-heights': 'Washington Heights',
		'wavecrest': 'Wavecrest',
		'west-brighton': 'West Brighton',
		'west-farms': 'West Farms',
		'west-harlem': 'West Harlem',
		'west-village': 'West Village',
		'westchester-square': 'Westchester Square',
		'westerleigh': 'Westerleigh',
		'whitestone': 'Whitestone',
		'williamsbridge': 'Williamsbridge',
		'williamsburg': 'Williamsburg',
		'willowbrook': 'Willowbrook',
		'windsor-terrace': 'Windsor Terrace',
		'woodhaven': 'Woodhaven',
		'woodlawn': 'Woodlawn',
		'woodrow': 'Woodrow',
		'woodside': 'Woodside',
		'yorkville': 'Yorkville',
		"park-slope-south": "South Slope",
		"alphabet-city": "Alphabet City",
		"nomad": "NoMad",
		"tudor-city": "Tudor City",
		
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
	
	
