/**
 * chicookcountyapp.js: Sets global JS variables and initializes DNAinfo Chicago cook county real estate map
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var CHISALES = null;
var COMMUNITIES = null;
var MY_MAP = null;
var selectedMin = null;
var selectedMax = null;

$().ready(new function(){
    var myMap = new DNAinfoChiCookCounty();
    myMap.loadPointLayers();
    myMap.loadCommuninities();
    MY_MAP = myMap;
});
