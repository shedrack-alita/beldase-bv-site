// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.getElementById('cartTotal');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const quickViewButtons = document.querySelectorAll('.quick-view');
const newsletterForm = document.querySelector('.newsletter-form');

// Hero Slider elements
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');

// Slider elements
const productsSlider = document.querySelector('.products-slider');
const productsGrid = document.querySelector('.products-grid');
const sliderPrev = document.querySelector('.slider-prev');
const sliderNext = document.querySelector('.slider-next');

// Cart state
let cart = [];
let cartCount = 0;

// Hero Slider state
let currentHeroSlide = 0;
let heroSlideInterval;

// Slider state
let currentSlide = 0;
let slideInterval;
let slidesPerView;
let totalSlides; 
let totalSlidesToShow;

// ===== DASHBOARD FUNCTIONALITY =====

// Dashboard elements
const dashboardNav = document.querySelector('.dashboard-nav');
const dashboardSections = document.querySelectorAll('.dashboard-section');
const userNameElement = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const profileForm = document.getElementById('profileForm');
const passwordForm = document.getElementById('passwordForm');
const saveNotificationsBtn = document.getElementById('saveNotifications');
const exportDataBtn = document.getElementById('exportDataBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');

// User data storage
let userData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    bio: '',
    memberSince: new Date().toLocaleDateString(),
    orders: [],
    wishlist: [],
    addresses: [],
    notifications: {
        email: true,
        orderUpdates: true,
        promotional: false
    }
};

// === Price Formatting Helper ===
function formatPrice(price) {
    return (Math.round(price * 100) / 100).toFixed(2);
}

// === Custom Food Menu Logic ===
const foodMenuForm = document.getElementById('foodMenuForm');
const selectionSummary = document.getElementById('selection-summary');

if (foodMenuForm && selectionSummary) {
    // Helper to get selected values
    function getMenuSelections() {
        const base = foodMenuForm.querySelector('input[name="base"]:checked');
        const proteins = Array.from(foodMenuForm.querySelectorAll('input[name="protein"]:checked')).map(cb => cb.value);
        const vegetables = Array.from(foodMenuForm.querySelectorAll('input[name="vegetables"]:checked')).map(cb => cb.value);
        const extras = Array.from(foodMenuForm.querySelectorAll('input[name="extras"]:checked')).map(cb => cb.value);
        return {
            base: base ? base.value : '-',
            proteins,
            vegetables,
            extras
        };
    }

    // Update summary UI
    function updateMenuSummary() {
        const sel = getMenuSelections();
        selectionSummary.innerHTML = `
            <li>Base: <span>${sel.base}</span></li>
            <li>Protein: <span>${sel.proteins.length ? sel.proteins.join(', ') : '-'}</span></li>
            <li>Vegetables: <span>${sel.vegetables.length ? sel.vegetables.join(', ') : '-'}</span></li>
            <li>Extras: <span>${sel.extras.length ? sel.extras.join(', ') : '-'}</span></li>
        `;
    }

    // Listen for changes
    foodMenuForm.addEventListener('change', updateMenuSummary);
    updateMenuSummary();

    // Handle form submit (add to cart)
    foodMenuForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const sel = getMenuSelections();
        if (sel.base === '-' || sel.proteins.length === 0) {
            showNotification('Please select a base and at least one protein for your meal.', 'error');
            return;
        }
        
        // Compose meal name and description
        const mealName = `${sel.base} with ${sel.proteins.join(' & ')}`;
        let desc = '';
        if (sel.vegetables.length) desc += `Vegetables: ${sel.vegetables.join(', ')}. `;
        if (sel.extras.length) desc += `Extras: ${sel.extras.join(', ')}.`;
        const rawPrice = 12.99 + sel.proteins.length * 2.5 + sel.extras.length * 1.5 + sel.vegetables.length * 1.0;
        const price = parseFloat(formatPrice(rawPrice));
        const image = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80';
        addToCart(mealName, price, image);
        updateCartCount();
        showNotification('Custom meal added to cart!');
        foodMenuForm.reset();
        updateMenuSummary();
    });
}

// Initialize mobile menu functionality
function initMobileMenu() {
    if (!hamburger || !navMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }

    // Mobile menu toggle
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Mobile dropdown toggle
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = toggle.closest('.dropdown');
                dropdown.classList.toggle('active');
            }
        });
    });

    // Close mobile menu when clicking on a link (excluding dropdown toggles)
    document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            // Close all dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const isClickInsideNav = navMenu.contains(e.target);
            const isClickOnHamburger = hamburger.contains(e.target);
            // Fix: Don't close if click is inside a dropdown
            const isClickInsideDropdown = e.target.closest('.dropdown') !== null;

            if (!isClickInsideNav && !isClickOnHamburger && !isClickInsideDropdown && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                // Close all dropdowns
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }
    });
}

