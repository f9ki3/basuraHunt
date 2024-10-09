function populateSessionData(data) {
    // Populate the fields with the received data
    $('.profile_student_fname').val(data.fname);
    $('.profile_student_lname').val(data.lname);
    $('.profile_student_email').val(data.email);
    $('.profile_student_contact').val(data.contact);
    $('.profile_student_address').val(data.address);
    $('.profile_student_grade').val(data.year);
    $('.profile_student_strand').val(data.strand);
    $('.profile_student_section').val(data.section);
    $('.profile_student_no').val(data.student_no);
    $('.profile_student_id').val(data.id);
    
    // Update UI elements
    $('#fname_home').text("Hello " + data.fname);
    $('#fullname_profile').text(data.fname + " " + data.lname);
    $('#profileImage').attr('src', 'static/uploads/' + data.profile);
}

function getSessions() {
    $.ajax({
        type: "GET",
        url: "/getSession",
        dataType: "json",
        success: function(data) {
            data = JSON.parse(data);
            console.log(data)
            populateSessionData(data); // Populate fields with the fetched data
        },
        error: function(xhr, status, error) {
            console.error('Error fetching session data:', error);
        }
    });
}

// Run the function immediately to populate data
getSessions();