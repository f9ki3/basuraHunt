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
                <td class="text-muted">${report.report_first_name + ' ' + report.report_last_name}</td>
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

// Initial load
studentReportTable();
