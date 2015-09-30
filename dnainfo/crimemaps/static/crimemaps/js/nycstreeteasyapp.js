/**
 * nycstreeteasyapp.js: Sets global JS variables and initializes DNAinfo NYC streeeteasy app
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var ZIPS = null;
var activeLayer = 'sale';
var MY_MAP = null;

$().ready(new function(){
    var myMap = new DNAinfoNYCStreetEasy();
    myMap.loadSE();
    MY_MAP = myMap;
});

