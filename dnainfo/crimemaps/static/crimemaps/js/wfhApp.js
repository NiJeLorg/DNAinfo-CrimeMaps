/**
 * compstatApp.js: Sets global JS variables and initializes DNAinfo compstat map
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var polyTopojson = null;
var POLYGONS = null;
var MY_MAP = null;
// set up a counter so we can assign an ID to each layer
var count = 0;

$().ready(new function(){
    var myMap = new DNAinfoWfhMap();
    myMap.loadPolyLayer();
    MY_MAP = myMap;	
    DNAinfoWfhMap.slightPanUp();		
});
