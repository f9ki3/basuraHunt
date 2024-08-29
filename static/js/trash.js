let total = 0

// Lets make a function that check if message is depends on the data
// The status are, Empty Trash, Normal Level, Bin Half Filled, Critical Level, Bin Full
function message(data){
    if (data == 0 ){
        $('#messageTrash').text('Empty Trash!')
    }else if(data < 50){
        $('#messageTrash').text('Normal Level')
    }else if(data > 50 && data < 60){
        $('#messageTrash').text('Bin Half Filled')
    }else if(data < 100){
        $('#messageTrash').text('Critical Level')
    }else{
        $('#messageTrash').text('Bin Full')
    }
}

function trashDisplay(Data){
    total = total + Data;
    message(total)
    
    // ajax calls
    $.ajax({
        type: "POST",
        url: "/trashLogs",
        contentType: "application/json", // Ensure you're sending JSON
        data: JSON.stringify({ data: total }), // Serialize your data
        dataType: "json",
        success: function (response) {
            console.log(response);
        }
    });
    

    // console.log(total)
    let percent = total;
    if (total>100){
        total = total - 100
        Data = 0+'%';
    }else if(total == ''){
        Data = 0+'%';
    }else if(total < 0){
        Data = 0+'%';
    }else{
        Data = total+'%';
    }

    let colorContent = ''

    // Lets change the color depend to percentage
    if(percent <= 20){
        colorContent = '#fa8c8c'
        
    }else if(percent <= 30){
        colorContent = '#fab78c'
        
    }else if(percent <= 50){
        colorContent = '#faf38c'
        
    }else if(percent <= 70){
        colorContent = '#e3fa8c'
        
    }else if(percent <= 80){
        colorContent = '#c5fa8c'
        
    }else if(percent <= 100){
        colorContent = '#a5fa8c'
        
    }

    $('#trashPercent').text(Data)

    $('.trashBinContainer').css({
        'display': 'flex',
        'background-color': '#e3f7fe',
        'justify-content': 'center',
        'height': '350px',
        'width': '100px',
        'border-bottom': '3px solid green',
        'border-left': '3px solid green',
        'border-right': '3px solid green',
        'border-radius': ' 0px 0px 15px 15px',
        'position': 'relative'
    })

    $('.trashBinContent').css({
        'width': '100%',
        'height': Data,
        'background-color': colorContent,
        'position': 'absolute',
        'border-radius': ' 0px 0px 13px 13px',
        'bottom': '0',
        'left': '0'
    }); // Adjust the duration (1000ms) as needed

    $('.trashPercent').css({
        'position': 'absolute',
        'top': '150',
        'text-align': 'center',
        'font-weight': 'bolder',
        'z-index': '10',
        'color': 'green'
    })
}
trashDisplay(0)

$('#throwTrash').on('click', function(){
    trashDisplay(1)
});
