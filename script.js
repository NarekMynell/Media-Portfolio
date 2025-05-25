const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalVideo = document.getElementById('modal-video');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

// Sample media files (replace with your own)
const mediaFiles = [
    { type: 'video', src: 'media/1.mp4' },
    { type: 'video', src: 'media/2.mp4' },
    { type: 'video', src: 'media/3.mp4' },
    { type: 'image', src: 'media/4.jpg' },
    { type: 'image', src: 'media/5.jpg' },
    { type: 'video', src: 'media/6.mp4' },
    { type: 'video', src: 'media/7.mp4' },
    { type: 'video', src: 'media/8.mp4' },
    { type: 'video', src: 'media/9.mp4' },
    { type: 'video', src: 'media/10.mp4' },
    { type: 'video', src: 'media/11.mp4' },
    { type: 'video', src: 'media/12.mp4' },
    { type: 'video', src: 'media/13.mp4' },
    { type: 'video', src: 'media/14.mp4' },
    { type: 'video', src: 'media/15.mp4' },
    { type: 'image', src: 'media/16.jpg' },
    { type: 'video', src: 'media/17.mp4' },
    { type: 'image', src: 'media/18.jpg' },
    { type: 'video', src: 'media/19.mp4' },
    { type: 'video', src: 'media/20.mp4' },
    { type: 'video', src: 'media/21.mp4' },
    { type: 'video', src: 'media/22.mp4' },
    { type: 'image', src: 'media/23.gif' },
    { type: 'video', src: 'media/24.mp4' },
    // Add more media items here to test
];

let currentIndex = 0;
let zoomLevel = 1;
let isVideoHovered = false; // Track if a video is being hovered
let videoElements = []; // Store all video elements

// Load media into gallery with immediate rendering
function loadGallery() {
    gallery.innerHTML = ''; // Clear existing content
    console.log('Loading gallery...'); // Debug log
    videoElements = []; // Reset video elements array
    mediaFiles.forEach((media, index) => {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        const tx = (Math.random() - 0.5) * 20;
        const ty = (Math.random() - 0.5) * 20;
        item.style.setProperty('--tx', `${tx}px`);
        item.style.setProperty('--ty', `${ty}px`);
        if (media.type === 'image') {
            const img = document.createElement('img');
            img.src = media.src;
            img.onerror = () => console.log(`Image load error for ${media.src}`); // Debug error
            item.appendChild(img);
        } else if (media.type === 'video') {
            const video = document.createElement('video');
            video.src = media.src;
            video.muted = true;
            video.preload = 'auto'; // Ensure video loads
            video.onerror = () => console.log(`Video load error for ${media.src}`); // Debug error
            item.appendChild(video);
            videoElements.push(video); // Add to video elements array

            // Play video briefly to render first frame, then pause
            video.play().then(() => {
                setTimeout(() => {
                    video.pause();
                    video.currentTime = 0; // Reset to first frame
                }, 100); // Play for 0.1 second
            }).catch(err => console.log('Initial play error:', err));

            // Play on hover, pause on mouse leave
            item.addEventListener('mouseenter', () => {
                isVideoHovered = true; // Mark that a video is being hovered
                video.play().catch(err => console.log('Play error:', err));
            });
            item.addEventListener('mouseleave', () => {
                isVideoHovered = false; // Mark that no video is being hovered
                video.pause();
                video.currentTime = 0; // Reset to start
            });
        }
        item.addEventListener('click', () => openModal(index));
        gallery.appendChild(item);
    });

    // Force reflow and ensure visibility
    gallery.style.opacity = '1';
    gallery.style.display = 'block';
    console.log('Gallery loaded, items count:', gallery.children.length); // Debug log

    // Start random video playback if no video is hovered
    startRandomVideoPlayback();
}

// Function to play random videos when no video is hovered
function startRandomVideoPlayback() {
    setInterval(() => {
        if (!isVideoHovered && videoElements.length > 0) {
            // Select a random video
            const randomIndex = Math.floor(Math.random() * videoElements.length);
            const video = videoElements[randomIndex];

            // Play the video for a random duration between 0.5 and 1.5 seconds
            video.play().then(() => {
                const playDuration = Math.random() * 1000 + 1500; // Random between 1.5s and 2.5s
                setTimeout(() => {
                    video.pause();
                    video.currentTime = 0; // Reset to first frame
                }, playDuration);
            }).catch(err => console.log('Random play error:', err));
        }
    }, 2000); // Check every 2 seconds to avoid overlapping plays
}

// Open modal with selected media
function openModal(index) {
    currentIndex = index;
    const media = mediaFiles[index];
    modalVideo.pause();
    modalVideo.currentTime = 0;
    if (media.type === 'image') {
        modalImg.src = media.src;
        modalImg.style.display = 'block';
        modalVideo.style.display = 'none';
    } else if (media.type === 'video') {
        modalVideo.src = media.src;
        modalVideo.style.display = 'block';
        modalImg.style.display = 'none';
        modalVideo.play();
    }
    modal.style.display = 'flex';
}

// Close modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    modalVideo.pause();
    modalVideo.currentTime = 0;
});

// Navigate through media
prevBtn.addEventListener('click', () => {
    modalVideo.pause();
    modalVideo.currentTime = 0;
    currentIndex = (currentIndex - 1 + mediaFiles.length) % mediaFiles.length;
    openModal(currentIndex);
});

nextBtn.addEventListener('click', () => {
    modalVideo.pause();
    modalVideo.currentTime = 0;
    currentIndex = (currentIndex + 1) % mediaFiles.length;
    openModal(currentIndex);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'flex') {
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'Escape') closeBtn.click();
    }
});

// Swipe navigation
let touchStartX = 0;
modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});
modal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) nextBtn.click();
    if (touchEndX > touchStartX + 50) prevBtn.click();
});

// Zoom controls
const zoomControls = document.createElement('div');
zoomControls.classList.add('zoom-controls');
zoomControls.innerHTML = `
    <button onclick="zoomIn()">+</button>
    <button onclick="zoomOut()">-</button>
`;
document.body.appendChild(zoomControls);

function zoomIn() {
    zoomLevel += 0.1;
    gallery.style.transform = `scale(${zoomLevel})`;
}

function zoomOut() {
    zoomLevel = Math.max(0.5, zoomLevel - 0.1);
    gallery.style.transform = `scale(${zoomLevel})`;
}

// Auto-scroll to top and load gallery on page load
window.onload = () => {
    loadGallery();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};