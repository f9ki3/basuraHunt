// Connect to the WebSocket server
var socket = io();

// Function to update the trash display based on the count
function trashDisplay(total) {
    // Ensure total is between 0 and 100
    total = Math.max(0, Math.min(total, 100));

    // Reverse the total for visual representation
    let reversedTotal = 100 - total;

    // Set height to 100% if total is 5 or less
    let displayHeight = total <= 5 ? '100%' : reversedTotal + '%';

    // Determine color based on reversed total
    var colorContent;
    if (reversedTotal <= 20) {
        colorContent = '#fa8c8c'; // Light red
    } else if (reversedTotal <= 30) {
        colorContent = '#fab78c'; // Light orange
    } else if (reversedTotal <= 50) {
        colorContent = '#faf38c'; // Pale yellow
    } else if (reversedTotal <= 70) {
        colorContent = '#e3fa8c'; // Even lighter green
    } else if (reversedTotal <= 80) {
        colorContent = '#c5fa8c'; // Lighter green
    } else {
        colorContent = '#a5fa8c'; // Light green
    }

    // Update the visual of the trash bin
    $('.trashBinContent').css({
        'width': '100%',
        'height': displayHeight,
        'background-color': colorContent,
        'position': 'absolute',
        'border-radius': '0px 0px 13px 13px',
        'bottom': '0',
        'left': '0'
    });
    
    $('.trashBinContainer').css({
        'display': 'flex',
        'background-color': '#e3f7fe',
        'justify-content': 'center',
        'height': '350px',
        'width': '100px',
        'border-bottom': '3px solid green',
        'border-left': '3px solid green',
        'border-right': '3px solid green',
        'border-radius': '0px 0px 15px 15px',
        'position': 'relative'
    });

    $('.trashPercent').css({
        'position': 'absolute',
        'top': '150px',
        'text-align': 'center',
        'font-weight': 'bolder',
        'z-index': '10',
        'color': 'green'
    });

    $('#trashPercent').text(total <= 5 ? '100%' : reversedTotal + '%');
}

// Handle WebSocket messages
socket.on('updateTrash', function (data) {
    trashDisplay(data.count);  // Update trash display with new count
});

// Handle "Throw Trash" button click
$('#throwTrash').on('click', function () {
    $.ajax({
        type: "POST",
        url: "/data",
        contentType: "application/json",
        data: JSON.stringify({ distance: 1 }),  // Sending new data
        success: function (response) {
            // The WebSocket will handle the real-time update
        }
    });
});

// Optional: Initial setup if needed (fetch current count and display it)
function initialize() {
    $.ajax({
        type: "GET",
        url: "/getCount",
        dataType: "json",
        success: function (response) {
            trashDisplay(Number(response));
        }
    });
}

// Call initialize function to set up the initial state
initialize();
