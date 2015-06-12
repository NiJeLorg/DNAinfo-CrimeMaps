/**
 * chiShootingsApp.js: Sets global JS variables and initializes DNAinfo Chicago shootings map
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var CHISHOOTINGS = null;
var COMMUNITIES = null;
var MY_MAP = null;
var nearestCenterId = null;
var selectedMin = null;
var selectedMax = null;

$().ready(new function(){
    var myMap = new DNAinfoChiShootings();
    myMap.loadPointLayers();
    myMap.loadCommuninities();
    MY_MAP = myMap;
    DNAinfoChiShootings.slightPanUp();
});
