/**
 * map.js: Creates map for selecting which pluto plot to use
 */

function miniMapApplication() {}

miniMapApplication.initialize = function (objid) {
	// set zoom and center for this map   
    this.map = new L.Map('minimap_'+objid, {
		minZoom:14,
		maxZoom:18,
    	center: [40.710508, -73.943825],
   	 	zoom: 16,
	});

	miniMapApplication.map[objid] = this.map;

	// get bounds and set maxBounds so user can't pan outside of a certain extent
	//this.bounds = this.map.getBounds().pad(1);
	//this.map.setMaxBounds(this.bounds);

	// set a tile layer to be CartoDB tiles 
	var CartoDBTiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png', { attribution: 'Map tiles by <a href=\"http://cartodb.com/attributions#basemaps\">CartoDB</a>, under <a href=\"https://creativecommons.org/licenses/by/3.0/\" target=\"_blank\">CC BY 3.0</a>. Data by <a href=\"http://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>, under ODbL.'
	});

	// add these tiles to our map
	this.map.addLayer(CartoDBTiles);


	//add pluto data to map
	miniMapApplication.getGeojson(this.map, objid);


}

miniMapApplication.getGeojson = function (map, objid) {
	$.ajax({
		type: "GET",
		url: "/skyline/admin/nyc/reporter/getGeojson/"+ objid +"/",
		success: function(data){
			// load the draw tools
			if (data) {
				var geojson = JSON.parse(data);

				miniMapApplication.geojson[objid] = L.geoJson(geojson, {
				    style: miniMapApplication.initStyle,
				}).addTo(map);

				// zoom to this plot
				map.fitBounds(miniMapApplication.geojson[objid].getBounds());

			} 
        }
	});
}


/* Style states */
miniMapApplication.initStyle = {
        weight: 0,
        opacity: 0,
        color: '#bdbdbd',
        fillOpacity: 0.8,
        fillColor: '#fc5158'
    };



/* Vars */
miniMapApplication.map = [];
miniMapApplication.geojson = [];



