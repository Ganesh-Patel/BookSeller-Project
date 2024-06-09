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
    fetchCategories();
    fetchBooks();
    const modal = document.getElementById('bookModal');
    const closeBtn = document.querySelector('.book-close-btn');
    const modalBookImage = document.getElementById('modalBookImage');
    const modalBookTitle = document.getElementById('modalBookTitle');
    const modalBookAuthor = document.getElementById('modalBookAuthor');
    const modalBookDescription = document.getElementById('modalBookDescription');
    const buyLinksContainer = document.getElementById('buyLinks');
    const modalActionButton = document.getElementById('modalActionButton');

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('quick-review-btn')) {
            const bookId = event.target.dataset.bookId;
            if (bookId) {
                fetchBookDetails(bookId);
            } else {
                console.error('Book ID is not defined');
            }
        }
    });

    function fetchBookDetails(bookId) {
        fetch(`https://books-backend.p.goit.global/books/${bookId}`)
            .then(response => response.json())
            .then(book => {
                showModal(book);
            })
            .catch(error => console.error('Error fetching book details:', error));
    }

    function showModal(book) {
        modalBookImage.src = book.book_image;
        modalBookTitle.textContent = book.title;
        modalBookAuthor.textContent = `by ${book.author}`;
        modalBookDescription.textContent = book.description || 'No description available.';

        // Clear previous buy links
        buyLinksContainer.innerHTML = '';
        
        // Use predefined images for buy links
        const predefinedLinks = [
            { name: 'Amazon', imgSrc: 'https://yevhenii2022.github.io/team-proj-js-book-app/amazon-shop-1x.d33dc585.png', imgSrcSet: 'https://yevhenii2022.github.io/team-proj-js-book-app/amazon-shop-1x.d33dc585.png 1x, https://yevhenii2022.github.io/team-proj-js-book-app/amazon-shop-2x.01f59d3f.png 2x', alt: 'amazon' },
            { name: 'Apple Books', imgSrc: 'https://yevhenii2022.github.io/team-proj-js-book-app/apple-shop-1x.aeb5cfd2.png', imgSrcSet: 'https://yevhenii2022.github.io/team-proj-js-book-app/apple-shop-1x.aeb5cfd2.png 1x, https://yevhenii2022.github.io/team-proj-js-book-app/apple-shop-2x.df06fe16.png 2x', alt: 'apple-books' },
            { name: 'Bookshop', imgSrc: 'https://yevhenii2022.github.io/team-proj-js-book-app/bookshop-1x.d3877644.png', imgSrcSet: 'https://yevhenii2022.github.io/team-proj-js-book-app/bookshop-1x.d3877644.png 1x, https://yevhenii2022.github.io/team-proj-js-book-app/bookshop-2x.bc4a3396.png 2x', alt: 'bookshop' }
        ];

        book.buy_links.forEach(link => {
            const predefinedLink = predefinedLinks.find(predefined => predefined.name === link.name);
            if (predefinedLink) {
                const anchor = document.createElement('a');
                anchor.href = link.url;
                anchor.target = '_blank';
                anchor.innerHTML = `<img srcset="${predefinedLink.imgSrcSet}" src="${predefinedLink.imgSrc}" alt="${predefinedLink.alt}">`;
                buyLinksContainer.appendChild(anchor);
            }
        });

        // Update the action button
        if (isBookInCart(book._id)) {
            modalActionButton.textContent = 'Remove from Shopping Cart';
            modalActionButton.onclick = () => removeFromCart(book._id);
        } else {
            modalActionButton.textContent = 'Add to Shopping Cart';
            modalActionButton.onclick = () => addToCart(book._id);
        }

        modal.style.display = 'block';
    }

    function isBookInCart(bookId) {
        return false;
    }

    function addToCart(bookId) {
        console.log(`Adding book ${bookId} to cart`);
        modal.style.display = 'none';
    }

    function removeFromCart(bookId) {
        console.log(`Removing book ${bookId} from cart`);
        modal.style.display = 'none';
    }

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

