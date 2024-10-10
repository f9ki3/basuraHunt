$(document).ready(function() {
    let itemsPerPage = 10; // Default number of items per page
    let currentData = []; // Store the current data
    let filteredData = []; // Store filtered data

    // Function to handle pagination logic and rendering
    function renderTable(data, page = 1) {
        $('#reportTableAccounts').empty(); // Clear table data
        $('#noItemsMessage').hide(); // Hide the no items message initially

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

        // If no data is found, show the message and hide the table body
        if (paginatedData.length === 0) {
            $('#reportTableAccounts').hide(); // Hide the tbody if no items found
            $('#noItemsMessage').show(); // Show the no items message
            return; // Exit the function
        } else {
            $('#reportTableAccounts').show(); // Show the tbody if items are found
        }

        // Iterate through the paginated data and append each row to the table
        paginatedData.forEach(function(item) {
            var row = `
                <tr>
                    <td>${item.id}</td>
                    <td><div style="width: 35px; height: 35px"><img style="border-radius: 100%; object-fit: cover; width: 100%; height: 100%" src="../static/img/${item.profile}" alt="Profile Image"></div></td>
                    <td>${item.contact}</td>
                    <td>${item.email}</td>
                    <td>${item.fname + " " + item.lname}</td>
                    <td>${item.address ? item.address : 'N/A'}</td>
                    <td>${item.status === 1 ? 'Student' : 'Administrator'}</td>
                    <td>
                        <button data-del_id="${item.id}" data-bs-toggle="modal" data-bs-target="#delete_account" class="btn-delete" style="background: transparent; border: none; font-size: 20px"><i class="bi text-muted bi-trash"></i></button>
                        <button data-ed_id="${item.id}" data-bs-toggle="modal" data-bs-target="#edit_account" class="btn-edit" style="background: transparent; border: none; font-size: 20px"><i class="bi text-muted bi-pencil"></i></button>
                    </td>
                </tr>
            `;
            $('#reportTableAccounts').append(row);
        });

        // Call function to create pagination controls
        renderPaginationControls(page, totalPages);

        // Add event listener for delete buttons
        $('.btn-delete').off('click').on('click', function() {
            const delId = $(this).data('del_id'); // Get the del_id
            $('#delete_id').val(delId)
        });

        // Add event listener for edit buttons
        $('.btn-edit').off('click').on('click', function() {
            const ed_id = $(this).data('ed_id'); // Get the ed_id from the button's data attribute
        
            // Make an AJAX POST request to pass the ed_id to the Flask endpoint
            $.ajax({
                url: '/edit_account',  // Flask endpoint to handle the edit request
                type: 'POST',
                contentType: 'application/json',  // Sending data as JSON
                data: JSON.stringify({ ed_id: ed_id }),  // Pass ed_id in the request payload
                success: function(response) {
                    response = JSON.parse(response)
                    // Ensure response is valid and check if data exists
                    $('#edit_form').empty(); // Clear any existing form elements inside #edit_form
                    
                    // Handle response based on status (0 for admin, 1 for student)
                    if (response.status == 1) {
                        // Populate the #edit_form with the student edit form and directly insert values
                        $('#edit_form').html(`
                            <input autocomplete="off" id="acc_id" class="acc_id me-1 form-control mb-3 form-control-sm" type="hidden" value="${response.id}">
                        
                            <!-- Grade and Strand Selection -->
                            <div class="d-flex align-items-center justify-content-center flex-row mb-3">
                                <div class="flex-fill me-2">
                                    <select id="student_grade" class="student_grade text-muted form-select form-select-sm">
                                        <option disabled>Select Grade</option>
                                        <option value="Grade 11" ${response.year === 'Grade 11' ? 'selected' : ''}>Grade 11</option>
                                        <option value="Grade 12" ${response.year === 'Grade 12' ? 'selected' : ''}>Grade 12</option>
                                    </select>
                                </div>
                                <div class="flex-fill">
                                    <select id="student_strand" class="student_strand text-muted form-select form-select-sm">
                                        <option disabled>Select Strand</option>
                                        <option value="GAS" ${response.strand === 'GAS' ? 'selected' : ''}>GAS</option>
                                        <option value="STEM" ${response.strand === 'STEM' ? 'selected' : ''}>STEM</option>
                                        <option value="TVL" ${response.strand === 'TVL' ? 'selected' : ''}>TVL</option>
                                        <option value="ICT" ${response.strand === 'ICT' ? 'selected' : ''}>ICT</option>
                                    </select>
                                </div>
                            </div>
                        
                            <!-- Section and Student ID Fields -->
                            <div class="d-flex align-items-center justify-content-center flex-row mb-3">
                                <div class="flex-fill me-1">
                                    <input autocomplete="off" id="student_section" class="student_section form-control form-control-sm" type="text" placeholder="Section" value="${response.section}">
                                </div>
                                <div class="flex-fill ms-1">
                                    <input autocomplete="off" id="student_id" class="student_id form-control form-control-sm" type="text" placeholder="Student No" value="${response.student_no}">
                                </div>
                            </div>
                        
                            <!-- First Name and Last Name Fields -->
                            <div class="d-flex">
                                <input autocomplete="off" id="student_fname" class="student_fname me-1 form-control mb-3 form-control-sm" type="text" placeholder="First Name" value="${response.fname}">
                                <input autocomplete="off" id="student_lname" class="student_lname ms-1 form-control mb-3 form-control-sm" type="text" placeholder="Last Name" value="${response.lname}">
                            </div>
                        
                            <!-- Email and Contact Fields -->
                            <div class="d-flex">
                                <input autocomplete="off" id="student_email" class="student_email me-1 form-control mb-3 form-control-sm" type="email" placeholder="Enter your Email" value="${response.email}">
                                <input autocomplete="off" id="student_contact" class="student_contact ms-1 form-control mb-3 form-control-sm" type="text" placeholder="Enter your contact" value="${response.contact}">
                            </div>
                        
                            <!-- Address -->
                            <div class="d-flex">
                                <textarea id="student_address" class="student_address form-control mb-3" placeholder="Enter your Address" style="font-size: 14px;">${response.address}</textarea>
                            </div>
                        
                            <div class="modal-footer">
                                <button type="button" style="background-color: #ccf3d7; color: #009429" class="btn" data-bs-dismiss="modal">Cancel</button>
                                <button onclick="updateStudent()" type="button" style="background-color: #009429; color: white" class="btn">
                                    <p id="text_update_admin" class="m-0 p-0">Update Student</p>
                                    <div id="load_update_admin" style="display: none;" class="spinner-grow spinner-grow-sm m-1" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </button>
                            </div>                        
                        `);
                    } else if (response.status == 0) {
                        // Populate the #edit_form with the admin edit form and directly insert values
                        $('#edit_form').html(`
                            <!-- First Name and Last Name Fields -->
                            <div class="d-flex">
                                <input autocomplete="off" id="admin_id" type="hidden" value="${response.id}" class="admin_id me-1 form-control mb-3 form-control-sm">
                                <input autocomplete="off" id="admin_fname" type="text" placeholder="First Name" value="${response.fname}" class="admin_fname me-1 form-control mb-3 form-control-sm">
                                <input autocomplete="off" id="admin_lname" type="text" placeholder="Last Name" value="${response.lname}" class="admin_lname ms-1 form-control mb-3 form-control-sm">
                            </div>
                        
                            <!-- Email and Contact Fields -->
                            <div class="d-flex">
                                <input autocomplete="off" id="admin_email" type="email" placeholder="Enter your Email" value="${response.email}" class="admin_email me-1 form-control mb-3 form-control-sm">
                                <input autocomplete="off" id="admin_contact" type="number" placeholder="Enter your contact" value="${response.contact}" class="admin_contact ms-1 form-control mb-3 form-control-sm">
                            </div>
                        
                            <!-- Address -->
                            <div class="d-flex">
                                <textarea id="admin_address" class="admin_address form-control mb-3" placeholder="Enter your Address" style="font-size: 14px;">${response.address}</textarea>
                            </div>
                        
                            <div class="modal-footer">
                                <button type="button" style="background-color: #ccf3d7; color: #009429" class="btn" data-bs-dismiss="modal">Cancel</button>
                                <button onclick="update_admin()" type="button" style="background-color: #009429; color: white" class="btn">
                                    <p id="text_update_student" class="m-0 p-0">Update Admin</p>
                                    <div id="load_update_student" style="display: none;" class="spinner-grow spinner-grow-sm m-1" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </button>
                            </div>
                        `);
                        
                        
                    }
                },
                error: function(xhr, status, error) {
                    // Handle error case
                    console.error('AJAX Error:', status, error);
                    alert('An error occurred while processing the request.');
                }
            });
        });
        

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
        $('#paginationControlsAccounts a').off('click').on('click', function(e) {
            e.preventDefault();
            const newPage = $(this).data('page');
            if (!$(this).parent().hasClass('disabled')) {
                renderTable(filteredData, newPage);
            }
        });
    }

    // Function to filter data based on the search query
    function filterData(query) {
        const filtered = currentData.filter(item => {
            const fullName = `${item.fname || ''} ${item.lname || ''}`.toLowerCase();

            return (
                fullName.includes(query.toLowerCase()) ||
                (item.email && item.email.toLowerCase().includes(query.toLowerCase())) ||
                (item.contact && item.contact.toLowerCase().includes(query.toLowerCase()))
            );
        });
        return filtered;
    }

    // Function to handle item selection from the dropdown
    function updateItemsPerPage() {
        itemsPerPage = parseInt($('#accountShowsItems').val()); // Get the selected value
        renderTable(filteredData, 1); // Re-render the table on the first page
    }

    // Search input event listener
    $('#searchInputAccount').on('input', function() {
        const query = $(this).val();
        if (query.trim() === '') {
            filteredData = currentData; // Reset to show all data when input is empty
        } else {
            filteredData = filterData(query);
        }
        renderTable(filteredData, 1); // Render filtered data on page 1
    });

    // Fetch the data via AJAX
    $.ajax({
        url: 'accounts', // Replace with your API endpoint
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            currentData = response; // Store the response data
            filteredData = currentData; // Initialize filtered data

            // Initial render with page 1
            renderTable(filteredData, 1);

            // Event listener for "All" button
            $('#allUsersBtn').off('click').on('click', function() {
                filteredData = currentData; // Show all records
                renderTable(filteredData, 1);
            });

            // Event listener for "Administrator" button
            $('#adminBtn').off('click').on('click', function() {
                filteredData = currentData.filter(function(item) {
                    return item.status === 0; // Only administrators
                });
                renderTable(filteredData, 1); // Render admins on page 1
            });

            // Event listener for "Students" button
            $('#studentBtn').off('click').on('click', function() {
                filteredData = currentData.filter(function(item) {
                    return item.status === 1; // Only students
                });
                renderTable(filteredData, 1); // Render students on page 1
            });
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', status, error);
        }
    });

    // Event listener for items per page dropdown
    $('#accountShowsItems').on('change', updateItemsPerPage);
});



