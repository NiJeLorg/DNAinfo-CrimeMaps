/**
 * chiShootingsListeners.js: listeners and controllers for chi shootings map
 * Author: NiJeL
 */


$( document ).ready(function() {

	// update map when combo box is picked
	$( ".form-inline" ).change(function() {
		$("body").addClass("loading");
		DNAinfoChiShootings.updateMapFromSliderCombo();
	});

	// update slider and map afte button clicks
	$( "#yearToDate" ).click(function() {
		$("body").addClass("loading");
		selectedMin = moment().startOf('year').toDate();
		selectedMax = moment().toDate();
		updateSlider();
		DNAinfoChiShootings.updateMapFromSliderCombo();
	});

	$( "#previousSixMonths" ).click(function() {
		$("body").addClass("loading");
		selectedMin = moment().subtract(6, 'months').toDate();
		selectedMax = moment().toDate();
		updateSlider();
		DNAinfoChiShootings.updateMapFromSliderCombo();
	});

	$( "#previousYear" ).click(function() {
		$("body").addClass("loading");
		selectedMin = moment().subtract(1, 'years').toDate();
		selectedMax = moment().toDate();
		updateSlider();
		DNAinfoChiShootings.updateMapFromSliderCombo();
	});

	function updateSlider() {

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
					DNAinfoChiShootings.updateMapFromSliderCombo();
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

	}

	$('body').on('click', '#viewCitywide', function () {
		DNAinfoChiShootings.drawCitywideChart();	    
	});


});
