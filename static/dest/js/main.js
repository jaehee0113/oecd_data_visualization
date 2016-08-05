// Loads the existing data (ajax)
function loadData(path){

    d3.queue()
    .defer(d3.csv, path + "oecd_migration.csv")
    .defer(d3.json, path + "world_countries.json")
    .await(analyze);

    //This inner function is called after two data (csv and json file are loaded)
    function analyze(error, oecd_data, geo_data){
    	if(error){
    		console.log(error);
    	}

    	draw(oecd_data);
    	drawMap(oecd_data, geo_data, 2000);

    	$(".loadingGIF").hide();
    	$(".overlay").hide();
    }
}

//This function deals with tab actions.
function openTabs(evt, dataType){

    // Declare all variables
    var i, tabcontent, tablinks;

    document.getElementById("Legend").style.display = "none";
    document.getElementById("home").style.display = "none";

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(dataType).style.display = "block";
    if(dataType === "map"){
    	document.getElementById("Legend").style.display = "block";
    }
    evt.currentTarget.className += " active";

}

//This function displays the legend for the map 
//(as a barometer. Note that US is excluded as the data is singificantly large.)
function drawGradientLegend(){
	var w = 140, h = 400;
	var key = d3.select("#Barometer").append("svg").attr("width", w).attr("height", h);
	var key2 = d3.select("#Keys").append("svg").attr("width", 140).attr("height", 30).append("g");


	key2.append("rect")
		.attr("width", 20)
		.attr("height", 20)
		.style("fill", "rgb(253,253,150)")
		.attr("transform", "translate(0,5)");

	key2.append('text').text('>1,000,000')
                .attr('x', 50)
                .attr('y', 20)
                .attr('fill', 'black');	

	var legend = key.append("defs")
				.append("svg:linearGradient")
					.attr("id", "gradient")
					.attr("x1", "100%")
					.attr("y1", "0%")
					.attr("x2", "100%")
					.attr("y2", "100%")
					.attr("spreadMethod", "pad");

	legend
		.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", "rgb(22,225,232)")
		.attr("stop-opacity", 1);

	legend
		.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", "rgb(22,149,232)")
		.attr("stop-opacity", 1);

	key.append("rect")
		.attr("width", w - 100)
		.attr("height", h - 100)
		.style("fill", "url(#gradient)")
		.attr("transform", "translate(0,10)");

	var y = d3.scale.linear().range([300, 0]).domain([900000,20495]);

	var yAxis = d3.svg.axis().scale(y).orient("right");

	key.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(41,10)")
		.call(yAxis).append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 30)
		.attr("dy", ".100em")
		.style("text-anchor", "end");

}

