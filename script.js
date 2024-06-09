const homelist = document.getElementById('navigation__list');
const signUpBtn = document.getElementById("sign-up-btn");
const logOutBtn = document.getElementById("log-out-btn");
const modal = document.getElementById('authModal');
const openModalBtn = document.getElementById('sign-up-btn');
const closeModalBtn = document.querySelector('.close-btn');
const switchToLogin = document.getElementById('switch-to-login');
const switchToSignup = document.getElementById('switch-to-signup');
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const notification = document.getElementById('notification');
let loginstatus = false;

function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    loginstatus = !!currentUser; 
    if (loginstatus) {
        displayUsername(currentUser);
        homelist.style.display = 'flex';
        logOutBtn.style.display = 'none';
    } else {
        homelist.style.display = 'none';
        logOutBtn.style.display = 'none';
    }
}

// Initial check for login status when the page loads
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

openModalBtn.addEventListener('click', function() {
    if (loginstatus) {
        // Toggle the display of the logout button
        logOutBtn.style.display = logOutBtn.style.display === 'block' ? 'none' : 'block';
    } else {
        modal.style.display = 'flex';
    }
});

closeModalBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    clearInputFields();
});

window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

switchToLogin.addEventListener('click', function() {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    switchToLogin.style.display = 'none';
    switchToSignup.style.display = 'block';
});

switchToSignup.addEventListener('click', function() {
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
    switchToLogin.style.display = 'block';
    switchToSignup.style.display = 'none';
});

signupBtn.addEventListener('click', function() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (!username || !email || !password) {
        alert('Please fill out all fields.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.find(user => user.email === email);

    if (userExists) {
        alert('User already exists. Please log in.');
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    showNotification('You have successfully registered.');

    clearInputFields();
    switchToLogin.click();
});

loginBtn.addEventListener('click', function() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Please fill out all fields.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        alert('Invalid email or password.');
        return;
    }

    localStorage.setItem('currentUser', user.username);
    showNotification('Authorization successful!', 'success');
    loginstatus = true;
    homelist.style.display = 'flex';
    clearInputFields();

    modal.style.display = 'none';
    displayUsername(user.username);
});

logOutBtn.addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully!', 'success');
    logOutBtn.style.display = 'none'; // Hide logout button on logout
    homelist.style.display = 'none'; // Hide navigation list on logout
    loginstatus = false;
    displaySignUpButton();
});

function clearInputFields() {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('signup-username').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
}

function showNotification(message) {
    notification.innerText = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

function displayUsername(username) {
    signUpBtn.querySelector('.sign-up-btn__text').innerText = username;
}

function displaySignUpButton() {
    signUpBtn.querySelector('.sign-up-btn__text').innerText = 'Sign up';
}

// Theme toggle logic
const checkbox = document.getElementById("checkbox");
const body = document.body;
const currTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currTheme);
checkbox.checked = currTheme === 'dark';

checkbox.addEventListener("change", () => {
    const newTheme = checkbox.checked ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    body.setAttribute('data-theme', newTheme);
});