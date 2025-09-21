// Global state management
let currentUser = null;
let isPlaying = false;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
    
    // Add event listeners
    addEventListeners();
    
    // Check if user is logged in (from localStorage simulation)
    checkUserSession();
});

// Initialize application
function initializeApp() {
    // Add smooth scrolling for anchor links
    addSmoothScrolling();
    
    // Add hover effects to cards
    addCardHoverEffects();
    
    // Add floating animation to music notes (if on home page)
    animateMusicNotes();
    
    // Initialize music player functionality
    initializeMusicPlayer();
    
    console.log('MelodyConnect initialized successfully!');
}

// Add event listeners
function addEventListeners() {
    // Play button listeners
    document.querySelectorAll('.btn-outline-info').forEach(btn => {
        if (btn.querySelector('.fa-play')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                playMusic('Unknown Track', 'Unknown Artist');
            });
        }
    });

    // Like button listeners
    document.querySelectorAll('.btn-outline-warning').forEach(btn => {
        if (btn.querySelector('.fa-heart')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleLike(this);
            });
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Form validation
    addFormValidation();
}

// Show notification function
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (notification && notificationText) {
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    'fa-info-circle';
        
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas ${icon} me-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.display = 'block';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    } else {
        // Fallback to alert if notification element not found
        alert(message);
    }
}

// Form handlers
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const spinner = submitBtn.querySelector('.spinner-border');
    
    // Reset validation state
    email.classList.remove('is-invalid');
    password.classList.remove('is-invalid');
    
    // Validate inputs
    let isValid = true;
    
    if (!email.value || !isValidEmail(email.value)) {
        email.classList.add('is-invalid');
        isValid = false;
    }
    
    if (!password.value) {
        password.classList.remove('is-invalid');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Show loading state
    submitBtn.disabled = true;
    spinner.classList.remove('d-none');
    
    // Simulate API call
    setTimeout(() => {
        // For demo purposes, accept any valid email/password
        currentUser = {
            email: email.value,
            name: email.value.split('@')[0],
            loginTime: new Date().toISOString()
        };
        
        // Store session
        storeUserSession(currentUser);
        
        showNotification('Login successful! Welcome back!');
        
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1000);
}

function handleRegister(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Please agree to the Terms and Conditions', 'error');
        return;
    }
    
    // Get selected genres
    const genres = Array.from(document.getElementById('favoriteGenres').selectedOptions)
                       .map(option => option.value);
    
    // Simulate registration
    currentUser = { 
        email: email, 
        name: `${firstName} ${lastName}`,
        username: username,
        genres: genres,
        joinDate: new Date().toISOString()
    };
    
    storeUserSession(currentUser);
    showNotification('Account created successfully! Welcome to MelodyConnect!');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function handleProfileUpdate(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('profileFirstName').value;
    const lastName = document.getElementById('profileLastName').value;
    const bio = document.getElementById('profileBio').value;
    const location = document.getElementById('profileLocation').value;
    const website = document.getElementById('profileWebsite').value;
    
    // Update user object
    if (currentUser) {
        currentUser.name = `${firstName} ${lastName}`;
        currentUser.bio = bio;
        currentUser.location = location;
        currentUser.website = website;
        currentUser.lastUpdated = new Date().toISOString();
        
        storeUserSession(currentUser);
    }
    
    showNotification('Profile updated successfully!');
}

function handleEventCreation(event) {
    event.preventDefault();
    
    const eventName = document.getElementById('eventName').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventLocation = document.getElementById('eventLocation').value;
    const eventGenre = document.getElementById('eventGenre').value;
    const eventDescription = document.getElementById('eventDescription').value;
    
    // Validation
    if (!eventName || !eventDate || !eventTime || !eventLocation || !eventGenre) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Check if event date is in the future
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    if (eventDateTime <= new Date()) {
        showNotification('Event date must be in the future', 'error');
        return;
    }
    
    showNotification(`Event "${eventName}" created successfully!`);
    document.getElementById('eventForm').reset();
}

function handleGroupCreation(event) {
    event.preventDefault();
    
    const groupName = document.getElementById('groupName').value;
    const groupCategory = document.getElementById('groupCategory').value;
    const groupDescription = document.getElementById('groupDescription').value;
    
    // Validation
    if (!groupName || !groupCategory || !groupDescription) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (groupName.length < 3) {
        showNotification('Group name must be at least 3 characters long', 'error');
        return;
    }
    
    if (groupDescription.length < 10) {
        showNotification('Group description must be at least 10 characters long', 'error');
        return;
    }
    
    showNotification(`Group "${groupName}" created successfully!`);
    document.getElementById('groupForm').reset();
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function storeUserSession(user) {
    try {
        // In a real application, avoid storing sensitive data in localStorage
        // This is just for demonstration purposes
        const userData = {
            ...user,
            sessionId: generateSessionId()
        };
        // Note: localStorage is not available in Claude artifacts
        // In a real environment, you would use: localStorage.setItem('melodyConnectUser', JSON.stringify(userData));
        console.log('User session stored:', userData);
    } catch (error) {
        console.warn('Could not store user session:', error);
    }
}

function checkUserSession() {
    try {
        // In a real environment: const userData = localStorage.getItem('melodyConnectUser');
        // For demo purposes, we'll simulate a logged-in state
        const userData = null;
        
        if (userData) {
            currentUser = JSON.parse(userData);
            updateNavbarForLoggedInUser();
        }
    } catch (error) {
        console.warn('Could not retrieve user session:', error);
    }
}

function generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9);
}

