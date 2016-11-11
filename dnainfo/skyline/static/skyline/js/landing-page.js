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
});
