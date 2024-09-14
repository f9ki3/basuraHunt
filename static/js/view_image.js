const imageContainer = document.getElementById('image-container');
const image = document.getElementById('zoom-image');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');

let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX, startY;

// For pinch zoom
let initialDistance = 0;
let pinchStartScale = 1;

function updateTransform() {
    image.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
}

// Zoom in function
zoomInBtn.addEventListener('click', () => {
    scale += 0.1;
    updateTransform();
});

// Zoom out function
zoomOutBtn.addEventListener('click', () => {
    scale = Math.max(scale - 0.1, 0.1); // Prevent scaling below 0.1
    updateTransform();
});

// Zoom with scroll
imageContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
        scale += 0.1; // Scroll up to zoom in
    } else {
        scale = Math.max(scale - 0.1, 0.1); // Scroll down to zoom out
    }
    updateTransform();
});

// Drag to pan functionality
imageContainer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    imageContainer.style.cursor = 'grabbing';
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
});

imageContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
});

imageContainer.addEventListener('mouseup', () => {
    isDragging = false;
    imageContainer.style.cursor = 'grab';
});

imageContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    imageContainer.style.cursor = 'grab';
});

// Handle touch events for mobile pinch-to-zoom
imageContainer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches[0], e.touches[1]);
        pinchStartScale = scale;
    } else if (e.touches.length === 1) {
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
    }
});

imageContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
        // Handle pinch zoom
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        scale = Math.max(pinchStartScale * (currentDistance / initialDistance), 0.1); // Prevent scaling below 0.1
        updateTransform();
    } else if (e.touches.length === 1) {
        // Handle dragging (pan)
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        updateTransform();
    }
});

imageContainer.addEventListener('touchend', () => {
    isDragging = false;
});

// Utility function to calculate the distance between two touch points
function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}