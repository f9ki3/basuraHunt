
function session() {
    $.ajax({
        type: "GET",
        url: "/getSession",
        dataType: "json", // Automatically parses JSON
        success: function (data) {
            data = JSON.parse(data)
            // console.log(data)
            $('#fname_home').text("Hello " + data.fname)
            $('#fullname_profile').text(data.fname + " " + data.lname)
            $('#profileImage').attr('src', 'static/uploads/' + data.profile);

        },
        error: function (xhr, status, error) {
            console.error('Error fetching reports:', error);
        }
    });
    
}

session()