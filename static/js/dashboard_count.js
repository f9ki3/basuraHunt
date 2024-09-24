function get_dashboard(){
    $.ajax({
        type: "GET",
        url: "/get_dashboard",
        dataType: "json",
        success: function (response) {
            admin_count = response.admin_count
            student_count = response.student_count
            today_dispose = response.today_dispose_count
            total_dispose_count = response.total_dispose_count
            $('#admin_count').text(admin_count)
            $('#student_count').text(student_count)
            $('#today_dispose').text(today_dispose)
            $('#total_dispose_count').text(total_dispose_count)
        }
    });
}
setInterval(() => {
    get_dashboard()
}, 5000);

get_dashboard()