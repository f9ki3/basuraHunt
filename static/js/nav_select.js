// function setActiveButton() {
//     const activeHref = localStorage.getItem('activeButtonHref');
//     let foundActiveButton = false;

//     if (activeHref) {
//         document.querySelectorAll('.nav-admin .btn').forEach(button => {
//             if (button.href === activeHref) {
//                 button.classList.add('active');
//                 foundActiveButton = true;
//             }
//         });
//     }

//     // Set the default button to Dashboard if no active button is found
//     if (!foundActiveButton) {
//         const defaultButton = document.querySelector('.nav-admin .btn[href="/dashboard"]');
//         if (defaultButton) {
//             defaultButton.classList.add('active');
//             localStorage.setItem('activeButtonHref', defaultButton.href);
//         }
//     }
// }

// // Set the active button when the page loads
// setActiveButton();

// // Add click event listeners to all buttons
// document.querySelectorAll('.nav-admin .btn').forEach(button => {
//     button.addEventListener('click', function() {
//         // Remove 'active' class from all buttons
//         document.querySelectorAll('.nav-admin .btn').forEach(btn => btn.classList.remove('active'));
        
//         // Add 'active' class to the clicked button
//         this.classList.add('active');
        
//         // Save the href of the active button to localStorage
//         localStorage.setItem('activeButtonHref', this.href);
//     });
// });