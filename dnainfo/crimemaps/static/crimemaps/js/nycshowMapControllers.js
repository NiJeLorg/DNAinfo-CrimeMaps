/**
 * controller.js: listeners and controllers for DNAinfo crime map
 * Author: NiJeL
 */


$( document ).ready(function() {

    $('.neighborhoodName').text(DNAinfoNYCNeighShow.neighborhoodBabyName(neighborhoodLive));

    // update facebook meta content
    $("meta[property='og:description']").attr('content', "I'm a " + DNAinfoNYCNeighShow.neighborhoodBabyName(neighborhoodLive) + " expert & here's where I think the area begins and ends. Now draw your neighborhood.");

    // facebook link creation and appending
    var app_id = '406014149589534';
    var fbcaption = 'I\'m a '+ DNAinfoNYCNeighShow.neighborhoodBabyName(neighborhoodLive) +' expert & here\'s where I think the area begins and ends. Now draw your neighborhood: https://visualizations.dnainfo.com/nycneigh/ via https://www.facebook.com/dnainfo/';
    var fblink = 'https://visualizations.dnainfo.com/nycneighshow/'+ id +'/';
    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
    $('#showShareFB').attr("href", fbUrl);


    var twitterlink = 'https://visualizations.dnainfo.com/nycneighshow/'+ id +'/';
    var via = 'DNAinfo';
    var twittercaption = 'Here\'s where I think '+ DNAinfoNYCNeighShow.neighborhoodBabyName(neighborhoodLive) +'\'s borders are. Now draw your neighborhood.';
    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + encodeURIComponent(twittercaption);
    $('#showShareTwitter').attr("href", twitterUrl);
    
});
