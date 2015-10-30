/**
 * nycstreeteasyapp.js: Sets global JS variables and initializes DNAinfo NYC streeeteasy app
 * Author: NiJeL
 */

/*
  On DOM load handlers
 */
var ZIPS = null;
var activeLayer = 'rent';
var MY_MAP = null;
var selectedQ = moment(dateperiod, "MMM. DD, YYYY").toDate();

$().ready(new function(){
    var myMap = new DNAinfoNYCStreetEasy();
    myMap.loadSE();
    MY_MAP = myMap;
});

