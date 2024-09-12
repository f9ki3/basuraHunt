
function session() {
    $.ajax({
        type: "GET",
        url: "/getSession",
        dataType: "json", // Automatically parses JSON
        success: function (data) {
            console.log(data)
            
        },
        error: function (xhr, status, error) {
            console.error('Error fetching reports:', error);
        }
    });
    
}
session()