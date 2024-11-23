let currentImageIndex = 0; // Global variable to keep track of the current image index
let imagesArray = []; // Global array to store image paths

function studentReportPost() {
    $.ajax({
        type: "GET",
        url: "/getReport",
        dataType: "json", // Automatically parses JSON
        success: function (data) {
            data = JSON.parse(data);
            $('#reportContainer').empty(); // Clear the container before appending new data
        
            // Check if data is an array
            if (Array.isArray(data)) {
                data.reverse().forEach(function(report) {
                    // Skip reports with status "Resolve"
                    if (report.report_status === '2' || report.report_status === '3') {
                        // Skip this iteration if the status is '2' or '3'
                        return;
                    }
        
                    // Determine which status button to show
                    let statusButtons = '';
                    switch (report.report_status) {
                        case '0':
                            statusButtons = `<button class="btn border mt-3" disabled><i class="bi bi-repeat me-2"></i> Pending</button>`;
                            break;
                        case '1':
                            statusButtons = `<button class="btn border mt-3" disabled><i class="bi bi-repeat me-2"></i> Responding</button>`;
                            break;
                        default:
                            statusButtons = ''; // No button for any other status
                    }
        
                    // Split report_media by comma and get the images
                    let mediaArray = report.report_media.split(',');
                    let firstImage = mediaArray[0];
                    let globalStudentId = $('#global_student_id').val();
                    let reportHtml = `
                        <div class="border p-4 rounded rounded-4 mb-3 shadow" style="height: auto;">
                            <div class="d-flex justify-content-between">
                                <div class="d-flex align-items-center">
                                    <i class="bi me-2 fs-3 bi-person-circle"></i>
                                    <p class="text-muted mb-0">Anonymous</p>
                                </div>
                                <div>
                                    ${
                                        String(report.user_id) === globalStudentId
                                            ? `
                                            <button 
                                                style="background-color: transparent; border: none" 
                                                data-bs-toggle="modal" 
                                                data-bs-target="#delete" 
                                                class="delete-btn" 
                                                data-id="${report.report_id}">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                            `
                                            : ""
                                    }
                                </div>
                            </div>
                            
                            <div style="height: auto;" class="p-3 bg-light rounded-4">
                                <p>${report.report_description}</p>
                            </div>

                            <div 
                                style="height: 300px; width: 100%; cursor: pointer;" 
                                class="mt-3 border bg-light rounded-4" 
                                data-bs-toggle="modal" 
                                data-bs-target="#view_img">
                                ${
                                    firstImage.match(/\.(mp4|webm|ogg)$/i)
                                        ? `
                                        <video 
                                            controls 
                                            style="object-fit: cover; width: 100%; height: 100%;" 
                                            class="view-video rounded-4">
                                            <source src="../static/uploads/${firstImage}" type="video/mp4">
                                            Your browser does not support the video tag.
                                        </video>
                                        `
                                        : `
                                        <img 
                                            id="viewImage-${report.report_id}" 
                                            style="object-fit: cover; width: 100%; height: 100%;" 
                                            class="view-image rounded-4" 
                                            src="../static/uploads/${firstImage}" 
                                            alt="Report Image">
                                        `
                                }
                            </div>

                            <div>
                                <button 
                                    class="btn border mt-3" 
                                    onclick="follow_up(${report.report_id})">
                                    <i class="bi bi-reply me-2"></i> Follow Up
                                </button>
                                ${statusButtons}
                            </div>
                        </div>
                    `;

        
                    // Append each report to the container
                    $('#reportContainer').append(reportHtml);
        
                    // Add click event listener to the image
                    $(`#viewImage-${report.report_id}`).on('click', function() {
                        currentImageIndex = 0; // Reset to the first image
                        imagesArray = mediaArray; // Store images for this report
                        updateImage();
                        updateNavigationButtons();
                    });
        
                    // Handle edit button click
                    $(document).on('click', '.edit-btn', function() {
                        const reportID = $(this).data('id');
                        const reportDescription = $(this).data('description');
                        const reportMedia = $(this).data('media');
        
                        // Populate the edit fields
                        $('#editReportID').val(reportID);
                        $('#desc2').val(reportDescription);
        
                        // Clear previous images in the preview area
                        $('#edit-upload-preview').empty();
        
                        // Populate images in the edit upload preview
                        let mediaArray = reportMedia.split(',');
                        mediaArray.forEach(image => {
                            const imageElement = `
                                <div class="position-relative d-inline-block me-2">
                                    <img src="../static/uploads/${image}" alt="Image" class="img-thumbnail" style="width: 80px; height: 80px;">
                                </div>
                            `;
        
                            // Create the remove button
                            const removeButton = $('<button>')
                                .addClass('remove-btn btn btn-danger')
                                .html('<i class="bi bi-trash3"></i>')
                                .css({
                                    'position': 'absolute',
                                    'top': '5px',
                                    'right': '5px',
                                    'z-index': '10',
                                    'display': 'none'
                                });
        
                            // Append image element and remove button to the preview area
                            $('#edit-upload-preview').append(imageElement);
                            $('#edit-upload-preview').children().last().append(removeButton);
                        });
        
                        // Show remove button on hover
                        $('#edit-upload-preview').on('mouseenter', '.position-relative', function() {
                            $(this).find('.remove-btn').show();
                        }).on('mouseleave', '.position-relative', function() {
                            $(this).find('.remove-btn').hide();
                        });
        
                        // Remove image on click of the remove button
                        $('#edit-upload-preview').on('click', '.remove-btn', function() {
                            $(this).closest('.position-relative').remove(); // Remove the entire image div
                        });
                    });
        
                    // Add event listener to pass report_id to #delete_id
                    $(document).on('click', '.delete-btn', function() {
                        const reportId = $(this).data('id');
                        $('#delete_id').val(reportId); // Set the report_id to the delete_id input
                    });
                });
            } else {
                console.error('Received data is not an array:', data);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error fetching reports:', error);
        }
    });
}

let currentScale = 1; // Initialize the scale for zoom

// Update the image or video based on the current index
function updateImage() {
    if (imagesArray.length > 0) {
        let currentMedia = imagesArray[currentImageIndex];
        let mediaExtension = currentMedia.split('.').pop().toLowerCase();

        // Check if it's a video or an image and update accordingly
        if (['mp4', 'webm', 'ogg', 'mov'].includes(mediaExtension)) {
            // Display video
            $('#image-container').html(`
                <video id="zoom-video" controls style="object-fit: cover; width: 100%; height: 100%;">
                    <source src="../static/uploads/${currentMedia}" type="video/${mediaExtension}">
                    Your browser does not support the video tag.
                </video>
            `);
        } else {
            // Display image
            $('#image-container').html(`
                <img id="zoom-image" style="object-fit: cover; width: 100%; height: 100%;" src="../static/uploads/${currentMedia}" alt="Image">
            `);
        }
    }
}

// Update navigation buttons state
function updateNavigationButtons() {
    $('#previous').prop('disabled', currentImageIndex === 0); // Disable if first image
    $('#next').prop('disabled', currentImageIndex === imagesArray.length - 1); // Disable if last image
}

// Reset zoom to original
function resetZoom() {
    currentScale = 1; // Reset the zoom scale
    const zoomElement = $('#zoom-image').length ? $('#zoom-image') : $('#zoom-video');
    zoomElement.css({
        transform: 'scale(1)', // Reset scale to original
        transition: 'transform 0.3s ease' // Smooth transition
    });
}

// Zoom In
$('#zoom-in').on('click', function() {
    currentScale += 0.1; // Increase the scale
    zoomContent();
});

// Zoom Out
$('#zoom-out').on('click', function() {
    currentScale -= 0.1; // Decrease the scale
    if (currentScale < 1) currentScale = 1; // Prevent zooming out too much
    zoomContent();
});

// Zoom content function for both image and video
function zoomContent() {
    const zoomElement = $('#zoom-image').length ? $('#zoom-image') : $('#zoom-video');
    zoomElement.css({
        transform: `scale(${currentScale})`, // Apply the scale transform
        transition: 'transform 0.3s ease' // Smooth zoom transition
    });
}

// Handle Previous and Next button clicks
$('#next').on('click', function() {
    if (currentImageIndex < imagesArray.length - 1) {
        currentImageIndex++;
        updateImage();
        updateNavigationButtons();
        resetZoom(); // Reset zoom on next
    }
});

$('#previous').on('click', function() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateImage();
        updateNavigationButtons();
        resetZoom(); // Reset zoom on previous
    }
});

