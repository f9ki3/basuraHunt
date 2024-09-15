$(document).ready(function() {
    const itemsPerPage = 10; // Number of items per page

    // Function to handle pagination logic and rendering
    function renderTable(data, page = 1) {
        $('#reportTableAccounts').empty(); // Clear table data

        // Sort the data by id in descending order
        data.sort(function(a, b) {
            return b.id - a.id;
        });

        // Calculate the total number of pages
        const totalPages = Math.ceil(data.length / itemsPerPage);

        // Determine the start and end index of the items for the current page
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Slice the data for the current page
        const paginatedData = data.slice(startIndex, endIndex);

        // Iterate through the paginated data and append each row to the table
        paginatedData.forEach(function(item) {
            var row = `
                <tr>
                    <td>${item.id}</td>
                    <td><div style="width: 35px; height: 35px"><img style="border-radius: 100%; object-fit: cover; width: 100%; height: 100%" src="../static/img/${item.profle}" alt="Profile Image"></div></td>
                    <td>${item.student_no}</td>
                    <td>${item.fname + " " + item.lname}</td>
                    <td>${item.email}</td>
                    <td>${item.address ? item.address : 'N/A'}</td>
                    <td>${item.status === 1 ? 'Student' : 'Administrator'}</td>
                    <td>
                        <button style="background: transparent; border: none; font-size: 20px"><i class="bi text-muted bi-trash"></i></button>
                        <button style="background: transparent; border: none; font-size: 20px"><i class="bi text-muted bi-pencil"></i></button>
                    </td>
                </tr>
            `;
            $('#reportTableAccounts').append(row);
        });

        // Call function to create pagination controls
        renderPaginationControls(page, totalPages);
    }

    // Function to render pagination controls
    function renderPaginationControls(currentPage, totalPages) {
        $('#paginationControlsAccounts').empty(); // Clear pagination controls

        // Maximum of 5 pages to show
        const maxPages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
        let endPage = Math.min(totalPages, startPage + maxPages - 1);

        if (endPage - startPage < maxPages - 1) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        // Previous button (always shown, but disabled on the first page)
        $('#paginationControlsAccounts').append(`
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link text-muted" href="#" data-page="${currentPage - 1}">Previous</a>
            </li>
        `);

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            $('#paginationControlsAccounts').append(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link text-muted" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }

        // Next button (disabled if it's the last page)
        $('#paginationControlsAccounts').append(`
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link text-muted" href="#" data-page="${currentPage + 1}">Next</a>
            </li>
        `);

        // Event listener for pagination clicks
        $('#paginationControlsAccounts a').on('click', function(e) {
            e.preventDefault();
            const newPage = $(this).data('page');
            if (!$(this).parent().hasClass('disabled')) {
                renderTable(currentData, newPage);
            }
        });
    }

    let currentData = []; // Store the current data

    // Fetch the data via AJAX
    $.ajax({
        url: 'accounts', // Replace with your API endpoint
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            currentData = response; // Store the response data

            // Initial render with page 1
            renderTable(currentData, 1);

            // Filter and render data when "All" button is clicked
            $('#allUsersBtn').on('click', function() {
                renderTable(currentData, 1); // Show all records
            });

            // Filter and render data when "Administrator" button is clicked
            $('#adminBtn').on('click', function() {
                const admins = currentData.filter(function(item) {
                    return item.status === 0; // Only administrators
                });
                renderTable(admins, 1); // Render admins on page 1
            });

            // Filter and render data when "Students" button is clicked
            $('#studentBtn').on('click', function() {
                const students = currentData.filter(function(item) {
                    return item.status === 1; // Only students
                });
                renderTable(students, 1); // Render students on page 1
            });
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', status, error);
        }
    });
});
