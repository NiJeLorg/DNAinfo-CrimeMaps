/**
 * map.js: Creates map for selecting which pluto plot to use
 */

function mapApplication() {}

mapApplication.initialize = function () {
	// set zoom and center for this map
	this.center = mapApplication.center(neighborhoodName);
	if (iDontSeeMyNeighborhood == "True"){
		this.zoom = 11;
		this.minZoom = 11;
	} else {
		this.zoom = 15;
		this.minZoom = 14;
	}    
    this.map = new L.Map('map', {
		minZoom:this.minZoom,
		maxZoom:18,
    	center: this.center,
   	 	zoom: this.zoom
	});

	mapApplication.map = this.map;

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
	
	//add pluto data
	mapApplication.loadPluto();


}


mapApplication.loadPluto = function () {
	d3.json(plutoData, function(data) {
		var polyTopojson = topojson.feature(data, data.objects[filename]).features;
		drawPolys(polyTopojson);
	});

	function drawPolys(polyTopojson) {
		//console.log(polyTopojson);
		mapApplication.PLUTO = L.geoJson(polyTopojson, {
		    style: mapApplication.getStyleFor_PLUTO,
			onEachFeature: mapApplication.onEachFeature_PLUTO
		}).addTo(mapApplication.map);

	}

}

mapApplication.getStyleFor_PLUTO = function (feature){
    return {
        weight: 0,
        opacity: 0,
        color: '#bdbdbd',
        fillOpacity: 0.5,
        fillColor: '#aaa'
    }
}

mapApplication.onEachFeature_PLUTO = function(feature,layer){	

	layer.bindLabel("<strong>" + feature.properties.Address + "</strong>", { direction:'auto' });
	
    layer.on('mouseover', function(ev) {
    	if (layer != mapApplication.lastClickedLayer) {
    		layer.setStyle(mapApplication.hovered);
    	}
    });
		
    layer.on('mouseout', function(ev) {
    	if (layer != mapApplication.lastClickedLayer) {
    		mapApplication.PLUTO.resetStyle(ev.target);
    	}
				
    });	
	

    layer.on('click', function(ev) {

    	// check to see if any layers have been clicked and if so reset the style
    	if(mapApplication.lastClickedLayer){
		   mapApplication.PLUTO.resetStyle(mapApplication.lastClickedLayer);
		}

		// set style
		layer.setStyle(mapApplication.clicked);

		// bring to front
		if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }

	    // assign layer clicked to lastLayerClicked for use later
	    mapApplication.lastClickedLayer = layer;

	    // clear previous layers
	    mapApplication.SELECTED.clearLayers();

	    layer.feature.properties.color = "#ffcf2d";
	    layer.feature.properties.roofColor = "#ffcf2d";
	    layer.feature.properties.height = buildingHeight;
	    layer.feature.properties.name = buildingName;
	    layer.feature.properties.printAddress = buildingAddress;
	    layer.feature.properties.text = buildingText;
	    layer.feature.properties.image = buildingImage;
	    layer.feature.properties.minHeight = 0;


	    mapApplication.SELECTED.addLayer(layer);
	   	var geojson = mapApplication.SELECTED.toGeoJSON();
	   	$('#id_buildingFootprint').val(JSON.stringify(geojson));


        // remove disable from next button
        if ($('#sponsoredNextEnd').prop("disabled")) {
            $('#sponsoredNextEnd').prop("disabled", false);
        }


    });	


}