//Should display top 10 destination for migrants from year 2000 to 2013! (ANIMATION TO BE INCLUDED!)
function drawMap(oecd_data, geo_data, year){

	var filtered_oecd_data = oecd_data.filter(function(d){
		return d['Year'] == year && d['Variable'] == "Inflows of foreign population by nationality" && (d['COU'] != 'USA');
	});

	var filtered_oecd_data2 = oecd_data.filter(function(d){
		return d['Year'] == year && d['Variable'] == "Inflows of foreign population by nationality";
	});

	//Aggregate data based on "Country" and sums up all the values!
	var aggregated_data = d3.nest()
		.key(function(d){
			return d.COU;
		})
		.rollup(function(d){
			return d3.sum(d, function(g){
				return g.Value;
			})
		})
		.entries(filtered_oecd_data);

	var original_data = d3.nest()
		.key(function(d){
			return d.COU;
		})
		.rollup(function(d){
			return d3.sum(d, function(g){
				return g.Value;
			})
		})
		.entries(filtered_oecd_data2);
	

	var linearScale = d3.scale.linear()
                           .domain([20495,900000])
                           .range([225,178]);

    var scaled_aggregated_data = aggregated_data;
    
	for(var i = 0; i < scaled_aggregated_data.length; i++){
		scaled_aggregated_data[i]['values'] = Math.floor(linearScale(scaled_aggregated_data[i]['values']));
	}
	
    var margin = 75,
            width = $("svg").parent().width() - margin,
            height = 900 - margin;

	var svg = d3.select("#map")
		.append("svg")
			.attr('class', 'map_canvas')
			.attr("width", width + margin)
			.attr("height", height + margin)
		.append('g')
		    .attr('class','map');

	var projection = d3.geo.mercator()
						.scale(220)
						.translate([width / 2, height / 2]);

	var path = d3.geo.path().projection(projection);

	var tooltip = d3.select('#map').append('div')
            .attr('class', 'hidden tooltip');

	var map = svg.selectAll('.province')
				.data(geo_data.features)
				.enter()
				.append('path')
				.attr('class', function(d) {
                    return 'province ' + d.id;
                })
				.attr('d', path)
				.on('mousemove', function(d) {
                    var mouse = d3.mouse(svg.node()).map(function(d) {
                        return parseInt(d);
                    });

                    tooltip.classed('hidden', false)
                        .attr('style', 'left:' + (mouse[0] + 15) +
                                'px; top:' + (mouse[1] + 50) + 'px')
                        .html(d['properties']['name'] + "</br><b> Total Inflows: " + getTotalInflows(d.id, original_data));
                })
                .on('mouseout', function() {
                    tooltip.classed('hidden', true);
                })
                .style('fill', function(d){	

                	if(d.id == 'USA' || d.id == 'DEU'){
						return 'rgb(253,253,150)';
					}

					for(var i = 0; i < scaled_aggregated_data.length; i++){
						if(d.id == scaled_aggregated_data[i]['key']){
							return 'rgb(22,' + scaled_aggregated_data[i]['values'] + ',232)';
						}
					}

					return 'rgb(221,221,221)';
				})
				.style('stroke', 'black')
				.style('stroke-width', 0.5);
	drawGradientLegend();
}

//This function is used for tooltip for a map. 
//When a user hovers on a map, the tooltipe appears and this function returns what will be inside the tooltip.
function getTotalInflows(COA, data){
	
	format = d3.format("0,000");

	for(var i = 0; i < data.length; i++){
		if(COA == data[i]['key']){
			return format(data[i]['values']) + " people";
		}
	}

	return "Not Available";
}

// This function draws the graph (uses dimple.js)
function draw(oecd_data){

	/*
        D3.js setup code
    */
    var margin = 75,
        width = 800,
        height = 1200;

	
	var svg = d3.select("#graph")
			.append("svg")
			  .attr("width", width + 1500 + margin)
			  .attr("height", height + margin)
			.append('g')
				.attr("width", width - margin)
			  .attr("height", height - margin)
			    .attr('class','chart');

	svg.append("text")
		.attr("x", width / 2 + 300)
		.attr("y", 30)
		.attr("id", "graph_title")
		.text("Top 6 destination for expatriates (2000 ~ 2013)");  

	var filteredData = dimple.filterData(oecd_data, "Variable", "Inflows of foreign population by nationality");
	var filteredData = dimple.filterData(filteredData, "Country", ['Korea', 'Australia', 'New Zealand', 'United States', 'Canada', 'United Kingdom']);
	
	var myChart = new dimple.chart(svg, filteredData);
	var x = myChart.addTimeAxis("x", "Year"); 
	var y = myChart.addMeasureAxis("y", "Value");
	x.dateParseFormat = "%Y";
	x.tickFormat = "%Y";
	x.timeInterval = 1;	
	//works like layer!
	myChart.addSeries("Country", dimple.plot.line);
	myChart.addSeries("Country", dimple.plot.scatter);
	var myLegend = myChart.addLegend(100, 30, 900, 30, "left");
	myChart.draw();

	//Due to the long text, the legend was very difficult to see. As such, I abbreviated full names and changed their x value.
	myLegend.shapes.selectAll('text').each( function(d){
		var val = d3.select(this).attr('x');
		d3.select(this).attr('x', val - 23);
		if(d.key == "United States"){
			d3.select(this).text("US");
		}else if(d.key == "United Kingdom"){
			d3.select(this).text("UK");
		}else if(d.key == "Australia"){
			d3.select(this).text("AUS");
		}else if(d.key == "New Zealand"){
			d3.select(this).text("NZ");
		}else if(d.key == "Korea"){
			d3.select(this).text("KOR");
		}else if(d.key == "Canada"){
			d3.select(this).text("CAN");
		}
	});
}