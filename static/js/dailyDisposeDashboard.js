let chart;
let responseData; // Define responseData in a higher scope

function changeChartType(type) {
    // Prepare the data from the response
    const bin1Data = responseData.bin1.value;
    const bin2Data = responseData.bin2.value;
    const dates = responseData.bin1.date; // Assuming both bins have the same dates

    const options = {
        series: [{
            name: 'Trash Bin 1',
            data: bin1Data
        }, {
            name: 'Trash Bin 2',
            data: bin2Data
        }],
        chart: {
            height: 350,
            type: type,
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                dynamicAnimation: {
                    speed: 350
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'datetime',
            categories: dates // Use the dates from the response
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        },
    };

    // If chart already exists, destroy it before creating a new one
    if (chart) {
        chart.destroy();
    }

    // Create and render the chart
    chart = new ApexCharts(document.querySelector("#dailyDispose"), options);
    chart.render();
}

// Initial AJAX call to fetch data
$.ajax({
    url: '/getDisposeDashboardsAnalytics', // Replace with your API endpoint
    method: 'GET',
    success: function(data) {
        responseData = data; // Store response data in the higher scope variable
        // Call changeChartType with initial chart type
        changeChartType('area');
    },
    error: function(xhr, status, error) {
        console.error('Error fetching data:', error);
    }
});

// Set up click event handlers for buttons
$('#area').click(function() {
    changeChartType('area');
});
$('#line').click(function() {
    changeChartType('line');
});
$('#bar').click(function() {
    changeChartType('bar');
});