/**
 * bar.js: Draws results page horizonatal bar chart
 */

function drawBars() {}

drawBars.initialize = function () {
	// set up dataset
	if (bedrooms == 0) {
		var bedroomsText = "studio";
	} else if (bedrooms <= 4) {
		var bedroomsText = bedroom + " bedroom";
	} else {
		var bedroomsText = "5+ bedroom";		
	} 

	if (todayType == "Citywide") {
		var whereText = "Citywide";
	} else {
		var whereText = "in " + todayType;
	}

	var todayLabel = "For a " + bedroomsText + " apartment " + whereText;

    var d3_dataset = [{"amount":"$" + drawBars.numberWithCommas(allPaid), "label":year + " Value", "value":+allPaid}, 
                      {"amount":"$" + drawBars.numberWithCommas(withInflation), "label":"In Today's Dollars", "value":+withInflation}, 
                      {"amount":"$" + drawBars.numberWithCommas(today), "label":todayLabel, "value":+today}];

	var width = $('#visContainer').width();
	if (width < 600) {
		var height = width;
	} else if (width < 1200) {
		var height = width/2.5;
	} else {
		var height = width/4;		
	}

	var x = d3.scale.linear()
    	.range([0, width])
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
      .attr("y", function(d) { return y(d.amount) + y.rangeBand()/2.3; })
      .style("font-size" ,"12px")
      .style("font-family" ,"\"Titillium Web\", Helvetica, Sans-Serif")
      .style("font-weight" ,"400")
      .style("stroke" ,"#ffffff")
      .style("fill" ,"#ffffff")
      .text(function(d) { return d.amount });

	gs.append("text")
      .attr("x", 10)
      .attr("y", function(d) { return y(d.amount) + y.rangeBand()/1.7; })
      .style("font-size" ,"10px")
      .style("font-family" ,"\"Titillium Web\", Helvetica, Sans-Serif")
      .style("font-weight" ,"100")
      .style("stroke" ,"#ffffff")
      .style("fill" ,"#ffffff")
      .text(function(d) { return d.label });


	bars.transition()  
		.attr("width", function(d) { return x(parseInt(d.value)); })
		.duration(1000) 
  		.delay(500)
  		.ease("cubic");


}

drawBars.numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


