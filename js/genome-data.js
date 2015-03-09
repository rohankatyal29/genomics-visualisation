var categories =[];
var AVGPOST= [];
var RSQ = [];
var LDAF = [];
var requestData, dataSet;

jQuery(document).ready( function() {
    jQuery("#submitBtn").click(function(){
        jQuery("#formData").hide();
        jQuery("#graphHolder").append("<div id='container' class='well' style='min-width: 310px; height: 400px; margin: 0 auto'></div>");
        jQuery("#backBtn").show();
        setRequestData();
    });   

    jQuery("#backBtn").click(function() {
        jQuery("#backBtn").hide();
        jQuery("#container").remove();
        jQuery("#formData").show();
    });
      
});
  
function setRequestData(){
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

    dataSet = $.ajax({
      type: "POST",
      contentType: 'application/json',  
      url: url,
      data: JSON.stringify(requestData),
      success: function(){ pushData(); }
    });

};

function pushData(){
        categories =[];
        AVGPOST= [];
        RSQ = [];
        LDAF = [];
        jQuery.each(dataSet.responseJSON.variants, function(index, value){
        categories.push(value.id);
        AVGPOST.push(parseFloat(value.info.AVGPOST[0]));
        RSQ.push(parseFloat(value.info.RSQ[0]));
        LDAF.push(parseFloat(value.info.LDAF[0]));
    });

    populateTable();
};

function populateTable () {
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