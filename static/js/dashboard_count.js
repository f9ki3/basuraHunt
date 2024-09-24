function animateCount(element, finalValue) {
    let animationDuration = 2000; // Duration of the animation in milliseconds
    let animationInterval = 20;   // Interval for each random number change
    let startTime = Date.now();

    let interval = setInterval(() => {
        // Calculate the elapsed time
        let elapsed = Date.now() - startTime;

        // Generate a random number between 0 and a bit above finalValue for animation
        let randomValue = Math.floor(Math.random() * (finalValue + 100));

        // Set the random value in the element
        $(element).text(randomValue);

        // If animation duration has passed, set the final value and clear the interval
        if (elapsed >= animationDuration) {
            $(element).text(finalValue);
            clearInterval(interval);
        }
    }, animationInterval);
}

function get_dashboard(){
    $.ajax({
        type: "GET",
        url: "/get_dashboard",
        dataType: "json",
        success: function (response) {
            admin_count = response.admin_count;
            student_count = response.student_count;
            today_dispose = response.today_dispose_count;
            total_dispose_count = response.total_dispose_count;

            // Apply animation to each count
            animateCount('#admin_count', admin_count);
            animateCount('#student_count', student_count);
            animateCount('#today_dispose', today_dispose);
            animateCount('#total_dispose_count', total_dispose_count);
        }
    });
}

// Call get_dashboard initially and set an interval to fetch data every 5 seconds
get_dashboard();
