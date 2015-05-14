/**
 * linkiframebuilder.js: simple creator of urls and iframes for dna info crime map admin area
 * Author: NiJeL
 */


$( document ).ready(function() {

	$('.compstatLink').click(function() {
		// get start and end dates
		var startDate = $(this).data("start-date");
		var endDate = $(this).data("end-date");
		var url = 'https://visualizations.dnainfo.com/compstat/?startDate=' + encodeURIComponent(startDate) + '&endDate=' + encodeURIComponent(endDate);
		// add to compstatUrl div
		$('#compstatUrl').html('<p><strong>URL: </strong><pre><a href="' + url + '">' + url + '</a></pre></p>');

		$('#comsptatIframe').html('<p>This iframe enbedded in a DNAinfo article will automatically center on the neighborhood in the article\'s URL</p><p><strong>iframe: </strong><pre>&lt;iframe frameborder="0" height="700" marginheight="0" marginwidth="0" src="'+ url +'" width="100%" style="border: 1px solid #A9A9A9;"&gt;&lt;/iframe&gt;</pre></p>');

		$('#compstatMap').html('four weeks ending on ' + endDate + ' <span class="caret"></span>');

	});

	$('.doittLink').click(function() {
		// get start and end dates
		var monthYear = $(this).data("month-year");
		var url = 'https://visualizations.dnainfo.com/doitt/?monthYear=' + encodeURIComponent(monthYear);
		// add to compstatUrl div
		$('#doittUrl').html('<p><strong>URL: </strong><pre><a href="' + url + '">' + url + '</a></pre></p>');

		$('#doittIframe').html('<p>This iframe enbedded in a DNAinfo article will automatically center on the neighborhood in the article\'s URL</p><p><strong>iframe: </strong><pre>&lt;iframe frameborder="0" height="700" marginheight="0" marginwidth="0" src="'+ url +'" width="100%" style="border: 1px solid #A9A9A9;"&gt;&lt;/iframe&gt;</pre></p>');

		$('#doittMap').html(monthYear + ' <span class="caret"></span>');

	});

	$('.blotterLink').click(function() {
		// get start and end dates
		var startDate = $(this).data("start-date");
		var endDate = $(this).data("end-date");
		var url = 'https://visualizations.dnainfo.com/blotter/?startDate=' + encodeURIComponent(startDate) + '&endDate=' + encodeURIComponent(endDate);
		// add to compstatUrl div
		$('#blotterUrl').html('<p><strong>URL: </strong><pre><a href="' + url + '">' + url + '</a></pre></p>');

		$('#blotterIframe').html('<p>This iframe enbedded in a DNAinfo article will automatically center on the neighborhood in the article\'s URL</p><p><strong>iframe: </strong><pre>&lt;iframe frameborder="0" height="700" marginheight="0" marginwidth="0" src="'+ url +'" width="100%" style="border: 1px solid #A9A9A9;"&gt;&lt;/iframe&gt;</pre></p>');

		$('#blotterMap').html(startDate + ' - ' + endDate + ' <span class="caret"></span>');

	});


});
