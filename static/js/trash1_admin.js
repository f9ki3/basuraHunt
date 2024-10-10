var socket = io();

function updateMessage(data) {
    let message;
    if (data < 0) {
        message = 'Empty Trash!';
    } else if (data < 50) {
        message = 'Normal Level';
    } else if (data < 70) {
        message = 'Bin Half Filled';
    } else if (data < 95) {
        message = 'Critical Level';
    } else {
        message = 'Bin Full'; // Covers data >= 100
        $('#pickTrashAdmin1').prop('disabled', false);
        vibrateButton();
    }
    $('#messageTrash').text(message);
}

function vibrateButton() {
    const button = $('#pickTrashAdmin1');
    button.addClass('vibrate');
    setTimeout(() => button.removeClass('vibrate'), 500);
}

function trashDisplay(total) {
    total = Math.max(0, Math.min(total, 100));
    $('#pickTrashAdmin1').prop('disabled', true);
    const reversedTotal = 100 - total;
    const displayHeight = total <= 5 ? '100%' : reversedTotal + '%';

    updateMessage(reversedTotal);
    updateTrashBinStyles(total, displayHeight);
    $('#trashPercent').text(total <= 5 ? '100%' : reversedTotal + '%');
    $('#trash1percent').text(total <= 5 ? '100%' : reversedTotal + '%');
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
    if (total <= 20) return '#fa8c8c'; // Light red
    if (total <= 30) return '#fab78c'; // Light orange
    if (total <= 50) return '#faf38c'; // Pale yellow
    if (total <= 70) return '#e3fa8c'; // Even lighter green
    if (total <= 80) return '#c5fa8c'; // Lighter green
    return '#a5fa8c'; // Light green
}

// Listen for real-time updates via WebSocket
socket.on('updateTrash', function(data) {
    trashDisplay(Number(data.count));
});

// Handle "Throw Trash" button click
$('#throwTrash').on('click', function () {
    $.ajax({
        type: "POST",
        url: "/data",
        contentType: "application/json",
        data: JSON.stringify({ distance: 1 })
    });
});


// Periodically check the status of the microcontroller
function checkMicrocontrollerStatus() {
    $.ajax({
        url: '/check_status',
        method: 'GET',
        success: function(response) {
            const isMicrocontrollerOn = response.status !== "off";
            $('#trash').toggle(isMicrocontrollerOn);
            $('#wifi').toggle(!isMicrocontrollerOn);
            $('#dashtrash1').toggle(isMicrocontrollerOn);
            $('#wifidash1').toggle(!isMicrocontrollerOn);
        },
        error: function(error) {
            console.error("Error: ", error);
        }
    });
}

setInterval(checkMicrocontrollerStatus, 5000);

$('#pickTrashAdmin1').click(function (e) {
    e.preventDefault();
    $.ajax({
        url: '/process_trash1',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ dispose: 1 })
    });
});

// Fetch and update dispose count
function fetchDisposeCount() {
    $.ajax({
        type: "GET",
        url: "/get_dispose1",
        dataType: "json",
        success: function (response) {
            $('#disposeCount').text(response.response);
        },
        error: function(xhr, status, error) {
            console.log("Error: " + error);
        }
    });
}

// Initial run on page load
$(document).ready(fetchDisposeCount);

// Fetch on button click
$('#pickTrashAdmin1').click(fetchDisposeCount);
