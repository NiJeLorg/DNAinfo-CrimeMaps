/**
 * controller.js: listeners and controllers for DNAinfo crime map
 * Author: NiJeL
 */


$( document ).ready(function() {

    $('.neighborhoodName').text(DNAinfoCHINeighShow.neighborhoodName(neighborhoodLive));

    var fbUrl = "https://visualizations.dnainfo.com/chineighshow/"+ id +"/";

    $('#showShareFB').click(function() { 
      FB.ui({
        method: 'share',
        display: 'popup',
        href: fbUrl,
      }, function(response){});
    });

    

});
