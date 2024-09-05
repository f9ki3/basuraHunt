$('#auth').html(`
    <div class="col-12 col-md-6 col-lg-3" style="color: #252422;">
        <div class="d-flex justify-content-center align-items-center mt-3" style="width: 100%; margin-bottom: 100px;">
            <div style="width: 15%;">
                <img style="object-fit: cover; width: 100%; height: auto;" src="../static/img/icon.webp" alt="Icon">
            </div>
        </div>
        <h2 class="fw-bolder w-100 mb-3 text-center">Create an Account</h2>
        <div id="prm">
            <input autocomplete="off" id="email" type="email" placeholder="Email" class="ps-4 form-control mb-3 fs-6 form-control-lg">
            <input autocomplete="off" id="student_id" type="text" placeholder="Student No" class="ps-4 form-control mb-3 fs-6 form-control-lg">
        </div>
        <div id="pass" style="display: none;">
            <input autocomplete="off" id="vpassword" type="password" placeholder="Enter Password" class="ps-4 form-control mb-3 fs-6 form-control-lg">
            <input autocomplete="off" id="cpassword" type="password" placeholder="Confirm Password" class="ps-4 form-control fs-6 form-control-lg">
        </div>
        <button id="continue" disabled class="w-100 btn-lg fs-6 btn" style="background-color: #009429; color: white;">Continue</button>
        <button id="create" disabled class="mt-3 w-100 btn-lg fs-6 btn" style="display: none; background-color: #009429; color: white;">Create</button>
        <p class="text-center mt-3 mb-3">or</p>
        <div>
            <a href="/login" class=" mt-3 w-100 btn btn-lg fs-6 border d-flex flex-row align-items-center text-muted">
                <i class="bi bi-google fs-5 me-4 ms-2"></i> Continue with Google
            </a>
            <a href="#" class=" mt-3 w-100 btn btn-lg fs-6 border d-flex flex-row align-items-center text-muted">
                <i class="bi bi-facebook fs-5 me-4 ms-2"></i> Continue with Facebook
            </a>
        </div>
    </div>
    `);

    $(document).on('input', function() {  
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
        if (student_id.length === 10) {
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
        $('#create, #pass').show();
    });
    
    
    

    




    