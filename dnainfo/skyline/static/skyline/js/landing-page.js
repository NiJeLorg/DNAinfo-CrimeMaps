/**
 * landing-page.js: basic JS for the landing page
 */

$(document).ready(function() {

    // fade in main image and search bar
    $(".fadein").fadeIn("slow");

    // set up select 2
    // remove form labels
    $('label').remove();
    // add a form-control class to the input, disabled attribute and placeholder text
    $('#id_whereBuilding').addClass("form-control");
    // don't allow a blank option
    $('#id_whereBuilding option[value=""]').remove();
    // initialize select 2
    $('.django-select2').djangoSelect2();
    // update placeholder text
    $('.select2-selection__placeholder').text("Select a Neighborhood");

    // for iOS, force blur to close keyboard if clicking away from the input field
    $(document).on('click', '#select2-drop', function(e) {
        document.activeElement.blur();
    });

    var approvedModalOpen = false;
    var proposedModalOpen = false;
    var sponsoredModalOpen = false;

    $('#openApprovedModal').click(function() {
        if (!approvedModalOpen) {
            $('#approvedModal').css('display', 'block');
            approvedModalOpen = true;
        } else {
            $('#approvedModal').css('display', 'none');
            approvedModalOpen = false;
        }
    });


    $('#openProposedModal').click(function() {
        if (!proposedModalOpen) {
            $('#proposedModal').css('display', 'block');
            proposedModalOpen = true;
        } else {
            $('#proposedModal').css('display', 'none');
            proposedModalOpen = false;
        }
    });


    $('#openSponsoredModal').click(function() {
        if (!sponsoredModalOpen) {
            $('#sponsoredModal').css('display', 'block');
            sponsoredModalOpen = true;
        } else {
            $('#sponsoredModal').css('display', 'none');
            sponsoredModalOpen = false;
        }
    });


    $('#closeApprovedModal').click(function() {
        $('#approvedModal').css('display', 'none');
        approvedModalOpen = false;
    });
    $('#closeProposedModal').click(function() {
        $('#proposedModal').css('display', 'none');
        proposedModalOpen = false;
    });
    $('#closeSponsoredModal').click(function() {
        $('#sponsoredModal').css('display', 'none');
        sponsoredModalOpen = false;
    });

    var $select2obj;
    var dropDownOpen = false;

    $('.chevron-button-top').click(function() {
        $select2obj = $('header .django-select2').djangoSelect2();
    });

    $('.chevron-button-bottom').click(function() {
        $select2obj = $('footer .django-select2').djangoSelect2();
    });


    $('.chevron-button').click(function() {
        if (!dropDownOpen) {
            $select2obj.select2("open");
            dropDownOpen = true;
        } else {
            $select2obj.select2("close");
            dropDownOpen = false;
        }
    });

    // submit the form on change
    $(document).on('change', '#id_whereBuilding', function(e) {
        $(this).closest('form').submit();
    });

    // set up facebook and twitter buttons
    var app_id = '406014149589534';
    var fbdescription = "Every new building affects the character of a neighborhood, so DNAinfo created this 3D map that helps you understand how high new buildings could be going up near you: "+ bitlyURL;
    var fblink = "https://visualizations.dnainfo.com/";
    var fbpicture = "https://editorial-ny.dnainfo.com/interactives/2016/aptshare.jpeg";
    var fbname = "3D Neighbohood Skyline";
    var fbcaption = "DNAinfo New York";
    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&description='+ encodeURIComponent(fbdescription) + '&link=' + encodeURIComponent(bitlyURL) + '&redirect_uri=' + encodeURIComponent(fblink) + '&name=' + encodeURIComponent(fbname) + '&caption=' + encodeURIComponent(fbcaption) + '&picture=' + encodeURIComponent(fbpicture);
    var fbOnclick = 'window.open("' + fbUrl + '","facebook-share-dialog","width=626,height=436");return false;';
    //$('#showShareFB').attr("href", fbUrl);
    $('#showShareFB').attr("onclick", fbOnclick);


    var twitterlink = bitlyURL;
    var via = 'DNAinfo';
    var twittercaption = "Every new building affects the character of a neighborhood, so DNAinfo created this 3D map that helps you understand how high new buildings could be going up near you:";
    var twitterUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + encodeURIComponent(twittercaption);
    var twitterOnclick = 'window.open("' + twitterUrl + '","twitter-share-dialog","width=626,height=436");return false;';
    //$('#showShareTwitter').attr("href", twitterUrl);
    $('#showShareTwitter').attr("onclick", twitterOnclick);



});
