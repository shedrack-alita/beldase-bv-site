// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin JS loaded');
    
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    console.log('Elements found:', { menuToggle, sidebar, sidebarClose, sidebarOverlay });
    
    // Simple toggle function
    function toggleSidebar() {
        console.log('Toggle function called');
        
        if (sidebar) {
            const isActive = sidebar.classList.contains('active');
            console.log('Sidebar is active:', isActive);
            
            if (isActive) {
                // Close sidebar
                closeSidebar();
            } else {
                // Open sidebar
                openSidebar();
            }
        }
    }
    
    // Close sidebar function
    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        console.log('Sidebar closed');
    }
    
    // Open sidebar function
    function openSidebar() {
        if (sidebar) sidebar.classList.add('active');
        if (menuToggle) menuToggle.classList.add('active');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        console.log('Sidebar opened');
    }
    
    // Add click event to menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Menu toggle clicked');
            toggleSidebar();
        });
        
        // Add touch event for mobile
        menuToggle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Menu toggle touched');
            toggleSidebar();
        });
    }
    
    // Add click event to sidebar close button
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Sidebar close clicked');
            closeSidebar();
        });
    }
    
    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            console.log('Overlay clicked');
            closeSidebar();
        });
    }
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (sidebar && sidebar.classList.contains('active')) {
                closeSidebar();
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
    
    // Navigation handling - allow normal navigation but close sidebar on mobile
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow normal navigation (don't prevent default)
            // Just close sidebar on mobile after a short delay
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    closeSidebar();
                }, 100);
            }
        });
    });
    
    // Category filter
    const categoryFilter = document.querySelector('.category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterProducts(this.value);
        });
    }
});

// Navigation function
function navigateToSection(section) {
    const sections = {
        'dashboard': showDashboard,
        'products': showProducts,
        'orders': showOrders,
        'users': showUsers,
        'analytics': showAnalytics,
        'settings': showSettings
    };
    
    if (sections[section]) {
        sections[section]();
    }
}

// Section display functions
function showDashboard() {
    document.querySelector('.header-left h1').textContent = 'Dashboard';
    // Dashboard is already visible by default
}

function showProducts() {
    document.querySelector('.header-left h1').textContent = 'Products';
    // Products section is already visible
}

function showOrders() {
    document.querySelector('.header-left h1').textContent = 'Orders';
    // Implement orders view
    console.log('Orders section');
}

function showUsers() {
    document.querySelector('.header-left h1').textContent = 'Users';
    // Implement users view
    console.log('Users section');
}

function showAnalytics() {
    document.querySelector('.header-left h1').textContent = 'Analytics';
    // Implement analytics view
    console.log('Analytics section');
}

function showSettings() {
    document.querySelector('.header-left h1').textContent = 'Settings';
    // Implement settings view
    console.log('Settings section');
}

// Load dashboard data
function loadDashboardData() {
    // Simulate loading dashboard statistics
    updateStats();
    loadRecentOrders();
}

// Update statistics
function updateStats() {
    // In a real application, this would fetch data from an API
    const stats = {
        orders: 1234,
        revenue: 45678,
        customers: 892,
        products: 156
    };
    
    // Update stats display
    document.querySelectorAll('.stat-number').forEach((stat, index) => {
        const values = Object.values(stats);
        if (values[index]) {
            stat.textContent = index === 1 ? `€€{values[index].toLocaleString()}` : values[index].toLocaleString();
        }
    });
}

// Load recent orders
function loadRecentOrders() {
    // In a real application, this would fetch from an API
    const recentOrders = [
        {
            id: '1234',
            items: 'Premium Whey Protein x2',
            date: '2 hours ago',
            status: 'pending',
            amount: 99.98
        },
        {
            id: '1233',
            items: 'Complete Multivitamin x1',
            date: '4 hours ago',
            status: 'completed',
            amount: 29.99
        },
        {
            id: '1232',
            items: 'Energy Protein Bars x3',
            date: '6 hours ago',
            status: 'shipped',
            amount: 74.97
        }
    ];
    
    // Update orders display
    const orderContainer = document.querySelector('.card-content');
    if (orderContainer) {
        // Clear existing orders
        const existingOrders = orderContainer.querySelectorAll('.order-item');
        existingOrders.forEach(order => order.remove());
        
        // Add new orders
        recentOrders.forEach(order => {
            const orderElement = createOrderElement(order);
            orderContainer.appendChild(orderElement);
        });
    }
}

// Create order element
function createOrderElement(order) {
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order-item';
    orderDiv.innerHTML = `
        <div class="order-info">
            <h4>Order #€{order.id}</h4>
            <p>€{order.items}</p>
            <span class="order-date">€{order.date}</span>
        </div>
        <div class="order-status €{order.status}">€{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
        <div class="order-amount">€€{order.amount}</div>
    `;
    return orderDiv;
}

// Modal functions
function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Product management functions
function saveProduct() {
    const form = document.querySelector('.product-form');
    const formData = new FormData(form);
    
    // Get form values
    const productData = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        description: document.getElementById('product-description').value,
        image: document.getElementById('product-image').value,
        status: document.getElementById('product-status').value
    };
    
    // Validate form
    if (!validateProductForm(productData)) {
        return;
    }
    
    // Save product (in real app, this would be an API call)
    addProductToTable(productData);
    
    // Close modal and reset form
    closeModal('addProductModal');
    form.reset();
    
    // Show success message
    showNotification('Product added successfully!', 'success');
}

