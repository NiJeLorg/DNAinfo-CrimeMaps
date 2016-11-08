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

    $('#openApprovedModal').click(function() {
        $('#approvedModal').css('display', 'block');
    });
    $('#openProposedModal').click(function() {
        $('#proposedModal').css('display', 'block');
    });
    $('#openSponsoredModal').click(function() {
        $('#sponsoredModal').css('display', 'block');
    });
    $('#closeApprovedModal').click(function() {
        $('#approvedModal').css('display', 'none');
    });
    $('#closeProposedModal').click(function() {
        $('#proposedModal').css('display', 'none');
    });
    $('#closeSponsoredModal').click(function() {
        $('#sponsoredModal').css('display', 'none');
    });

    var $select2obj;

    $('.chevron-button-top').click(function() {
        $select2obj = $('header .django-select2').djangoSelect2();
    });

    $('.chevron-button-bottom').click(function() {
        $select2obj = $('footer .django-select2').djangoSelect2();
    });


    $('.chevron-button').click(function() {
        $select2obj.select2("open");
        console.log($select2obj);
    });
});
