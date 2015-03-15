var categories =[];
var AVGPOST= [];
var RSQ = [];
var LDAF = [];
var data = [];
var requestData, dataSet;

jQuery(document).ready( function() {
    jQuery("#stacked-bar-graph").click(function(){
        jQuery("#formData").fadeOut(1200);
        jQuery("#graphHolder").append("<div id='container' style='min-width: 310px; height: 550px; margin: 0 auto'></div>");
        jQuery("#backBtn").fadeIn(1000);
        getBarGraphData();
    });   

    jQuery("#line-graph").click(function(){
        jQuery("#formData").fadeOut(1600);
        jQuery("#graphHolder").append("<div id='container' style='min-width: 310px; height: 550px; margin: 0 auto'></div>");
        jQuery("#backBtn").fadeIn(1000);
        getLineGraphData();
    });  

    jQuery("#backBtn").click(function() {
        jQuery("#backBtn").fadeOut(1000);
        jQuery("#container").remove();
        jQuery("#formData").fadeIn(1000);
    });
      
});
  
function getBarGraphData() {

    var variantSetId = jQuery("#variantId").val();
    var maxCalls = jQuery("#maxCalls").val();
    var callSetId = jQuery("#callSetId").val();
    console.log(variantSetId + " " + maxCalls);

    requestData = {
      "variantSetIds": [variantSetId],
      "callSetIds": [callSetId],
      "referenceName": "1",
      "maxCalls": parseInt(maxCalls)
    };
    
    var apiKey = "AIzaSyBmbVgej4zs0KwKfAn7FUR-s_0H7wRZcIY";
    var url = "https://www.googleapis.com/genomics/v1beta2/variants/search?key=" + apiKey;

    categories =[];
    AVGPOST= [];
    RSQ = [];
    LDAF = [];

    dataSet = $.ajax({
      type: "POST",
      contentType: 'application/json',  
      url: url,
      data: JSON.stringify(requestData),
      success: function() {   
	    jQuery.each(dataSet.responseJSON.variants, function(index, value) {
		   	categories.push(value.id);
		    AVGPOST.push(parseFloat(value.info.AVGPOST[0]));
		    RSQ.push(parseFloat(value.info.RSQ[0]));
		    LDAF.push(parseFloat(value.info.LDAF[0]));
		}); 
	  	drawBarGraph();
	  }
    });

}

function drawBarGraph() {
	  jQuery('#container').highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: 'Genome API Data Representation'
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Data Values'
	            },
	            stackLabels: {
	                enabled: true,
	                style: {
	                    fontWeight: 'bold',
	                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
	                }
	            }
	        },
	        legend: {
	            align: 'right',
	            x: -30,
	            verticalAlign: 'top',
	            y: 25,
	            floating: true,
	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
	            borderColor: '#CCC',
	            borderWidth: 1,
	            shadow: false
	        },
	        tooltip: {
	            formatter: function () {
	                return 'VariantId: <b>' + categories[this.x] + '</b><br/>' +
	                    this.series.name + ': ' + this.y + '<br/>' +
	                    'Total: ' + this.point.stackTotal;
	            }
	        },
	        plotOptions: {
	            column: {
	                stacking: 'normal',
	                dataLabels: {
	                    enabled: true,
	                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
	                    style: {
	                        textShadow: '0 0 3px black'
	                    }
	                }
	            }
	        },
	        series: [{
	            name: 'AVGPOST',
	            data: AVGPOST
	        }, {
	            name: 'RSQ',
	            data: RSQ
	        }, {
	            name: 'LDAF',
	            data: LDAF
	        }]
	 });
}

function getLineGraphData() {

	categories =[];
    AVGPOST= [];
    RSQ = [];
    LDAF = [];

	var variantSetId = jQuery("#variantId").val();
    var maxCalls = jQuery("#maxCalls").val();
    var callSetId = jQuery("#callSetId").val();
    console.log(variantSetId + " " + maxCalls);
    requestData = {
      "variantSetIds": [variantSetId],
      "callSetIds": [callSetId],
      "referenceName": "1",
      "maxCalls": parseInt(maxCalls)
  };

    var apiKey = "AIzaSyBmbVgej4zs0KwKfAn7FUR-s_0H7wRZcIY";
    var url = "https://www.googleapis.com/genomics/v1beta2/variants/search?key=" + apiKey;
    var variantIndex = [], data = [];

    var dataSet = $.ajax({
      type: "POST",
      contentType: 'application/json',  
      url: url,
      data: JSON.stringify(requestData),
      success: function(){ 
      	jQuery.each(dataSet.responseJSON.variants, function(index, value){
			data.push(
	    		{ 'date': index ,'RSQ':String(value.info.RSQ[0]), 'AVGPOST': String(value.info.AVGPOST[0]), 'LDAF': String(value.info.LDAF[0]) }
	    	);
	  		variantIndex.push(value.id);
		});
      	drawLineGraph(variantIndex, data);
      }
    });
 
}

function drawLineGraph(variantIndex, data) {

    var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


    var x = d3.scale.linear()
    .range([0, width]);

    var y = d3.scale.linear()
    .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(d, i){
      return "Variant " + d;
    });

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

    var svg = d3.select("#container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

    var variantProperties = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {date: d.date, value: +d[name]};
        })
      };
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain([
    d3.min(variantProperties, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
    d3.max(variantProperties, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
    ]);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")

    var property = svg.selectAll(".property")
    .data(variantProperties)
    .enter().append("g")
    .attr("class", "property");

    property.append("path")
    .attr("class", "line")
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d) { return color(d.name); });

    property.append("text")
    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.value) + ")"; })
    .attr("x", 3)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });

}






