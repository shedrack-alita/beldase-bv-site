// Orders Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Orders JS loaded');
    
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    console.log('Elements found:', { menuToggle, sidebar, sidebarClose, sidebarOverlay });
    
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
    
    // Simple toggle function
    function toggleSidebar() {
        console.log('Toggle function called');
        
        if (sidebar) {
            const isActive = sidebar.classList.contains('active');
            console.log('Sidebar is active:', isActive);
            
            if (isActive) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }
    }
    
    // Add click event to menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Menu toggle clicked');
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
        link.addEventListener('click', function() {
            // Allow normal navigation (don't prevent default)
            // Just close sidebar on mobile after a short delay
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    closeSidebar();
                }, 100);
            }
        });
    });
    
    initializeOrdersPage();
    addEventListeners();
    loadOrders();
});

function initializeOrdersPage() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    const statusFilter = document.querySelector('.status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', handleStatusFilter);
    }
    
    const dateFilter = document.querySelector('.date-filter');
    if (dateFilter) {
        dateFilter.addEventListener('change', handleDateFilter);
    }
    
    setupPagination();
}

function addEventListeners() {
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportOrders);
    }
    
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-order-btn')) {
            showOrderDetails(e.target.dataset.orderId);
        }
        
        if (e.target.classList.contains('status-btn')) {
            updateOrderStatus(e.target.dataset.orderId, e.target.dataset.status);
        }
    });
}

// ... existing code ...

// Responsive design improvements
window.addEventListener('resize', debounce(() => {
    const tableContainer = document.querySelector('.orders-table');
    if (tableContainer) {
        tableContainer.style.overflowX = window.innerWidth < 768 ? 'auto' : 'visible';
    }
    
    // Adjust modal size for mobile
    const modals = document.querySelectorAll('.modal-content');
    modals.forEach(modal => {
        if (window.innerWidth < 768) {
            modal.style.width = '95%';
            modal.style.margin = '10px';
        } else {
            modal.style.width = '';
            modal.style.margin = '';
        }
    });
    
    // Adjust order details grid for mobile
    const orderDetailsGrid = document.querySelector('.order-details-grid');
    if (orderDetailsGrid) {
        if (window.innerWidth < 1024) {
            orderDetailsGrid.style.gridTemplateColumns = '1fr';
        } else {
            orderDetailsGrid.style.gridTemplateColumns = '1fr 1fr';
        }
    }
}, 250));

// Enhanced mobile touch support
document.addEventListener('touchstart', function() {}, {passive: true});

// Improve table scrolling on mobile
function setupMobileTableScroll() {
    const table = document.querySelector('.orders-table');
    if (table && window.innerWidth < 768) {
        table.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        }, {passive: true});
    }
}

// Call on load and resize
setupMobileTableScroll();
window.addEventListener('resize', setupMobileTableScroll);

// Improve mobile modal handling
function showOrderDetails(orderId) {
    const order = getSampleOrders().find(o => o.id == orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderDetailsModal');
    if (!modal) return;
    
    // Populate modal content
    populateOrderDetails(order);
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add mobile-specific adjustments
    if (window.innerWidth < 768) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.maxHeight = '90vh';
        modalContent.style.overflowY = 'auto';
    }
}

function populateOrderDetails(order) {
    const modal = document.getElementById('orderDetailsModal');
    if (!modal) return;
    
    // Populate order info
    modal.querySelector('.order-id').textContent = order.id;
    modal.querySelector('.order-date').textContent = order.date;
    modal.querySelector('.order-status').textContent = order.status;
    modal.querySelector('.order-status').className = `order-status €{order.status}`;
    modal.querySelector('.order-total').textContent = `€€{order.total.toFixed(2)}`;
    
    // Populate customer info
    modal.querySelector('.customer-name').textContent = order.customer.name;
    modal.querySelector('.customer-email').textContent = order.customer.email;
    modal.querySelector('.customer-phone').textContent = order.customer.phone;
    modal.querySelector('.shipping-address').textContent = order.customer.address;
    
    // Populate order items
    const itemsContainer = modal.querySelector('.order-items-list');
    itemsContainer.innerHTML = order.items.map(item => `
        <div class="order-item-detail">
            <div class="item-info">
                <img src="€{item.image}" alt="€{item.name}" class="item-image">
                <div class="item-details">
                    <h6>€{item.name}</h6>
                    <p>Qty: €{item.quantity}</p>
                </div>
            </div>
            <div class="item-price">€€{item.price.toFixed(2)}</div>
        </div>
    `).join('');
    
    // Populate timeline
    const timelineContainer = modal.querySelector('.timeline');
    timelineContainer.innerHTML = order.timeline.map(event => `
        <div class="timeline-item €{event.status}">
            <div class="timeline-content">
                <h6>€{event.title}</h6>
                <p>€{event.description}</p>
                <span class="timeline-date">€{event.date}</span>
            </div>
        </div>
    `).join('');
} 