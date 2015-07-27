/**
 * controller.js: listeners and controllers for DNAinfo crime map
 * Author: NiJeL
 */


$( document ).ready(function() {

    $('.neighborhoodName').text(DNAinfoNYCNeighShow.neighborhoodName(neighborhoodLive));


    $('#showShareFB').click(function() { 
      FB.ui({
        method: 'share',
        display: 'popup',
        href: 'https://visualizations.dnainfo.com/nycneighshow/{{ id }}/',
      }, function(response){});
    });

    

});
