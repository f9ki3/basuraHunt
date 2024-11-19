document.addEventListener('DOMContentLoaded', function() {
    const student_id_recycle = document.getElementById('global_student_id');
    const productSelect = document.getElementById('productSelect');
    const gradeSelect = document.getElementById('gradeSelect');
    const strandSelect = document.getElementById('strandSelect');
    const sectionSelect = document.getElementById('sectionSelect');
    const quantityInput = document.getElementById('quantityInput');
    const sub_btn = document.getElementById('sub_btn');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner'); // Spinner element

    // Function to generate recycle_id (BSR + 5-digit number)
    function generateRecycleId() {
        const randomFiveDigitNumber = Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit number
        return 'BSR' + randomFiveDigitNumber;
    }

    // Validation function to check if value is selected or quantity is entered
    function validateForm() {
        let isValid = true;
        clearErrors(); // Clear previous errors
        
        if (!productSelect.value) {
            showError(productSelect, 'productError', 'Please select a product.');
            isValid = false;
        }
        
        if (!gradeSelect.value) {
            showError(gradeSelect, 'gradeError', 'Please select a grade level.');
            isValid = false;
        }
        
        if (!strandSelect.value) {
            showError(strandSelect, 'strandError', 'Please select a strand.');
            isValid = false;
        }
        
        if (!sectionSelect.value) {
            showError(sectionSelect, 'sectionError', 'Please select a section.');
            isValid = false;
        }
        
        const quantity = quantityInput.value;
        if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
            showError(quantityInput, 'quantityError', 'Please enter a valid quantity.');
            isValid = false;
        }

        return isValid;
    }
    
    // Display error messages and add red border
    function showError(inputElement, errorId, message) {
        document.getElementById(errorId).innerText = message;
        inputElement.classList.add('border', 'border-danger'); // Add red border
    }

    // Clear error messages and remove red border
    function clearErrors() {
        document.getElementById('productError').innerText = '';
        document.getElementById('gradeError').innerText = '';
        document.getElementById('strandError').innerText = '';
        document.getElementById('sectionError').innerText = '';
        document.getElementById('quantityError').innerText = '';
        
        // Remove red borders
        removeRedBorders();
    }

    function removeRedBorders() {
        const fields = [productSelect, gradeSelect, strandSelect, sectionSelect, quantityInput];
        fields.forEach(field => {
            field.classList.remove('border', 'border-danger');
        });
    }

    // Add input event listeners for real-time validation
    productSelect.addEventListener('input', validateForm);
    gradeSelect.addEventListener('input', validateForm);
    strandSelect.addEventListener('input', validateForm);
    sectionSelect.addEventListener('input', validateForm);
    quantityInput.addEventListener('input', validateForm);

    // Handle form submission with AJAX
    submitBtn.addEventListener('click', function(event) {
        event.preventDefault();
        
        if (validateForm()) {
            // Show the spinner and disable the submit button
            spinner.classList.remove('d-none');
            sub_btn.classList.add('d-none');
            submitBtn.disabled = true;

            // Generate the recycle_id
            const recycle_id = generateRecycleId();

            // Gather form data to send as JSON, including the generated recycle_id
            const formData = {
                student_id: student_id_recycle.value,
                recycle_id: recycle_id, // Include the generated recycle_id
                product: productSelect.value,
                grade: gradeSelect.value,
                strand: strandSelect.value,
                section: sectionSelect.value,
                quantity: quantityInput.value
            };

            // Send data via AJAX
            $.ajax({
                url: '/insert_recycle', // Replace with your endpoint URL
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                    console.log('Form submitted successfully:', response);

                    // Simulate a 3-second delay before hiding the spinner and enabling the button
                    setTimeout(function() {
                        spinner.classList.add('d-none'); // Hide spinner
                        submitBtn.disabled = false; // Enable submit button
                        
                        // Redirect with the recycle_id as a query parameter
                        window.location.href = `/success-recycle?recycle_id=${recycle_id}`;
                    }, 3000); // 3000 milliseconds = 3 seconds
                },
                error: function(error) {
                    console.error('Error submitting form:', error);

                    // Simulate a 3-second delay before hiding the spinner and enabling the button
                    setTimeout(function() {
                        spinner.classList.add('d-none'); // Hide spinner
                        submitBtn.disabled = false; // Enable submit button
                        sub_btn.classList.remove('d-none');
                        window.location.href = `/success-recycle?recycle_id=${recycle_id}`;
                    }, 3000); // 3000 milliseconds = 3 seconds
                }
            });
        }
    });
});
