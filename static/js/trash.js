$(document).on('input', function(){
    const value = parseInt($('#input_value').val(), 10); // Ensure the value is an integer
    const percent = `${value}%`; // Use the value for height

    let color = '';

    if (value <= 20) {
        color = '#f6b2b2';
    } else if (value < 35) {
        color = '#f6c8b2';
    } else if (value < 50) {
        color = '#f6d7b2';
    } else if (value < 60) {
        color = '#f6efb2';
    } else if (value < 70) {
        color = '#e4f6b2';
    } else if (value < 80) {
        color = '#d4f6b2';
    } else if (value <= 100) {
        color = '#a8fa8c';
    }

    $('.containerBin').css({
        'border-bottom': `3px solid ${color}`, // Use the variable color
        'border-left': `3px solid ${color}`, // Use the variable color
        'border-right': `3px solid ${color}`, // Use the variable color
        'border-radius-bottom-right': '10px',
        'border-radius-bottom-left': '10px',
        'height': '350px',
        'width': '150px',
        'position': 'relative'
    });

    $('.trashbin').css({
        'background-color': color, // Use the variable color
        'height': percent, // Correctly set the height as a percentage
        'position': 'absolute',
        'bottom': '0',
        'left': '0',
        'width': '100%'
    });
});
