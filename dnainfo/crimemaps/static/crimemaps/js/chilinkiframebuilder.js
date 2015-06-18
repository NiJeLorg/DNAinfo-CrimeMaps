/**
 * chilinkiframebuilder.js: simple creator of urls and iframes for Chicago dna info crime map admin area
 * Author: NiJeL
 */


$( document ).ready(function() {

	$('.input-daterange').datepicker({
	    todayHighlight: true,
	    endDate: "today",
	    todayBtn: true,
	    clearBtn: true,
	    startView: 2
	});

	$('.input-daterange').change(function() {
		// get start and end dates
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();
		var url = 'https://visualizations.dnainfo.com/chishootings/?startDate=' + encodeURIComponent(startDate) + '&endDate=' + encodeURIComponent(endDate);
		// add to compstatUrl div
		$('#chiShootingsUrl').html('<p><strong>URL: </strong><pre><a href="' + url + '">' + url + '</a></pre></p>');

		$('#chiShootingsIframe').html('<p>This iframe enbedded in a DNAinfo article will automatically center on the neighborhood in the article\'s URL</p><p><strong>iframe: </strong><pre>&lt;iframe frameborder="0" height="700" marginheight="0" marginwidth="0" src="'+ url +'" width="100%" style="border: 1px solid #A9A9A9;"&gt;&lt;/iframe&gt;</pre></p>');

	});

});
