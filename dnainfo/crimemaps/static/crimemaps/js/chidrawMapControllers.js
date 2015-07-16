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

});
