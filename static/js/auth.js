$('#auth').html(`
    <div id="create_page" style="display: none" class="col-12 col-md-6 col-lg-3" style="color: #252422;">
        <div class="d-flex justify-content-center align-items-center mt-3" style="width: 100%;">
            <div style="width: 70%;">
                <img style="object-fit: cover; width: 100%; height: auto;" src="../static/img/icon.webp" alt="Icon">
            </div>
        </div>
        <h2 class="fw-bolder w-100 mb-5 text-center">Create an Account</h2>

        <div>
            <div id="message_alert" style="display: none" class="alert ps-4 alert-primary alert-dismissible fade show" role="alert">
            <strong>Note:</strong> You should use strong password containing numbers or special characters.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>

        <div>
            <div id="warn_create" style="display: none" class="alert ps-4 alert-danger alert-dismissible fade show" role="alert">
            <strong>Warning</strong> Your email is already registered!.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>

        <div>
            <div id="warn_server" style="display: none" class="alert ps-4 alert-danger alert-dismissible fade show" role="alert">
            <strong>Server Error</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>

        <div id="prm">
            <div class="d-flex">
                <input autocomplete="off" id="fname" type="text" placeholder="First Name" class="ps-4 me-1 form-control mb-3 fs-6 form-control-lg">
                <input autocomplete="off" id="lname" type="text" placeholder="Last Name" class="ps-4 ms-1 form-control mb-3 fs-6 form-control-lg">
            </div>
            <input autocomplete="off" id="email" type="email" placeholder="Enter your Email" class="ps-4 form-control mb-3 fs-6 form-control-lg">
            <input autocomplete="off"  maxlength="11" id="contact" type="number" placeholder="Enter your Contact No." class="ps-4 form-control mb-3 fs-6 form-control-lg">
            <input autocomplete="off" id="student_id" type="hidden" value="00000" placeholder="Enter your Student No" class="ps-4 form-control mb-3 fs-6 form-control-lg">
        </div>
    
        <div id="pass" style="display: none;">
            <div class="d-flex mb-3">
                <select id="grade" class="form-select me-1">
                    <option disabled selected>Select Grade</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                </select>   
                <select id="strand" class="form-select ms-1">
                    <option disabled selected>Select Strand</option>
                    <option value="GAS">GAS</option>
                    <option value="STEM">STEM</option>
                    <option value="TVL">TVL</option>
                    <option value="ICT">ICT</option>
                </select>    
            </div>
            <input autocomplete="off" id="section" type="text" placeholder="Enter your section" class="ps-4 form-control mb-3 fs-6 form-control-lg">
            <input autocomplete="off" id="vpassword" type="password" placeholder="Enter Password" class="ps-4 form-control mb-3 fs-6 form-control-lg">
            <input autocomplete="off" id="cpassword" type="password" placeholder="Confirm Password" class="ps-4 form-control fs-6 form-control-lg">
        </div>
        
        <button id="continue" disabled class="border w-100 btn-lg fs-6 btn" style="background-color: #2d6979; color: white;">Continue</button>
        <button id="create" disabled class="border mt-3 w-100 btn-lg fs-6 btn" style="display: none; background-color: #2d6979; color: white;">
            <p id="create_text" class="m-0 p-0">Create</p>
            <div id="create_loader" style="display: none;" class="spinner-grow spinner-grow-sm m-1" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </button>
        <button id="back" class="mt-3 w-100 btn-lg border fs-6 btn text-muted" style="display: none;">Back</button>
        <p class="text-center mt-3 mb-3">Already have an account? <a id="log" style="cursor: pointer; text-decoration: none; color: #2d6979">Login</a></p>
        <p class="text-center mt-3 mb-3">or</p>
        <div>
            <a href="/login" class="btn-hover mt-3 w-100 btn btn-lg fs-6 border d-flex flex-row align-items-center text-muted">
                <i class="bi bi-google fs-5 me-4 ms-2"></i> Continue with Google
            </a>
            
        </div>
    </div>
    `);

    $('#auth1').html(`
        <div id="log_page" class="col-12 col-md-6 col-lg-3" style="color: #252422;">
            <div class="d-flex justify-content-center align-items-center mt-3" style="width: 100%;">
                <div style="width: 70%;">
                    <img style="object-fit: cover; width: 100%; height: auto;" src="../static/img/icon.webp" alt="Icon">
                </div>
            </div>
            <h2 class="fw-bolder w-100 mb-5 text-center">BasuraHunt</h2>
            <div>
                <div id="log_val" style="display: none;" class="alert ps-4 alert-danger alert-dismissible fade show" role="alert">
                    Incorrect email or password.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>

            <div>
                <div id="prm">
                    <input autocomplete="off" id="log_email" type="email" placeholder="Email Address" class="ps-4 form-control mb-3 fs-6 form-control-lg">
                    <input autocomplete="off" id="log_password" type="password" placeholder="Enter Password" class="ps-4 form-control mb-3 fs-6 form-control-lg">
                </div>

                <button id="login" disabled class="border w-100 btn-lg fs-6 btn" style="background-color: #2d6979; color: white;">
                    <p id="login_text" class="m-0 p-0">Login</p>
                    <div id="login_loader" style="display: none;" class="spinner-grow spinner-grow-sm m-1" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </button>
                
    
            <p class="text-center mt-3 mb-3">Don't have an Account? <a id="cre" style="cursor: pointer; text-decoration: none; color: #2d6979">Create</a></p>
            <p class="text-center mt-3 mb-3">or</p>
            <div>
                <a href="/login" class="btn-hover mt-3 w-100 btn btn-lg fs-6 border d-flex flex-row align-items-center text-muted">
                    <i class="bi bi-google fs-5 me-4 ms-2"></i> Continue with Google
                </a>
                
            </div>
        </div>
        `);


    // create account
    $('#email, #student_id, #fname, #lname, #contact').on('input', function() {  
        let email = $('#email').val().trim();  // Trim to avoid empty spaces
        let student_id = $('#student_id').val().trim();
        let fname = $('#fname').val().trim();
        let lname = $('#lname').val().trim();
        let contact = $('#contact').val().trim();  // Add contact field
    
        // Email validation regex
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Name validation regex (only alphabetic characters)
        let namePattern = /^[A-Za-z]+$/;
        
        // Student ID validation regex (exactly 5 digits)
        let studentIdPattern = /^\d{5}$/;
    
        // Contact number validation (10-15 numeric characters)
        let contactPattern = /^\d{10,15}$/;
        
        // Validate email
        if (emailPattern.test(email)) {
            $('#email').removeClass('is-invalid').addClass('is-valid');
        } else {
            $('#email').removeClass('is-valid').addClass('is-invalid');
        }
        
        // Validate student_id (must be exactly 5 numeric characters)
        if (studentIdPattern.test(student_id)) {
            $('#student_id').removeClass('is-invalid').addClass('is-valid');
        } else {
            $('#student_id').removeClass('is-valid').addClass('is-invalid');
        }
    
        // Validate first name (must not be empty and only contain letters)
        if (namePattern.test(fname) && fname !== '') {
            $('#fname').removeClass('is-invalid').addClass('is-valid');
        } else {
            $('#fname').removeClass('is-valid').addClass('is-invalid');
        }
    
        // Validate last name (must not be empty and only contain letters)
        if (namePattern.test(lname) && lname !== '') {
            $('#lname').removeClass('is-invalid').addClass('is-valid');
        } else {
            $('#lname').removeClass('is-valid').addClass('is-invalid');
        }
        
        // Validate contact number (must be between 10-15 digits)
        if (contactPattern.test(contact)) {
            $('#contact').removeClass('is-invalid').addClass('is-valid');
        } else {
            $('#contact').removeClass('is-valid').addClass('is-invalid');
        }
        
        // Enable/Disable the button based on all validations
        if ($('#email').hasClass('is-valid') && 
            $('#student_id').hasClass('is-valid') && 
            $('#fname').hasClass('is-valid') && 
            $('#lname').hasClass('is-valid') && 
            $('#contact').hasClass('is-valid')) {
            $('#continue').prop('disabled', false);  // Enable the button
        } else {
            $('#continue').prop('disabled', true);  // Disable the button
        }
    });
    

    $('#continue').on('click', function() {  
        $(this).hide();
        $('#prm').hide();
        $('#create, #pass, #back, #message_alert').show();
    });

    $('#back').on('click', function() {  
        $('#prm, #continue').show();
        $('#create, #pass, #back').hide();
    });

    

    $('#vpassword, #cpassword, #grade, #strand, #section').on('input change', function() {  
        let vpassword = $('#vpassword').val().trim();  // Trim to avoid empty spaces
        let cpassword = $('#cpassword').val().trim();
        
        // Validate Grade selection
        let gradeValid = $('#grade').val() !== null; // Ensure a grade is selected
        
        // Validate Strand selection
        let strandValid = $('#strand').val() !== null; // Ensure a strand is selected
    
        // Validate Section (must not be empty)
        let section = $('#section').val().trim();
        let sectionValid = section !== '';
    
        // Validate if the passwords match
        if (vpassword && cpassword && vpassword === cpassword) {
            $('#vpassword, #cpassword').removeClass('is-invalid').addClass('is-valid');
        } else {
            $('#vpassword, #cpassword').removeClass('is-valid').addClass('is-invalid');
        }
    
        // Update validation classes for Grade and Strand
        if (gradeValid) {
            $('#grade').removeClass('is-invalid').addClass('is-valid');
        } else {
            $('#grade').removeClass('is-valid').addClass('is-invalid');
        }
    
        if (strandValid) {
            $('#strand').removeClass('is-invalid').addClass('is-valid');
        } else {
            $('#strand').removeClass('is-valid').addClass('is-invalid');
        }
    
        // Update validation class for Section
        if (sectionValid) {
            $('#section').removeClass('is-invalid').addClass('is-valid');
        } else {
            $('#section').removeClass('is-valid').addClass('is-invalid');
        }
    
        // Enable/Disable the button based on all validations
        if ($('#vpassword').hasClass('is-valid') && 
            $('#cpassword').hasClass('is-valid') &&
            gradeValid &&
            strandValid &&
            sectionValid) {
            $('#create').prop('disabled', false);  // Enable the button
            $('#back').prop('disabled', true);
        } else {
            $('#create').prop('disabled', true);  // Disable the button
            $('#back').prop('disabled', false);
        }
    });
    

    $('#create').on('click', function() {
        $('#create_text').hide();
        $('#create_loader').show();
        $('#create').prop('disabled', true);
    
        // Get values from input fields
        let email = $('#email').val();
        let student_id = $('#student_id').val();
        let vpassword = $('#vpassword').val();
        let fname = $('#fname').val();
        let lname = $('#lname').val();
        let contact = $('#contact').val(); // Get value from the contact field
        let grade = $('#grade').val(); // Get value from the grade select
        let strand = $('#strand').val(); // Get value from the strand select
        let section = $('#section').val(); // Get value from the section field
    
        // Prepare data object
        let data = {
            'email': email,
            'student_id': student_id,
            'password': vpassword,
            'fname': fname,
            'lname': lname,
            'contact': contact, // Add contact to the data object
            'grade': grade, // Add grade to the data object
            'strand': strand, // Add strand to the data object
            'section': section // Add section to the data object
        };
    
        // Log the data for debugging
        console.log(data); 
    
        // AJAX request to the server
        setTimeout(function() {
            $.ajax({
                type: "POST",
                url: "/createAccountManual",
                data: JSON.stringify(data), // Convert data to JSON string
                contentType: "application/json", // Set the content type to JSON
                dataType: "json",
                success: function(response) {
                    let responseData = response.data;
    
                    if (responseData == 1) {
                        window.location.href = '/success_create';
                    } else if (responseData == 0) {
                        $('#message_alert').hide();
                        $('#warn_create').show();
                        $('#back').click();
                        $('#email').val('').removeClass('is-valid').addClass('is-invalid');
                    } else {
                        $('#message_alert').hide();
                        $('#warn_server').show();
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    $('#message_alert').hide();
                    $('#warn_server').show();
                },
                complete: function() {
                    $('#create_text').show();
                    $('#create_loader').hide();
                    $('#create').prop('disabled', false);
                }
            });
        }, 3000); // Delay in milliseconds
    });
        
    
    
    
    
    
    
    // Change log or create toggle

    function togglePages(showPageId) {
        $('#create_page, #log_page').hide();
        $(showPageId).show();
    }
    
    $('#cre').click(function () {
        togglePages('#create_page');
    });
    
    $('#log').click(function () {
        togglePages('#log_page');
    });
    

    // logn
    $('#log_email, #log_password').on('input', function() {

        function checkFields() {
            let log_email = $('#log_email').val();
            let log_password = $('#log_password').val();
            
            if (log_email && log_password) {
                $('#login').prop('disabled', false); // Enable button
            } else {
                $('#login').prop('disabled', true); // Disable button
            }
        }

        checkFields();
    });
    
    $('#login').click(function(){
        let log_email = $('#log_email').val()
        let log_password = $('#log_password').val()

        $('#login_text').hide();
        $('#login_loader').show();
        $('#login').prop('disabled', true);

        data = {
            'log_email': log_email,
            'log_password': log_password
        }

        setTimeout(function() {
            $.ajax({
                type: "POST",
                url: "/log_account",
                data: JSON.stringify({
                    log_email: log_email,
                    log_password: log_password
                }),
                dataType: "json",
                contentType: "application/json",
                success: function (response) {
                    // console.log(response.data)
                    if (response.data == 0) {
                        $('#login_text').show();
                        $('#login_loader').hide();
                        $('#login').prop('disabled', false);
                        window.location.href='/dashboard'
                    } else if (response.data == 1) {
                        $('#login_text').show();
                        $('#login_loader').hide();
                        $('#login').prop('disabled', false);
                        console.log(response.data)
                        window.location.href='/home'
                    } else if (response.data == 2){
                        $('#log_val').hide();
                        $('#login_text, #log_val').show();
                        $('#login_loader').hide();
                        $('#login').prop('disabled', false);
                        $('#log_email, #log_password').addClass('is-invalid');
                        
                    }
                },
                error: function (xhr, status, error) {
                    console.error("AJAX Error:", status, error);
                }
            });
        }, 3000); // 3000 milliseconds = 3 seconds
        
        
    })
    


    document.addEventListener('DOMContentLoaded', function() {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent the default action (like form submission)
                const loginButton = document.getElementById('login');
                if (loginButton) {
                    loginButton.click(); // Trigger click on the login button
                }
            }
        });
    });

    