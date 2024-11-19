var socket = io();

function updateMessage2(data2) {
    let message;

    // Handle the case when data2 is less than or equal to 0
    if (data2 === 0) {
        message = 'Empty Trash!'; // Corrected this condition to check for exactly 0
    } else if (data2 < 50) {
        message = 'Normal Level';
    } else if (data2 < 70) {
        message = 'Bin Half Filled';
    } else if (data2 < 95) {
        message = 'Critical Level';
    } else {
        message = 'Bin Full';
        $('#pickTrashAdmin2').prop('disabled', false);
        vibrateButton();
    }

    $('#messageTrash2').text(message);
}


function vibrateButton2() {
    $('#pickTrashAdmin2').addClass('vibrate');
    setTimeout(() => $('#pickTrashAdmin2').removeClass('vibrate'), 500);
}

function trashDisplay2(total2) {
    // Make sure total2 is between 0 and 100
    total2 = Math.max(0, Math.min(total2, 100));
    const reversedTotal2 = 100 - total2;
    const displayHeight2 = total2 <= 5 ? '100%' : reversedTotal2 + '%';

    $('#pickTrashAdmin2').prop('disabled', true);
    updateMessage2(reversedTotal2);
    updateTrashBinStyles2(total2, displayHeight2);
    $('#trashPercent2, #trash2percent').text(displayHeight2);
}

function updateTrashBinStyles2(total2, displayHeight2) {
    const colorContent2 = getColorByTotal2(total2);

    $('.trashBinContent2').css({
        'width': '100%',
        'height': displayHeight2,
        'background-color': colorContent2,
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

function getColorByTotal2(total2) {
    if (total2 <= 20) return '#fa8c8c'; // Light red
    if (total2 <= 30) return '#fab78c'; // Light orange
    if (total2 <= 50) return '#faf38c'; // Pale yellow
    if (total2 <= 70) return '#e3fa8c'; // Lighter green
    if (total2 <= 80) return '#c5fa8c'; // Even lighter green
    return '#a5fa8c'; // Light green
}

socket.on('updateTrash2', function(data) {
    trashDisplay2(Number(data.count));
});

$('#throwTrash2').on('click', function () {
    $.ajax({
        type: "POST",
        url: "/data2",
        contentType: "application/json",
        data: JSON.stringify({ distance: 1 })
    });
});

function checkMicrocontrollerStatus2() {
    $.ajax({
        url: '/check_status2',
        method: 'GET',
        success: function(response) {
            const isMicrocontrollerOn = response.status !== "off";
            $('#trash2, #dashtrash2').toggle(isMicrocontrollerOn);
            $('#wifi2, #wifidash2').toggle(!isMicrocontrollerOn);
        },
        error: function(error) {
            console.error("Error: ", error);
        }
    });
}

setInterval(checkMicrocontrollerStatus2, 5000);

$('#pickTrashAdmin2').on('click', function (e) {
    e.preventDefault();
    $.ajax({
        url: '/process_trash2',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ dispose: 1 }),
        success: fetchDisposeCount2 // Automatically fetch dispose count on success
    });
});

function fetchDisposeCount2() {
    $.ajax({
        type: "GET",
        url: "/get_dispose2",
        dataType: "json",
        success: function (response) {
            $('#disposeCount2').text(response.response);
        },
        error: function(xhr, status, error) {
            console.log("Error: " + error);
        }
    });
}

$(document).ready(fetchDisposeCount2);