// Initialize slider functionality
function initSlider() {
    if (!productsSlider || !productsGrid) {
        console.warn('Slider elements not found');
        return;
    }

    // Calculate total number of products
    const productCards = productsGrid.querySelectorAll('.product-card');
    totalSlides = productCards.length;
    
    // Calculate slides per view based on screen size
    updateSlidesPerView();
    
    // Generate dots dynamically
    generateDots();
    
    // Set initial position
    updateSliderPosition();
    
       // Start auto-play
    startAutoPlay();
    
    // Pause auto-play on hover
    productsSlider.addEventListener('mouseenter', pauseAutoPlay);
    productsSlider.addEventListener('mouseleave', startAutoPlay);
    
    // Handle window resize
    window.addEventListener('resize', handleResize);

    // Listen for arrow clicks
    if (sliderPrev && sliderNext) {
        sliderPrev.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
        sliderNext.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
    }
}

// Generate dots dynamically based on total slides
function generateDots() {
    const dotsContainer = document.querySelector('.slider-dots');
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlidesToShow; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.setAttribute('data-slide', i);
        if (i === currentSlide) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
        
        dotsContainer.appendChild(dot);
    }
}

// Update slides per view based on screen size
function updateSlidesPerView() {
    const width = window.innerWidth;
    if (width <= 480) {
        slidesPerView = 1;
    } else if (width <= 768) {
        slidesPerView = 2;
    } else if (width <= 1024) {
        slidesPerView = 3;
    } else {
        slidesPerView = 4;
    }
    
    // Update total slides to show
    totalSlidesToShow = Math.max(1, Math.ceil(totalSlides / slidesPerView));
    
    // Reset current slide if it's out of bounds
    if (currentSlide >= totalSlidesToShow) {
        currentSlide = 0;
    }
    
    // Regenerate dots when slides per view changes
    generateDots();
    updateSliderPosition();
    updateDots();
}

// Go to specific slide
function goToSlide(slideIndex) {
    if (slideIndex < 0) {
        slideIndex = totalSlidesToShow - 1;
    } else if (slideIndex >= totalSlidesToShow) {
        slideIndex = 0;
    }
    
    currentSlide = slideIndex;
    updateSliderPosition();
    updateDots();
}

// Update slider position
function updateSliderPosition() {
    const productCards = productsGrid.querySelectorAll('.product-card');
    if (productCards.length === 0) return;
    const firstCard = productCards[0];
    const cardWidth = firstCard.offsetWidth;
    const computedStyle = window.getComputedStyle(productsGrid);
    const gap = parseFloat(computedStyle.gap) || 24;
    // Calculate how much to move for each slide (move by slidesPerView products)
    const move = (cardWidth + gap) * slidesPerView * currentSlide;
    productsGrid.style.transform = `translateX(-${move}px)`;
}

// Update active dot
function updateDots() {
    const dots = document.querySelectorAll('.slider-dots .dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
    });
}

// Start auto-play
function startAutoPlay() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    slideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000); // Change slide every 5 seconds
}

// Pause auto-play
function pauseAutoPlay() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Handle window resize
function handleResize() {
    // Recalculate slides per view based on screen size
    updateSlidesPerView();
    updateSliderPosition();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage first
    loadCartFromStorage();
    
    // Initialize existing functionality
    initMobileMenu();
    initSlider();
    initFAQ();
    initContactForm();
    initHeroSlider();
    
    // Initialize dashboard if on dashboard page
    if (dashboardNav) {
        initDashboard();
    }
    
    // Update navigation for logged-in users
    updateNavigationForUser();

    // Intercept Proceed to Checkout button in cart modal
    // Always redirect to checkout.html, never to login.html
    document.body.addEventListener('click', function(e) {
        const btn = e.target.closest('.cart-actions .btn-primary');
        if (btn) {
            e.preventDefault();
            window.location.href = 'checkout.html';
        }
    });
});

// Initialize FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Initialize contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Simulate form submission
            showNotification('Thank you for your message! We\'ll get back to you soon.');
            contactForm.reset();
        });
    }
}

// Cart functionality
cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close cart modal when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Add to cart functionality
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(productCard.querySelector('.current-price').textContent.replace('€', ''));
        const productImage = productCard.querySelector('img').src;
        
        addToCart(productName, productPrice, productImage);
        updateCartCount();
        showNotification('Product added to cart!');
    });
});

// Quick view functionality
quickViewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        const productDescription = productCard.querySelector('.product-description').textContent;
        const productImage = productCard.querySelector('img').src;
        
        showQuickViewModal(productName, productPrice, productDescription, productImage);
    });
});

