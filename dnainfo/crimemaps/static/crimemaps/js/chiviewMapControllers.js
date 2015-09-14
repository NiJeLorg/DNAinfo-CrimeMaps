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
	} else if (countDrawnNeighborhoods > 5) {
		$( "#all" ).prop('checked', true);
		$("#shapeControls").removeClass('hidden');
		$("#drawNeighButton").removeClass('hidden');
	} else if (countDrawnNeighborhoods > 0) {
		$( "#all" ).prop('checked', true);
		$("#shapeControls").removeClass('hidden');
		$("#drawNeighButton").removeClass('hidden');
	} else {
		$("#nobodysDrawn").removeClass('hidden');
		$("#drawNeighButton").removeClass('hidden');
	}

	// swap out how to use this map text if drawn shapes are less than 25
	if (countDrawnNeighborhoods < 25) {
		$("#howToUseThisMap").html("<h4>How to Use This Map:</h4><p>Hover or tap on sections of the map above to see how readers drew " + DNAinfoCHINeighView.neighborhoodBabyName(neighborhood) + ".</p>");
	}


	// expand/contract lower tray
	$('#popup-expand').click(function() {
		$( ".popup-wrapper" ).toggleClass("popup-wrapper-open");
		$( ".popup-wrapper" ).toggleClass("popup-wrapper-75pct");
		$( ".map" ).toggleClass("map-popup-wrapper-open");
		$( ".map" ).toggleClass("map-popup-wrapper-75pct");
		var text = $('#popup-expand').text();
		$('#popup-expand').text(text == "Expand this window" ? "Contract this window" : "Expand this window");
	});
	


});
