/**
 * nycfireworks2015citywideapp.js: Sets global JS variables and initializes DNAinfo fireworks 2015 citywide app
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var NEIGHBORHOODS = null;
var ALLDRAWNGEOJSONS = null;
var MY_MAP = null;

$().ready(new function(){
    var myMap = new DNAinfoCHINeighView();
    myMap.loadAllDrawnGeojsons();
	myMap.loadCountGeojson();
    MY_MAP = myMap;
});

