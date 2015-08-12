/* 
* Functions to create the main DNAinfo Crime Map
*/

// initialize map
function DNAinfoNYCNeighAll() {
	// set zoom and center for this map
	this.center = [40.710508, -73.943825];
	this.zoom = 10;

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
	
    // enable events
    this.map.doubleClickZoom.enable();
    this.map.scrollWheelZoom.enable();
	
	// empty containers for layers 
	this.ALLDRAWNGEOJSONS = null;

}

DNAinfoNYCNeighAll.onEachFeature_ALLDRAWNGEOJSONS = function(feature,layer){	

	layer.bindLabel('ID Number: ' + feature.properties.ID);
	
}

DNAinfoNYCNeighAll.prototype.loadAllDrawnGeojsons = function (){
	var thismap = this;
	$.ajax({
		type: "GET",
		url: "/allnycgeojsons/",
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
				    style: DNAinfoNYCNeighAll.getStyleFor_ALLDRAWNGEOJSONS,
					onEachFeature: DNAinfoNYCNeighAll.onEachFeature_ALLDRAWNGEOJSONS,
				});
				thismap.map.addLayer(thismap.ALLDRAWNGEOJSONS);
				thismap.ALLDRAWNGEOJSONS.bringToBack();
			} else {
				thismap.ALLDRAWNGEOJSONS = null;
			}
        }
	});

}

DNAinfoNYCNeighAll.getStyleFor_ALLDRAWNGEOJSONS = function (feature){
    return {
        weight: 4,
        opacity: 1,
        color: '#000',
        fillOpacity: 0.05,
        fillColor: '#bdbdbd'
    }
}
	
	
