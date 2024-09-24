let chart;

function changeChartType(type) {
    const options = {
        series: [{
            name: 'Trash Bin 1',
            data: [50, 40, 100, 51, 42, 109, 100, 60, 70, 90]
        }, {
            name: 'Trash Bin 2',
            data: [11, 32, 45, 32, 120, 52, 41, 80, 75, 65]
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
            categories: [
                "2024-09-01T00:00:00.000Z",
                "2024-09-02T00:00:00.000Z",
                "2024-09-03T00:00:00.000Z",
                "2024-09-04T00:00:00.000Z",
                "2024-09-05T00:00:00.000Z",
                "2024-09-06T00:00:00.000Z",
                "2024-09-07T00:00:00.000Z",
                "2024-09-08T00:00:00.000Z",
                "2024-09-09T00:00:00.000Z",
                "2024-09-10T00:00:00.000Z"
            ]
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

// Initial render with area chart
changeChartType('area');

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
