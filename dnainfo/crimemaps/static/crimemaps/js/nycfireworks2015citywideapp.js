/**
 * nycfireworks2015citywideapp.js: Sets global JS variables and initializes DNAinfo fireworks 2015 citywide app
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var FIREWORKS = null;
var HEATMAP = null;
var MY_MAP = null;
// set up a counter so we can assign an ID to each layer
var nearestCenterId = null;

$().ready(new function(){
    var myMap = new DNAinfoNYCFireworks2015citywide();
    myMap.loadPointLayers();
    myMap.loadNeighborhoods();
    MY_MAP = myMap;
});
