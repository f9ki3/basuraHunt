// WebSocket setup for real-time updates
var socket = io();

function updateMessage(data) {
    let message;
    // Ensure data is between 0 and 100
    data = Math.max(0, Math.min(data, 100));
    
    if (data === 0) {
        message = 'Empty Trash!'; // Corrected this condition to check for exactly 0
    } else if (data < 50) {
        message = 'Normal Level';
    } else if (data < 70) {
        message = 'Bin Half Filled';
    } else if (data < 95) {
        message = 'Critical Level';
    } else {
        message = 'Bin Full';
        $('#pickTrashAdmin1').prop('disabled', false);
        vibrateButton();
    }

    $('#messageTrash').text(message);
}

function vibrateButton() {
    $('#pickTrashAdmin1').addClass('vibrate');
    setTimeout(() => $('#pickTrashAdmin1').removeClass('vibrate'), 500);
}

function trashDisplay(total) {
    total = Math.max(0, Math.min(total, 100));
    const reversedTotal = 100 - total;
    const displayHeight = total <= 5 ? '100%' : reversedTotal + '%';
    $('#pickTrashAdmin1').prop('disabled', true);
    updateMessage(reversedTotal);
    updateTrashBinStyles(total, displayHeight);
    $('#trashPercent, #trash1percent').text(displayHeight);
}

function updateTrashBinStyles(total, displayHeight) {
    const colorContent = getColorByTotal(total);

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
}

function getColorByTotal(total) {
    if (total <= 20) return '#fa8c8c';
    if (total <= 30) return '#fab78c';
    if (total <= 50) return '#faf38c';
    if (total <= 70) return '#e3fa8c';
    if (total <= 80) return '#c5fa8c';
    return '#a5fa8c';
}

// Handle real-time data updates
socket.on('updateTrash', function(data) {
    trashDisplay(Number(data.count));
}).on('error', function(error) {
    console.error("WebSocket Error: ", error);
});

// AJAX call for "Throw Trash"
$('#throwTrash').on('click', function () {
    $.ajax({
        type: "POST",
        url: "/data",
        contentType: "application/json",
        data: JSON.stringify({ distance: 1 }),
        error: function(xhr, status, error) {
            console.log("Error while throwing trash: " + error);
        }
    });
});

// Periodically check microcontroller status
function checkMicrocontrollerStatus() {
    $.ajax({
        url: '/check_status',
        method: 'GET',
        success: function(response) {
            const isMicrocontrollerOn = response.status !== "off";
            $('#trash, #dashtrash1').toggle(isMicrocontrollerOn);
            $('#wifi, #wifidash1').toggle(!isMicrocontrollerOn);
        },
        error: function(error) {
            console.error("Error checking microcontroller status: ", error);
        }
    });
}

setInterval(checkMicrocontrollerStatus, 5000);

// Handle "Pick Trash" click event
$('#pickTrashAdmin1').click(function (e) {
    e.preventDefault();
    $.ajax({
        url: '/process_trash1',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ dispose: 1 }),
        success: fetchDisposeCount,
        error: function(xhr, status, error) {
            console.log("Error while processing trash: " + error);
        }
    });
});

// Fetch and display dispose count
function fetchDisposeCount() {
    $.ajax({
        type: "GET",
        url: "/get_dispose1",
        dataType: "json",
        success: function (response) {
            $('#disposeCount').text(response.response);
        },
        error: function(xhr, status, error) {
            console.log("Error fetching dispose count: " + error);
        }
    });
}

// Initialize on page load
$(document).ready(fetchDisposeCount);
