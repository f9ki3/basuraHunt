setInterval(() => {
    let $wifiIcon = $('#wifi-icon');

    // Cycle through the different wifi classes
    if ($wifiIcon.hasClass('bi-wifi-2')) {
        $wifiIcon.removeClass('bi-wifi-2').addClass('bi-wifi');
    } else if ($wifiIcon.hasClass('bi-wifi')) {
        $wifiIcon.removeClass('bi-wifi').addClass('bi-wifi-1');
    } else {
        $wifiIcon.removeClass('bi-wifi-1').addClass('bi-wifi-2');
    }
}, 500);  // Change icon every 1 second

setInterval(() => {
    let $wifiIcon = $('#wifi-icon2');

    // Cycle through the different wifi classes
    if ($wifiIcon.hasClass('bi-wifi-2')) {
        $wifiIcon.removeClass('bi-wifi-2').addClass('bi-wifi');
    } else if ($wifiIcon.hasClass('bi-wifi')) {
        $wifiIcon.removeClass('bi-wifi').addClass('bi-wifi-1');
    } else {
        $wifiIcon.removeClass('bi-wifi-1').addClass('bi-wifi-2');
    }
}, 500);  // Change icon every 1 second