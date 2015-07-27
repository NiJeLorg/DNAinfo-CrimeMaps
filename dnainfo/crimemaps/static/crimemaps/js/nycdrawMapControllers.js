/**
 * controller.js: listeners and controllers for DNAinfo crime map
 * Author: NiJeL
 */


$( document ).ready(function() {

    $('#introduction').modal('show');
    $('#closeIntroModal').click(function() {
      $('#introduction').modal('hide');
    });

    $('#imFinished').click(function() {
      DNAinfoNYCNeighDraw.imFinished();
    });

    $('#startOver').click(function() {
      DNAinfoNYCNeighDraw.startOver();
    });

    $('.neighborhoodName').text(DNAinfoNYCNeighDraw.neighborhoodName(neighborhoodLive));

    // add glyphicon to draw polygon tool
    $('.leaflet-draw-draw-polygon').append("<span class=\"glyphicon glyphicon-pencil red-pencil\" aria-hidden=\"true\"></span>");


    var fbUrl = "https://visualizations.dnainfo.com/nycneighshow/"+ id +"/";

    $('#shareFB').click(function() { 
      FB.ui({
        method: 'share',
        display: 'popup',
        href: fbUrl,
      }, function(response){});
    });

    

});
