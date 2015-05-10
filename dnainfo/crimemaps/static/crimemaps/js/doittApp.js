/**
 * doittApp.js: Sets global JS variables and initializes DNAinfo doitt map
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var GRADPOINT = null;
var MY_MAP = null;
// set up a counter so we can assign an ID to each layer
var count = 0;
var nearestCenterId = null;


$().ready(new function(){
    var myMap = new DNAinfoDoittMap();
    myMap.loadPointLayers();
    myMap.loadPrecincts();
    MY_MAP = myMap;
    DNAinfoDoittMap.slightPanUp();		
});
