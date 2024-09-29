
function studentReportPost() {
    $.ajax({
        type: "GET",
        url: "/getReport",
        dataType: "json", // Automatically parses JSON
        success: function (data) {
            data = JSON.parse(data);
            // console.log(data); // Log the response data for debugging
            $('#reportContainer').empty(); // Clear the container before appending new data
    
            // Check if data is an array
            if (Array.isArray(data)) {
                // console.log(data);
                data.reverse().forEach(function(report) {
                    // Determine which status button to show
                    let statusButtons = '';
                    switch (report.report_status) {
                        case '0':
                            statusButtons = `
                                <button class="btn border mt-3" disabled><i class="bi bi-repeat me-2"></i> Pending</button>
                                `;
                            break;
                        case '1':
                            statusButtons = `
                                <button class="btn border mt-3" disabled><i class="bi bi-repeat me-2"></i> Responding</button>
                                `;
                            break;
                        case '2':
                            statusButtons = `
                                <button class="btn border mt-3" disabled><i class="bi bi-repeat me-2"></i> Resolve</button>
                                `;
                            break;
                        default:
                            statusButtons = ''; // No button for any other status
                    }
                
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
                            <img id="viewImage-${report.report_id}" style="object-fit: cover; width: 100%; height: 100%;" class="view-image rounded-4" src="../static/uploads/${report.report_media}" alt="Image">
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
                        const imgSrc = $(this).attr('src');
                        $('#zoom-image').attr('src', imgSrc);
                    });
                    $(document).on('click', '.edit-btn', function() {
                        // Get the data from the clicked button
                        const reportID = $(this).data('id');
                        const reportDescription = $(this).data('description');
                    
                        // Populate the modal inputs with the data
                        $('#editReportID').val(reportID);
                        $('#desc2').val(reportDescription);
                    });                    
                });
                
                // Add event listener to pass report_id to #delete_id
                $(document).on('click', '.delete-btn', function() {
                    const reportId = $(this).data('id');
                    $('#delete_id').val(reportId); // Set the report_id to the delete_id input
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




studentReportPost()
setInterval(() => {
    studentReportPost()
}, 60000);

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



