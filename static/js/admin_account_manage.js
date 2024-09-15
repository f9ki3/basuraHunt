$(document).ready(function() {
    $.ajax({
        url: 'accounts', // Replace with your API endpoint
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            // Clear existing data
            $('#reportTableAccounts').empty();

            // Iterate through the response data
            response.forEach(function(item) {
                // Create a row for each item
                var row = `
                    <tr>
                        <td>${item.id}</td>
                        <td><div style="width: 40px; height: 40px"><img style="border-radius: 100%; object-fit: cover; width: 100%; height: 100%" src="../static/img/${item.profle}" alt="Profile Image"></div></td>
                        <td>${item.student_no}</td>
                        <td>${item.fname + " " + item.lname}</td>
                        <td>${item.email}</td>
                        <td>${item.address ? item.address : 'N/A'}</td>
                        <td>${item.status === 1 ? 'Student' : 'Administrator'}</td>
                    </tr>
                `;

                // Append the row to the table body
                $('#reportTableAccounts').append(row);
            });
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', status, error);
        }
    });
});