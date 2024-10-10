var socket = io();

function updateMessage2(data) {
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
        $('#pickTrashAdmin2').prop('disabled', false);
        vibrateButton2();
    }
    $('#messageTrash2').text(message);
}

function vibrateButton2() {
    const button = $('#pickTrashAdmin2');
    button.addClass('vibrate');
    setTimeout(() => button.removeClass('vibrate'), 500);
}

function trashDisplay2(total) {
    total = Math.max(0, Math.min(total, 100));
    $('#pickTrashAdmin2').prop('disabled', true);
    const reversedTotal = 100 - total;
    const displayHeight = total <= 5 ? '100%' : reversedTotal + '%';

    updateMessage2(reversedTotal);
    updateTrashBinStyles2(total, displayHeight);
    $('#trashPercent2').text(total <= 5 ? '100%' : reversedTotal + '%');
}

function updateTrashBinStyles2(total, displayHeight) {
    const colorContent = getColorByTotal2(total);

    $('.trashBinContent2').css({
        'width': '100%',
        'height': displayHeight,
        'background-color': colorContent,
        'position': 'absolute',
        'border-radius': '0 0 13px 13px',
        'bottom': '0',
        'left': '0'
    });

    $('.trashBinContainer2').css({
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

    $('.trashPercent2').css({
        'position': 'absolute',
        'top': '150px',
        'text-align': 'center',
        'font-weight': 'bolder',
        'z-index': '10',
        'color': 'green'
    });
}

function getColorByTotal2(total) {
    if (total <= 20) return '#fa8c8c'; // Light red
    if (total <= 30) return '#fab78c'; // Light orange
    if (total <= 50) return '#faf38c'; // Pale yellow
    if (total <= 70) return '#e3fa8c'; // Even lighter green
    if (total <= 80) return '#c5fa8c'; // Lighter green
    return '#a5fa8c'; // Light green
}

// Listen for real-time updates via WebSocket
socket.on('updateTrash', function(data) {
    trashDisplay2(Number(data.count));
});

// Handle "Throw Trash" button click
$('#throwTrash').on('click', function () {
    $.ajax({
        type: "POST",
        url: "/data2",
        contentType: "application/json",
        data: JSON.stringify({ distance: 1 })
    });
});

// Initial setup to fetch current count
function initialize2() {
    $.ajax({
        type: "GET",
        url: "/getCount2",
        dataType: "json",
        success: function (response) {
            if (response !== 400) {
                trashDisplay2(Number(response.distance));
            } else {
                console.log('Disconnected');
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", status, error);
        }
    });
}

// Call initialize2 function to set up the initial state
initialize2();

// Periodically check the status of the microcontroller
function checkMicrocontrollerStatus2() {
    $.ajax({
        url: '/check_status2',
        method: 'GET',
        success: function(response) {
            const isMicrocontrollerOn = response.status !== "off";
            $('#trash2').toggle(isMicrocontrollerOn);
            $('#wifi2').toggle(!isMicrocontrollerOn);
        },
        error: function(error) {
            console.error("Error: ", error);
        }
    });
}

setInterval(checkMicrocontrollerStatus2, 5000);

$('#pickTrashAdmin2').click(function (e) {
    e.preventDefault();
    $.ajax({
        url: '/process_trash2',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ dispose: 1 })
    });
});

// Fetch and update dispose count
function fetchdisposeCount2() {
    $.ajax({
        type: "GET",
        url: "/get_dispose",
        dataType: "json",
        success: function (response) {
            $('#disposeCount2').text(response.response);
        },
        error: function(xhr, status, error) {
            console.log("Error: " + error);
        }
    });
}

// Initial run on page load
$(document).ready(fetchdisposeCount2);

// Fetch on button click
$('#pickTrashAdmin2').click(fetchdisposeCount2);
