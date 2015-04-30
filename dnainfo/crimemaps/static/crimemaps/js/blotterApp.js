/**
 * blotterApp.js: Sets global JS variables and initializes DNAinfo blotter map
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var BLOTTER = null;
var MY_MAP = null;

$().ready(new function(){
    var myMap = new DNAinfoBlotterMap();
    myMap.loadPointLayers();
    MY_MAP = myMap;			
});
