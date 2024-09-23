var socket = io();

function updateMessage(data) {
    if (data < 0) {
        $('#messageTrash').text('Empty Trash!');
    } else if (data < 50) {
        $('#messageTrash').text('Normal Level');
    } else if (data < 70) {
        $('#messageTrash').text('Bin Half Filled');
    } else if (data < 95) {
        $('#messageTrash').text('Critical Level');
    } else { // This covers both data === 100 and data > 100
        $('#messageTrash').text('Bin Full'); // Show message when 100 or above
        $('#pickTrashAdmin1').prop('disabled', false);
        function vibrateButton() {
            $('#pickTrashAdmin1').addClass('vibrate');
            setTimeout(function() {
                $('#pickTrashAdmin1').removeClass('vibrate');
            }, 500); // Duration should match the animation duration
        }
        vibrateButton()

    }
}


function trashDisplay(total) {
    // Ensure total is between 0 and 100
    total = Math.max(0, Math.min(total, 100));
    $('#pickTrashAdmin1').prop('disabled', true);
    // Reverse the total for visual representation
    let reversedTotal = 100 - total;

    // Set height to 100% if total is 5 or less
    let displayHeight = total <= 5 ? '100%' : reversedTotal + '%';

    updateMessage(reversedTotal);

    // Determine color based on total
    let colorContent;
    if (total <= 20) {
        colorContent = '#fa8c8c'; // Light red for lower values
    } else if (total <= 30) {
        colorContent = '#fab78c'; // Light orange
    } else if (total <= 50) {
        colorContent = '#faf38c'; // Pale yellow
    } else if (total <= 70) {
        colorContent = '#e3fa8c'; // Even lighter green
    } else if (total <= 80) {
        colorContent = '#c5fa8c'; // Lighter green
    } else {
        colorContent = '#a5fa8c'; // Light green for higher values
    }

    // Update the visual of the trash bin
    $('.trashBinContent').css({
        'width': '100%',
        'height': displayHeight,
        'background-color': colorContent,
        'position': 'absolute',
        'border-radius': '0 0 13px 13px',
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
        'border-radius': '0 0 15px 15px',
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

// Listen for real-time updates via WebSocket
socket.on('updateTrash', function(data) {
    // Data received will contain the updated trash count
    let total = Number(data.count);
    trashDisplay(total);
});

// Handle "Throw Trash" button click
$('#throwTrash').on('click', function () {
    $.ajax({
        type: "POST",
        url: "/data",
        contentType: "application/json",
        data: JSON.stringify({ distance: 1 }), // Sending new data
        success: function (response) {
            // The WebSocket will handle the real-time update
        }
    });
});

// Optional: Initial setup to fetch current count and display it
function initialize() {
    $.ajax({
        type: "GET",
        url: "/getCount",
        dataType: "json",
        success: function (response) {
            if (response === 400) {
                console.log('Disconnected');
            } else {
                trashDisplay(Number(response.distance)); // Assuming response has a distance property
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", status, error); // Handle AJAX error
        }
    });
}

// Call initialize function to set up the initial state
initialize();

// Periodically check the status of the microcontroller
function checkMicrocontrollerStatus() {
    $.ajax({
        url: '/check_status',  // Flask endpoint
        method: 'GET',
        success: function(response) {
            const status = response.status;
            if (status === "off") {
                $('#trash2').hide();  // Hide trash bin when the microcontroller is off
                $('#wifi2').show();   // Show Wi-Fi indicator
            } else {
                $('#trash2').show();  // Show trash bin when the microcontroller is on
                $('#wifi2').hide();   // Hide Wi-Fi indicator
            }
        },
        error: function(error) {
            console.error("Error: ", error);
        }
    });
}

setInterval(checkMicrocontrollerStatus, 5000);
