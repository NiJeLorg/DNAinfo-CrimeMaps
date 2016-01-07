/**
 * chiShootingsListeners.js: listeners and controllers for chi shootings map
 * Author: NiJeL
 */


$( document ).ready(function() {

	// populate start and end date box
	$('#startDate').val(moment(startDate).format("M/D/YYYY"));
	$('#endDate').val(moment(endDate).format("M/D/YYYY"));

	// update map when combo box is picked
	$( ".form-inline" ).change(function() {
		$("body").addClass("loading");
		selectedMin = $('#startDate').val();
		selectedMax = $('#endDate').val();
		DNAinfoChiShootings.updateMap();
	});

	// adding bootstrap date picker in lieu of date range slider
	$('.input-daterange').datepicker({
		format: 'm/d/yyyy',
	    todayHighlight: true,
	    endDate: "today",
	    todayBtn: true,
	    clearBtn: false,
	    startView: 3
	});

	$('.input-daterange').change(function() {
		// get start and end dates
		$("body").addClass("loading");
		selectedMin = $('#startDate').val();
		selectedMax = $('#endDate').val();
		DNAinfoChiShootings.updateMap();
	});

	$('body').on('click', '#viewCitywide', function () {
		DNAinfoChiShootings.drawCitywideChart();	    
	});

	// expand/contract lower tray
	$('#popup-expand').click(function() {
		$( ".popup-wrapper" ).toggleClass("popup-wrapper-open");
		$( ".popup-wrapper" ).toggleClass("popup-wrapper-75pct");
		$( ".map" ).toggleClass("map-popup-wrapper-open");
		$( ".map" ).toggleClass("map-popup-wrapper-75pct");
		var text = $('#popup-expand').text();
		$('#popup-expand').text(text == "Expand this window" ? "Contract this window" : "Expand this window");
	});


	// update slider and map after button clicks
	// removed buttons -- keeping code to put back if neccesary
/*	$( "#yearToDate" ).click(function() {
		$("body").addClass("loading");
		selectedMin = moment().startOf('year').toDate();
		selectedMax = moment().toDate();
		updateSlider();
		DNAinfoChiShootings.updateMap();
	});

	$( "#previousSixMonths" ).click(function() {
		$("body").addClass("loading");
		selectedMin = moment().subtract(6, 'months').toDate();
		selectedMax = moment().toDate();
		updateSlider();
		DNAinfoChiShootings.updateMap();
	});

	$( "#previousYear" ).click(function() {
		$("body").addClass("loading");
		selectedMin = moment().subtract(1, 'years').toDate();
		selectedMax = moment().toDate();
		updateSlider();
		DNAinfoChiShootings.updateMap();
	});*/

/*	function updateSlider() {

		var minDate = new Date(2010,0,1);
		var maxDate = moment().toDate();

	  	// destroy the old slider
	  	d3.select('#timeSlider').selectAll("*").remove();

	  	// recreate slider
		mapSlider = d3.slider()
				.axis(
					d3.svg.axis()
						.orient("top")
						.scale(
							d3.time.scale()
								.domain([minDate, maxDate])
						)
						.ticks(d3.time.years)
						.tickSize(24, 0)
						.tickFormat(d3.time.format("%Y"))
				)
				.scale(
					d3.time.scale()
						.domain([minDate, maxDate])
				)
				.value( [ selectedMin, selectedMax ] )
				.on("slideend", function(evt, value) {
					$("body").addClass("loading");
					// run a function to update map layers with new dates
					selectedMin = value[0];
					selectedMax = value[1];
					DNAinfoChiShootings.updateMap();
					// add formated dates selected to area right below slider
					$('#printStartDate').html(moment(selectedMin).format("MMM D, YYYY"));
					$('#printEndDate').html(moment(selectedMax).format("MMM D, YYYY"));

				})
				.on("slide", function(evt, value) {
					// run a function to update map layers with new dates
					selectedMin = value[0];
					selectedMax = value[1];
					// add formated dates selected to area right below slider
					$('#printStartDate').html(moment(selectedMin).format("MMM D, YYYY"));
					$('#printEndDate').html(moment(selectedMax).format("MMM D, YYYY"));
				});

		d3.select('#timeSlider').call(mapSlider);

	}*/



});
