function clearNotif() {
    $.ajax({
      url: '/clear_notifications', // Replace with the actual URL of your route
      method: 'GET', // or 'POST' depending on your route's method
      success: function(response) {
        fetchNotificationCount()
      },
      error: function(xhr, status, error) {
        // Handle any errors that occur during the request
        console.error('Error clearing notifications:', error);
      }
    });
  }
