$('#auth').html(`
    <div id="create_page" style="display: none" class="col-12 col-md-6 col-lg-3" style="color: #252422;">
        <div class="d-flex justify-content-center align-items-center mt-3" style="width: 100%; margin-bottom: 100px;">
            <div style="width: 15%;">
                <img style="object-fit: cover; width: 100%; height: auto;" src="../static/img/icon.webp" alt="Icon">
            </div>
        </div>
        <h2 class="fw-bolder w-100 mb-5 text-center">Create an Account</h2>

        <div>
            <div id="message_alert" style="display: none" class="alert ps-4 alert-primary alert-dismissible fade show" role="alert">
            <strong>Note:</strong> You should use strong password containing numbers or specal characters.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>

        <div id="prm">
            <input autocomplete="off" id="email" type="email" placeholder="Enter your Email" class="ps-4 form-control mb-3 fs-6 form-control-lg">
            <input autocomplete="off" id="student_id" type="text" placeholder="Enter your Student No" class="ps-4 form-control mb-3 fs-6 form-control-lg">
        </div>
    
        <div id="pass" style="display: none;">
            <input autocomplete="off" id="vpassword" type="password" placeholder="Enter Password" class="ps-4 form-control mb-3 fs-6 form-control-lg">
            <input autocomplete="off" id="cpassword" type="password" placeholder="Confirm Password" class="ps-4 form-control fs-6 form-control-lg">
        </div>
        <button id="continue" disabled class="border w-100 btn-lg fs-6 btn" style="background-color: #009429; color: white;">Continue</button>
        <button id="create" disabled class="border mt-3 w-100 btn-lg fs-6 btn" style="display: none; background-color: #009429; color: white;">Create</button>
        <button id="back" class="mt-3 w-100 btn-lg border fs-6 btn text-muted" style="display: none;">Back</button>
        <p class="text-center mt-3 mb-3">Already have an account? <a id="log" style="cursor: pointer; text-decoration: none; color: #009429">Login</a></p>
        <p class="text-center mt-3 mb-3">or</p>
        <div>
            <a href="/login" class="btn-hover mt-3 w-100 btn btn-lg fs-6 border d-flex flex-row align-items-center text-muted">
                <i class="bi bi-google fs-5 me-4 ms-2"></i> Continue with Google
            </a>
            <a href="#" class=" mt-3 w-100 btn-hover btn btn-lg fs-6 d-flex border flex-row align-items-center text-muted">
                <i class="bi bi-facebook fs-5 me-4 ms-2"></i> Continue with Facebook
            </a>
        </div>
    </div>
    `);

    $('#auth1').html(`
        <div id="log_page" class="col-12 col-md-6 col-lg-3" style="color: #252422;">
            <div class="d-flex justify-content-center align-items-center mt-3" style="width: 100%; margin-bottom: 100px;">
                <div style="width: 15%;">
                    <img style="object-fit: cover; width: 100%; height: auto;" src="../static/img/icon.webp" alt="Icon">
                </div>
            </div>
            <h2 class="fw-bolder w-100 mb-5 text-center">BasuraHunt</h2>
    
            <div id="prm">
                <input autocomplete="off" id="log_email" type="email" placeholder="Email Address" class="ps-4 form-control mb-3 fs-6 form-control-lg">
                <input autocomplete="off" id="log_password" type="password" placeholder="Enter Password" class="ps-4 form-control mb-3 fs-6 form-control-lg">
            </div>
        

            <button id="login" disabled class="border w-100 btn-lg fs-6 btn" style="background-color: #009429; color: white;">Login</button>
    
            <p class="text-center mt-3 mb-3">Don't have an Account? <a id="cre" style="cursor: pointer; text-decoration: none; color: #009429">Create</a></p>
            <p class="text-center mt-3 mb-3">or</p>
            <div>
                <a href="/login" class="btn-hover mt-3 w-100 btn btn-lg fs-6 border d-flex flex-row align-items-center text-muted">
                    <i class="bi bi-google fs-5 me-4 ms-2"></i> Continue with Google
                </a>
                <a href="#" class=" mt-3 w-100 btn-hover btn btn-lg fs-6 d-flex border flex-row align-items-center text-muted">
                    <i class="bi bi-facebook fs-5 me-4 ms-2"></i> Continue with Facebook
                </a>
            </div>
        </div>
        `);


    // create account
    $('#email, #student_id').on('input', function() {  
        let email = $('#email').val().trim();  // Trim to avoid empty spaces
        let student_id = $('#student_id').val().trim();
        
        // Email validation regex
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Validate email
        if (emailPattern.test(email)) {
            $('#email').removeClass('is-invalid').addClass('is-valid');
        } else {
            $('#email').removeClass('is-valid').addClass('is-invalid');
        }
        
        // Validate student_id (must be exactly 5 characters)
        if (student_id.length === 5) {
            $('#student_id').removeClass('is-invalid').addClass('is-valid');
        } else {
            $('#student_id').removeClass('is-valid').addClass('is-invalid');
        }
        
        // Enable/Disable the button based on both validations
        if ($('#email').hasClass('is-valid') && $('#student_id').hasClass('is-valid')) {
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
    

    $('#vpassword, #cpassword').on('input', function() {  
        let vpassword = $('#vpassword').val().trim();  // Trim to avoid empty spaces
        let cpassword = $('#cpassword').val().trim();
        
        // Validate if the passwords match
        if (vpassword && cpassword && vpassword === cpassword) {
            $('#vpassword, #cpassword').removeClass('is-invalid').addClass('is-valid');
            // console.log('Passwords match');
        } else {
            $('#vpassword, #cpassword').removeClass('is-valid').addClass('is-invalid');
            // console.log('Passwords do not match');
        }

        // Enable/Disable the button based on both validations
        if ($('#vpassword').hasClass('is-valid') && $('#cpassword').hasClass('is-valid')) {
            $('#create').prop('disabled', false);  // Enable the button
            $('#back').prop('disabled', true);
        } else {
            $('#create').prop('disabled', true);  // Disable the button
            $('#back').prop('disabled', false);
        }
    });

    $('#create').on('click', function() {  
        let email = $('#email').val()
        let student_id = $('#student_id').val()
        let vpassword = $('#vpassword').val()

        data = {
            'email': email,
            'student_id': student_id,
            'password': vpassword,
        }

        $.ajax({
            type: "POST",
            url: "/createAccountManual",
            data: JSON.stringify(data), // Convert data to JSON string
            contentType: "application/json", // Set the content type to JSON
            dataType: "json",
            success: function(response) {
                // Handle the response from the server
                console.log(response);
                // You can update your UI or perform other actions here
            },
            error: function(xhr, status, error) {
                // Handle errors here
                console.error('Error:', error);
            }
        });
        
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
    

    




    