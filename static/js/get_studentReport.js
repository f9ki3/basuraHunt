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
                    // Determine which status button to show
                    let statusButtons = '';
                    switch (report.report_status) {
                        case '0':
                            statusButtons = `<button class="btn border mt-3" disabled><i class="bi bi-repeat me-2"></i> Pending</button>`;
                            break;
                        case '1':
                            statusButtons = `<button class="btn border mt-3" disabled><i class="bi bi-repeat me-2"></i> Responding</button>`;
                            break;
                        case '2':
                            statusButtons = `<button class="btn border mt-3" disabled><i class="bi bi-repeat me-2"></i> Resolve</button>`;
                            break;
                        default:
                            statusButtons = ''; // No button for any other status
                    }

                    // Split report_media by comma and get the images
                    let mediaArray = report.report_media.split(',');
                    let firstImage = mediaArray[0];

                    let reportHtml = `
                    <div class="border p-4 rounded rounded-4 mb-3 shadow" style="height: auto;">
                        <div class="d-flex justify-content-between">
                            <div class="d-flex">
                                <i class="bi me-2 fs-3 bi-person-circle"></i>
                                <p class="text-muted">Anonymous</p>
                            </div>
                            <div>
                                <button 
                                    style="background-color: transparent; border: none" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#edit" 
                                    class="edit-btn" 
                                    data-id="${report.report_id}" 
                                    data-description="${report.report_description}" 
                                    data-media="${report.report_media}">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button style="background-color: transparent; border: none" data-bs-toggle="modal" data-bs-target="#delete" class="delete-btn" data-id="${report.report_id}"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                        
                        <div style="height: auto;" class="p-3 bg-light rounded-4">
                            <p>${report.report_description}</p>
                        </div>
                        <div style="height: 300px; width: 100%; cursor: pointer" class="mt-3 border bg-light rounded-4" data-bs-toggle="modal" data-bs-target="#view_img">
                            <img id="viewImage-${report.report_id}" style="object-fit: cover; width: 100%; height: 100%;" class="view-image rounded-4" src="../static/uploads/${firstImage}" alt="Image">
                        </div>

                        <div>
                            <button class="btn border mt-3"><i class="bi bi-reply me-2"></i> Follow Up</button>
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
                        $('#editReportID').val(reportID);
                        $('#desc2').val(reportDescription);
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

function updateImage() {
    if (imagesArray.length > 0) {
        $('#zoom-image').attr('src', '../static/uploads/' + imagesArray[currentImageIndex]);
    }
}

function updateNavigationButtons() {
    $('#previous').prop('disabled', currentImageIndex === 0); // Disable if first image
    $('#next').prop('disabled', currentImageIndex === imagesArray.length - 1); // Disable if last image
}

// Reset zoom to original
function resetZoom() {
    $('#zoom-image').css({
        transform: 'scale(1)', // Reset scale to original
        transition: 'transform 0.3s ease' // Smooth transition
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
