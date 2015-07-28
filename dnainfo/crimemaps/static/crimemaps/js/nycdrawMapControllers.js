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

    $('.neighborhoodName').text(DNAinfoNYCNeighDraw.neighborhoodBabyName(neighborhoodLive));

    // add glyphicon to draw polygon tool
    $('.leaflet-draw-draw-polygon').append("<span class=\"glyphicon glyphicon-pencil red-pencil\" aria-hidden=\"true\"></span>");


});
