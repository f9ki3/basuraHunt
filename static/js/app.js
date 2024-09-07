// document.addEventListener('DOMContentLoaded', () => {
//     const distanceElement = document.getElementById('distance');
//     const percentageElement = document.getElementById('percentage');

//     function updateData() {
//         fetch('/data', { method: 'POST' })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.status === 'success') {
//                     const distance = data.distance;
//                     const percentage = data.percentage;

//                     distanceElement.textContent = `Distance: ${distance} cm`;
//                     percentageElement.textContent = `Percentage: ${percentage}%`;
//                 } else {
//                     console.error('Error fetching data:', data.message);
//                 }
//             })
//             .catch(error => console.error('Error:', error));
//     }

//     // Update data every 2 seconds
//     setInterval(updateData, 2000);

//     // Initial call to display data immediately
//     updateData();
// });
