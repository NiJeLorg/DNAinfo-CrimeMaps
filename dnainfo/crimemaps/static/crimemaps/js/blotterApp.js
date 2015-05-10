/**
 * blotterApp.js: Sets global JS variables and initializes DNAinfo blotter map
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var BLOTTER = null;
var MY_MAP = null;
// set up a counter so we can assign an ID to each layer
var count = 0;
var nearestCenterId = null;

$().ready(new function(){
    var myMap = new DNAinfoBlotterMap();
    myMap.loadPointLayers();
    myMap.loadPrecincts();
    MY_MAP = myMap;
    DNAinfoBlotterMap.slightPanUp();
});
