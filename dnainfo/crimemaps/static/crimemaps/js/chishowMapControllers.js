/**
 * controller.js: listeners and controllers for DNAinfo crime map
 * Author: NiJeL
 */


$( document ).ready(function() {

    $('.neighborhoodName').text(DNAinfoCHINeighShow.neighborhoodBabyName(neighborhoodLive));

    // update facebook meta content
    //$("meta[property='og:description']").attr('content', "I'm a " + DNAinfoCHINeighShow.neighborhoodBabyName(neighborhoodLive) + " expert & here's where I think the area begins and ends. Now draw your neighborhood.");

    // facebook link creation and appending
    var app_id = '406014149589534';
    var fbcaption = 'I\'m a '+ DNAinfoCHINeighShow.neighborhoodBabyName(neighborhoodLive) +' expert & here\'s where I think the area begins and ends. Now draw your neighborhood: https://visualizations.dnainfo.com/chineigh/ via https://www.facebook.com/DNAinfoChicago';
    var fblink = 'https://visualizations.dnainfo.com/chineighshow/'+ id +'/';
    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
    $('#showShareFB').attr("href", fbUrl);


    var twitterlink = 'https://visualizations.dnainfo.com/chineighshow/'+ id +'/';
    var via = 'DNAinfoCHI';
    var twittercaption = 'Here\'s where I think '+ DNAinfoCHINeighShow.neighborhoodBabyName(neighborhoodLive) +'\'s borders are. Now draw your neighborhood.';
    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + encodeURIComponent(twittercaption);
    $('#showShareTwitter').attr("href", twitterUrl);

    $('.share').click(function() {
        $('#shareThankYou').modal('show');
    });


});
