$(document).ready(function () {
    let maxFiles = 3;

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
                let imgElement = $('<img>').attr('src', e.target.result);

                // Create the remove button
                let removeBtn = $('<button>').addClass('remove-btn').html('<i class="bi bi-trash3"></i>');

                // Remove image on click
                removeBtn.on('click', function () {
                    newDiv.remove();
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
            };

            reader.readAsDataURL(file);
        }

        // Disable further uploads if the limit is reached
        if (previewDiv.children().length >= maxFiles) {
            $('#fileUpload').prop('disabled', true);
            $('#uploadBtn').css('pointer-events', 'none').css('opacity', '0.5');
        }
    });
});