function updateNavbarForLoggedInUser() {
    const navbarActions = document.getElementById('navbarActions');
    if (currentUser && navbarActions) {
        navbarActions.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-user me-1"></i>${currentUser.name || 'User'}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="profile.html">
                        <i class="fas fa-user me-2"></i>Profile
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">
                        <i class="fas fa-sign-out-alt me-2"></i>Logout
                    </a></li>
                </ul>
            </div>
        `;
    }
}

function logout() {
    currentUser = null;
    try {
        // localStorage.removeItem('melodyConnectUser');
        console.log('User logged out');
    } catch (error) {
        console.warn('Could not clear user session:', error);
    }
    
    showNotification('Logged out successfully!');
    
    // Reset navbar
    const navbarActions = document.getElementById('navbarActions');
    if (navbarActions) {
        navbarActions.innerHTML = `
            <a href="login.html" class="btn btn-outline-light me-2">Login</a>
            <a href="register.html" class="btn btn-light">Join Now</a>
        `;
    }
    
    // Redirect to home
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Music player functions
function initializeMusicPlayer() {
    const musicPlayer = document.getElementById('musicPlayer');
    if (musicPlayer) {
        // Add click handlers for player controls
        const playButton = musicPlayer.querySelector('.btn-custom');
        if (playButton) {
            playButton.addEventListener('click', togglePlayPause);
        }
    }
}

function playMusic(title = 'Unknown Track', artist = 'Unknown Artist') {
    const musicPlayer = document.getElementById('musicPlayer');
    if (musicPlayer) {
        // Update player info
        const titleElement = musicPlayer.querySelector('h6');
        const artistElement = musicPlayer.querySelector('small');
        
        if (titleElement) titleElement.textContent = title;
        if (artistElement) artistElement.textContent = artist;
        
        // Show player
        musicPlayer.style.display = 'block';
        isPlaying = true;
        
        // Update play button
        const playButton = musicPlayer.querySelector('.btn-custom i');
        if (playButton) {
            playButton.className = 'fas fa-pause';
        }
        
        showNotification(`Now playing: ${title} by ${artist}`, 'info');
    }
}

function togglePlayPause() {
    const playButton = document.querySelector('#musicPlayer .btn-custom i');
    if (playButton) {
        if (isPlaying) {
            playButton.className = 'fas fa-play';
            isPlaying = false;
            showNotification('Music paused', 'info');
        } else {
            playButton.className = 'fas fa-pause';
            isPlaying = true;
            showNotification('Music resumed', 'info');
        }
    }
}

function toggleMusicPlayer() {
    const player = document.getElementById('musicPlayer');
    if (player) {
        player.style.display = player.style.display === 'none' ? 'block' : 'none';
    }
}

function toggleLike(button) {
    const currentLikes = parseInt(button.textContent.trim().split(' ')[1]) || 0;
    const isLiked = button.classList.contains('btn-warning');
    
    if (isLiked) {
        button.innerHTML = `<i class="fas fa-heart"></i> ${Math.max(0, currentLikes - 1)}`;
        button.classList.remove('btn-warning');
        button.classList.add('btn-outline-warning');
        showNotification('Removed from favorites', 'info');
    } else {
        button.innerHTML = `<i class="fas fa-heart"></i> ${currentLikes + 1}`;
        button.classList.remove('btn-outline-warning');
        button.classList.add('btn-warning');
        showNotification('Added to favorites!', 'info');
    }
}

// Enhanced user experience functions
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addCardHoverEffects() {
    document.querySelectorAll('.card-custom').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
        });
    });
}

function animateMusicNotes() {
    const musicNotes = document.querySelectorAll('.music-note');
    musicNotes.forEach((note, index) => {
        note.style.animationDelay = `${index * 0.5}s`;
        
        // Add random movement
        setInterval(() => {
            const randomX = Math.random() * 10 - 5;
            const randomY = Math.random() * 10 - 5;
            note.style.transform += ` translate(${randomX}px, ${randomY}px)`;
        }, 5000 + index * 1000);
    });
}

function handleKeyboardShortcuts(e) {
    // Space bar to play/pause (when music player is visible)
    if (e.code === 'Space' && document.getElementById('musicPlayer')?.style.display === 'block') {
        e.preventDefault();
        togglePlayPause();
    }
    
    // Escape to close notifications
    if (e.code === 'Escape') {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.style.display = 'none';
        }
    }
    
    // Ctrl+K to focus search (if search exists)
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
}

function addFormValidation() {
    // Add real-time validation for forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.required;
    
    clearFieldError(field);
    
    if (required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    if (type === 'password' && value && value.length < 6) {
        showFieldError(field, 'Password must be at least 6 characters long');
        return false;
    }
    
    if (field.id === 'confirmPassword') {
        const password = document.getElementById('password')?.value;
        if (value && password && value !== password) {
            showFieldError(field, 'Passwords do not match');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('is-invalid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export functions for global access (if needed)
window.MelodyConnect = {
    handleLogin,
    handleRegister,
    handleProfileUpdate,
    handleEventCreation,
    handleGroupCreation,
    logout,
    toggleMusicPlayer,
    showNotification
};
