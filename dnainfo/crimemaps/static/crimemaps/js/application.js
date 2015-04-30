/**
 * Application.js: Sets global JS variables and initializes DNAinfo crime map
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var mainLayer = null;
var polygonData = null;
var polyTopojson = null;
var POLYGONS = null;
var GRADPOINT = null;
var BLOTTER = null;
var clusterLocations = null;
var MY_MAP = null;


$().ready(new function(){
    var myMap = new DNAinfoCrimeMap();
    myMap.loadPolyLayer();
    myMap.loadPointLayers();
    MY_MAP = myMap;			
});
