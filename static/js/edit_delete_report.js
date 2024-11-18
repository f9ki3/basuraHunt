function delete_report() {
    let report_id = $('#delete_id').val(); // Get the value from the delete_id input
    $.ajax({
        type: "POST",
        url: "/delete_report", // Ensure the endpoint matches the route in Flask
        contentType: "application/json", // Specify that we're sending JSON
        data: JSON.stringify({ id: report_id }), // Send the report ID as a JSON object
        dataType: "json", // Expect a JSON response
        success: function (response) {
            // Handle success response (if any actions are needed after deletion)
            console.log(response.message); // Assuming the server sends a message back
            $('#cancelDelReport').click()
            studentReportPost()
            location.reload()
        },
        error: function (xhr, status, error) {
            // Handle errors here
            console.error("Error deleting report:", error);
        }
    });
}

function edit_report() {
    let report_id = $('#editReportID').val(); // Get the report ID from the modal input
    let desc2 = $('#desc2').val(); // Get the updated description
    let med2 = $('#med2')[0].files[0]; // Get the file from the input

    let formData = new FormData();
    formData.append('id', report_id);
    formData.append('desc', desc2);

    if (med2) {
        formData.append('med', med2); // Append the file only if it exists
    }

    $.ajax({
        type: "POST",
        url: "/edit_report", // Flask route for editing the report
        processData: false,
        contentType: false, // Required for FormData
        data: formData, // Send the FormData object
        success: function (response) {
            console.log(response.message); // Assuming the server sends a message back
            $('#cancelEditReport').click()
            $('#desc2, #med2').val('')
            studentReportPost(); // Reload or refresh the report list
        },
        error: function (xhr, status, error) {
            console.error("Error editing report:", error);
        }
    });
}