// Newsletter form submission
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    if (email) {
        showNotification('Thank you for subscribing!');
        newsletterForm.reset();
    }
});

// Smooth scrolling for navigation links (excluding dropdown toggles)
document.querySelectorAll('a[href^="#"]:not(.dropdown-toggle)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        if (href === '#') {
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load cart from localStorage on page load
function loadCartFromStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        try {
            cart = JSON.parse(cartData);
            updateCartDisplay();
            updateCartCount(); // Always update cart count, even if cart display doesn't exist
        } catch (e) {
            console.error('Error loading cart from localStorage:', e);
            cart = [];
            updateCartCount(); // Update cart count even if loading failed
        }
    } else {
        updateCartCount(); // Update cart count even if no cart data exists
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCartToStorage(); // Save to localStorage
    updateCartDisplay();
}

// Update cart count
function updateCartCount() {
    try {
        cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
        // Fallback: set cart count to 0 if there's an error
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = '0';
        }
    }
}

// Update cart display
function updateCartDisplay() {
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-content">
                <img src="${item.image || ''}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>€${formatPrice(item.price)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                    <button onclick="removeFromCart(${index})" class="remove-btn">×</button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    if (cartTotal) {
        cartTotal.textContent = formatPrice(total);
    }
    updateCartCount();
}

// Update quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    saveCartToStorage(); // Save to localStorage
    updateCartDisplay();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage(); // Save to localStorage
    updateCartDisplay();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #BF1109;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(191, 17, 9, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Show quick view modal
function showQuickViewModal(name, price, description, image) {
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div class="quick-view-content" style="
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            position: relative;
        ">
            <button class="close-quick-view" style="
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            ">&times;</button>
            <img src="${image}" alt="${name}" style="
                width: 100%;
                height: 300px;
                object-fit: cover;
                border-radius: 10px;
                margin-bottom: 1rem;
            ">
            <h3 style="color: #BF1109; margin-bottom: 0.5rem;">${name}</h3>
            <p style="color: #666; margin-bottom: 1rem;">${description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 1.5rem; font-weight: 700; color: #BF1109;">€${formatPrice(price)}</span>
                <button class="btn btn-primary" onclick="addToCartFromQuickView('${name}', ${price}, '${image}')">Add to Cart</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    modal.querySelector('.close-quick-view').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Add to cart from quick view
function addToCartFromQuickView(name, price, image) {
    addToCart(name, price, image);
    updateCartCount();
    showNotification('Product added to cart!');
    
    // Close quick view modal
    const modal = document.querySelector('.quick-view-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #BF1109;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 1rem;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);

// Initialize cart display
updateCartDisplay();

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Initialize hero slider functionality
function initHeroSlider() {
    if (!heroSlides || heroSlides.length === 0) {
        console.warn('Hero slider elements not found');
        return;
    }

    // Add event listeners for dots
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToHeroSlide(index);
        });
    });
    
    // Start auto-play
    startHeroAutoPlay();
    
    // Pause auto-play on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', pauseHeroAutoPlay);
        heroSection.addEventListener('mouseleave', startHeroAutoPlay);
    }
}

// Go to specific hero slide
function goToHeroSlide(slideIndex) {
    if (slideIndex < 0) {
        slideIndex = heroSlides.length - 1;
    } else if (slideIndex >= heroSlides.length) {
        slideIndex = 0;
    }
    
    // Remove active class from current slide and dot
    heroSlides[currentHeroSlide].classList.remove('active');
    heroDots[currentHeroSlide].classList.remove('active');
    
    // Update current slide
    currentHeroSlide = slideIndex;
    
    // Add active class to new slide and dot
    heroSlides[currentHeroSlide].classList.add('active');
    heroDots[currentHeroSlide].classList.add('active');
    
    // Reset auto-play timer
    resetHeroAutoPlay();
}

// Start hero auto-play
function startHeroAutoPlay() {
    heroSlideInterval = setInterval(() => {
        goToHeroSlide(currentHeroSlide + 1);
    }, 5000); // Change slide every 5 seconds
}

// Pause hero auto-play
function pauseHeroAutoPlay() {
    if (heroSlideInterval) {
        clearInterval(heroSlideInterval);
    }
}

// Reset hero auto-play
function resetHeroAutoPlay() {
    clearInterval(heroSlideInterval);
    startHeroAutoPlay();
}

// Initialize dashboard functionality
function initDashboard() {
    if (!dashboardNav) return; // Not on dashboard page
    
    // Load user data from localStorage
    loadUserData();
    
    // Initialize dashboard navigation
    initDashboardNavigation();
    
    // Initialize dashboard forms
    initDashboardForms();
    
    // Initialize dashboard actions
    initDashboardActions();
    
    // Update dashboard display
    updateDashboardDisplay();
}

