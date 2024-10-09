$(document).ready(function () {
    $('#acc_type').click(function () {
        const type = $('#acc_type').val();

        // Clear all input fields, selects, and text areas, and remove validation classes
        const clearInputs = () => {
            // Target all input fields, select elements, and text areas in both admin and student pages
            $('#student_page input, #student_page select, #student_page textarea, #admin_page input, #admin_page select, #admin_page textarea')
                .val('') // Clear input and textarea values
                .removeClass('is-valid is-invalid'); // Remove validation classes
            $('#student_page select, #admin_page select').prop('selectedIndex', 0); // Reset select elements to default
        };

        // Switch between admin and student pages
        if (type == 'admin') {
            $('#student_page').hide();
            $('#admin_page').show();
            clearInputs(); // Clear inputs when switching to admin
        } else if (type == 'student') {
            $('#student_page').show();
            $('#admin_page').hide();
            clearInputs(); // Clear inputs when switching to student
        }
    });
});




$(document).ready(function () {
    // Real-time validation function
    function validateInput() {
        let allValid = true; // Flag to check if all fields are valid

        // Validate Grade
        if ($('#student_grade').val() === null) {
            $('#student_grade').addClass('is-invalid').removeClass('is-valid');
            allValid = false;
        } else {
            $('#student_grade').addClass('is-valid').removeClass('is-invalid');
        }

        // Validate Strand
        if ($('#student_strand').val() === null) {
            $('#student_strand').addClass('is-invalid').removeClass('is-valid');
            allValid = false;
        } else {
            $('#student_strand').addClass('is-valid').removeClass('is-invalid');
        }

        // Validate Section
        if ($('#student_section').val().trim() === '') {
            $('#student_section').addClass('is-invalid').removeClass('is-valid');
            allValid = false;
        } else {
            $('#student_section').addClass('is-valid').removeClass('is-invalid');
        }

        // Validate Student ID
        if ($('#student_id').val().trim() === '') {
            $('#student_id').addClass('is-invalid').removeClass('is-valid');
            allValid = false;
        } else {
            $('#student_id').addClass('is-valid').removeClass('is-invalid');
        }

        // Validate First Name
        if ($('#student_fname').val().trim() === '') {
            $('#student_fname').addClass('is-invalid').removeClass('is-valid');
            allValid = false;
        } else {
            $('#student_fname').addClass('is-valid').removeClass('is-invalid');
        }

        // Validate Last Name
        if ($('#student_lname').val().trim() === '') {
            $('#student_lname').addClass('is-invalid').removeClass('is-valid');
            allValid = false;
        } else {
            $('#student_lname').addClass('is-valid').removeClass('is-invalid');
        }

        // Validate Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($('#student_email').val().trim())) {
            $('#student_email').addClass('is-invalid').removeClass('is-valid');
            allValid = false;
        } else {
            $('#student_email').addClass('is-valid').removeClass('is-invalid');
        }

        // Validate Contact
        if ($('#student_contact').val().trim() === '' || isNaN($('#student_contact').val().trim())) {
            $('#student_contact').addClass('is-invalid').removeClass('is-valid');
            allValid = false;
        } else {
            $('#student_contact').addClass('is-valid').removeClass('is-invalid');
        }

        // Validate Address
        if ($('#student_address').val().trim() === '') {
            $('#student_address').addClass('is-invalid').removeClass('is-valid');
            allValid = false;
        } else {
            $('#student_address').addClass('is-valid').removeClass('is-invalid');
        }

        // Validate Password and Confirm Password
        const password = $('#student_password').val().trim();
        const confirmPassword = $('#student_confirm_password').val().trim();
        
        // Check only if both fields are filled before checking for match
        if (password === '') {
            $('#student_password').addClass('is-invalid').removeClass('is-valid');
            allValid = false;
        } else {
            $('#student_password').addClass('is-valid').removeClass('is-invalid');
        }
        
        if (confirmPassword === '') {
            $('#student_confirm_password').addClass('is-invalid').removeClass('is-valid');
            allValid = false;
        } else {
            $('#student_confirm_password').removeClass('is-invalid'); // Remove invalid class if confirm password is not empty
            if (password !== confirmPassword) {
                $('#student_confirm_password').addClass('is-invalid').removeClass('is-valid');
                allValid = false;
            } else {
                $('#student_confirm_password').addClass('is-valid').removeClass('is-invalid');
            }
        }

        // Enable or disable the Create Student button based on validation
        $('#createAddStudent').prop('disabled', !allValid);
    }

    // Bind the validateInput function to input events
    $('#student_grade, #student_strand, #student_section, #student_id, #student_fname, #student_lname, #student_email, #student_contact, #student_address, #student_password, #student_confirm_password').on('input change', validateInput);

    // Initial state: disable the button
    $('#createAddStudent').prop('disabled', true);
    



    
    function validateAdminInput() {
        const inputs = {
            fname: $('#admin_fname'),
            lname: $('#admin_lname'),
            email: $('#admin_email'),
            contact: $('#admin_contact'),
            address: $('#admin_address'),
            password: $('#admin_password'),
            confirmPassword: $('#admin_confirm_password'),
        };
    
        let allValid = true; // Initialize a flag to track overall validity
    
        // Validate each input field
        Object.entries(inputs).forEach(([key, input]) => {
            if (key === 'email') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.val().trim())) {
                    input.addClass('is-invalid').removeClass('is-valid');
                    allValid = false; // Set flag to false if invalid
                } else {
                    input.addClass('is-valid').removeClass('is-invalid');
                }
            } else if (key === 'contact') {
                if (input.val().trim().length < 10) {
                    input.addClass('is-invalid').removeClass('is-valid');
                    allValid = false;
                } else {
                    input.addClass('is-valid').removeClass('is-invalid');
                }
            } else if (key === 'password') {
                if (input.val().length === 0) {
                    input.addClass('is-invalid').removeClass('is-valid');
                    allValid = false;
                } else {
                    input.addClass('is-valid').removeClass('is-invalid');
                }
            } else if (key === 'confirmPassword') {
                const password = inputs.password.val();
                if (input.val() !== password || input.val() === '') {
                    input.addClass('is-invalid').removeClass('is-valid');
                    allValid = false;
                } else {
                    input.addClass('is-valid').removeClass('is-invalid');
                }
            } else {
                if (input.val().trim().length < 2) {
                    input.addClass('is-invalid').removeClass('is-valid');
                    allValid = false;
                } else {
                    input.addClass('is-valid').removeClass('is-invalid');
                }
            }
        });
    
        // Enable or disable the button based on overall validity
        $('#createAddAdmin').prop('disabled', !allValid);
    }
    
    // Attach input events for real-time validation for admins
    $('#admin_fname, #admin_lname, #admin_email, #admin_contact, #admin_address, #admin_password, #admin_confirm_password').on('input', validateAdminInput);
    





    $('#createAddStudent').click(function() {
        // Gather data from the input fields
        const studentData = {
            grade: $('#student_grade').val(),
            strand: $('#student_strand').val(),
            section: $('#student_section').val(),
            student_id: $('#student_id').val(),
            first_name: $('#student_fname').val(),
            last_name: $('#student_lname').val(),
            email: $('#student_email').val(),
            contact: $('#student_contact').val(),
            address: $('#student_address').val(),
            password: $('#student_password').val(),
            confirm_password: $('#student_confirm_password').val()
        };

        $('#text_add_student').hide()
        $('#load_add_student').show()
        // Make the AJAX request to the Flask endpoint
        setTimeout(() => {
            $.ajax({
                url: '/create_student',  // Replace with your Flask endpoint
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(studentData),
                success: function(response) {
                    // Handle success response
                    console.log('Student created successfully:', response);
                    $('#account_success').show()
                    $('#text_add_student').show()
                    $('#load_add_student').hide()
                    setTimeout(() => {
                        location.reload()
                    }, 2000);
                    // Optionally, you can add code to close the modal or reset the form here
                },
                error: function(error) {
                    // Handle error response
                    console.error('Error creating student:', error);
                }
            });
        }, 3000);
    });



    $('#createAddAdmin').on('click', function() {
        // Get the form data
        let adminData = {
            'first_name': $('#admin_fname').val(),
            'last_name': $('#admin_lname').val(),
            'email': $('#admin_email').val(),
            'contact': $('#admin_contact').val(),
            'address': $('#admin_address').val(),
            'password': $('#admin_password').val(),
            'confirm_password': $('#admin_confirm_password').val()
        };

        $('#text_add_admin').hide()
        $('#load_add_admin').show()

        setTimeout(() => {
            // Perform AJAX request
            $.ajax({
                url: '/create_admin', // Flask endpoint
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(adminData),
                success: function(response) {
                    $('#account_success').show()
                    $('#text_add_admin').show()
                    $('#load_add_admin').hide()
                    setTimeout(() => {
                        location.reload()
                    }, 2000);
                    // Optionally, close the modal or reset the form
                },
                error: function(error) {
                    alert('Error creating admin');
                }
            });
        }, 3000);
    });
});


