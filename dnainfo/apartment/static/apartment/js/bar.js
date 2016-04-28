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
		var whereText = "Citywide";
	} else {
		var whereText = " in " + todayType;
	}

	var todayLabel = "Current median price for a " + bedroomsText + whereText;
	var todayLabelTop = "Current median price for a " + bedroomsText;
	var todayLabelBottom =  "apartment" + whereText;

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
		var bottomRange = 170;
		var wrapTextSize = width - 80;
		var height = width/2.5;
		var smallFontSize = "10px";
		var largeFontSize = "12px";
	} else if (width < 600) {
		var bottomRange = 235;
		var wrapTextSize = width - 80;
		var height = width/3;		
		var smallFontSize = "14px";
		var largeFontSize = "16px";
	} else {
		var bottomRange = 265;
		var wrapTextSize = width - 200;
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
        .range(["#4291c3", "#e66e6e", "#ffba77",]);

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
      	if (x(parseInt(d.value)) <= wrapTextSize) {
      		return y(d.amount) + y.rangeBand()/2.8; 
      	} else {
      		return y(d.amount) + y.rangeBand()/2.3;
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
      	if (x(parseInt(d.value)) <= wrapTextSize) {
      		return y(d.amount) + y.rangeBand()/1.65;
      	} else {
      		return y(d.amount) + y.rangeBand()/1.45;
      	}      	 
      })
      .style("font-size" ,smallFontSize)
      .style("font-family" ,"\"Titillium Web\", Helvetica, Sans-Serif")
      .style("font-weight" ,"200")
      .style("stroke" ,"#ffffff")
      .style("fill" ,"#ffffff")
      .text(function(d) { 
      	console.log(x(parseInt(d.value)));
      	console.log(bottomRange);
      	if (x(parseInt(d.value)) <= wrapTextSize) {
      		return d.labelTop;
      	} else {
      		return d.label;
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
      	if (x(parseInt(d.value)) <= wrapTextSize) {
      		return d.labelBottom;
      	} else {
      		return '';
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


