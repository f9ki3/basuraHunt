let reports = [];
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;

// Fetch and render reports with optional filters and pagination
function studentReportTable(statusFilter = '', searchQuery = '', page = 1, perPage = 10) {
    $.ajax({
        type: "GET",
        url: "/getReport",
        dataType: "json",
        success: function (data) {
            data = JSON.parse(data);
            console.log(data)
            reports = data; // Store reports for later use
            itemsPerPage = perPage; // Update items per page
            currentPage = page; // Update current page
            totalPages = Math.ceil(reports.length / itemsPerPage); // Calculate total pages
            renderReports(statusFilter, searchQuery);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching reports:', error);
        }
    });
}

// Render reports based on status, search query, and pagination
function renderReports(statusFilter, searchQuery) {
    $('#reportTable').empty(); // Clear the container before appending new data
    let filteredReports = reports;

    // Filter by status if specified
    if (statusFilter) {
        filteredReports = filteredReports.filter(report => report.report_status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
        filteredReports = filteredReports.filter(report => 
            report.report_first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.report_last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.user_contact.includes(searchQuery)
        );
    }

    // Paginate the filtered reports
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedReports = filteredReports.slice(start, end);

    // Display the "No items found" message if no reports are available
    if (paginatedReports.length === 0) {
        $('#noItemsMessage').show();
    } else {
        $('#noItemsMessage').hide();
        paginatedReports.forEach(function(report) {
            let reportHtml = `
            <tr>
                <td class="text-muted">${report.report_id}</td>
                <td class="text-muted">${report.user_first_name + ' ' + report.user_last_name}</td>
                <td class="text-muted">${report.user_email}</td>
                <td class="text-muted">${report.user_contact}</td>
                <td class="text-muted">${report.report_status}</td>
            </tr>
            `;
            $('#reportTable').append(reportHtml);
        });
        renderPaginationControls();
    }
}

// Event listeners for status buttons
$('#allBtn').on('click', function() {
    studentReportTable('', $('#searchInput').val(), 1, itemsPerPage);
});

$('#pendingBtn').on('click', function() {
    studentReportTable('Pending', $('#searchInput').val(), 1, itemsPerPage);
});

$('#respondingBtn').on('click', function() {
    studentReportTable('Responding', $('#searchInput').val(), 1, itemsPerPage);
});

$('#resolveBtn').on('click', function() {
    studentReportTable('Resolve', $('#searchInput').val(), 1, itemsPerPage);
});

// Event listener for search input
$('#searchInput').on('input', function() {
    studentReportTable($('.btn.active').attr('id') || '', $(this).val(), 1, itemsPerPage);
});

// Event listener for items per page selection
$('#itemsPerPage').on('change', function() {
    itemsPerPage = parseInt($(this).val(), 10);
    studentReportTable($('.btn.active').attr('id') || '', $('#searchInput').val(), 1, itemsPerPage);
});

// Event listener for pagination controls
$('#paginationControls').on('click', 'a[data-page]', function(e) {
    e.preventDefault();
    const page = $(this).data('page');
    studentReportTable($('.btn.active').attr('id') || '', $('#searchInput').val(), page, itemsPerPage);
});

$('#paginationControls').on('click', '#prevPage', function(e) {
    e.preventDefault();
    if (currentPage > 1) {
        studentReportTable($('.btn.active').attr('id') || '', $('#searchInput').val(), currentPage - 1, itemsPerPage);
    }
});

$('#paginationControls').on('click', '#nextPage', function(e) {
    e.preventDefault();
    if (currentPage < totalPages) {
        studentReportTable($('.btn.active').attr('id') || '', $('#searchInput').val(), currentPage + 1, itemsPerPage);
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
    $('#viewStudentRecordsTable').hide();
    const viewStudentRecord = $('#viewStudentRecord');
    viewStudentRecord.empty(); // Clear previous details

    // Determine status and style
    let statusHtml = '';
    if (record.report_status == 0) {
        statusHtml = `
            <div class="alert alert-warning" role="alert" style="display: inline-block; padding: 2px 8px; font-size: 12px; margin: 0;">
                <p style="margin: 0;"><i class="bi bi-arrow-repeat me-2"></i>Pending</p>
            </div>`;
    } else {
        statusHtml = `
            <div class="alert alert-success" role="alert" style="display: inline-block; padding: 2px 8px; font-size: 12px; margin: 0;">
                <p style="margin: 0;"><i class="bi bi-check-circle me-2"></i>Verified</p>
            </div>`;
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
                        <p>${record.user_first_name + " " +record.user_last_name}</p>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-4">
                        <p>Report ID:</p>
                    </div>
                    <div class="col-8">
                        <p>${record.report_id}</p>
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
                        <div style="width: 10rem; height: 10rem;">
                            <a href="../static/uploads/${record.report_media}" target="_blank">
                                <img class="rounded-4" style="object-fit: cover; width: 100%; height: 100%;" src="../static/uploads/${record.report_media}" alt="Media Upload">
                            </a>
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
                        <button class="btn btn-sm me-2" style="background-color: #009429; color: white"><i class="bi bi-hand-thumbs-up me-2"></i>Accept</button>
                        <button class="btn btn-sm" style="background-color: rgb(228, 249, 227); border: 1px solid #009429; color: #009429"><i class="bi bi-hand-thumbs-down me-2"></i>Decline</button>
                        <button style="display: none" class="btn btn-sm" style="background-color: #009429; color: white"><i class="bi bi-check-circle me-2"></i>Resolve</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    viewStudentRecord.append(recordHtml);
}


// Function to return a human-readable status
function reportStatusLabel(status) {
    switch (status) {
        case '0': return 'Pending';
        case '1': return 'Responding';
        case '2': return 'Resolved';
        default: return 'Unknown';
    }
}

// Event listener for table row clicks
$('#reportTable').on('click', 'tr', function() {
    const row = $(this);
    const reportId = row.find('td').first().text(); // Assuming the first cell contains the report ID

    // Find the corresponding report data
    const report = reports.find(r => r.report_id == reportId);

    if (report) {
        renderStudentRecord(report);
    }
});

function close_report_details(){
    $('#viewStudentRecord').empty()
    $('#viewStudentRecordsTable').show()
}

// Initial load
studentReportTable();
