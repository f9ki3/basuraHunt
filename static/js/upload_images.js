$(document).ready(function () {
    let maxFiles = 6;
    let selectedFiles = []; // Array to store selected files (both images and videos)

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
            alert(`You can only upload a total of ${maxFiles} files.`);
            return;
        }

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let fileType = file.type.split('/')[0]; // Check file type

            // Allow only images and videos
            if (fileType !== 'image' && fileType !== 'video') {
                alert('Only image and video files are allowed.');
                continue;
            }

            let reader = new FileReader();

            reader.onload = function (e) {
                let newDiv = $('<div>').addClass('file-container me-3 mt-3 border rounded d-flex justify-content-center align-items-center position-relative').css({
                    'width': '120px',
                    'height': '120px',
                    'overflow': 'hidden'
                });

                if (fileType === 'image') {
                    // Create the image element
                    let imgElement = $('<img>').attr('src', e.target.result).css({
                        'width': '100%',
                        'height': '100%',
                        'object-fit': 'cover' // Ensures the image fills the container proportionally
                    });
                    newDiv.append(imgElement);
                } else if (fileType === 'video') {
                    // Create the video element with autoplay and controls
                    let videoElement = $('<video>').attr('src', e.target.result).attr('controls', true).attr('autoplay', true).css({
                        'width': '100%',
                        'height': '100%',
                        'object-fit': 'cover' // Ensures the video fits the container
                    });
                    newDiv.append(videoElement);
                }

                // Create the remove button
                let removeBtn = $('<button>').addClass('remove-btn btn btn-danger').html('<i class="bi bi-trash3"></i>').css({
                    'position': 'absolute',
                    'top': '5px',
                    'right': '5px',
                    'z-index': '10',
                    'display': 'none' // Hide button initially
                });

                // Show remove button on hover over the parent div (not just the image/video)
                newDiv.hover(function () {
                    removeBtn.fadeIn(); // Use fadeIn for smoother transition
                }, function () {
                    removeBtn.fadeOut(); // Use fadeOut to hide the button smoothly
                });

                // Remove file on click
                removeBtn.on('click', function () {
                    newDiv.remove();
                    // Remove the file from the array
                    selectedFiles = selectedFiles.filter(f => f !== file);
                    // Re-enable upload button if we are below max files
                    if (selectedFiles.length < maxFiles) {
                        $('#fileUpload').prop('disabled', false);
                        $('#uploadBtn').css('pointer-events', 'auto').css('opacity', '1');
                    }
                });

                // Append the remove button to the container
                newDiv.append(removeBtn);

                // Append the new div to the preview div
                previewDiv.append(newDiv);

                // Append the selected file to the array
                selectedFiles.push(file);
            };

            reader.readAsDataURL(file);
        }

        // Disable further uploads if the limit is reached
        if (selectedFiles.length >= maxFiles) {
            $('#fileUpload').prop('disabled', true);
            $('#uploadBtn').css('pointer-events', 'none').css('opacity', '0.5');
        }
    });

    // Handle report submission and pass the selected files
    $('#report_student').on('click', function () {
        let desc = $('#desc').val();
        let strand = $('#strand').val(); // Get selected strand value
        let section = $('#section').val(); // Get entered section value
        
        if (!strand || !section) {
            alert('Please select a strand and enter a section.');
            return;
        }

        if (selectedFiles.length === 0) {
            alert('Please upload at least one file.');
            return;
        }

        // Create FormData object to send the form data
        let formData = new FormData();
        formData.append('desc', desc);
        formData.append('strand', strand); // Append strand to FormData
        formData.append('section', section); // Append section to FormData

        // Append each selected file to the FormData
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files[]', selectedFiles[i]); // Append each file with the name 'files[]'
        }

        // Log FormData content for debugging
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]); // Logs each key-value pair
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
                    selectedFiles = []; // Clear the selected files array
                    $('#fileUpload').val(''); // Clear the input field
                    $('#strand').val(''); // Clear the strand dropdown
                    $('#section').val(''); // Clear the section input field
                    $('#closeReport').click();
                    location.reload()
                },
                error: function (xhr, status, error) {
                    console.error(error);
                }
            });
        }, 3000);
    });
});