// Validate product form
function validateProductForm(data) {
    if (!data.name || !data.category || !data.price || !data.stock || !data.description || !data.image) {
        showNotification('Please fill in all required fields', 'error');
        return false;
    }
    
    if (data.price <= 0) {
        showNotification('Price must be greater than 0', 'error');
        return false;
    }
    
    if (data.stock < 0) {
        showNotification('Stock cannot be negative', 'error');
        return false;
    }
    
    return true;
}

// Add product to table
function addProductToTable(productData) {
    const tableBody = document.querySelector('.products-table tbody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>
            <img src="€{productData.image}" alt="€{productData.name}" onerror="this.src='https://via.placeholder.com/50x50?text=No+Image'">
        </td>
        <td>€{productData.name}</td>
        <td>€{productData.category}</td>
        <td>€€{productData.price.toFixed(2)}</td>
        <td>€{productData.stock}</td>
        <td><span class="status €{productData.status}">€{productData.status.charAt(0).toUpperCase() + productData.status.slice(1)}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon edit-btn" onclick="editProduct(€{Date.now()})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete-btn" onclick="deleteProduct(€{Date.now()})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    tableBody.appendChild(newRow);
}

// Edit product
function editProduct(productId) {
    // In a real application, this would fetch product data and populate the form
    console.log('Edit product:', productId);
    showNotification('Edit functionality coming soon!', 'info');
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        // In a real application, this would be an API call
        const row = event.target.closest('tr');
        row.remove();
        showNotification('Product deleted successfully!', 'success');
    }
}

// Filter products
function filterProducts(category) {
    const rows = document.querySelectorAll('.products-table tbody tr');
    
    rows.forEach(row => {
        const productCategory = row.children[2].textContent.toLowerCase();
        if (category === '' || productCategory === category.toLowerCase()) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Quick action functions
function openCategoryModal() {
    showNotification('Category management coming soon!', 'info');
}

function openUserModal() {
    showNotification('User management coming soon!', 'info');
}

function openPromoModal() {
    showNotification('Promotion management coming soon!', 'info');
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification €{type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>€{message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: €{type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#cce5ff'};
        color: €{type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#004085'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
}

// Add CSS animation
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
`;
document.head.appendChild(style);

// Logout functionality
document.querySelector('.logout-btn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        // In a real application, this would clear session/tokens
        window.location.href = 'index.html';
    }
});

// Export functions for global access
window.openAddProductModal = openAddProductModal;
window.closeModal = closeModal;
window.saveProduct = saveProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.openCategoryModal = openCategoryModal;
window.openUserModal = openUserModal;
window.openPromoModal = openPromoModal;

function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
    
    // Handle sidebar navigation clicks on mobile
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });
}

function setupResponsiveHandlers() {
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            handleResize();
        }, 250);
    });
    
    // Initial call
    handleResize();
}

function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    const isMobile = window.innerWidth <= 768;
    const isLandscape = window.innerWidth <= 768 && window.innerHeight < window.innerWidth;
    
    if (sidebar) {
        // Handle landscape orientation
        if (isLandscape) {
            sidebar.style.position = 'fixed';
            sidebar.style.height = '100vh';
            sidebar.style.transform = 'translateX(-100%)';
        } else if (isMobile) {
            sidebar.style.position = 'relative';
            sidebar.style.height = 'auto';
            sidebar.style.transform = 'none';
        } else {
            sidebar.style.position = 'fixed';
            sidebar.style.height = '100vh';
            sidebar.style.transform = 'none';
        }
    }
    
    // Adjust table scrolling on mobile
    const tables = document.querySelectorAll('.products-table, .orders-table');
    tables.forEach(table => {
        if (isMobile) {
            table.style.overflowX = 'auto';
        } else {
            table.style.overflowX = 'visible';
        }
    });
    
    // Adjust modal sizing
    const modals = document.querySelectorAll('.modal-content');
    modals.forEach(modal => {
        if (isMobile) {
            modal.style.width = '95%';
            modal.style.margin = '10px';
            modal.style.maxHeight = '95vh';
        } else {
            modal.style.width = '';
            modal.style.margin = '';
            modal.style.maxHeight = '';
        }
    });
}

// Enhanced touch support for mobile
function setupTouchSupport() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Improve touch scrolling
    const scrollableElements = document.querySelectorAll('.products-table, .orders-table, .modal-content');
    scrollableElements.forEach(element => {
        element.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        }, { passive: true });
    });
}

// Handle form submissions on mobile
function setupMobileForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Add loading state for mobile
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                // Re-enable after a delay (in real app, this would be after API response)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Submit';
                }, 2000);
            }
        });
    });
}

// Initialize touch support and mobile forms
setupTouchSupport();
setupMobileForms();

// Export functions for use in other admin pages
window.adminPanel = {
    toggleSidebar: function() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        }
    },
    
    closeSidebar: function() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    },
    
    handleResize: handleResize
}; 