const cat_list=document.getElementById("menu-list");
const apiUrl = 'https://books-backend.p.goit.global/books/category-list';

async function fetchCategories() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        data.forEach(category => {
            const listItem = document.createElement('li');
            listItem.textContent = category.list_name;
            cat_list.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}
// here starts
const booksApiUrl = 'https://books-backend.p.goit.global/books/top-books';
const booksContainerElement = document.getElementById('books-container');
const mainTitleElement = document.querySelector('.main-title');
const bestSellerSpan = mainTitleElement.querySelector('.bestSeller');
const booksSpan = mainTitleElement.querySelector('.books');
const backButton = document.getElementById('back-button');

async function fetchBooks() {
    try {
        const response = await fetch(booksApiUrl);
        const data = await response.json();
        data.forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.classList.add('category-section');

            const categoryTitle = document.createElement('h3');
            categoryTitle.classList.add('category-title');
            categoryTitle.textContent = category.list_name;
            categorySection.appendChild(categoryTitle);

            const booksList = document.createElement('div');
            booksList.classList.add('books-list');

            category.books.slice(0, 3).forEach(book => {
                const bookCard = createBookCard(book);
                booksList.appendChild(bookCard);
            });

            categorySection.appendChild(booksList);

            const showMoreBtn = document.createElement('button');
            showMoreBtn.classList.add('show-more-btn');
            showMoreBtn.textContent = 'Show More';
            showMoreBtn.addEventListener('click', async () => {
                await showMoreBooks(category.list_name, categorySection, booksList);
                updateMainTitle(category.list_name);
                backButton.style.display = 'block';
            });
            categorySection.appendChild(showMoreBtn);

            booksContainerElement.appendChild(categorySection);
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function createBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    const bookImage = document.createElement('img');
    bookImage.src = book.book_image;
    imageContainer.appendChild(bookImage);

    const quickReviewBtn = document.createElement('button');
    quickReviewBtn.classList.add('quick-review-btn');
    quickReviewBtn.textContent = 'Quick View';
    quickReviewBtn.dataset.bookId = book._id;
    imageContainer.appendChild(quickReviewBtn);

    bookCard.appendChild(imageContainer);

    const bookTitle = document.createElement('h4');
    bookTitle.classList.add('book-name');
    bookTitle.textContent = book.title;
    bookCard.appendChild(bookTitle);

    const bookAuthor = document.createElement('p');
    bookAuthor.classList.add('book-author');
    bookAuthor.textContent = book.author;
    bookCard.appendChild(bookAuthor);

    return bookCard;
}


async function showMoreBooks(category, categorySection, booksList) {
    const categoryApiUrl = `https://books-backend.p.goit.global/books/category?category=${encodeURIComponent(category)}`;
    try {
        const response = await fetch(categoryApiUrl);
        const data = await response.json();
        booksList.innerHTML = '';
        data.forEach(book => {
            const bookCard = createBookCard(book);
            booksList.appendChild(bookCard);
        });
        hideOtherCategories(categorySection);
    } catch (error) {
        console.error('Error fetching more books:', error);
    }
}

function hideOtherCategories(selectedCategorySection) {
    const categorySections = document.querySelectorAll('.category-section');
    categorySections.forEach(section => {
        if (section !== selectedCategorySection) {
            section.style.display = 'none';
        }
    });
}

function updateMainTitle(categoryName) {
    const words = categoryName.split(' ');
    const lastWord = words.pop();
    const remainingWords = words.join(' ');
    bestSellerSpan.textContent = remainingWords;
    booksSpan.textContent = lastWord;
}

backButton.addEventListener('click', () => {
    booksContainerElement.innerHTML = '';
    fetchBooks();
    bestSellerSpan.textContent = 'Best Sellers';
    booksSpan.textContent = 'Books';
    backButton.style.display = 'none';
});
