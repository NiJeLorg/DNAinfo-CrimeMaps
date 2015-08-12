/**
 * nycfireworks2015citywideapp.js: Sets global JS variables and initializes DNAinfo fireworks 2015 citywide app
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var ALLDRAWNGEOJSONS = null;
var MY_MAP = null;

$().ready(new function(){
    var myMap = new DNAinfoCHINeigh();
    //myMap.loadNeighborhoods();
    myMap.loadAllDrawnGeojsons();
    MY_MAP = myMap;
});
