$(document).ready(function () {
    let maxFiles = 3;
    let selectedImages = []; // Array to store selected images

    // Trigger file input when clicking the icon box
    $('#uploadBtn').on('click', function () {
        $('#fileUpload').click();
    });

    // Handle file upload and preview
    $('#fileUpload').on('change', function () {
        let files = this.files;
        let previewDiv = $('#upload-preview');
        let currentFileCount = previewDiv.children().length;

        // Check if adding the new files exceeds the maximum allowed
        if (currentFileCount + files.length > maxFiles) {
            alert(`You can only upload a total of ${maxFiles} pictures.`);
            return;
        }

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let reader = new FileReader();

            reader.onload = function (e) {
                // Create new div for each image
                let newDiv = $('<div>').addClass('image-container ms-3 border rounded d-flex justify-content-center align-items-center').css({
                    'width': '120px',
                    'height': '120px',
                    'position': 'relative'
                });

                // Create the image element
                let imgElement = $('<img>').attr('src', e.target.result).css({
                    'width': '100%',
                    'height': '100%',
                    'object-fit': 'cover'
                });

                // Create the remove button
                let removeBtn = $('<button>').addClass('remove-btn btn btn-danger').html('<i class="bi bi-trash3"></i>').css({
                    'position': 'absolute',
                    'top': '5px',
                    'right': '5px',
                    'z-index': '10',
                    'display': 'none'
                });

                // Show remove button on hover
                newDiv.hover(function () {
                    removeBtn.show();
                }, function () {
                    removeBtn.hide();
                });

                // Remove image on click
                removeBtn.on('click', function () {
                    newDiv.remove();
                    // Remove the file from the array
                    selectedImages = selectedImages.filter(img => img !== file);
                    // Re-enable upload button if we are below max files
                    if ($('#upload-preview').children().length < maxFiles) {
                        $('#fileUpload').prop('disabled', false);
                        $('#uploadBtn').css('pointer-events', 'auto').css('opacity', '1');
                    }
                });

                // Append image and remove button to the container
                newDiv.append(imgElement);
                newDiv.append(removeBtn);

                // Append the new div to the preview div
                previewDiv.append(newDiv);

                // Append the selected file to the array
                selectedImages.push(file);
            };

            reader.readAsDataURL(file);
        }

        // Disable further uploads if the limit is reached
        if (previewDiv.children().length >= maxFiles) {
            $('#fileUpload').prop('disabled', true);
            $('#uploadBtn').css('pointer-events', 'none').css('opacity', '0.5');
        }
    });

    // Handle report submission and pass the selected images
    $('#report_student').on('click', function () {
        let desc = $('#desc').val();
        
        if (selectedImages.length === 0) {
            alert('Please upload at least one image.');
            return;
        }

        // Create FormData object to send the form data
        let formData = new FormData();
        formData.append('desc', desc);

        // Append each selected image to the FormData
        for (let i = 0; i < selectedImages.length; i++) {
            formData.append('images[]', selectedImages[i]); // Append each image with the name 'images[]'
        }

        // Log FormData content
        for (let pair of formData.entries()) {
            console.log(pair[0]+ ': ' + pair[1]); // Logs each key-value pair
        }

        $('#post_content').hide();
        $('#loader_post').show();
        
        setTimeout(() => {
            $.ajax({
                type: "POST",
                url: "/insertReport",
                data: formData,
                processData: false, // Prevent jQuery from processing the data
                contentType: false, // Prevent jQuery from setting content type
                success: function (response) {
                    studentReportPost();
                    $('#post_content').show();
                    $('#loader_post').hide();
                    $('#desc').val(''); // Reset the description
                    $('#upload-preview').empty(); // Clear the preview
                    selectedImages = []; // Clear the selected images array
                },
                error: function (xhr, status, error) {
                    console.error(error);
                }
            });
        }, 3000);
    });
});
