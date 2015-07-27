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
      DNAinfoCHINeighDraw.imFinished();
    });

    $('#startOver').click(function() {
      DNAinfoCHINeighDraw.startOver();
    });

    $('.neighborhoodName').text(DNAinfoCHINeighDraw.neighborhoodName(neighborhoodLive));

    // add glyphicon to draw polygon tool
    $('.leaflet-draw-draw-polygon').append("<span class=\"glyphicon glyphicon-pencil red-pencil\" aria-hidden=\"true\"></span>");

    var fbUrl = "https://visualizations.dnainfo.com/chineighshow/"+ id +"/";

    $('#shareFB').click(function() { 
      FB.ui({
        method: 'share',
        display: 'popup',
        href: fbUrl,
      }, function(response){});
    });

});
