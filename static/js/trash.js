function trashDisplay(Data){
    let percent = Data;
    if (Data>100){
        Data = 0+'%';
    }else if(Data == ''){
        Data = 0+'%';
    }else if(Data < 0){
        Data = 0+'%';
    }else{
        Data = Data+'%';
    }

    let colorContent = ''

    // Lets change the color depend to percentage
    if(percent <= 20){
        colorContent = '#fa8c8c'
        console.log(colorContent)
    }else if(percent <= 30){
        colorContent = '#fab78c'
        console.log(colorContent)
    }else if(percent <= 50){
        colorContent = '#faf38c'
        console.log(colorContent)
    }else if(percent <= 70){
        colorContent = '#e3fa8c'
        console.log(colorContent)
    }else if(percent <= 80){
        colorContent = '#c5fa8c'
        console.log(colorContent)
    }else if(percent <= 100){
        colorContent = '#a5fa8c'
        console.log(colorContent)
    }

    $('#trashPercent').text(Data)

    $('.trashBinContainer').css({
        'display': 'flex',
        'background-color': '#d3edf8',
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
    })

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

$(document).on('input', function(){
    const trashData = $('#trashData').val()
    trashDisplay(trashData)
});