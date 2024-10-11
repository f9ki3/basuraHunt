// let chart;
// let responseData; // Define responseData in a higher scope

// function changeChartType(type) {
//     // Prepare the data from the response
//     const bin1Data = responseData.bin1.value;
//     const bin2Data = responseData.bin2.value;
//     const dates = responseData.bin1.date; // Assuming both bins have the same dates

//     const options = {
//         series: [{
//             name: 'Trash Bin 1',
//             data: bin1Data
//         }, {
//             name: 'Trash Bin 2',
//             data: bin2Data
//         }],
//         chart: {
//             height: 350,
//             type: type,
//             animations: {
//                 enabled: true,
//                 easing: 'easeinout',
//                 speed: 800,
//                 dynamicAnimation: {
//                     speed: 350
//                 }
//             }
//         },
//         dataLabels: {
//             enabled: false
//         },
//         stroke: {
//             curve: 'smooth'
//         },
//         xaxis: {
//             type: 'datetime',
//             categories: dates // Use the dates from the response
//         },
//         tooltip: {
//             x: {
//                 format: 'dd/MM/yy HH:mm'
//             },
//         },
//     };

//     // If chart already exists, destroy it before creating a new one
//     if (chart) {
//         chart.destroy();
//     }

//     // Create and render the chart
//     chart = new ApexCharts(document.querySelector("#dailyDispose"), options);
//     chart.render();
// }

// // Initial AJAX call to fetch data
// $.ajax({
//     url: '/getDisposeDashboardsAnalytics', // Replace with your API endpoint
//     method: 'GET',
//     success: function(data) {
//         responseData = data; // Store response data in the higher scope variable
//         // Call changeChartType with initial chart type
//         changeChartType('area');
//     },
//     error: function(xhr, status, error) {
//         console.error('Error fetching data:', error);
//     }
// });

// // Set up click event handlers for buttons
// $('#area').click(function() {
//     changeChartType('area');
// });
// $('#line').click(function() {
//     changeChartType('line');
// });
// $('#bar').click(function() {
//     changeChartType('bar');
// });


let chart;
let responseData; // Define responseData in a higher scope
let lastFetchedData = null; // Variable to store the previous data for comparison
const pollingInterval = 5000; // Polling interval set to 5 seconds (5000 ms)
const LOCAL_STORAGE_KEY = 'selectedChartType'; // Key to store chart type in localStorage

// Function to check if the new data is different from the last fetched data
function isDataChanged(newData, oldData) {
    return JSON.stringify(newData) !== JSON.stringify(oldData);
}

// Function to change chart type and render the chart
function changeChartType(type) {
    if (!responseData) return; // Ensure responseData is available

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

    // Save the selected chart type to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, type);
}

// Function to fetch data and update the chart if changes are detected
function fetchData() {
    $.ajax({
        url: '/getDisposeDashboardsAnalytics', // Replace with your API endpoint
        method: 'GET',
        success: function(data) {
            // Check if the fetched data is different from the last stored data
            if (!lastFetchedData || isDataChanged(data, lastFetchedData)) {
                lastFetchedData = data; // Update last fetched data
                responseData = data; // Store the new response data
                
                // Get the chart type from localStorage (default to 'area' if none is saved)
                const savedChartType = localStorage.getItem(LOCAL_STORAGE_KEY) || 'area';
                changeChartType(savedChartType); // Update the chart with the saved type
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
}

// Polling mechanism to fetch data at regular intervals
function startPolling() {
    fetchData(); // Initial fetch
    setInterval(fetchData, pollingInterval); // Poll every 5 seconds (5000 ms)
}

// Set up click event handlers for buttons to change chart type
document.getElementById('area').addEventListener('click', function() {
    changeChartType('area');
});
document.getElementById('line').addEventListener('click', function() {
    changeChartType('line');
});
document.getElementById('bar').addEventListener('click', function() {
    changeChartType('bar');
});

// Start polling and load the saved chart type when the page loads
$(document).ready(function() {
    startPolling();
});