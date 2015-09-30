/**
 * chizillowapp.js: Sets global JS variables and initializes DNAinfo Chicago zillow app
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var ZIPS = null;
var activeLayer = 'sale';
var MY_MAP = null;

$().ready(new function(){
    var myMap = new DNAinfoCHIZillow();
    myMap.loadZillow();
    MY_MAP = myMap;
});

