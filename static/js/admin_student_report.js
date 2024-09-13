let reports = [];

// Fetch and render reports with optional filters
function studentReportTable(statusFilter = '', searchQuery = '') {
    $.ajax({
        type: "GET",
        url: "/getReport",
        dataType: "json",
        success: function (data) {
            data = JSON.parse(data);
            reports = data; // Store reports for later use
            renderReports(statusFilter, searchQuery);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching reports:', error);
        }
    });
}

// Render reports based on status and search query
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
            // report.report_first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            // report.report_last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.user_email.toLowerCase().includes(searchQuery.toLowerCase()) 
            // report.user_contact.includes(searchQuery)
        );
    }

    filteredReports.forEach(function(report) {
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
}

// Event listeners for status buttons
$('#allBtn').on('click', function() {
    renderReports('', $('#searchInput').val());
});

$('#pendingBtn').on('click', function() {
    renderReports('Pending', $('#searchInput').val());
});

$('#respondingBtn').on('click', function() {
    renderReports('Responding', $('#searchInput').val());
});

$('#resolveBtn').on('click', function() {
    renderReports('Resolve', $('#searchInput').val());
});

// Event listener for search input
$('#searchInput').on('input', function() {
    const searchQuery = $(this).val();
    const statusFilter = $('.btn.active').attr('id') || ''; // Get the current filter
    renderReports(statusFilter, searchQuery);
});

// Initial load
studentReportTable();
