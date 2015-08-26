/**
 * controller.js: listeners and controllers for DNAinfo crime map
 * Author: NiJeL
 */



$( document ).ready(function() {

    $('.neighborhoodName').text(DNAinfoNYCNeighView.neighborhoodBabyName(neighborhoodLive));

    // toggle map layer listeners
	$( "#count" ).change(function() {
		if ($( "#count" ).prop('checked')) {
			DNAinfoNYCNeighView.addLayers('count');
		} else {
			DNAinfoNYCNeighView.removeLayers('count');
		}
	});

	$( "#all" ).change(function() {
		if ($( "#all" ).prop('checked')) {
			DNAinfoNYCNeighView.addLayers('all');
		} else {
			DNAinfoNYCNeighView.removeLayers('all');
		}
	});

	$( "#drawnCount" ).change(function() {
		DNAinfoNYCNeighView.updateGeojson();
	});

	


});
