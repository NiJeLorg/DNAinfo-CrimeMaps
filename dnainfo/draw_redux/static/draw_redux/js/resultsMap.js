/**
 * resultsMap.js: Creates results map for draw redux
 */

function resultsMapApplication() {}

resultsMapApplication.initialize = function () {

	// create an object to hold all of the colors for each hood drawn
	resultsMapApplication.colorsByHood = {};

	// set zoom and center for this map
	this.center = center(neighborhoodName);
	this.zoom = 15;
	this.minZoom = 14;
    this.map = new L.Map('map', {
		minZoom:this.minZoom,
		maxZoom:18,
    	center: this.center,
   	 	zoom: this.zoom
	});

	resultsMapApplication.map = this.map;

	// get bounds and set maxBounds so user can't pan outside of a certain extent
	this.bounds = this.map.getBounds().pad(1);
	this.map.setMaxBounds(this.bounds);

	// set a tile layer to be CartoDB tiles 
	var CartoDBTiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png', { attribution: 'Map tiles by <a href=\"http://cartodb.com/attributions#basemaps\">CartoDB</a>, under <a href=\"https://creativecommons.org/licenses/by/3.0/\" target=\"_blank\">CC BY 3.0</a>. Data by <a href=\"http://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>, under ODbL.'
	});

	// add these tiles to our map
	this.map.addLayer(CartoDBTiles);
	
    // enable events
    this.map.doubleClickZoom.enable();
    this.map.scrollWheelZoom.enable();

	//load geocoder control
	var geocoder = this.map.addControl(L.Control.geocoder({collapsed: true, placeholder:'Address Search', geocoder:new L.Control.Geocoder.Google()}));
	
	// get geojson
	resultsMapApplication.getAdded();

	function center(neighborhood) {

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


}

resultsMapApplication.getAdded = function () {
	$.ajax({
		type: "GET",
		url: "/in-or-out/nyc/getAdded/"+ objectID +"/",
		success: function(data){
			// load the draw tools
			if (data) {
				var results = JSON.parse(data);
				resultsMapApplication.added = results;

			} else {
				resultsMapApplication.added = [];
			}

			//get removed
			resultsMapApplication.getRemoved();
        }
	});
}

resultsMapApplication.getRemoved = function () {
	$.ajax({
		type: "GET",
		url: "/in-or-out/nyc/getRemoved/"+ objectID +"/",
		success: function(data){
			// load the draw tools
			if (data) {
				var results = JSON.parse(data);
				resultsMapApplication.removed = results;
			} else {
				resultsMapApplication.removeded = [];
			}

			//get removed
			resultsMapApplication.loadHood();
        }
	});
}




resultsMapApplication.loadHood = function () {
	d3.json(hoodBlocks, function(data) {
		var polyTopojson = topojson.feature(data, data.objects[filename]).features;
		drawPolys(polyTopojson);
	});

	function drawPolys(polyTopojson) {
		resultsMapApplication.HOOD = L.geoJson(polyTopojson, {
		    style: resultsMapApplication.getStyleFor_HOOD,
			onEachFeature: resultsMapApplication.onEachFeature_HOOD
		}).addTo(resultsMapApplication.map);

	}

}

