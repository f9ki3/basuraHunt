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

function trashDisplay2(total2) {
    total2 = Math.max(0, Math.min(total2, 100));
    $('#pickTrashAdmin2').prop('disabled', true);
    const reversedtotal22 = 100 - total2;
    const displayHeight2 = total2 <= 5 ? '100%' : reversedtotal22 + '%';

    updateMessage2(reversedtotal22);
    updateTrashBinStyles2(total2, displayHeight2);
    $('#trashPercent2').text(total2 <= 5 ? '100%' : reversedtotal22 + '%');
    $('#trash2percent').text(total2 <= 5 ? '100%' : reversedtotal22 + '%');
}

function updateTrashBinStyles2(total2, displayHeight2) {
    const colorContent = getColorBytotal22(total2);

    $('.trashBinContent2').css({
        'width': '100%',
        'height': displayHeight2,
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

function getColorBytotal22(total2) {
    if (total2 <= 20) return '#fa8c8c'; // Light red
    if (total2 <= 30) return '#fab78c'; // Light orange
    if (total2 <= 50) return '#faf38c'; // Pale yellow
    if (total2 <= 70) return '#e3fa8c'; // Even lighter green
    if (total2 <= 80) return '#c5fa8c'; // Lighter green
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

// Periodically check the status of the microcontroller
function checkMicrocontrollerStatus2() {
    $.ajax({
        url: '/check_status2',
        method: 'GET',
        success: function(response) {
            const isMicrocontrollerOn = response.status !== "off";
            $('#trash2').toggle(isMicrocontrollerOn);
            $('#wifi2').toggle(!isMicrocontrollerOn);
            $('#dashtrash2').toggle(isMicrocontrollerOn);
            $('#wifidash2').toggle(!isMicrocontrollerOn);
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
