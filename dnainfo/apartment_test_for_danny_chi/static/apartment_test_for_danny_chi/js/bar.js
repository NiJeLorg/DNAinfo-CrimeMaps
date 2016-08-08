/**
 * bar.js: Draws results page horizonatal bar chart
 */

function drawBars() {}

drawBars.initialize = function () {
	// set up dataset
	if (bedrooms == 0) {
		var bedroomsText = "studio";
	} else if (bedrooms <= 4) {
		var bedroomsText = bedrooms + "-bedroom";
	} else {
		var bedroomsText = "5+ bedroom";		
	} 

	if (todayType == "Citywide") {
		var whereText = " Citywide";
	} else {
		var whereText = " in " + todayType;
	}

	if (usingzri == "True") {
		var todayLabel = "Current median price for all apartments" + whereText;
		var todayLabelTop = "Current median price for all";
		var todayLabelBottom =  "apartments" + whereText;		
	} else {
		var todayLabel = "Current median price for a " + bedroomsText + whereText;
		var todayLabelTop = "Current median price for a " + bedroomsText;
		var todayLabelBottom =  "apartment" + whereText;		
	}


	// Current median price for a [X]-bedroom in [Neighborhood]

	var inflationLabel = "Your " + year + " rent adjusted for inflation.";
	var inflationLabelTop = "Your " + year + " rent";
	var inflationLabelBottom =  "adjusted for inflation.";

    // var d3_dataset = [{"amount":"$" + drawBars.numberWithCommas(allPaid), "label":year + " Value", "value":+allPaid}, 
    //                   {"amount":"$" + drawBars.numberWithCommas(withInflation), "label":"In Today's Dollars", "value":+withInflation}, 
    //                   {"amount":"$" + drawBars.numberWithCommas(today), "label":todayLabel, "labelTop": todayLabelTop, "labelBottom": todayLabelBottom, "value":+today}];

    var d3_dataset = [{"amount":"$" + drawBars.numberWithCommas(withInflation), "label":inflationLabel, "labelTop": inflationLabelTop, "labelBottom": inflationLabelBottom, "value":+withInflation}, 
                      {"amount":"$" + drawBars.numberWithCommas(today), "label":todayLabel, "labelTop": todayLabelTop, "labelBottom": todayLabelBottom, "value":+today}];    

	var width = $('#visContainer').width();
	if (width < 400) {
		// top bar less than 210px, then wrap text
		// bottom mar less than 275px, then wrap text
		var bottomRange = 170;
		var wrapTextSizeTop = 210;
		var wrapTextSizeBottom = 275;
		var height = width/2.5;
		var smallFontSize = "10px";
		var largeFontSize = "12px";
	} else if (width < 600) {
		// top bar less than 285px, then wrap text
		// bottom mar less than 380px, then wrap text
		var bottomRange = 235;
		var wrapTextSizeTop = 285;
		var wrapTextSizeBottom = 380;
		var height = width/3;		
		var smallFontSize = "14px";
		var largeFontSize = "16px";
	} else {
		// top bar less than 325px, then wrap text
		// bottom mar less than 430px, then wrap text
		var bottomRange = 265;
		var wrapTextSizeTop = 325;
		var wrapTextSizeBottom = 430;
		var height = width/4;		
		var smallFontSize = "16px";
		var largeFontSize = "18px";
	}


    // min domain is 0 dollars
	var x = d3.scale.linear()
    	.range([bottomRange, width])
    	.domain([0, d3.max(d3_dataset, function(d) { return d.value; })]);


	var y = d3.scale.ordinal()
	    .rangeRoundBands([0, height], 0.1)
	    .domain(d3_dataset.map(function(d) { return d.amount; }));

    var color = d3.scale.ordinal()
        .range(["#0073a3", "#fc5158", "#ffba77",]);

	var svg = d3.select("#visContainer").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	var gs = svg.selectAll("rect")
	  .data(d3_dataset)
	 .enter().append("g")
	  .attr("class", "bar");

	var bars = gs.append("rect")
	  .style("fill", function(d) { return color(d.amount); })
	  .attr("x", 0)
	  .attr("y", function(d) { return y(d.amount); })
	  .attr("width", 0)
	  .attr("height", y.rangeBand());

	gs.append("text")
      .attr("x", 10)
      .attr("y", function(d) {
      	if (d.label == inflationLabel) {
      		// top bar
	      	if (x(parseInt(d.value)) <= wrapTextSizeTop) {
	      		return y(d.amount) + y.rangeBand()/2.8; 
	      	} else {
	      		return y(d.amount) + y.rangeBand()/2.3;
	      	}
      	} else {
      		// lower bar
	      	if (x(parseInt(d.value)) <= wrapTextSizeBottom) {
	      		return y(d.amount) + y.rangeBand()/2.8; 
	      	} else {
	      		return y(d.amount) + y.rangeBand()/2.3;
	      	}
      	}
      })
      .style("font-size" ,largeFontSize)
      .style("font-family" ,"\"Titillium Web\", Helvetica, Sans-Serif")
      .style("font-weight" ,"400")
      .style("stroke" ,"#ffffff")
      .style("fill" ,"#ffffff")
      .text(function(d) { return d.amount });

	gs.append("text")
      .attr("x", 10)
      .attr("y", function(d) { 
      	if (d.label == inflationLabel) {
      		// top bar
	      	if (x(parseInt(d.value)) <= wrapTextSizeTop) {
	      		return y(d.amount) + y.rangeBand()/1.65;
	      	} else {
	      		return y(d.amount) + y.rangeBand()/1.45;
	      	}      	 
      	} else {
      		// lower bar
	      	if (x(parseInt(d.value)) <= wrapTextSizeBottom) {
	      		return y(d.amount) + y.rangeBand()/1.65;
	      	} else {
	      		return y(d.amount) + y.rangeBand()/1.45;
	      	}      	 
      	}
      })
      .style("font-size" ,smallFontSize)
      .style("font-family" ,"\"Titillium Web\", Helvetica, Sans-Serif")
      .style("font-weight" ,"200")
      .style("stroke" ,"#ffffff")
      .style("fill" ,"#ffffff")
      .text(function(d) { 
      	if (d.label == inflationLabel) {
      		// top bar
	      	if (x(parseInt(d.value)) <= wrapTextSizeTop) {
	      		return d.labelTop;
	      	} else {
	      		return d.label;
	      	}
      	} else {
      		// lower bar
	      	if (x(parseInt(d.value)) <= wrapTextSizeBottom) {
	      		return d.labelTop;
	      	} else {
	      		return d.label;
	      	}
      	}
      });

	gs.append("text")
      .attr("x", 10)
      .attr("y", function(d) { return y(d.amount) + y.rangeBand()/1.15; })
      .style("font-size" ,smallFontSize)
      .style("font-family" ,"\"Titillium Web\", Helvetica, Sans-Serif")
      .style("font-weight" ,"200")
      .style("stroke" ,"#ffffff")
      .style("fill" ,"#ffffff")
      .text(function(d) { 
      	if (d.label == inflationLabel) {
      		// top bar
	      	if (x(parseInt(d.value)) <= wrapTextSizeTop) {
	      		return d.labelBottom;
	      	} else {
	      		return '';
	      	}
      	} else {
      		// lower bar
	      	if (x(parseInt(d.value)) <= wrapTextSizeBottom) {
	      		return d.labelBottom;
	      	} else {
	      		return '';
	      	}
      	}

      });		

	bars.transition()  
		.attr("width", function(d) { return x(parseInt(d.value)); })
		.duration(1000) 
  		.delay(500)
  		.ease("cubic");


}

drawBars.numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


