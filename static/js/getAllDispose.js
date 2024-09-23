$(document).ready(function() {
    let currentPage = 1;
    let itemsPerPage = 10; // Number of items to show per page (default)
    let disposeData = [];
    let filteredData = []; // To hold the filtered search results

    // Fetch the disposal data
    fetchDisposeAll();

    // Listen for changes in the itemsPerPage dropdown
    $('#itemsPerPageDispose').on('change', function() {
        itemsPerPage = parseInt($(this).val()); // Update itemsPerPage based on the dropdown selection
        currentPage = 1; // Reset to the first page when items per page changes
        updateTable(); // Update the table with new pagination
        updatePaginationInfo(); // Update pagination info
    });

    // Search input event listener
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        // Filter the disposeData based on the search term
        filteredData = disposeData.filter(item => 
            item.id.toString().includes(searchTerm) ||
            item.date.toLowerCase().includes(searchTerm)
        );
        currentPage = 1; // Reset to first page after search
        updateTable(); // Update the table with search results
        updatePaginationInfo(); // Update pagination info with filtered results
    });

    function fetchDisposeAll() {
        $.ajax({
            url: '/get_dispose_all',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                disposeData = data;
                filteredData = data; // Initialize filteredData with all data
                updateTable();
                updatePaginationInfo();
            },
            error: function(error) {
                console.error("Error fetching data:", error);
                alert("Failed to load data. Please try again later.");
            }
        });
    }

    function updateTable() {
        const tbody = $('#disposeAll');
        tbody.empty(); // Clear existing rows

        // Calculate start and end indices for the current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Slice the filtered data for the current page
        const currentItems = filteredData.slice(startIndex, endIndex);

        if (currentItems.length === 0) {
            tbody.append('<tr><td colspan="3">No records found.</td></tr>');
            return;
        }

        currentItems.forEach(item => {
            const row = `<tr>
                <td style="padding-top: 20px; padding-bottom: 15px">${item.id}</td>
                <td style="padding-top: 20px; padding-bottom: 15px">${item.date}</td>
                <td style="padding-top: 20px; padding-bottom: 15px">Bin 1</td>
                <td style="padding-top: 20px; padding-bottom: 15px">Collect Trash</td>
            </tr>`;
            tbody.append(row);
        });
    }

    function updatePaginationInfo() {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        $('#pagination-info').text(`Page ${currentPage} of ${totalPages}`).addClass('disabled');

        $('#prev-page').prop('disabled', currentPage === 1);
        $('#next-page').prop('disabled', currentPage === totalPages);

        // Update pagination buttons
        updatePaginationButtons(totalPages);
    }

    function updatePaginationButtons(totalPages) {
        const paginationContainer = $('#pagination-info').parent(); // Get the parent of the pagination info
        paginationContainer.find('.page-item:not(#prev-page):not(#next-page)').remove(); // Clear existing page items

        const maxPagesToShow = 5; // Number of page buttons to show
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = `<li class="page-item ${i === currentPage ? 'active' : ''}">
                <button class="page-link" data-page="${i}">${i}</button>
            </li>`;
            paginationContainer.find('ul.pagination').append(pageButton);
        }

        // Attach click events to the dynamically created page buttons
        paginationContainer.find('.page-link').on('click', function() {
            currentPage = parseInt($(this).data('page'));
            updateTable();
            updatePaginationInfo();
        });
    }

    $('#prev-page').on('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updateTable();
            updatePaginationInfo();
        }
    });

    $('#next-page').on('click', function() {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateTable();
            updatePaginationInfo();
        }
    });
});