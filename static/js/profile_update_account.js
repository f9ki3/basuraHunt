function updateStudentProfile() {
    // Collect data from the input fields
    const id = $('#profile_student_id').val(); 
    const student_no = $('#profile_student_no').val(); 
    const email = $('#profile_student_email').val();
    const fname = $('#profile_student_fname').val();
    const lname = $('#profile_student_lname').val();
    const year = $('#profile_student_grade').val();
    const strand = $('#profile_student_strand').val();
    const section = $('#profile_student_section').val();
    const contact = $('#profile_student_contact').val();
    const address = $('#profile_student_address').val();

    $('#profile_load_update_admin').show();
    $('#profile_text_update_admin').hide();

    setTimeout(() => {
        // Make the AJAX request to update the student
        $.ajax({
            url: '/update_student',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: id,
                student_no: student_no,
                email: email,
                fname: fname,
                lname: lname,
                year: year,
                strand: strand,
                section: section,
                contact: contact,
                address: address
            }),
            success: function(response) {
                console.log(response);
                if (response === 1) {
                    getSessions();
                    $('#profile_load_update_admin').hide();
                    $('#profile_text_update_admin').show();
                    $('#update_success').show();
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else if (response === 0) {
                    alert("Student not found.");
                } else if (response === 2) {
                    alert("No fields provided for update.");
                } else {
                    alert("An error occurred: " + response);
                }
            },
            error: function(xhr, status, error) {
                alert("An error occurred: " + error);
                $('#profile_load_update_admin').hide();
                $('#profile_text_update_admin').show();
            }
        });
    }, 3000);
}
