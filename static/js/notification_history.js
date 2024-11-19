// Store previous notifications data to compare changes
let previousNotifications = [];

function fetchNotifications() {
    $.ajax({
        url: '/getNotifHistory', // The endpoint
        method: 'GET',           // HTTP method
        dataType: 'json',        // Expected response format
        success: function(data) {
            // Ensure the data is an array and that it's not empty
            if (Array.isArray(data) && data.length > 0) {
                // Check if the new data is different from the previous data
                const isDataChanged = JSON.stringify(data) !== JSON.stringify(previousNotifications);

                if (isDataChanged) {
                    // Clear previous notifications if the data has changed
                    $('#notificationHistory').empty();

                    // Update the previous notifications with the new data
                    previousNotifications = data;

                    // Loop through the notifications and process each one
                    data.forEach(function(notification) {
                        let notificationHTML = '';
                        
                        // Convert the notification date string to a JavaScript Date object
                        const notificationDate = new Date(notification.date);
                        
                        // Get the current time in Philippine Standard Time (PST)
                        const currentDate = new Date();
                        const options = { timeZone: 'Asia/Manila' };
                        
                        // Adjust the notification time and current time to PST
                        const notificationDatePST = new Date(notificationDate.toLocaleString('en-US', options));
                        const currentDatePST = new Date(currentDate.toLocaleString('en-US', options));

                        const timeDifferenceMs = currentDatePST - notificationDatePST;

                        // Function to format time difference
                        function formatTimeDifference(ms) {
                            const seconds = ms / 1000;
                            const minutes = seconds / 60;
                            const hours = minutes / 60;
                            const days = hours / 24;
                            const months = days / 30;

                            if (months >= 1) {
                                return Math.floor(months) + " month(s) ago";
                            } else if (days >= 1) {
                                return Math.floor(days) + " day(s) ago";
                            } else if (hours >= 1) {
                                return Math.floor(hours) + " hour(s) ago";
                            } else if (minutes >= 1) {
                                return Math.floor(minutes) + " minute(s) ago";
                            } else {
                                return Math.floor(seconds) + " second(s) ago";
                            }
                        }

                        // Determine the time difference text
                        const timeDifferenceText = formatTimeDifference(timeDifferenceMs);

                        // Check the type of each notification and append accordingly
                        if (notification.type === 'pending') {
                            notificationHTML = `
                                <div class="alert alert-light border-none alert-dismissible fade show d-flex align-items-center" role="alert">
                                    <div class="me-3 rounded-5 p-3 fs-3 bg-warning text-white">
                                        <i class="bi bi-file-earmark-arrow-up"></i>
                                    </div>
                                    <div>
                                        <strong>${notification.fname} ${notification.lname}</strong>
                                        <p style="font-size: 12px; margin-bottom: 0;">Submitted a pending report.</p>
                                        <p style="font-size: 12px">${notification.date}</p>
                                        <p class="time-difference" style="font-size: 12px;">${timeDifferenceText}</p>
                                    </div>
                                </div>
                            `;
                        } else if (notification.type === 'responding') {
                            notificationHTML = `
                                <div class="alert alert-light border-none alert-dismissible fade show d-flex align-items-center" role="alert">
                                    <div class="me-3 rounded-5 p-3 fs-3 bg-primary text-white">
                                        <i class="bi bi-arrow-repeat"></i>
                                    </div>
                                    <div>
                                        <strong>${notification.fname} ${notification.lname}</strong>
                                        <p style="font-size: 12px; margin-bottom: 0;">Responded to the Account report.</p>
                                        <p style="font-size: 12px">${notification.date}</p>
                                        <p class="time-difference" style="font-size: 12px;">${timeDifferenceText}</p>
                                    </div>
                                </div>
                            `;
                        } else if (notification.type === 'resolved') {
                            notificationHTML = `
                                <div class="alert alert-light border-none alert-dismissible fade show d-flex align-items-center" role="alert">
                                    <div class="me-3 rounded-5 p-3 fs-3 bg-success text-white">
                                        <i class="bi bi-check-circle"></i>
                                    </div>
                                    <div>
                                        <strong>${notification.fname} ${notification.lname}</strong>
                                        <p style="font-size: 12px; margin-bottom: 0;">Resolved the Account report.</p>
                                        <p style="font-size: 12px">${notification.date}</p>
                                        <p class="time-difference" style="font-size: 12px;">${timeDifferenceText}</p>
                                    </div>
                                </div>
                            `;
                        } else if (notification.type === 'declined') {
                            notificationHTML = `
                                <div class="alert alert-light border-none alert-dismissible fade show d-flex align-items-center" role="alert">
                                    <div class="me-3 rounded-5 p-3 fs-3 bg-danger text-white">
                                        <i class="bi bi-x-circle"></i>
                                    </div>
                                    <div>
                                        <strong>${notification.fname} ${notification.lname}</strong>
                                        <p style="font-size: 12px; margin-bottom: 0;">Declined the Account Report.</p>
                                        <p style="font-size: 12px">${notification.date}</p>
                                        <p class="time-difference" style="font-size: 12px;">${timeDifferenceText}</p>
                                    </div>
                                </div>
                            `;
                        }

                        // If notificationHTML was created, append it to the #notificationHistory div
                        if (notificationHTML) {
                            $('#notificationHistory').append(notificationHTML);
                        }
                    });
                }
            } else {
                // If no notifications, show a message
                $('#notificationHistory').empty().append('<p>No notifications available.</p>');
            }
        },
        error: function(xhr, status, error) {
            // Handle the error response
            console.error('Request failed: ' + status + ', ' + error);
        }
    });
}

// Start polling every 10 seconds (10000ms)
setInterval(fetchNotifications, 5000);

// Initial fetch when the page loads
fetchNotifications();
