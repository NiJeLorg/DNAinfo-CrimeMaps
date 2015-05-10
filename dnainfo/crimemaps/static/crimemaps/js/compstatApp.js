/**
 * compstatApp.js: Sets global JS variables and initializes DNAinfo compstat map
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var polygonData = null;
var polyTopojson = null;
var POLYGONS = null;
var MY_MAP = null;
// set up a counter so we can assign an ID to each layer
var count = 0;
var firstMouseOver = true;

$().ready(new function(){
    var myMap = new DNAinfoCompstatMap();
    myMap.loadPolyLayer();
    MY_MAP = myMap;			
});
