/**
 * controller.js: listeners and controllers for DNAinfo crime map
 * Author: NiJeL
 */



$( document ).ready(function() {

    $('.neighborhoodName').text(DNAinfoCHINeighView.neighborhoodBabyName(neighborhood));

    // toggle map layer listeners
	$( "#count" ).change(function() {
		if ($( "#count" ).prop('checked')) {
			DNAinfoCHINeighView.addLayers('count');
		} else {
			DNAinfoCHINeighView.removeLayers('count');
		}
	});

	$( "#all" ).change(function() {
		if ($( "#all" ).prop('checked')) {
			DNAinfoCHINeighView.addLayers('all');
		} else {
			DNAinfoCHINeighView.removeLayers('all');
		}
	});

	$( "#drawnCount" ).change(function() {
		DNAinfoCHINeighView.updateGeojson();
	});


	$( "#howThisMapWasMadeTitle" ).click(function() {
		$( "#howThisMapWasMade" ).removeClass('hidden');
	});

	// remove items if there are less than 25 drawn shapes
	if (countDrawnNeighborhoods >= 25) {
		$("#legendWrapper").removeClass('hidden');
		$("#countControls").removeClass('hidden');
		$("#shapeControls").removeClass('hidden');
	} else if (countDrawnNeighborhoods > 0) {
		$( "#all" ).prop('checked', true);
		$("#shapeControls").removeClass('hidden');
	} else {
		$("#nobodysDrawn").removeClass('hidden');

	}
	


});
