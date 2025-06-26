// API URLs
const API_BASE_URL = 'http://localhost:3000/api';

// Check if server is running
async function checkServer() {
    try {
        const response = await fetch('http://localhost:3000/health', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Server health check response:', data);
        return data.status === 'Server is running';
    } catch (error) {
        console.error('Server connection error:', error);
        return false;
    }
}

// DOM Elements
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');
const userBtn = document.getElementById('userBtn');
const userDisplayName = document.getElementById('userDisplayName');
const showSignupBtn = document.getElementById('showSignupBtn');
const showLoginBtn = document.getElementById('showLoginBtn');

// Success callback functions that can be overridden
window.loginSuccess = function(data) {
    console.log('Login successful:', data);
    window.location.href = 'index.html';
};

window.signupSuccess = function(data) {
    console.log('Signup successful:', data);
    window.location.href = 'index.html';
};

// Check if user is already logged in and server status
document.addEventListener('DOMContentLoaded', async () => {
    // Check server connection first
    const isServerRunning = await checkServer();
    if (!isServerRunning) {
        loginError.textContent = 'Server is not running. Please try again later.';
        loginError.style.display = 'block';
        signupError.textContent = 'Server is not running. Please try again later.';
        signupError.style.display = 'block';
        return;
    }

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
        updateUIForLoggedInUser(user);
    }
});

// Event Listeners
if (showSignupBtn) {
    showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.hide();
        signupModal.show();
        loginError.style.display = 'none';
    });
}

if (showLoginBtn) {
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.hide();
        loginModal.show();
        signupError.style.display = 'none';
    });
}

if (userBtn) {
    userBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            if (confirm('Do you want to logout?')) {
                logout();
            }
        } else {
            loginModal.show();
        }
    });
}

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    
    try {
        // Check server first
        const isServerRunning = await checkServer();
        if (!isServerRunning) {
            throw new Error('Server is not running. Please try again later.');
        }

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            mode: 'cors',
            credentials: 'include'
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            updateUIForLoggedInUser(data.user);
            loginModal.hide();
            loginForm.reset();
            window.loginSuccess(data);
        } else {
            loginError.textContent = data.message || 'Login failed. Please check your credentials.';
            loginError.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = error.message || 'An error occurred. Please try again later.';
        loginError.style.display = 'block';
    }
});

// Handle Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signupError.style.display = 'none';
    
    try {
        // Check server first
        const isServerRunning = await checkServer();
        if (!isServerRunning) {
            throw new Error('Server is not running. Please try again later.');
        }

        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const phone = document.getElementById('signupPhone').value;
        const password = document.getElementById('signupPassword').value;

        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phone }),
            mode: 'cors',
            credentials: 'include'
        });

        const data = await response.json();
        console.log('Signup response:', data);

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            updateUIForLoggedInUser(data.user);
            signupModal.hide();
            signupForm.reset();
            window.signupSuccess(data);
        } else {
            signupError.textContent = data.message || 'Signup failed. Please try again.';
            signupError.style.display = 'block';
        }
    } catch (error) {
        console.error('Signup error:', error);
        signupError.textContent = error.message || 'An error occurred. Please try again later.';
        signupError.style.display = 'block';
    }
});

// Update UI for logged-in user
function updateUIForLoggedInUser(user) {
    if (userDisplayName) {
        userDisplayName.textContent = user.name;
        userDisplayName.style.display = 'inline';
    }
    if (userBtn) {
        const icon = userBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('uil-user-md');
            icon.classList.add('uil-user-check');
        }
    }
}

// Handle Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (userDisplayName) {
        userDisplayName.style.display = 'none';
    }
    if (userBtn) {
        const icon = userBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('uil-user-check');
            icon.classList.add('uil-user-md');
        }
    }
    // Redirect to welcome page if not already there
    if (!window.location.pathname.includes('welcome.html')) {
        window.location.href = 'welcome.html';
    }
} 