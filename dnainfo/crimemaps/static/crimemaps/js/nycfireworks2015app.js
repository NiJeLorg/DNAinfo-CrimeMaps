/**
 * nycfireworks2010to2014app.js: Sets global JS variables and initializes DNAinfo fireworks 2010 to 2014 app
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
    var myMap = new DNAinfoNYCFireworks2015();
    myMap.loadPointLayers();
    myMap.loadNeighborhoods();
    MY_MAP = myMap;
    DNAinfoNYCFireworks2015.slightPanUp();
});
