let reports = [];
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;

// Fetch and render reports with optional filters and pagination
function studentReportTable(statusFilter = '', page = 1, perPage = 10) {
    $.ajax({
        type: "GET",
        url: "/getReport",
        dataType: "json",
        success: function (data) {
            data = JSON.parse(data);
            // console.log(data);
            reports = data; // Store reports for later use
            itemsPerPage = perPage; // Update items per page
            currentPage = page; // Update current page
            totalPages = Math.ceil(reports.length / itemsPerPage); // Calculate total pages
            renderReports(statusFilter, $('#searchInput').val()); // Pass search input value
        },
        error: function (xhr, status, error) {
            console.error('Error fetching reports:', error);
        }
    });
}

// Render reports based on status filter, search filter, and pagination
function renderReports(statusFilter, searchQuery = '') {
    $('#reportTable').empty(); // Clear the container before appending new data
    let filteredReports = reports;

    // Filter by status if specified
    if (statusFilter) {
        filteredReports = filteredReports.filter(report => report.report_status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredReports = filteredReports.filter(report => 
            (report.user_first_name + " " + report.user_last_name).toLowerCase().includes(query) ||
            report.user_email.toLowerCase().includes(query) ||
            report.report_id.toString().includes(query)
        );
    }

    // Sort reports by date in descending order (most recent first)
    filteredReports.sort((a, b) => new Date(b.report_date) - new Date(a.report_date));

    // Paginate the filtered reports
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedReports = filteredReports.slice(start, end);

    // Display the "No items found" message if no reports are available
    if (paginatedReports.length === 0) {
        $('#noItemsMessage').show();
    } else {
        $('#noItemsMessage').hide();
        paginatedReports.forEach(function (report) {
            let statusHtml = '';
            if (report.report_status == 0) {
                statusHtml = `
                    <div class="alert alert-warning" role="alert" style="display: inline-block; padding: 2px 8px; font-size: 12px; margin: 0;">
                        <p style="margin: 0;"><i class="bi bi-arrow-repeat me-2"></i>Pending</p>
                    </div>`;
            } else if (report.report_status == 1) {
                statusHtml = `
                    <div class="alert alert-primary" role="alert" style="display: inline-block; padding: 2px 8px; font-size: 12px; margin: 0;">
                        <p style="margin: 0;"><i class="bi bi-arrow-repeat me-2"></i>Responding</p>
                    </div>`;
            } else if (report.report_status == 2){
                statusHtml = `
                    <div class="alert alert-success" role="alert" style="display: inline-block; padding: 2px 8px; font-size: 12px; margin: 0;">
                        <p style="margin: 0;"><i class="bi bi-check-circle me-2"></i>Resolve</p>
                    </div>`;
            } else {
                statusHtml = `
                    <div class="alert alert-danger" role="alert" style="display: inline-block; padding: 2px 8px; font-size: 12px; margin: 0;">
                        <p style="margin: 0;"><i class="bi bi-send-x me-2"></i>Declined</p> 
                    </div>`;
            }

            let reportHtml = `
            <tr  onclick="showReportDetails(${report.report_id})">
                <td style="padding-top: 20px; padding-bottom: 15px">${report.report_id}</td>
                <td style="padding-top: 20px; padding-bottom: 15px">${report.report_description}</td>
                <td style="padding-top: 20px; padding-bottom: 15px">${report.user_first_name} ${report.user_last_name}</td>
                <td style="padding-top: 20px; padding-bottom: 15px">${report.user_email}</td>
                <td style="padding-top: 20px; padding-bottom: 15px">${statusHtml}</td>
            </tr>
            `;
            $('#reportTable').append(reportHtml);
        });

        renderPaginationControls();
    }
}// Show report details when a row is clicked
function showReportDetails(reportId) {
    const report = reports.find(r => r.report_id === reportId);
    if (report) {
        renderStudentRecord(report);
    }
}

// Event listeners for status buttons
$('#allBtn').on('click', function () {
    studentReportTable('', 1, itemsPerPage);
});

$('#pendingBtn').on('click', function () {
    studentReportTable('0', 1, itemsPerPage);
});

$('#respondingBtn').on('click', function () {
    studentReportTable('1', 1, itemsPerPage);
});

$('#resolveBtn').on('click', function () {
    studentReportTable('2', 1, itemsPerPage);
});

$('#declinedBtn').on('click', function () {
    studentReportTable('3', 1, itemsPerPage);
});


// Event listener for items per page selection
$('#itemsPerPage').on('change', function () {
    itemsPerPage = parseInt($(this).val(), 10);
    studentReportTable($('.btn.active').attr('id') || '', 1, itemsPerPage);
});

// Event listener for pagination controls
$('#paginationControls').on('click', 'a[data-page]', function (e) {
    e.preventDefault();
    const page = $(this).data('page');
    studentReportTable($('.btn.active').attr('id') || '', page, itemsPerPage);
});

$('#paginationControls').on('click', '#prevPage', function (e) {
    e.preventDefault();
    if (currentPage > 1) {
        studentReportTable($('.btn.active').attr('id') || '', currentPage - 1, itemsPerPage);
    }
});

$('#paginationControls').on('click', '#nextPage', function (e) {
    e.preventDefault();
    if (currentPage < totalPages) {
        studentReportTable($('.btn.active').attr('id') || '', currentPage + 1, itemsPerPage);
    }
});

// Render pagination controls
function renderPaginationControls() {
    const paginationControls = $('#paginationControls');
    paginationControls.empty();

    if (totalPages <= 1) return;

    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    const nextDisabled = currentPage === totalPages ? 'disabled' : '';

    paginationControls.append(`
        <li class="page-item ${prevDisabled}">
            <a class="page-link text-muted" href="#" id="prevPage">Previous</a>
        </li>
    `);

    for (let i = 1; i <= totalPages; i++) {
        const active = i === currentPage ? 'active' : '';
        paginationControls.append(`
            <li class="page-item ${active}">
                <a class="page-link text-muted" href="#" data-page="${i}">${i}</a>
            </li>
        `);
    }

    paginationControls.append(`
        <li class="page-item ${nextDisabled}">
            <a class="page-link text-muted" href="#" id="nextPage">Next</a>
        </li>
    `);
}

function renderStudentRecord(record) {
    $('#viewStudentRecordsTable').hide(); // Ensure this element is visible
    const viewStudentRecord = $('#viewStudentRecord');
    viewStudentRecord.empty(); // Clear previous details

    // Determine status and style
    let statusHtml = '';
    if (record.report_status == 0) {
        statusHtml = `
            <div class="alert alert-warning" role="alert" style="display: inline-block; padding: 2px 8px; font-size: 12px; margin: 0;">
                <p style="margin: 0;"><i class="bi bi-arrow-repeat me-2"></i>Pending</p>
            </div>`;
    } else if (record.report_status == 1) {
        statusHtml = `
            <div class="alert alert-primary" role="alert" style="display: inline-block; padding: 2px 8px; font-size: 12px; margin: 0;">
                <p style="margin: 0;"><i class="bi bi-arrow-repeat me-2"></i>Responding</p>
            </div>`;
    } else if (record.report_status == 2){
        statusHtml = `
            <div class="alert alert-success" role="alert" style="display: inline-block; padding: 2px 8px; font-size: 12px; margin: 0;">
                <p style="margin: 0;"><i class="bi bi-check-circle me-2"></i>Resolved</p>
            </div>`;
    } else {
        statusHtml = `
            <div class="alert alert-danger" role="alert" style="display: inline-block; padding: 2px 8px; font-size: 12px; margin: 0;">
                <p style="margin: 0;"><i class="bi bi-send-x me-2"></i>Declined</p>
            </div>`;
    }


    // Determine buttons based on report_status
    let actionButtons = '';
    if (record.report_status == 0) {
        actionButtons = `
            <button onclick="accept_report()" class="btn btn-sm me-2" style="background-color: #009429; color: white"><i class="bi bi-hand-thumbs-up me-2"></i>Accept</button>
            <button onclick="decline_report()" class="btn btn-sm" style="background-color: rgb(228, 249, 227); border: 1px solid #009429; color: #009429"><i class="bi bi-hand-thumbs-down me-2"></i>Decline</button>`;
    } else if (record.report_status == 1) {
        actionButtons = `
            <button onclick="resolve_report()" class="btn btn-sm" style="background-color: #009429; color: white"><i class="bi bi-check-circle me-2"></i>Resolve</button>`;
    } else if (record.report_status == 2) {
        actionButtons = `
            <button disabled class="btn btn-sm" style="background-color: #009429; color: white"><i class="bi bi-check-circle me-2"></i>Completed</button>`;
    } else {
        actionButtons = `
            <button disabled class="btn btn-sm" style="background-color: #009429; color: white"><i class="bi bi-send-x me-2"></i>Declined</button>`;
    }

    // Append the details to the container
    const recordHtml = `
        <div class="m-0 p-0">
            <div style="font-size: 12px">
                <div class="row mb-3">
                    <div class="col-12 d-flex flex-row justify-content-between align-items-start">
                        <h4>Report Details</h4>
                        <button onclick="close_report_details()" class="btn btn-sm border"><i class="bi bi-arrow-90deg-left me-2"></i>Back</button>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-4">
                        <p>Fullname:</p>
                    </div>
                    <div class="col-8">
                        <p>${record.user_first_name} ${record.user_last_name}</p>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-4">
                        <p>Report ID:</p>
                    </div>
                    <div class="col-8">
                        <p id="id_report">${record.report_id}</p>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-4">
                        <p>Date:</p>
                    </div>
                    <div class="col-8">
                        <p>${record.report_date}</p>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-4">
                        <p>Email:</p>
                    </div>
                    <div class="col-8">
                        <p>${record.user_email}</p>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-4">
                        <p>Contact:</p>
                    </div>
                    <div class="col-8">
                        <p>${record.user_contact || 'N/A'}</p>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-4">
                        <p>Status:</p>
                    </div>
                    <div class="col-8">
                        ${statusHtml}
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-4">
                        <p>Media:</p>
                    </div>
                    <div class="col-8">
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                            ${record.report_media.split(',').map(media => {
                                // Check if the file is an image or video
                                if (media.match(/\.(jpg|jpeg|png|gif)$/i)) {
                                    return `
                                        <div class="col">
                                            <a href="../static/uploads/${media}" target="_blank" class="d-block h-100">
                                                <img class="rounded-4 w-100 h-100 object-fit-cover" src="../static/uploads/${media}" alt="Media Upload">
                                            </a>
                                        </div>
                                    `;
                                } else if (media.match(/\.(mp4|webm|ogg|mov)$/i)) {
                                    return `
                                        <div class="col">
                                            <a href="../static/uploads/${media}" target="_blank" class="d-block h-100">
                                                <video class="rounded-4 w-100 h-100 object-fit-cover" controls>
                                                    <source src="../static/uploads/${media}" type="video/${media.split('.').pop()}">
                                                    Your browser does not support the video tag.
                                                </video>
                                            </a>
                                        </div>
                                    `;
                                } else {
                                    return ''; // In case the file type is unsupported
                                }
                            }).join('')}
                        </div>

                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-4">
                        <p>Description:</p>
                    </div>
                    <div class="col-8">
                        <p>${record.report_description}</p>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-4">
                        <p>Action:</p>
                    </div>
                    <div class="col-8">
                        ${actionButtons}
                    </div>
                </div>
            </div>
        </div>
    `;

    viewStudentRecord.append(recordHtml);
}



// Event listener for the search input
$('#searchInput').on('input', function () {
    const searchQuery = $(this).val();
    studentReportTable($('.btn.active').attr('id') || '', currentPage, itemsPerPage);
});


function close_report_details() {
    $('#viewStudentRecord').hide(); // Hide the details view
}

// Initial load
studentReportTable();



function close_report_details(){
    $('#viewStudentRecord').empty()
    $('#viewStudentRecordsTable').show()
}

function accept_report() {
    const id = $('#id_report').text();

    // Make an AJAX request to update the report status
    $.ajax({
        url: '/update_report_status', // Replace with the actual API route
        method: 'POST',
        data: JSON.stringify({ report_id: id, status: 1 }), // Send data as JSON
        contentType: 'application/json', // Specify content type as JSON
        success: function(response) {
            if (response.success) {
                // Reload the record after successful update
                location.reload(); // Reload the page to show the updated status
            } else {
                alert('Error updating report status');
            }
        },
        error: function() {
            alert('Failed to update report status');
        }
    });
}

function resolve_report() {
    const id = $('#id_report').text();

    // Make an AJAX request to update the report status
    $.ajax({
        url: '/update_report_status_resolve', // Replace with the actual API route
        method: 'POST',
        data: JSON.stringify({ report_id: id, status: 2 }), // Send data as JSON
        contentType: 'application/json', // Specify content type as JSON
        success: function(response) {
            if (response.success) {
                // Reload the record after successful update
                location.reload(); // Reload the page to show the updated status
            } else {
                alert('Error updating report status');
            }
        },
        error: function() {
            alert('Failed to update report status');
        }
    });
}

function decline_report() {
    const id = $('#id_report').text();

    // Make an AJAX request to update the report status
    $.ajax({
        url: '/update_report_status_resolve', // Replace with the actual API route
        method: 'POST',
        data: JSON.stringify({ report_id: id, status: 3 }), // Send data as JSON
        contentType: 'application/json', // Specify content type as JSON
        success: function(response) {
            if (response.success) {
                // Reload the record after successful update
                location.reload(); // Reload the page to show the updated status
            } else {
                alert('Error updating report status');
            }
        },
        error: function() {
            alert('Failed to update report status');
        }
    });
}