resultsMapApplication.getStyleFor_HOOD = function (feature){
	// style added and removed first
	for (var i = resultsMapApplication.added.length - 1; i >= 0; i--) {
		if (feature.properties.BCTCB2010 == resultsMapApplication.added[i]) {
			return {
				weight: 2,
				opacity: 1,
			    color: '#555',		
		        fillOpacity: 0.8,
		        fillColor: '#fc5158'
		    };
		}
	}

	for (var i = resultsMapApplication.removed.length - 1; i >= 0; i--) {
		if (feature.properties.BCTCB2010 == resultsMapApplication.removed[i]) {
			return {
				weight: 2,
				opacity: 1,
			    color: '#555',		
		        fillOpacity: 0.8,
		        fillColor: '#aaa'
		    };
		}
	}

	// now style by neighborhood
	var hoodsDrawnInBlock = [];
	var hoodProportionInBlock = {};
	for (var i = hoodsKeys.length - 1; i >= 0; i--) {
		if (hoodsKeys[i] in feature.properties) {
			// feature.properties[hoodsKeys[i]] is the total number of drawing for this neighborhood in this block 
			// hoodsKeyAndMaxCount[hoodsKeys[i]] is the total number of drawing for that neighborhood
			// hoodProportionInBlock = calculating proportion for that neighborhood of the total drawings for the neighborhood in the block
			feature.properties[hoodsKeys[i]] = parseInt(feature.properties[hoodsKeys[i]]);
			hoodsKeyAndMaxCount[hoodsKeys[i]] = parseInt(hoodsKeyAndMaxCount[hoodsKeys[i]]);
			hoodProportionInBlock[hoodsKeys[i]] = feature.properties[hoodsKeys[i]] / hoodsKeyAndMaxCount[hoodsKeys[i]];
			hoodsDrawnInBlock.push(hoodsKeys[i]);
		}
	}

	// sort the results
	var hoodsProportionInBlockSorted = resultsMapApplication.sortProperties(hoodProportionInBlock);


	// if proportion is greater than 0.5, then fill with red
	if (hoodProportionInBlock[hoodNameNoHyphens + "_count"] >= 0.5) {
	    return {
	        weight: 0.5,
	        opacity: 0.7,
	        color: '#fff',
	        fillOpacity: 0.7,
	        fillColor: '#fc5158'
	    }		
	} else if (hoodNameNoHyphens + "_count" == hoodsProportionInBlockSorted[0][0]) {
		// check color object for presence of this neighborhood
        if(!resultsMapApplication.colorsByHood.hasOwnProperty(hoodsProportionInBlockSorted[1][0])) {
        	// assign color to colorsByHood object
        	resultsMapApplication.colorsByHood[hoodsProportionInBlockSorted[1][0]] = resultsMapApplication.colorAssignment(resultsMapApplication.objectLength(resultsMapApplication.colorsByHood));
        }

	    return {
	        weight: 0.5,
	        opacity: 0.7,
	        color: '#fff',
	        fillOpacity: 0.5,
	        fillColor: resultsMapApplication.colorsByHood[hoodsProportionInBlockSorted[1][0]]
	    }

	} else {
		// check color object for presence of this neighborhood
        if(!resultsMapApplication.colorsByHood.hasOwnProperty(hoodsProportionInBlockSorted[0][0])) {
        	// assign color to colorsByHood object
        	resultsMapApplication.colorsByHood[hoodsProportionInBlockSorted[0][0]] = resultsMapApplication.colorAssignment(resultsMapApplication.objectLength(resultsMapApplication.colorsByHood));
        }

	    return {
	        weight: 0.5,
	        opacity: 0.7,
	        color: '#fff',
	        fillOpacity: 0.5,
	        fillColor: resultsMapApplication.colorsByHood[hoodsProportionInBlockSorted[0][0]]
	    }	
	}

}

resultsMapApplication.onEachFeature_HOOD = function(feature,layer){	

	var hoodsDrawnInBlock = [];
	var hoodProportionInBlock = {};
	for (var i = hoodsKeys.length - 1; i >= 0; i--) {
		if (hoodsKeys[i] in feature.properties) {
			// feature.properties[hoodsKeys[i]] is the total number of drawing for this neighborhood in this block 
			// hoodsKeyAndMaxCount[hoodsKeys[i]] is the total number of drawing for that neighborhood
			// hoodProportionInBlock = calculating proportion for that neighborhood of the total drawings for the neighborhood in the block
			feature.properties[hoodsKeys[i]] = parseInt(feature.properties[hoodsKeys[i]]);
			hoodsKeyAndMaxCount[hoodsKeys[i]] = parseInt(hoodsKeyAndMaxCount[hoodsKeys[i]]);
			hoodProportionInBlock[hoodsKeys[i]] = feature.properties[hoodsKeys[i]] / hoodsKeyAndMaxCount[hoodsKeys[i]];
			hoodsDrawnInBlock.push(hoodsKeys[i]);
		}
	}

	// sort the results
	var hoodsProportionInBlockSorted = resultsMapApplication.sortProperties(hoodProportionInBlock);

	// calculate percent of total drawings is selected hood in each block
	var pctMainHood = (hoodProportionInBlock[hoodNameNoHyphens + "_count"] * 100).toFixed(1);
	// add this to feature.properties for later
	feature.properties.pctMainHood = pctMainHood;

	// calculate next hood that's not this hood and it's percentage
	var topOtherHood = {};
	if (hoodName != hoodsKeyAndName[hoodsProportionInBlockSorted[0][0]]) {
		topOtherHood['name'] = hoodsKeyAndName[hoodsProportionInBlockSorted[0][0]];
		topOtherHood['pct'] = (hoodsProportionInBlockSorted[0][1] * 100).toFixed(1);		
	} else {
		topOtherHood['name'] = hoodsKeyAndName[hoodsProportionInBlockSorted[1][0]];
		topOtherHood['pct'] = (hoodsProportionInBlockSorted[1][1] * 100).toFixed(1);
	}

	if (pctMainHood >= 50) {

		if (!L.Browser.touch) {
			layer.bindLabel("<strong>" + pctMainHood + "% agree this block is in<br />"+ hoodName +".</strong>", { direction:'auto' });
		}		

	} else {

		if (!L.Browser.touch) {
			layer.bindLabel("<strong>" + topOtherHood['pct'] + "% think this block is in " + topOtherHood['name'] +".</strong>", { direction:'auto' });

		}
		
	}


	for (var i = resultsMapApplication.added.length - 1; i >= 0; i--) {
		if (feature.properties.BCTCB2010 == resultsMapApplication.added[i]) {
			if (!L.Browser.touch) {
				layer.unbindLabel();
				layer.bindLabel("<strong>You added this block to " + hoodName + ".<br />" + pctMainHood + "% agree with you!</strong>", { direction:'auto' });
			}
		}
	}

	for (var i = resultsMapApplication.removed.length - 1; i >= 0; i--) {
		if (feature.properties.BCTCB2010 == resultsMapApplication.removed[i]) {
			if (!L.Browser.touch) {
				layer.unbindLabel();
				layer.bindLabel("<strong>You removed this block from " + hoodName + ".<br />" + pctMainHood + "% disagree with you.</strong>", { direction:'auto' });
			}

		}
	}

	layer.on('mouseover', function(ev) {
		layer.setStyle(resultsMapApplication.hover);
		if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }
	});

	layer.on('mouseout', function(ev) {
		resultsMapApplication.HOOD.resetStyle(layer);
	});

}


