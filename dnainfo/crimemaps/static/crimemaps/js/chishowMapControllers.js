/**
 * controller.js: listeners and controllers for DNAinfo crime map
 * Author: NiJeL
 */


$( document ).ready(function() {

    $('.neighborhoodName').text(DNAinfoCHINeighShow.neighborhoodBabyName(neighborhoodLive));

    // facebook link creation and appending
    var app_id = '406014149589534';
    var fbcaption = 'I\'m a '+ DNAinfoCHINeighShow.neighborhoodBabyName(neighborhoodLive) +' expert & here\'s where I think the area begins and ends. Now draw your neighborhood: https://visualizations.dnainfo.com/chineigh/ via https://www.facebook.com/dnainfo/';
    var fblink = 'https://visualizations.dnainfo.com/chineighshow/'+ id +'/';
    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
    $('#showShareFB').attr("href", fbUrl);


    var twitterlink = 'https://visualizations.dnainfo.com/chineighshow/'+ id +'/';
    var via = 'DNAinfo';
    var twittercaption = 'Here\'s where I think '+ DNAinfoCHINeighShow.neighborhoodBabyName(neighborhoodLive) +'\'s borders are. Now draw your neighborhood: https://visualizations.dnainfo.com/chineigh/';
    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + encodeURIComponent(twittercaption);
    $('#showShareTwitter').attr("href", twitterUrl);

});
