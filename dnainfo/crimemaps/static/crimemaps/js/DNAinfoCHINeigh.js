/* 
* Functions to create the main DNAinfo Crime Map
*/

// initialize map
function DNAinfoCHINeigh() {
	// set zoom and center for this map
	this.center = [41.848614, -87.684616];
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

DNAinfoCHINeigh.onEachFeature_ALLDRAWNGEOJSONS = function(feature,layer){	

	layer.bindLabel('ID Number: ' + feature.properties.ID + '<br />Neighborhood Name: ' + feature.properties.neighborhoodLive + '<br />Other Neighborhood: ' + feature.properties.otherNeighborhood);

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

    layer.on('click', function(ev) {
    	console.log(feature.properties.ID);

	    $.ajax({
			type: "GET",
			url: "/removechidrawngeojsonbyid/"+ feature.properties.ID + "/" ,
			success: function(data){
				window.location.reload(true); 
	        }
		});

    });

	
}

DNAinfoCHINeigh.prototype.loadAllDrawnGeojsons = function (){
	var thismap = this;
	$.ajax({
		type: "GET",
		url: "/chigeojsonsbyneigh/"+ neighborhoodLive + "/",
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
				    style: DNAinfoCHINeigh.getStyleFor_ALLDRAWNGEOJSONS,
					onEachFeature: DNAinfoCHINeigh.onEachFeature_ALLDRAWNGEOJSONS,
				});
				thismap.map.addLayer(thismap.ALLDRAWNGEOJSONS);
				thismap.ALLDRAWNGEOJSONS.bringToBack();
			} else {
				thismap.ALLDRAWNGEOJSONS = null;
			}
        }
	});

}

DNAinfoCHINeigh.getStyleFor_ALLDRAWNGEOJSONS = function (feature){
    return {
        weight: 1,
        opacity: 0.75,
        color: '#191975',
        fillOpacity: 0,
        fillColor: '#bdbdbd'
    }
}
	
	