mapApplication.center = function (neighborhood) {

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

mapApplication.fileLookup = function (neighborhood) {

	var lookup = {
		"allerton": 'MapPlutoNeighJoinOutput_ntacode__BX07',
		"annandale": 'MapPlutoNeighJoinOutput_ntacode__SI01_SI54_merge',
		"arden-heights": 'MapPlutoNeighJoinOutput_ntacode__SI48',
		"arrochar": 'MapPlutoNeighJoinOutput_ntacode__SI14_SI36_merge',
		"arverne": 'MapPlutoNeighJoinOutput_ntacode__QN12',
		"astoria": 'MapPlutoNeighJoinOutput_ntacode__QN68_QN70_QN71_merge',
		"auburndale": 'MapPlutoNeighJoinOutput_ntacode__QN48',
		"bath-beach": 'MapPlutoNeighJoinOutput_ntacode__BK27',
		"battery-park-city": 'MapPlutoNeighJoinOutput_ntacode__MN25',
		"bay-ridge": 'MapPlutoNeighJoinOutput_ntacode__BK31',
		"bay-terrace": 'MapPlutoNeighJoinOutput_ntacode__QN46_QN47_merge',
		"bay-terrace-staten-island": 'MapPlutoNeighJoinOutput_ntacode__SI01_SI54_merge',
		"baychester": 'MapPlutoNeighJoinOutput_ntacode__BX13',
		"bayside": 'MapPlutoNeighJoinOutput_ntacode__QN46_QN47_merge',
		"bayswater": 'MapPlutoNeighJoinOutput_ntacode__QN15',
		"bed-stuy": 'MapPlutoNeighJoinOutput_ntacode__BK35_BK75_BK79_merge',
		"bedford-park": 'MapPlutoNeighJoinOutput_ntacode__BX05',
		"beechhurst": 'MapPlutoNeighJoinOutput_ntacode__QN49',
		"belle-harbor": 'MapPlutoNeighJoinOutput_ntacode__QN10',
		"bellerose": 'MapPlutoNeighJoinOutput_ntacode__QN43',
		"belmont": 'MapPlutoNeighJoinOutput_ntacode__BX06',
		"bensonhurst": 'MapPlutoNeighJoinOutput_ntacode__BK28',
		"bergen-beach": 'MapPlutoNeighJoinOutput_ntacode__BK45',
		"bloomfield": 'MapPlutoNeighJoinOutput_ntacode__SI05',
		"boerum-hill": 'MapPlutoNeighJoinOutput_ntacode__BK38',
		"borough-park": 'MapPlutoNeighJoinOutput_ntacode__BK88',
		"breezy-point": 'MapPlutoNeighJoinOutput_ntacode__QN10',
		"briarwood": 'MapPlutoNeighJoinOutput_ntacode__QN35',
		"brighton-beach": 'MapPlutoNeighJoinOutput_ntacode__BK19',
		"broad-channel": 'MapPlutoNeighJoinOutput_ntacode__QN10',
		"brooklyn-heights": 'MapPlutoNeighJoinOutput_ntacode__BK09',
		"brookville": 'MapPlutoNeighJoinOutput_ntacode__QN03',
		"brownsville": 'MapPlutoNeighJoinOutput_ntacode__BK81',
		"bulls-heads": 'MapPlutoNeighJoinOutput_ntacode__SI05',
		"bushwick": 'MapPlutoNeighJoinOutput_ntacode__BK77_BK78_merge',
		"cambria-heights": 'MapPlutoNeighJoinOutput_ntacode__QN33',
		"canarsie": 'MapPlutoNeighJoinOutput_ntacode__BK50',
		"carnegie-hill": 'MapPlutoNeighJoinOutput_ntacode__MN31_MN32_MN40_merge',
		"carroll-gardens": 'MapPlutoNeighJoinOutput_ntacode__BK33',
		"castle-hill": 'MapPlutoNeighJoinOutput_ntacode__BX55_BX09_BX08_merge',
		"castleton-corners": 'MapPlutoNeighJoinOutput_ntacode__SI07',
		"central-harlem": 'MapPlutoNeighJoinOutput_ntacode__MN03_MN11_merge',
		"charleston": 'MapPlutoNeighJoinOutput_ntacode__SI11',
		"chelsea": 'MapPlutoNeighJoinOutput_ntacode__MN13',
		"chelsea-staten-island": 'MapPlutoNeighJoinOutput_ntacode__SI05',
		"chinatown": 'MapPlutoNeighJoinOutput_ntacode__MN22_MN27_MN28_merge',
		"city-island": 'MapPlutoNeighJoinOutput_ntacode__BX10',
		"civic-center": 'MapPlutoNeighJoinOutput_ntacode__MN22_MN27_MN28_merge',
		"claremont": 'MapPlutoNeighJoinOutput_ntacode__BX01',
		"claremont-village": 'MapPlutoNeighJoinOutput_ntacode__BX75',
		"clason-point": 'MapPlutoNeighJoinOutput_ntacode__BX55_BX09_BX08_merge',
		"clifton": 'MapPlutoNeighJoinOutput_ntacode__SI08_SI35_SI37_merge',
		"clinton-hill": 'MapPlutoNeighJoinOutput_ntacode__BK69',
		"co-op-city": 'MapPlutoNeighJoinOutput_ntacode__BX13',
		"cobble-hill": 'MapPlutoNeighJoinOutput_ntacode__BK09',
		"college-point": 'MapPlutoNeighJoinOutput_ntacode__QN23',
		"columbia-street-waterfront-district": 'MapPlutoNeighJoinOutput_ntacode__BK33',
		"columbus-circle": 'MapPlutoNeighJoinOutput_ntacode__MN12_MN14_merge',
		"concord": 'MapPlutoNeighJoinOutput_ntacode__SI14_SI36_merge',
		"concourse": 'MapPlutoNeighJoinOutput_ntacode__BX63',
		"concourse-village": 'MapPlutoNeighJoinOutput_ntacode__BX14',
		"coney-island": 'MapPlutoNeighJoinOutput_ntacode__BK21_BK23_merge',
		"corona": 'MapPlutoNeighJoinOutput_ntacode__QN25_QN26_merge',
		"country-club": 'MapPlutoNeighJoinOutput_ntacode__BX10',
		"crown-heights": 'MapPlutoNeighJoinOutput_ntacode__BK61_BK63_merge',
		"cypress-hills": 'MapPlutoNeighJoinOutput_ntacode__BK83',
		"ditmars": 'MapPlutoNeighJoinOutput_ntacode__QN72',
		"ditmas-park": 'MapPlutoNeighJoinOutput_ntacode__BK42',
		"dongan-hills": 'MapPlutoNeighJoinOutput_ntacode__SI14_SI36_merge',
		"douglaston": 'MapPlutoNeighJoinOutput_ntacode__QN45',
		"downtown-brooklyn": 'MapPlutoNeighJoinOutput_ntacode__BK38',
		"dumbo": 'MapPlutoNeighJoinOutput_ntacode__BK38',
		"dyker-heights": 'MapPlutoNeighJoinOutput_ntacode__BK30',
		"east-elmhurst": 'MapPlutoNeighJoinOutput_ntacode__QN27_QN28_merge',
		"east-flatbush": 'MapPlutoNeighJoinOutput_ntacode__BK91_BK95_BK96_merge',
		"east-harlem": 'MapPlutoNeighJoinOutput_ntacode__MN33_MN34_merge',
		"east-new-york": 'MapPlutoNeighJoinOutput_ntacode__BK82_BK85_BK93_merge',
		"east-village": 'MapPlutoNeighJoinOutput_ntacode__MN22_MN27_MN28_merge',
		"east-williamsburg": 'MapPlutoNeighJoinOutput_ntacode__BK72_BK73_BK90_merge',
		"eastchester": 'MapPlutoNeighJoinOutput_ntacode__BX03',
		"edenwald": 'MapPlutoNeighJoinOutput_ntacode__BX03',
		"edgemere": 'MapPlutoNeighJoinOutput_ntacode__QN12',
		"elm-park": 'MapPlutoNeighJoinOutput_ntacode__SI28',
		"elmhurst": 'MapPlutoNeighJoinOutput_ntacode__QN29',
		"eltingville": 'MapPlutoNeighJoinOutput_ntacode__SI01_SI54_merge',
		"emerson-hill": 'MapPlutoNeighJoinOutput_ntacode__SI24',
		"far-rockaway": 'MapPlutoNeighJoinOutput_ntacode__QN15',
		"fieldston": 'MapPlutoNeighJoinOutput_ntacode__BX22',
		"financial-district": 'MapPlutoNeighJoinOutput_ntacode__MN25',
		"flatbush": 'MapPlutoNeighJoinOutput_ntacode__BK42',
		"flatiron": 'MapPlutoNeighJoinOutput_ntacode__MN13',
		"flatlands": 'MapPlutoNeighJoinOutput_ntacode__BK58',
		"flushing": 'MapPlutoNeighJoinOutput_ntacode__QN22_QN52_QN62_merge',
		"fordham": 'MapPlutoNeighJoinOutput_ntacode__BX05_BX40_merge',
		"forest-hills": 'MapPlutoNeighJoinOutput_ntacode__QN17',
		"fort-george":'MapPlutoNeighJoinOutput_ntacode__MN35_MN36_merge',
		"fort-greene": 'MapPlutoNeighJoinOutput_ntacode__BK68',
		"fort-hamilton": 'MapPlutoNeighJoinOutput_ntacode__BK31',
		"fort-wadsworth": 'MapPlutoNeighJoinOutput_ntacode__SI14_SI36_merge',
		"fresh-meadows": 'MapPlutoNeighJoinOutput_ntacode__QN41',
		"garment-district": 'MapPlutoNeighJoinOutput_ntacode__MN17',
		"gerritsen-beach": 'MapPlutoNeighJoinOutput_ntacode__BK17_BK25_BK44_merge',
		"glendale": 'MapPlutoNeighJoinOutput_ntacode__QN19',
		"governors-island": 'MapPlutoNeighJoinOutput_ntacode__BK33',
		"gowanus": 'MapPlutoNeighJoinOutput_ntacode__BK37',
		"gramercy": 'MapPlutoNeighJoinOutput_ntacode__MN21',
		"graniteville": 'MapPlutoNeighJoinOutput_ntacode__SI12',
		"grant-city": 'MapPlutoNeighJoinOutput_ntacode__SI45',
		"grasmere": 'MapPlutoNeighJoinOutput_ntacode__SI14_SI36_merge',
		"gravesend": 'MapPlutoNeighJoinOutput_ntacode__BK26',
		"great-kills": 'MapPlutoNeighJoinOutput_ntacode__SI01_SI54_merge',
		"greenpoint": 'MapPlutoNeighJoinOutput_ntacode__BK76',
		"greenridge": 'MapPlutoNeighJoinOutput_ntacode__SI48',
		"greenwich-village": 'MapPlutoNeighJoinOutput_ntacode__MN23',
		"greenwood-heights": 'MapPlutoNeighJoinOutput_ntacode__BK32_BK34_merge',
		"grymes-hill": 'MapPlutoNeighJoinOutput_ntacode__SI08_SI35_SI37_merge',
		"hamilton-beach": 'MapPlutoNeighJoinOutput_ntacode__QN57',
		"hamilton-heights": 'MapPlutoNeighJoinOutput_ntacode__MN04',
		"heartland-village": 'MapPlutoNeighJoinOutput_ntacode__SI24',
		"hells-kitchen-clinton": 'MapPlutoNeighJoinOutput_ntacode__MN15',
		"high-bridge": 'MapPlutoNeighJoinOutput_ntacode__BX26',
		"hillcrest": 'MapPlutoNeighJoinOutput_ntacode__QN38',
		"hollis": 'MapPlutoNeighJoinOutput_ntacode__QN07',
		"holliswood": 'MapPlutoNeighJoinOutput_ntacode__QN06',
		"homecrest": 'MapPlutoNeighJoinOutput_ntacode__BK17_BK25_BK44_merge',
		"howard-beach": 'MapPlutoNeighJoinOutput_ntacode__QN57',
		"hudson-heights": 'MapPlutoNeighJoinOutput_ntacode__MN35_MN36_merge',
		"hudson-square": 'MapPlutoNeighJoinOutput_ntacode__MN24',
		"huguenot":'MapPlutoNeighJoinOutput_ntacode__SI32',
		"hunts-point": 'MapPlutoNeighJoinOutput_ntacode__BX27',
		"inwood": 'MapPlutoNeighJoinOutput_ntacode__MN01',
		"jackson-heights": 'MapPlutoNeighJoinOutput_ntacode__QN27_QN28_merge',
		"jamaica": 'MapPlutoNeighJoinOutput_ntacode__QN01_QN61_merge',
		"jamaica-estates": 'MapPlutoNeighJoinOutput_ntacode__QN06',
		"jamaica-hills": 'MapPlutoNeighJoinOutput_ntacode__QN35',
		"kensington": 'MapPlutoNeighJoinOutput_ntacode__BK41',
		"kew-gardens": 'MapPlutoNeighJoinOutput_ntacode__QN60',
		"kew-gardens-hills": 'MapPlutoNeighJoinOutput_ntacode__QN37',
		"kingsbridge": 'MapPlutoNeighJoinOutput_ntacode__BX29',
		"kingsbridge-heights": 'MapPlutoNeighJoinOutput_ntacode__BX28',
		"kips-bay": 'MapPlutoNeighJoinOutput_ntacode__MN20',
		"laurelton": 'MapPlutoNeighJoinOutput_ntacode__QN66'.
		"lenox-hill": 'MapPlutoNeighJoinOutput_ntacode__MN31_MN32_MN40_merge',
		"lighthouse-hills": 'MapPlutoNeighJoinOutput_ntacode__SI24',
		"lincoln-square": 'MapPlutoNeighJoinOutput_ntacode__MN12_MN14_merge',
		"lindenwood": 'MapPlutoNeighJoinOutput_ntacode__QN57',
		"little-italy": 'MapPlutoNeighJoinOutput_ntacode__MN24',
		"little-neck": 'MapPlutoNeighJoinOutput_ntacode__QN45',
		"livingston": 'MapPlutoNeighJoinOutput_ntacode__SI22',
		"long-island-city": 'MapPlutoNeighJoinOutput_ntacode__QN31',
		"longwood": 'MapPlutoNeighJoinOutput_ntacode__BX33',
		"lower-east-side": 'MapPlutoNeighJoinOutput_ntacode__MN22_MN27_MN28_merge',
		"malba": 'MapPlutoNeighJoinOutput_ntacode__QN49',
		"manhattan-beach": 'MapPlutoNeighJoinOutput_ntacode__BK17_BK25_BK44_merge',
		"manhattan-valley": 'MapPlutoNeighJoinOutput_ntacode__MN12_MN14_merge',
		"marble-hill": 'MapPlutoNeighJoinOutput_ntacode__MN01',
		"marine-park": 'MapPlutoNeighJoinOutput_ntacode__BK45',
		"mariners-harbor": 'MapPlutoNeighJoinOutput_ntacode__SI12',
		"maspeth": 'MapPlutoNeighJoinOutput_ntacode__QN30',
		"meatpacking-district": 'MapPlutoNeighJoinOutput_ntacode__MN23',
		"meiers-corners": 'MapPlutoNeighJoinOutput_ntacode__SI24',
		"melrose": 'MapPlutoNeighJoinOutput_ntacode__BX34',
		"middle-village": 'MapPlutoNeighJoinOutput_ntacode__QN21',
		"midland-beach": 'MapPlutoNeighJoinOutput_ntacode__SI45',
		"midtown": 'MapPlutoNeighJoinOutput_ntacode__MN17',
		"midtown-east": 'MapPlutoNeighJoinOutput_ntacode__MN19',
		"midtown-south": 'MapPlutoNeighJoinOutput_ntacode__MN17',
		"midwood": 'MapPlutoNeighJoinOutput_ntacode__BK43',
		"mill-basin": 'MapPlutoNeighJoinOutput_ntacode__BK45',
		"morningside-heights": 'MapPlutoNeighJoinOutput_ntacode__MN09',
		"morris-heights": 'MapPlutoNeighJoinOutput_ntacode__BX30_BX36_merge',
		"morris-park": 'MapPlutoNeighJoinOutput_ntacode__BX37',
		"morrisania": 'MapPlutoNeighJoinOutput_ntacode__BX35',
		"mott-haven": 'MapPlutoNeighJoinOutput_ntacode__BX39',
		"mount-hope": 'MapPlutoNeighJoinOutput_ntacode__BX41',
		"murray-hill": 'MapPlutoNeighJoinOutput_ntacode__MN20',
		"murray-hill-queens": 'MapPlutoNeighJoinOutput_ntacode__QN51',
		"navy-yard": 'MapPlutoNeighJoinOutput_ntacode__BK72_BK73_BK90_merge',
		"neponsit": 'MapPlutoNeighJoinOutput_ntacode__QN10',
		"new-brighton": 'MapPlutoNeighJoinOutput_ntacode__SI22',
		"new-dorp": 'MapPlutoNeighJoinOutput_ntacode__SI45',
		"new-dorp-beach": 'MapPlutoNeighJoinOutput_ntacode__SI45',
		"new-springville": 'MapPlutoNeighJoinOutput_ntacode__SI24',
		"noho": 'MapPlutoNeighJoinOutput_ntacode__MN23',
		"nolita": 'MapPlutoNeighJoinOutput_ntacode__MN24',
		"norwood": 'MapPlutoNeighJoinOutput_ntacode__BX43',
		"oakland-gardens": 'MapPlutoNeighJoinOutput_ntacode__QN42',
		"oakwood": 'MapPlutoNeighJoinOutput_ntacode__SI25',
		"ocean-breeze": 'MapPlutoNeighJoinOutput_ntacode__SI14_SI36_merge',
		"ocean-hill": 'MapPlutoNeighJoinOutput_ntacode__BK35_BK75_BK79_merge',
		"old-town": 'MapPlutoNeighJoinOutput_ntacode__SI14_SI36_merge',
		"olinville": 'MapPlutoNeighJoinOutput_ntacode__BX44',
		"ozone-park": 'MapPlutoNeighJoinOutput_ntacode__QN56',
		"park-slope": 'MapPlutoNeighJoinOutput_ntacode__BK37',
		"parkchester": 'MapPlutoNeighJoinOutput_ntacode__BX46',
		"pelham-bay": 'MapPlutoNeighJoinOutput_ntacode__BX10',
		"pelham-gardens": 'MapPlutoNeighJoinOutput_ntacode__BX31',
		"pelham-parkway": 'MapPlutoNeighJoinOutput_ntacode__BX49',
		"pleasant-plains": 'MapPlutoNeighJoinOutput_ntacode__SI11',
		"pomonok": 'MapPlutoNeighJoinOutput_ntacode__QN38',
		"port-morris": 'MapPlutoNeighJoinOutput_ntacode__BX39',
		"port-richmond": 'MapPlutoNeighJoinOutput_ntacode__SI22',
		"princes-bay": 'MapPlutoNeighJoinOutput_ntacode__SI01_SI54_merge',
		"prospect-heights": 'MapPlutoNeighJoinOutput_ntacode__BK64',
		"prospect-park-south": 'MapPlutoNeighJoinOutput_ntacode__BK42',
		"prospect-lefferts-gardens": 'MapPlutoNeighJoinOutput_ntacode__BK60',
		"queens-village": 'MapPlutoNeighJoinOutput_ntacode__QN34',
		"randall-manor": 'MapPlutoNeighJoinOutput_ntacode__SI08_SI35_SI37_merge',
		"randalls-island": 'MapPlutoNeighJoinOutput_ntacode__BX39',
		"red-hook": 'MapPlutoNeighJoinOutput_ntacode__BK33',
		"rego-park": 'MapPlutoNeighJoinOutput_ntacode__QN18',
		"richmond-hill": 'MapPlutoNeighJoinOutput_ntacode__QN54',
		"richmond-town": 'MapPlutoNeighJoinOutput_ntacode__SI25',
		"ridgewood": 'MapPlutoNeighJoinOutput_ntacode__QN20',
		"riverdale": 'MapPlutoNeighJoinOutput_ntacode__BX22',
		"rochdale-village": 'MapPlutoNeighJoinOutput_ntacode__QN02_QN76_merge',
		"rockaway-beach": 'MapPlutoNeighJoinOutput_ntacode__QN12',
		"rockaway-park": 'MapPlutoNeighJoinOutput_ntacode__QN10',
		"roosevelt-island": 'MapPlutoNeighJoinOutput_ntacode__MN31_MN32_MN40_merge',
		"rosebank": 'MapPlutoNeighJoinOutput_ntacode__SI08_SI35_SI37_merge',
		"rosedale": 'MapPlutoNeighJoinOutput_ntacode__QN05',
		"rossville": 'MapPlutoNeighJoinOutput_ntacode__SI32',
		"roxbury": 'MapPlutoNeighJoinOutput_ntacode__QN10',
		"schuylerville": 'MapPlutoNeighJoinOutput_ntacode__BX52',
		"sea-gate": 'MapPlutoNeighJoinOutput_ntacode__BK21_BK23_merge',
		"seaside": 'MapPlutoNeighJoinOutput_ntacode__QN10',
		"sheepshead-bay": 'MapPlutoNeighJoinOutput_ntacode__BK17_BK25_BK44_merge',
		"shore-acres": 'MapPlutoNeighJoinOutput_ntacode__SI08_SI35_SI37_merge',
		"silver-lake": 'MapPlutoNeighJoinOutput_ntacode__SI08_SI35_SI37_merge',
		"soho": 'MapPlutoNeighJoinOutput_ntacode__MN24',
		"soundview": 'MapPlutoNeighJoinOutput_ntacode__BX55_BX09_BX08_merge',
		"south-beach": 'MapPlutoNeighJoinOutput_ntacode__SI14_SI36_merge',
		"south-jamaica": 'MapPlutoNeighJoinOutput_ntacode__QN02_QN76_merge',
		"south-ozone-park": 'MapPlutoNeighJoinOutput_ntacode__QN55',
		"south-street-seaport": 'MapPlutoNeighJoinOutput_ntacode__MN25',
		"springfield-gardens": 'MapPlutoNeighJoinOutput_ntacode__QN03',
		"spuyten-duyvil": 'MapPlutoNeighJoinOutput_ntacode__BX29',
		"st-albans": 'MapPlutoNeighJoinOutput_ntacode__QN08',
		"st.-george": 'MapPlutoNeighJoinOutput_ntacode__SI22',
		"stapleton": 'MapPlutoNeighJoinOutput_ntacode__SI08_SI35_SI37_merge',
		"starrett-city": 'MapPlutoNeighJoinOutput_ntacode__BK82_BK85_BK93_merge',
		"stuy-town": 'MapPlutoNeighJoinOutput_ntacode__MN50',
		"sugar-hill": 'MapPlutoNeighJoinOutput_ntacode__MN04',
		"sunnyside": 'MapPlutoNeighJoinOutput_ntacode__QN31',
		"sunnyside-staten-island": 'MapPlutoNeighJoinOutput_ntacode__SI07',
		"sunset-park": 'MapPlutoNeighJoinOutput_ntacode__BK32_BK34_merge',
		"sutton-place": 'MapPlutoNeighJoinOutput_ntacode__MN19',
		"throgs-neck": 'MapPlutoNeighJoinOutput_ntacode__BX52',
		"times-square-theater-district": 'MapPlutoNeighJoinOutput_ntacode__MN17',
		"todt-hill": 'MapPlutoNeighJoinOutput_ntacode__SI24',
		"tompkinsville": 'MapPlutoNeighJoinOutput_ntacode__SI08_SI35_SI37_merge',
		"tottenville": 'MapPlutoNeighJoinOutput_ntacode__SI11',
		"travis": 'MapPlutoNeighJoinOutput_ntacode__SI05',
		"tremont-east-tremont": 'MapPlutoNeighJoinOutput_ntacode__BX17',
		"tribeca": 'MapPlutoNeighJoinOutput_ntacode__MN24',
		"turtle-bay": 'MapPlutoNeighJoinOutput_ntacode__MN19',
		"union-square": 'MapPlutoNeighJoinOutput_ntacode__MN13',
		"unionport": 'MapPlutoNeighJoinOutput_ntacode__BX59',
		"university-heights": 'MapPlutoNeighJoinOutput_ntacode__BX30_BX36_merge',
		"upper-east-side": 'MapPlutoNeighJoinOutput_ntacode__MN31_MN32_MN40_merge',
		"upper-west-side": 'MapPlutoNeighJoinOutput_ntacode__MN12_MN14_merge',
		"utopia": 'MapPlutoNeighJoinOutput_ntacode__QN41',
		"van-nest": 'MapPlutoNeighJoinOutput_ntacode__BX37',
		"vinegar-hill": 'MapPlutoNeighJoinOutput_ntacode__BK38',
		"wakefield": 'MapPlutoNeighJoinOutput_ntacode__BX62',
		"washington-heights": 'MapPlutoNeighJoinOutput_ntacode__MN35_MN36_merge',
		"wavecrest": 'MapPlutoNeighJoinOutput_ntacode__QN15',
		"west-brighton": 'MapPlutoNeighJoinOutput_ntacode__SI08_SI35_SI37_merge',
		"west-farms": 'MapPlutoNeighJoinOutput_ntacode__BX17',
		"west-harlem": 'MapPlutoNeighJoinOutput_ntacode__MN03_MN11_merge',
		"west-village": 'MapPlutoNeighJoinOutput_ntacode__MN23',
		"westchester-square": 'MapPlutoNeighJoinOutput_ntacode__BX37',
		"westerleigh": 'MapPlutoNeighJoinOutput_ntacode__SI07',
		"whitestone": 'MapPlutoNeighJoinOutput_ntacode__QN49',
		"willets-point": 'MapPlutoNeighJoinOutput_ntacode__QN22_QN52_QN62_merge',
		"williamsbridge": 'MapPlutoNeighJoinOutput_ntacode__BX44',
		"williamsburg": 'MapPlutoNeighJoinOutput_ntacode__BK72_BK73_BK90_merge',
		"willowbrook": 'MapPlutoNeighJoinOutput_ntacode__SI05',
		"windsor-terrace": 'MapPlutoNeighJoinOutput_ntacode__BK40',
		"woodhaven": 'MapPlutoNeighJoinOutput_ntacode__QN53',
		"woodlawn": 'MapPlutoNeighJoinOutput_ntacode__BX62',
		"woodrow": 'MapPlutoNeighJoinOutput_ntacode__SI32',
		"woodside": 'MapPlutoNeighJoinOutput_ntacode__QN63',
		"yorkville": 'MapPlutoNeighJoinOutput_ntacode__MN31_MN32_MN40_merge',
		"park-slope-south": 'MapPlutoNeighJoinOutput_ntacode__BK37',
		"alphabet-city": 'MapPlutoNeighJoinOutput_ntacode__MN22_MN27_MN28_merge',
		"nomad": 'MapPlutoNeighJoinOutput_ntacode__MN17',
		"tudor-city": 'MapPlutoNeighJoinOutput_ntacode__MN19',

	}

	if (lookup[neighborhood]) {			
		return lookup[neighborhood];
	} else {
		return 'MapPlutoNeighJoinOutput_ntacode__MN19';
	}

}


/* Style states */
mapApplication.initStyle = {
        weight: 0,
        opacity: 0,
        color: '#bdbdbd',
        fillOpacity: 0.5,
        fillColor: '#aaa'

    };

mapApplication.hovered = {
        weight: 0,
        opacity: 0,
        color: '#bdbdbd',
        fillOpacity: 0.8,
        fillColor: '#fc5158'
    };

mapApplication.clicked = {
		weight: 3,
		opacity: 1,
	    color: '#555',		
        fillOpacity: 0.8,
        fillColor: '#fc5158'
    };



/* Vars */
mapApplication.map;
// create a feature layer to use to write geojson to 
mapApplication.SELECTED = new L.FeatureGroup();
mapApplication.lastClickedLayer;



