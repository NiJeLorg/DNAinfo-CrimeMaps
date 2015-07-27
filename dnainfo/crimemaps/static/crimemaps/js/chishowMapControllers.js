/**
 * controller.js: listeners and controllers for DNAinfo crime map
 * Author: NiJeL
 */


$( document ).ready(function() {

    $('.neighborhoodName').text(DNAinfoCHINeighShow.neighborhoodName(neighborhoodLive));


    $('#showShareFB').click(function() { 
      FB.ui({
        method: 'share',
        display: 'popup',
        href: 'https://visualizations.dnainfo.com/chineighshow/{{ id }}/',
      }, function(response){});
    });

    

});
