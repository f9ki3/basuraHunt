$(document).ready(function() {
    fetchDisposeAll();
});

function fetchDisposeAll() {
    $.ajax({
        url: '/get_dispose_all',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            populateDisposeTable(data);
        },
        error: function(error) {
            console.error("Error fetching data:", error);
        }
    });
}

function populateDisposeTable(data) {
    const tbody = $('#disposeAll');
    tbody.empty(); // Clear existing rows

    // Ensure data is an array of objects
    data.forEach(item => {
        const row = `<tr>
            <td>${item.id}</td>
            <td>${item.date}</td>
            <td>Trash Collected</td>
        </tr>`;
        tbody.append(row);
    });
}