// Reset zoom when the modal is closed
$('#view_img').on('hidden.bs.modal', function() {
    resetZoom(); // Reset zoom when modal closes
});

// Call the function to load reports initially
studentReportPost();
setInterval(() => {
    studentReportPost();
}, 60000);

// Character count and auto-resize functions...

function updateCharCount(textarea) {
    const maxLength = 0;  // Set the correct maximum length
    const currentLength = textarea.value.length;
    const remainingChars = maxLength + currentLength;  // Calculate remaining characters

    $('#char-count, #char-count2').text(`${remainingChars} / 300`);  // Use jQuery's text() method
}

// Optionally, if you want the textarea to auto-resize as the user types
function autoResize(textarea) {
    textarea.style.height = 'auto';  // Reset height
    textarea.style.height = textarea.scrollHeight + 'px';  // Adjust height based on scrollHeight
}

studentReportPost()

function follow_up(report_id) {
    console.log("Report ID:", report_id);
    $.ajax({
        url: '/follow_up', // Replace with your endpoint URL
        type: 'POST', // POST is more appropriate for modifying data
        contentType: 'application/json', // Ensure the data is sent as JSON
        data: JSON.stringify({ report_id: report_id }), // Convert data to JSON string
        success: function(response) {
            // Handle success response
            console.log('Success:', response);
            studentReportPost(); // Call the function to refresh or update the UI
        },
        error: function(xhr, status, error) {
            // Handle error response
            console.error('Error:', error);
        }
    });
}

// put it under the delete
// <button 
//     style="background-color: transparent; border: none" 
//     data-bs-toggle="modal" 
//     data-bs-target="#edit" 
//     class="edit-btn" 
//     data-id="${report.report_id}" 
//     data-description="${report.report_description}" 
//     data-media="${report.report_media}">
//     <i class="bi bi-pencil"></i>
// </button>