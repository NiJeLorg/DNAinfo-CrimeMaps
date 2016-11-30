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

    // initializa select 2 objects
    var $select2objTop = $('#headerSelect2 .django-select2').djangoSelect2();
    var $select2objBottom = $('#footerSelect2 .django-select2').djangoSelect2();

    // update placeholder text
    setTimeout(function() {
        $('.select2-selection__placeholder').text("Select a Neighborhood");
    }, 100);


    // for iOS, force blur to close keyboard if clicking away from the input field
    $(document).on('click touchstart', '#select2-drop', function(e) {
        document.activeElement.blur();
    });

    // for iOS, force blur on every a tag click
    $(document).on('click touchstart', 'a', function() {
        // ensure iOS keyboard is closed
        document.activeElement.blur(); 
    });

    // ensure that methodology modal shows up at the top of the window, not at the top of the iframe
    $('#methodologyLink').on('mousedown', function (event) {
	    event.preventDefault();
	    $('#methodology').data('y', event.pageY); // store the mouseY position
	    $('#methodology').modal('show');
	});
    $('#methodology').on('show.bs.modal', function (e) {
	    var y = $('#methodology').data('y'); // gets the mouseY position
	    console.log(y);
	    $('#methodology').css('top', y);
    });


    var approvedModalOpen = false;
    var proposedModalOpen = false;
    var sponsoredModalOpen = false;

	$(document).on('click touchstart', '#openApprovedModal', function() {
        if (!approvedModalOpen) {
            $('#approvedModal').css('display', 'block');
            approvedModalOpen = true;
        } else {
            $('#approvedModal').css('display', 'none');
            approvedModalOpen = false;
        }
        // ensure iOS keyboard is closed
        document.activeElement.blur(); 
    });


	$(document).on('click touchstart', '#openProposedModal', function() {
        if (!proposedModalOpen) {
            $('#proposedModal').css('display', 'block');
            proposedModalOpen = true;
        } else {
            $('#proposedModal').css('display', 'none');
            proposedModalOpen = false;
        }
        // ensure iOS keyboard is closed
        document.activeElement.blur(); 
    });


	$(document).on('click touchstart', '#openSponsoredModal', function() {
        if (!sponsoredModalOpen) {
            $('#sponsoredModal').css('display', 'block');
            sponsoredModalOpen = true;
        } else {
            $('#sponsoredModal').css('display', 'none');
            sponsoredModalOpen = false;
        }
        // ensure iOS keyboard is closed
        document.activeElement.blur(); 
    });


	$(document).on('click touchstart', '#closeApprovedModal', function() {
        $('#approvedModal').css('display', 'none');
        approvedModalOpen = false;
        // ensure iOS keyboard is closed
        document.activeElement.blur(); 
    });
	$(document).on('click touchstart', '#closeProposedModal', function() {
        $('#proposedModal').css('display', 'none');
        proposedModalOpen = false;
        // ensure iOS keyboard is closed
        document.activeElement.blur(); 
    });
	$(document).on('click touchstart', '#closeSponsoredModal', function() {
        $('#sponsoredModal').css('display', 'none');
        sponsoredModalOpen = false;
        // ensure iOS keyboard is closed
        document.activeElement.blur(); 
    });

    var dropDownOpenTop = false;
    var dropDownOpenBottom = false;

	$(document).on('click touchstart', '.chevron-button-top', function() {
        if (!dropDownOpenTop) {
            $select2objTop.select2("open");
            dropDownOpenTop = true;
        } else {
            $select2objTop.select2("close");
            dropDownOpenTop = false;
            // ensure iOS keyboard is closed
            document.activeElement.blur(); 
        }        
    });

	$(document).on('click touchstart', '.chevron-button-bottom', function() {
        if (!dropDownOpenBottom) {
            $select2objBottom.select2("open");
            dropDownOpenBottom = true;
        } else {
            $select2objBottom.select2("close");
            dropDownOpenBottom = false;
            // ensure iOS keyboard is closed
            document.activeElement.blur(); 
        } 
    });


    // submit the form on change
    $(document).on('change', '#id_whereBuilding', function(e) {
        // ensure iOS keyboard is closed
        document.activeElement.blur(); 
        $(this).closest('form').submit();
    });

    // set up facebook and twitter buttons
    var app_id = '406014149589534';
    var fbdescription = "Every new building affects the character of a neighborhood, so DNAinfo created this 3-D map that helps you understand how high new buildings could be going up near you: "+ bitlyURL;
    var fblink = "https://visualizations.dnainfo.com/";
    var fbpicture = "https://visualizations.dnainfo.com/visualizations/static/skyline/css/images/FUTURE_SKYLINE_SOCIAL_SHARE.jpeg";
    var fbname = "Going Up! How Tall Will New Buildings in My Neighborhood Be?";
    var fbcaption = "DNAinfo New York";
    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&description='+ encodeURIComponent(fbdescription) + '&link=' + encodeURIComponent(bitlyURL) + '&redirect_uri=' + encodeURIComponent(fblink) + '&name=' + encodeURIComponent(fbname) + '&caption=' + encodeURIComponent(fbcaption) + '&picture=' + encodeURIComponent(fbpicture);
    var fbOnclick = 'window.open("' + fbUrl + '","facebook-share-dialog","width=626,height=436");return false;';
    //$('#showShareFB').attr("href", fbUrl);
    $('#showShareFB').attr("onclick", fbOnclick);


    var twitterlink = bitlyURL;
    var via = 'DNAinfo';
    var twittercaption = "This 3-D map shows what construction will do to my neighborhood's skyline: ";
    var twitterUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + encodeURIComponent(twittercaption);
    var twitterOnclick = 'window.open("' + twitterUrl + '","twitter-share-dialog","width=626,height=436");return false;';
    //$('#showShareTwitter').attr("href", twitterUrl);
    $('#showShareTwitter').attr("onclick", twitterOnclick);



});
