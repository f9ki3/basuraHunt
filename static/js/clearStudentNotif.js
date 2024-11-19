function clearNotifStudent() {
  console.log('click'); // This log is for debugging purposes, can be removed later
  
  // Perform the AJAX request to clear notifications
  $.ajax({
    url: '/clear_notifications_student',  // Ensure this is the correct endpoint
    method: 'GET',  // Change to 'POST' if that's the expected HTTP method
    success: function(response) {
      // Assuming fetchNotificationCount is a function that updates the notification count
      fetchNotificationCount();
    },
    error: function(xhr, status, error) {
      // Handle any errors that occur during the request
      console.error('Error clearing notifications:', error);
    }
  });
}