function delete_account() {
    const id = $('#delete_id').val(); // Get the ID of the account to be deleted

    $.ajax({
        url: `/delete_account/${id}`, // Your Flask endpoint for deletion
        type: 'DELETE', // Using DELETE HTTP method
        success: function(response) {
            // Handle success response
            console.log('Account deleted:', response);
            $('#delete_success').show()
            setTimeout(() => {
                location.reload()
            }, 3000);
        },
        error: function(xhr, status, error) {
            // Handle error response
            console.error('Error deleting account:', error);
            alert('An error occurred while trying to delete the account.'); // Show error message
        }
    });
}


function updateStudent() {
    // Collect data from the input fields
    const id = $('#acc_id').val(); 
    const student_no = $('.student_id').val(); 
    const email = $('.student_email').val();
    const fname = $('.student_fname').val();
    const lname = $('.student_lname').val();
    const year = $('.student_grade').val();
    const strand = $('.student_strand').val();
    const section = $('.student_section').val();
    const contact = $('.student_contact').val();
    const address = $('.student_address').val();
    // Show loading spinner
    $('#load_update_admin').show();
    $('#text_update_admin').hide();

    setTimeout(() => {
        // Make the AJAX request to update the student
        $.ajax({
            url: '/update_student',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: id,
                student_no: student_no,
                email: email,
                fname: fname,
                lname: lname,
                year: year,
                strand: strand,
                section: section,
                contact: contact,
                address: address
            }),
            success: function(response) {
                console.log(response)
                if (response === 1) {
                    $('#load_update_admin').hide();
                    $('#text_update_admin').show();
                    $('#update_success').show()
                    setTimeout(() => {
                        location.reload()
                    }, 2000);
                } else if (response === 0) {
                    alert("Student not found.");
                } else if (response === 2) {
                    alert("No fields provided for update.");
                } else {
                    alert("An error occurred: " + response);
                }
            },
            error: function(xhr, status, error) {
                alert("An error occurred: " + error);
                $('#load_update_admin').hide();
                $('#text_update_admin').show();
            }
        });
    }, 3000);
}

