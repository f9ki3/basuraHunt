$('#report_student').on('click', function(){
    let desc = $('#desc').val();
    let med = $('#med')[0].files[0]; // Get the file input

    if (!med) {
        alert('Please select a file.');
        return;
    }

    let allowedExtensions = ['jpg', 'jpeg', 'png'];
    let fileExtension = med.name.split('.').pop().toLowerCase(); // Get file extension

    if (!allowedExtensions.includes(fileExtension)) {
        alert('Only JPG and PNG files are allowed.');
        return;
    }

    let formData = new FormData();
    formData.append('desc', desc);
    formData.append('med', med); // Attach the file

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
                // console.log(response);
                studentReportPost()
                $('#post_content').show();
                $('#loader_post').hide();
                $('#desc, #med').val('')
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
    }, 3000);
});

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
                    switch (report.status) {
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
                        <div class="d-flex">
                            <i class="bi me-2 fs-3 bi-person-circle"></i>
                            <p class="text-muted">Idan Encinas</p>
                        </div>
                        
                        <div style="height: auto;" class="p-3 bg-light rounded-4">
                            <p>${report.description}</p>
                        </div>
                        <div style="height: 300px; width: 100%" class="mt-3 border bg-light rounded-4">
                            <img style="object-fit: cover; width: 100%; height: 100%;" class="rounded-4" src="../static/uploads/${report.media}" alt="Image">
                        </div>
                        <div>
                            <button class="btn border mt-3"><i class="bi bi-reply me-2"></i> Follow Up</button>
                            ${statusButtons}
                        </div>
                    </div>
                    `;
                    // Append each report to the container
                    $('#reportContainer').append(reportHtml);
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
    const maxLength = 0;
    const currentLength = textarea.value.length;
    const remainingChars = maxLength + currentLength;

    document.getElementById('char-count').textContent = `${remainingChars} / 300`;
}


// Optionally, if you want the textarea to auto-resize as the user types
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}
