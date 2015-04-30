/**
 * doittApp.js: Sets global JS variables and initializes DNAinfo doitt map
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var GRADPOINT = null;
var MY_MAP = null;

$().ready(new function(){
    var myMap = new DNAinfoDoittMap();
    myMap.loadPointLayers();
    MY_MAP = myMap;			
});
