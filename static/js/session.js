
function session() {
    $.ajax({
        type: "GET",
        url: "/getSession",
        dataType: "json", // Automatically parses JSON
        success: function (data) {
            data = JSON.parse(data)
            // console.log(data)
            $('#fname_home').text("Hello " + data.fname)

            
        },
        error: function (xhr, status, error) {
            console.error('Error fetching reports:', error);
        }
    });
    
}
session()