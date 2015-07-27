/**
 * controller.js: listeners and controllers for DNAinfo crime map
 * Author: NiJeL
 */


$( document ).ready(function() {

    $('.neighborhoodName').text(DNAinfoNYCNeighShow.neighborhoodName(neighborhoodLive));

    var fbUrl = "https://visualizations.dnainfo.com/nycneighshow/{{ id }}/";

    $('#showShareFB').click(function() { 
      FB.ui({
        method: 'share',
        display: 'popup',
        href: fbUrl,
      }, function(response){});
    });

    

});
