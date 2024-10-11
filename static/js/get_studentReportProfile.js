function studentReportPostProfile() {
    $.ajax({
        type: "GET",
        url: "/getReportProfile",
        dataType: "json", // Automatically parses JSON
        success: function (data) {
            data = JSON.parse(data)
            // console.log(data);
            $('#reportContainer2Profile').empty(); // Clear the container before appending new data

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
                            statusButtons = `<button class="btn border mt-3" disabled><i class="bi bi-repeat me-2"></i> Resolved</button>`;
                            break;
                        default:
                            statusButtons = ''; // No button for any other status
                    }

                    // Split report_media by comma and get the images
                    let mediaArray = report.report_media.split(',');
                    let firstImage = mediaArray.length > 0 ? mediaArray[0] : 'default-image.png'; // Fallback to a default image

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
                                <button style="background-color: transparent; border: none" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#delete" 
                                        class="delete-btn" 
                                        data-id="${report.report_id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="p-3 bg-light rounded-4">
                            <p>${report.report_description}</p>
                        </div>
                        <div style="height: 300px; width: 100%; cursor: pointer;" 
                             class="mt-3 border bg-light rounded-4" 
                             data-bs-toggle="modal" 
                             data-bs-target="#view_img">
                            <img id="viewImage-${report.report_id}" 
                                 style="object-fit: cover; width: 100%; height: 100%;" 
                                 class="view-image rounded-4" 
                                 src="../static/uploads/${firstImage}" 
                                 alt="Image">
                        </div>

                        <div>
                            <button class="btn border mt-3"><i class="bi bi-reply me-2"></i> Follow Up</button>
                            ${statusButtons}
                        </div>
                    </div>
                    `;

                    // Append each report to the container
                    $('#reportContainer2Profile').append(reportHtml);
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

studentReportPostProfile()