// Initialize dashboard navigation
function initDashboardNavigation() {
    // Dashboard navigation initialization
}

// Initialize dashboard forms
function initDashboardForms() {
    // Dashboard forms initialization
}

// Initialize dashboard actions
function initDashboardActions() {
    // Dashboard actions initialization
}

// Load user data from localStorage
function loadUserData() {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
        userData = { ...userData, ...JSON.parse(savedUserData) };
    }
    
    // Load from registration/login data if available
    const registrationData = localStorage.getItem('registrationData');
    if (registrationData) {
        const regData = JSON.parse(registrationData);
        userData.firstName = regData.firstName || userData.firstName;
        userData.lastName = regData.lastName || userData.lastName;
        userData.email = regData.email || userData.email;
    }
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Update dashboard display
function updateDashboardDisplay() {
    // Update user name
    if (userNameElement) {
        const displayName = userData.firstName || userData.email.split('@')[0];
        userNameElement.textContent = displayName;
    }
    
    // Update stats
    updateDashboardStats();
    
    // Update recent activity
    updateRecentActivity();
}

// Update dashboard statistics
function updateDashboardStats() {
    const totalOrdersElement = document.getElementById('totalOrders');
    const wishlistCountElement = document.getElementById('wishlistCount');
    const totalSpentElement = document.getElementById('totalSpent');
    const memberSinceElement = document.getElementById('memberSince');
    
    if (totalOrdersElement) {
        totalOrdersElement.textContent = userData.orders.length;
    }
    
    if (wishlistCountElement) {
        wishlistCountElement.textContent = userData.wishlist.length;
    }
    
    if (totalSpentElement) {
        const totalSpent = userData.orders.reduce((sum, order) => sum + (order.total || 0), 0);
        totalSpentElement.textContent = `€${formatPrice(totalSpent)}`;
    }
    
    if (memberSinceElement) {
        memberSinceElement.textContent = userData.memberSince;
    }
}

// Update recent activity
function updateRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    if (!activityList) return;
    
    // Add account creation activity if it's a new user
    if (!localStorage.getItem('userData')) {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-user-plus"></i>
            </div>
            <div class="activity-content">
                <p>Account created successfully</p>
                <span class="activity-time">Just now</span>
            </div>
        `;
        activityList.appendChild(activityItem);
    }
}

// Populate profile form with user data
function populateProfileForm() {
    if (!profileForm) return;
    
    const fields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'bio'];
    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input && userData[field]) {
            input.value = userData[field];
        }
    });
}

// Handle profile form submission
function handleProfileSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(profileForm);
    const updatedData = {};
    
    for (let [key, value] of formData.entries()) {
        updatedData[key] = value;
    }
    
    // Update user data
    Object.assign(userData, updatedData);
    saveUserData();
    
    // Update display
    updateDashboardDisplay();
    
    // Show success message
    showDashboardNotification('Profile updated successfully!', 'success');
}

// Handle password form submission
function handlePasswordSubmit(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmPassword) {
        showDashboardNotification('New passwords do not match!', 'error');
        return;
    }
    
    userData.password = newPassword;
    saveUserData();
    
    passwordForm.reset();
    
    showDashboardNotification('Password updated successfully!', 'success');
}

// Handle notification settings save
function handleNotificationSave() {
    const emailNotifications = document.getElementById('emailNotifications');
    const orderUpdates = document.getElementById('orderUpdates');
    const promotionalEmails = document.getElementById('promotionalEmails');
    
    userData.notifications = {
        email: emailNotifications.checked,
        orderUpdates: orderUpdates.checked,
        promotional: promotionalEmails.checked
    };
    
    saveUserData();
    showDashboardNotification('Notification preferences saved!', 'success');
}


// Handle export data
function handleExportData() {
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'user-data.json';
    link.click();
    
    showDashboardNotification('Data exported successfully!', 'success');
}

// Show dashboard notification
function showDashboardNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `dashboard-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
}

// Hide notification
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Update navigation to show dashboard link for logged-in users
function updateNavigationForUser() {
    const userIcon = document.querySelector('.user-icon');
    if (!userIcon) return;
    
    if (localStorage.getItem('isAuthenticated') === 'true') {
        // User is logged in, show dashboard link
        userIcon.href = 'pages/dashboard.html';
        userIcon.innerHTML = '<i class="fas fa-user"></i>';
        userIcon.title = 'Dashboard';
    } else {
        // User is not logged in, show login link
        userIcon.href = 'login.html';
        userIcon.innerHTML = '<i class="fas fa-user"></i>';
        userIcon.title = 'Login';
    }
}

// Immediate cart count update (fallback)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            loadCartFromStorage();
        }, 100);
    });
} else {
    // DOM is already loaded
    setTimeout(() => {
        loadCartFromStorage();
    }, 100);
} 