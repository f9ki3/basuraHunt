function updateDateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const dateString = now.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });

    // Update time
    $('.time-display').text(timeString);
    
    // Update date
    $('.date-display').text(dateString);

    // Update greeting based on the current time
    let greeting = '';
    if (hours >= 0 && hours < 12) {
        greeting = 'Good Morning, Administrator';
    } else if (hours >= 12 && hours < 18) {
        greeting = 'Good Afternoon, Administrator';
    } else {
        greeting = 'Good Evening, Administrator';
    }
    $('.greeting').text(greeting);
}

// Update every second
setInterval(updateDateTime, 1000);

// Initial call to display the time and greeting immediately on page load
updateDateTime();