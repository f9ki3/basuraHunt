setInterval(function() {
    function getCount(callback) {
        $.ajax({
            type: "GET",
            url: "/getCount2",
            dataType: "json",
            success: function (response) {
                callback(Number(response)); // Pass the response to the callback
            }
        });
    }
    
    getCount(function(data) {
        let total = data
        // Lets make a function that check if message is depends on the data
        // The status are, Empty Trash, Normal Level, Bin Half Filled, Critical Level, Bin Full
        function message(data){
            if (data == 0 ){
                $('#messageTrash2').text('Empty Trash!')
            }else if(data < 50){
                $('#messageTrash2').text('Normal Level')
            }else if(data > 50 && data < 70){
                $('#messageTrash2').text('Bin Half Filled')
            }else if(data < 100){
                $('#messageTrash2').text('Critical Level')
            }else{
                $('#messageTrash2').text('Bin Full')
            }
        }
    
        function updateCount(total){
            $.ajax({
                type: "POST",
                url: "/updateCount2",
                data: {total: total},
                dataType: "json",
                success: function (response) {
                    // console.log(response); 
                }
            });
        }
    
        function trashDisplay(Data){
            total = total + Data;
            message(total)
            updateCount(total)
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
            if (percent <= 20) {
                colorContent = '#a5fa8c'; // Light green
            } else if (percent <= 30) {
                colorContent = '#c5fa8c'; // Lighter green
            } else if (percent <= 50) {
                colorContent = '#e3fa8c'; // Even lighter green
            } else if (percent <= 70) {
                colorContent = '#faf38c'; // Pale yellow
            } else if (percent <= 80) {
                colorContent = '#fab78c'; // Light orange
            } else if (percent <= 100) {
                colorContent = '#fa8c8c'; // Light red
            }
    
            $('#trashPercent2').text(Data)
    
            $('.trashBinContainer2').css({
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
    
            $('.trashBinContent2').css({
                'width': '100%',
                'height': Data,
                'background-color': colorContent,
                'position': 'absolute',
                'border-radius': ' 0px 0px 13px 13px',
                'bottom': '0',
                'left': '0'
            }); // Adjust the duration (1000ms) as needed
    
            $('.trashPercent2').css({
                'position': 'absolute',
                'top': '150',
                'text-align': 'center',
                'font-weight': 'bolder',
                'z-index': '10',
                'color': 'green'
            })
        }
        trashDisplay(0)
        // setInterval(function() {
        //     trashDisplay(0);
        // }, 2000);
    
    
        $('#throwTrash2').on('click', function(){
            trashDisplay(1)
        });
    });    
},3000)
