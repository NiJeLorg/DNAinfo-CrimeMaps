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
// var minTimeSelected = null;
// var maxTimeSelected = null;
// var minPriceSelected = null;
// var maxPriceSelected = null;
// var priceFormatSlider = d3.format("$s");
// var priceFormat = d3.format("$,.0f");
var panorama = null;

$().ready(new function(){
    var myMap = new DNAinfoChiCookCounty();
    myMap.loadPointLayers();
    myMap.loadCommuninities();
    MY_MAP = myMap;
});
