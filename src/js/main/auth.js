// --- Core Auth Functions ---
async function registerUser({ firstName, lastName, email, password }) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    email = email.trim().toLowerCase();
    if (users.some(u => u.email === email)) {
        return { success: false, message: 'Email already registered.' };
    }
    const user = { firstName, lastName, email, password };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    setAuthenticatedUser(user);
    return { success: true, user };
}

async function loginUser(email, password) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    email = email.trim().toLowerCase();
    const user = users.find(u => u.email === email);
    if (user && user.password === password) {
        setAuthenticatedUser(user);
        return { success: true, user };
    }
    return { success: false, message: 'Invalid email or password.' };
}

async function forgotPassword(email) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    email = email.trim().toLowerCase();
    const user = users.find(u => u.email === email);
    if (user) {
        // Simulate sending email
        return { success: true, message: 'Password reset link sent to your email.' };
    }
    return { success: false, message: 'Email not found.' };
}

async function deleteAccount(email) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    email = email.trim().toLowerCase();
    const newUsers = users.filter(u => u.email !== email);
    if (newUsers.length === users.length) {
        return { success: false, message: 'User not found.' };
    }
    localStorage.setItem('users', JSON.stringify(newUsers));
    logoutUser();
    return { success: true, message: 'Account deleted.' };
}

function setAuthenticatedUser(user) {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

function getCurrentUser() {
    if (!isAuthenticated()) return null;
    try {
        return JSON.parse(localStorage.getItem('currentUser'));
    } catch {
        return null;
    }
}

function logoutUser() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
}

// --- Form Handlers ---
document.addEventListener('DOMContentLoaded', function() {
    // Registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const result = await registerUser({ firstName, lastName, email, password });
            if (result.success) {
                alert('Registration successful!');
                window.location.href = 'checkout.html';
            } else {
                alert(result.message);
            }
        });
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const result = await loginUser(email, password);
            if (result.success) {
                alert('Login successful!');
                window.location.href = 'dashboard.html';
            } else {
                alert(result.message);
            }
        });
    }

    // Forgot password form
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const result = await forgotPassword(email);
            alert(result.message);
        });
    }

    // Delete account form
    const deleteForm = document.getElementById('deleteAccountForm');
    if (deleteForm) {
        deleteForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('deleteEmail').value;
            const result = await deleteAccount(email);
            alert(result.message);
            if (result.success) {
                window.location.href = 'index.html';
            }
        });
    }

    // Logout button (if present)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logoutUser();
            window.location.href = 'login.html';
        });
    }
});


// Utility: Remove all users (for testing/admin only)
function clearAllUsers() {
    localStorage.removeItem('users');
    logoutUser();
}


// Utility: Protect a page (redirect to login if not authenticated)
function protectPage(loginPage = 'login.html') {
    if (!isAuthenticated()) {
        window.location.href = loginPage;
    }
} 