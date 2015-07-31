/**
 * controller.js: listeners and controllers for DNAinfo crime map
 * Author: NiJeL
 */


$( document ).ready(function() {

    if (L.Browser.touch) {
      $('#introductionTouch').modal('show');
      $('#closeIntroModalTouch').click(function() {
        $('#introductionTouch').modal('hide');
      });
    } else {
      $('#introduction').modal('show');
      $('#closeIntroModal').click(function() {
        $('#introduction').modal('hide');
      });
    }

  
    $('#imFinished').click(function() {
      DNAinfoNYCNeighDraw.imFinished();
    });

    $('#startOver').click(function() {
      DNAinfoNYCNeighDraw.startOver();
    });

    $('.neighborhoodName').text(DNAinfoNYCNeighDraw.neighborhoodBabyName(neighborhoodLive));

    // add glyphicon to draw polygon tool
    $('.leaflet-draw-draw-polygon').append("<span class=\"glyphicon glyphicon-pencil red-pencil\" aria-hidden=\"true\"></span>");

    // facebook link creation and appending
    var app_id = '406014149589534';
    var fbcaption = 'I\'m a '+ DNAinfoNYCNeighDraw.neighborhoodBabyName(neighborhoodLive) +' expert & here\'s where I think the area begins and ends. Now draw your neighborhood: https://visualizations.dnainfo.com/nycneigh/ via https://www.facebook.com/dnainfo/';
    var fblink = 'https://visualizations.dnainfo.com/nycneighshow/'+ id +'/';
    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
    $('#facebookButtonModal').attr("href", fbUrl);
    $('#showShareFB').attr("href", fbUrl);


    var twitterlink = 'https://visualizations.dnainfo.com/nycneighshow/'+ id +'/';
    var via = 'DNAinfo';
    var twittercaption = 'Here\'s where I think '+ DNAinfoNYCNeighDraw.neighborhoodBabyName(neighborhoodLive) +'\'s borders are. Now draw your neighborhood: https://visualizations.dnainfo.com/nycneigh/';
    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + encodeURIComponent(twittercaption);
    $('#twitterButtonModal').attr("href", twitterUrl);
    $('#showShareTwitter').attr("href", twitterUrl);



});