function update_admin() {
    // Collect data from the input fields using class selectors
    const id = $('.admin_id').val(); 
    const fname = $('.admin_fname').val();
    const lname = $('.admin_lname').val();
    const email = $('.admin_email').val();
    const contact = $('.admin_contact').val();
    const address = $('.admin_address').val();
    
    // Show loading spinner
    $('#load_update_student').show();
    $('#text_update_student').hide();

    setTimeout(() => {
        // Make the AJAX request to update the admin
        $.ajax({
            url: '/update_admin', // Update the URL to your actual endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: id,
                fname: fname,
                lname: lname,
                email: email,
                contact: contact,
                address: address
            }),
            success: function(response) {
                console.log(response);
                if (response === 1) {
                    $('#load_update_student').hide();
                    $('#text_update_student').show();
                    $('#update_success').show();
                    setTimeout(() => {
                        location.reload(); // Reload the page to reflect changes
                    }, 2000);
                } else if (response === 0) {
                    alert("Admin not found.");
                } else if (response === 2) {
                    alert("No fields provided for update.");
                } else {
                    alert("An error occurred: " + response);
                }
            },
            error: function(xhr, status, error) {
                alert("An error occurred: " + error);
                $('#load_update_student').hide();
                $('#text_update_student').show();
            }
        });
    }, 3000);
}
