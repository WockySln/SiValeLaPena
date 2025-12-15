// Load data from JSON files and initialize the page
let currentSlide = 0;
let slidesData = [];
let messagesData = [];

// Initialize the page
async function initializePage() {
    try {
        // Load photos data
        const photosResponse = await fetch('photos.json');
        slidesData = await photosResponse.json();
        loadSlides();

        // Load messages data
        const messagesResponse = await fetch('messages.json');
        messagesData = await messagesResponse.json();
        loadMessages();

        // Start carousel auto-advance
        setInterval(() => {
            changeSlide(1);
        }, 8000);

        // Start floating hearts
        setInterval(createHeart, 2000);

    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to default content if JSON files are not found
        loadDefaultContent();
    }
}

// Load slides from data
function loadSlides() {
    const carouselContainer = document.getElementById('carouselSlides');
    carouselContainer.innerHTML = '';

    slidesData.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
        slideDiv.innerHTML = `
            <img src="${slide.image}" alt="${slide.title}" class="slide-image">
            <div class="slide-title">${slide.title}</div>
            <div class="slide-caption">${slide.caption}</div>
        `;
        carouselContainer.appendChild(slideDiv);
    });
}

// Load messages from data
function loadMessages() {
    const messagesContainer = document.getElementById('loveMessages');
    messagesContainer.innerHTML = '';

    messagesData.forEach(message => {
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';
        messageCard.innerHTML = `
            <p class="message-text">${message.text}</p>
        `;
        messagesContainer.appendChild(messageCard);
    });
}

// Fallback content if JSON files are not available
function loadDefaultContent() {
    const defaultSlides = [
        {
            image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop",
            title: "Nuestro Primer Momento",
            caption: "Aquí puedes escribir lo que sentiste en este momento. Recuerdo cuando nos conocimos, tu sonrisa iluminó mi mundo."
        },
        {
            image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=600&fit=crop",
            title: "Cuando Éramos Nosotros",
            caption: "Cada risa, cada abrazo, cada mirada... todo construyó algo hermoso que vale la pena recuperar."
        }
    ];

    const defaultMessages = [
        {
            text: "Hay amores que marcan tu vida de tal manera que, aunque el tiempo pase, siempre encuentras tu camino de regreso a ellos."
        }
    ];

    slidesData = defaultSlides;
    messagesData = defaultMessages;
    loadSlides();
    loadMessages();
}

// Carousel functionality
function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

// Music control
const music = document.getElementById('backgroundMusic');
const musicControl = document.getElementById('musicControl');
let isPlaying = false;

// Autoplay music when page loads
function initMusic() {
    music.play().then(() => {
        isPlaying = true;
        musicControl.innerHTML = '<span class="music-icon">🎶</span>';
        musicControl.title = 'Click para pausar música';
    }).catch(error => {
        // If autoplay is blocked by browser, show play button
        console.log('Autoplay blocked, user needs to click to play');
        musicControl.innerHTML = '<span class="music-icon">🎵</span>';
        musicControl.title = 'Click para reproducir música';
    });
}

musicControl.addEventListener('click', () => {
    if (isPlaying) {
        music.pause();
        musicControl.innerHTML = '<span class="music-icon">🎵</span>';
        musicControl.title = 'Click para reproducir música';
    } else {
        music.play();
        musicControl.innerHTML = '<span class="music-icon">🎶</span>';
        musicControl.title = 'Click para pausar música';
    }
    isPlaying = !isPlaying;
});

// Canvas functionality
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const textArea = document.getElementById('textArea');
const colorPicker = document.getElementById('colorPicker');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = Math.max(400, container.offsetHeight);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;
}

function switchToWrite() {
    textArea.style.display = 'block';
    canvas.style.display = 'none';
    colorPicker.style.display = 'none';
    clearBtn.style.display = 'none';
    downloadBtn.style.display = 'none';
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function switchToDraw() {
    textArea.style.display = 'none';
    canvas.style.display = 'block';
    colorPicker.style.display = 'block';
    clearBtn.style.display = 'block';
    downloadBtn.style.display = 'block';
    resizeCanvas();
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function downloadCanvas() {
    const link = document.createElement('a');
    link.download = 'mi_mensaje_para_ti.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    [lastX, lastY] = [x - rect.left, y - rect.top];
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    const currentX = x - rect.left;
    const currentY = y - rect.top;
    
    ctx.strokeStyle = colorPicker.value;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    [lastX, lastY] = [currentX, currentY];
}

function stopDrawing() {
    isDrawing = false;
}

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopDrawing();
});

// Color picker
colorPicker.addEventListener('change', (e) => {
    ctx.strokeStyle = e.target.value;
});

// Floating hearts animation
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 6000);
}

// Responsive canvas
window.addEventListener('resize', () => {
    if (canvas.style.display !== 'none') {
        resizeCanvas();
    }
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    initMusic();
});