resultsMapApplication.objectLength = function(obj) {
	var count = 0;
	var i;

	for (i in obj) {
	    if (obj.hasOwnProperty(i)) {
	        count++;
	    }
	}

	return count;
}

resultsMapApplication.colorAssignment = function(key) {
	var colors = ["#8dd3c7","#ffffb3","#bebada","#7fc97f","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f", "#18e59f", "#fcaffc", "#ffbf04", "#56d8ff", "#dfc69d", "#0ee905", "#abd84e", "#cfc5dd", "#8cd8be", "#dec962", "#47e564", "#aed587", "#feb7bb", "#d4cf0c", "#88e011", "#11dfe1", "#fdbc7a", "#7fdf7b", "#a0d1dc", "#a0cdff", "#35e1be", "#d4c0fb", "#c0cdba", "#ffbd53", "#82dca0", "#f7b6de", "#feba9d", "#c1d267", "#cecd82", "#86df53", "#e1c2c0", "#e8c73d", "#b6d719", "#5ae53c", "#add4a6", "#1de685", "#d0cf49", "#75d8e1", "#e7c57e", "#a5d96c", "#b3cce7", "#c1cbce", "#67e095", "#8cd2f5", "#c7ce9c", "#22ddf5", "#60ddc8", "#e8bed4", "#a1d3c8", "#9fdb2e", "#f1c08e", "#1de851", "#f3c169", "#6ee16a", "#f9c137", "#eec614", "#c1c6f6", "#edc0ac", "#93da8b", "#ebb7f6", "#58e60b", "#54e1aa", "#dfbee7", "#d8c7b0", "#73ddb4", "#7ce13d", "#66e352", "#05e1d2", "#dac98d", "#91d9aa", "#c9d232", "#73dad2", "#bad291", "#5ee285", "#8edd65", "#edc457", "#14e93b", "#e1ca20", "#48e575", "#c1d17d", "#acd3b5", "#bfd355", "#b9d639", "#a0d79b", "#cbcbab", "#ffbb89", "#ffb8ac", "#cec9bf", "#d7cb73", "#feb5ca", "#ddcb50", "#feb1ed", "#77d6f0", "#71e320", "#efbdc0", "#b3cfc9", "#dbc3ce", "#edc19d", "#9cdc46", "#c6d307", "#a0d97c", "#d1ce62", "#4cdce6", "#b2d577", "#9edb5a", "#8fd5d7", "#1ae3b3", "#e5c66e", "#3ae490", "#bcd0ab", "#d7cd33", "#b3d660", "#7ede8b", "#92de36", "#57ddd7", "#c8d072", "#fdbe64", "#4ce29a", "#f3c34b", "#75e159", "#80dd96", "#95db76", "#9fcff0", "#f7b5e8", "#5be37b", "#cfc3f1", "#7cdf70", "#b8c9f1", "#c6cf8d", "#cac8d3", "#acd2bf", "#bfcadd", "#92d3e6", "#aacfe2", "#e7bfca", "#d7c2e2", "#dac5ba", "#cdcab5"];
	return colors[key];
}

resultsMapApplication.sortProperties = function(obj){
  // convert object into array
    var sortable=[];
    for(var key in obj)
        if(obj.hasOwnProperty(key))
            sortable.push([key, obj[key]]); // each item is an array in format [key, value]

    // sort items by value
    sortable.sort(function(a, b)
    {
      return b[1]-a[1]; // compare numbers
    });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

/* Style states */
resultsMapApplication.hover = {
		weight: 2,
		opacity: 1,
        color: '#555',
    };


/* Vars */
resultsMapApplication.map;
// create an array to push selected ids into
resultsMapApplication.added = [];
resultsMapApplication.removed = [];





