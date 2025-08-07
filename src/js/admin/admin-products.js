// Products Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize products page
    initializeProductsPage();
    
    // Add event listeners
    addEventListeners();
    
    // Load initial data
    loadProducts();

    console.log('Admin Products JS loaded');
    
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
});

function initializeProductsPage() {
    // Set up search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Set up status filter
    const statusFilter = document.querySelector('.status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', handleStatusFilter);
    }
    
    // Set up bulk actions
    setupBulkActions();
    
    // Set up pagination
    setupPagination();
}

function addEventListeners() {
    // Add product button
    const addProductBtn = document.querySelector('.add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', showAddProductModal);
    }
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Modal backdrop clicks
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
    
    // Form submissions
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }
    
    // Quick view buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-view-btn')) {
            showProductDetails(e.target.dataset.productId);
        }
        
        if (e.target.classList.contains('edit-btn')) {
            editProduct(e.target.dataset.productId);
        }
        
        if (e.target.classList.contains('delete-btn')) {
            deleteProduct(e.target.dataset.productId);
        }
    });
}

function loadProducts() {
    const tableBody = document.querySelector('.products-table tbody');
    if (!tableBody) return;
    
    // Show loading state
    tableBody.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        const products = getSampleProducts();
        renderProducts(products);
        tableBody.classList.remove('loading');
    }, 500);
}

function getSampleProducts() {
    return [
        {
            id: 1,
            name: "Premium Whey Protein",
            category: "supplements",
            price: 49.99,
            stock: 85,
            status: "active",
            created: "Jan 15, 2024",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 2,
            name: "Complete Multivitamin",
            category: "supplements",
            price: 29.99,
            stock: 120,
            status: "active",
            created: "Jan 10, 2024",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 3,
            name: "Energy Protein Bars",
            category: "supplements",
            price: 24.99,
            stock: 45,
            status: "active",
            created: "Jan 8, 2024",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80"
        },
        {
            id: 4,
            name: "BCAA Recovery",
            category: "supplements",
            price: 34.99,
            stock: 12,
            status: "active",
            created: "Jan 12, 2024",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 5,
            name: "Organic Green Tea",
            category: "restaurant",
            price: 19.99,
            stock: 200,
            status: "active",
            created: "Jan 5, 2024",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 6,
            name: "Natural Face Cream",
            category: "cosmetics",
            price: 39.99,
            stock: 75,
            status: "active",
            created: "Jan 3, 2024",
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80"
        },
        {
            id: 7,
            name: "Premium Whiskey",
            category: "bar",
            price: 89.99,
            stock: 30,
            status: "active",
            created: "Jan 7, 2024",
            image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 8,
            name: "Vitamin D3",
            category: "supplements",
            price: 15.99,
            stock: 150,
            status: "inactive",
            created: "Jan 2, 2024",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        }
    ];
}

function renderProducts(products) {
    const tableBody = document.querySelector('.products-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = products.map(product => `
        <tr>
            <td>
                <input type="checkbox" class="product-checkbox" data-id="€{product.id}">
            </td>
            <td>
                <img src="€{product.image}" alt="€{product.name}" loading="lazy">
            </td>
            <td>
                <div>
                    <strong>€{product.name}</strong>
                    <br>
                    <small class="text-muted">ID: €{product.id}</small>
                </div>
            </td>
            <td>
                <span class="category-badge €{product.category}">€{product.category}</span>
            </td>
            <td>€€{product.price.toFixed(2)}</td>
            <td>
                <span class="stock-level €{getStockLevelClass(product.stock)}">€{product.stock}</span>
            </td>
            <td>
                <span class="status-badge €{product.status}">€{product.status}</span>
            </td>
            <td>€{product.created}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-icon quick-view-btn" data-product-id="€{product.id}" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-icon edit-btn" data-product-id="€{product.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon delete-btn" data-product-id="€{product.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Update product count
    updateProductCount(products.length);
}

function getStockLevelClass(stock) {
    if (stock > 50) return 'high';
    if (stock > 20) return 'medium';
    return 'low';
}

function updateProductCount(count) {
    const countElement = document.querySelector('.product-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('.products-table tbody tr');
    
    rows.forEach(row => {
        const productName = row.querySelector('td:nth-child(3) strong').textContent.toLowerCase();
        const productId = row.querySelector('td:nth-child(3) small').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productId.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function handleStatusFilter(e) {
    const status = e.target.value;
    const rows = document.querySelectorAll('.products-table tbody tr');
    
    rows.forEach(row => {
        const productStatus = row.querySelector('.status-badge').textContent;
        
        if (status === 'all' || productStatus === status) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function setupBulkActions() {
    const selectAllCheckbox = document.querySelector('.select-all-checkbox');
    const productCheckboxes = document.querySelectorAll('.product-checkbox');
    const bulkButtons = document.querySelectorAll('.bulk-btn');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            productCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBulkActions();
        });
    }
    
    productCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBulkActions);
    });
    
    // Bulk action buttons
    bulkButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const selectedIds = getSelectedProductIds();
            
            if (selectedIds.length === 0) {
                showNotification('Please select at least one product', 'warning');
                return;
            }
            
            handleBulkAction(action, selectedIds);
        });
    });
}

function updateBulkActions() {
    const selectedIds = getSelectedProductIds();
    const bulkButtons = document.querySelectorAll('.bulk-btn');
    
    bulkButtons.forEach(btn => {
        btn.disabled = selectedIds.length === 0;
    });
    
    const selectAllCheckbox = document.querySelector('.select-all-checkbox');
    const productCheckboxes = document.querySelectorAll('.product-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.product-checkbox:checked');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = checkedCheckboxes.length === productCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedCheckboxes.length > 0 && checkedCheckboxes.length < productCheckboxes.length;
    }
}

function getSelectedProductIds() {
    const checkedBoxes = document.querySelectorAll('.product-checkbox:checked');
    return Array.from(checkedBoxes).map(checkbox => checkbox.dataset.id);
}

function handleBulkAction(action, productIds) {
    switch (action) {
        case 'delete':
            if (confirm(`Are you sure you want to delete €{productIds.length} product(s)?`)) {
                // Simulate deletion
                showNotification(`€{productIds.length} product(s) deleted successfully`, 'success');
                loadProducts(); // Reload to refresh the list
            }
            break;
        case 'activate':
            showNotification(`€{productIds.length} product(s) activated successfully`, 'success');
            break;
        case 'deactivate':
            showNotification(`€{productIds.length} product(s) deactivated successfully`, 'success');
            break;
        case 'export':
            showNotification(`Exporting €{productIds.length} product(s)...`, 'info');
            break;
    }
}

// --- Modal Logic: Only one definition each, globally attached ---
function showAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Reset the form when opening
        const form = modal.querySelector('.product-form');
        if (form) form.reset();
    }
}
window.showAddProductModal = showAddProductModal;

function closeModal(modalId) {
    if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    } else {
        // Close all modals if no id is provided
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.style.display = 'none');
    }
    document.body.style.overflow = 'auto';
}
window.closeModal = closeModal;

function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productData = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!productData.name || !productData.price || !productData.category) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Simulate API call
    showNotification('Product added successfully!', 'success');
    closeModal();
    e.target.reset();
    
    // Reload products
    setTimeout(() => {
        loadProducts();
    }, 1000);
}

function showProductDetails(productId) {
    const product = getSampleProducts().find(p => p.id == productId);
    if (!product) return;
    
    const modal = document.getElementById('productDetailsModal');
    if (!modal) return;
    
    // Populate modal content
    modal.querySelector('.product-image-large img').src = product.image;
    modal.querySelector('.product-info-details h2').textContent = product.name;
    modal.querySelector('.product-description').textContent = `High-quality €{product.category} product for optimal results.`;
    
    // Populate meta information
    const metaContainer = modal.querySelector('.product-meta');
    metaContainer.innerHTML = `
        <div class="meta-item">
            <span class="meta-label">Product ID:</span>
            <span class="meta-value">€{product.id}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Category:</span>
            <span class="meta-value">
                <span class="category-badge €{product.category}">€{product.category}</span>
            </span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Price:</span>
            <span class="meta-value">€€{product.price.toFixed(2)}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Stock Level:</span>
            <span class="meta-value">
                <span class="stock-level €{getStockLevelClass(product.stock)}">€{product.stock} units</span>
            </span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Status:</span>
            <span class="meta-value">
                <span class="status-badge €{product.status}">€{product.status}</span>
            </span>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function editProduct(productId) {
    const product = getSampleProducts().find(p => p.id == productId);
    if (!product) return;
    
    showNotification(`Editing product: €{product.name}`, 'info');
    // In a real application, you would populate a form with the product data
}

function deleteProduct(productId) {
    const product = getSampleProducts().find(p => p.id == productId);
    if (!product) return;
    
    if (confirm(`Are you sure you want to delete "€{product.name}"?`)) {
        showNotification(`Product "€{product.name}" deleted successfully`, 'success');
        // In a real application, you would make an API call to delete the product
    }
}

function setupPagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    // Create pagination buttons
    const totalPages = 5;
    const currentPage = 1;
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn" €{currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="pagination-btn €{i === currentPage ? 'active' : ''}">€{i}</button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span class="pagination-dots">...</span>';
        }
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn" €{currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Add click handlers
    const paginationButtons = paginationContainer.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                // Handle page change
                showNotification('Loading page...', 'info');
            }
        });
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-€{type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-€{getNotificationIcon(type)}"></i>
            <span>€{message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: €{getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        default: return '#17a2b8';
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Responsive design improvements
window.addEventListener('resize', debounce(() => {
    const tableContainer = document.querySelector('.products-table');
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
}, 250));

// Enhanced mobile touch support
document.addEventListener('touchstart', function() {}, {passive: true});

// Improve table scrolling on mobile
function setupMobileTableScroll() {
    const table = document.querySelector('.products-table');
    if (table && window.innerWidth < 768) {
        table.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        }, {passive: true});
    }
}

// Call on load and resize
setupMobileTableScroll();
window.addEventListener('resize', setupMobileTableScroll);

window.bulkAction = bulkAction;

const categorySelect = document.getElementById('categorySelect');
const productsTableBody = document.getElementById('productsTableBody');
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const productsTableFooter = document.getElementById('productsTableFooter');

let currentCategory = categorySelect.value;

// Fetch and render products for the selected category
function fetchProducts() {
  fetch(`€{API_URL}?category=€{encodeURIComponent(currentCategory)}`)
    .then(res => res.json())
    .then(renderProducts);
}

function renderProducts(products) {
  productsTableBody.innerHTML = '';
  products.forEach(product => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="Name">€{product.name}</td>
      <td data-label="Price">€{product.price}</td>
      <td data-label="Description">€{product.description || ''}</td>
      <td data-label="Image">€{product.image ? `<img src="€{product.image}" alt="" style="width:40px;height:40px;object-fit:cover;">` : ''}</td>
      <td data-label="Category">€{product.category}</td>
      <td data-label="Stock">€{product.stock}</td>
      <td data-label="Status">€{product.status}</td>
      <td data-label="Actions">
        <button onclick="editProduct('€{product._id}')">Edit</button>
        <button onclick="deleteProduct('€{product._id}')">Delete</button>
      </td>
    `;
    productsTableBody.appendChild(tr);
  });
  productsTableFooter.innerHTML = `<span style='font-weight:600;color:#1976d2;'>Showing €{products.length} products</span> — Manage your €{currentCategory.toLowerCase()} products efficiently.`;
}

// Add Product button
addProductBtn.onclick = () => {
  openProductModal();
};

// Category switcher
categorySelect.onchange = () => {
  currentCategory = categorySelect.value;
  fetchProducts();
};

// Modal logic
closeModal.onclick = () => {
  productModal.style.display = 'none';
};

function openProductModal(product = null) {
  productModal.style.display = 'flex';
  modalTitle.textContent = product ? 'Edit Product' : 'Add Product';
  productForm.reset();
  document.getElementById('productId').value = product ? product._id : '';
  document.getElementById('productName').value = product ? product.name : '';
  document.getElementById('productPrice').value = product ? product.price : '';
  document.getElementById('productDescription').value = product ? product.description : '';
  document.getElementById('productImage').value = product ? product.image : '';
  document.getElementById('productCategory').value = product ? product.category : currentCategory;
  document.getElementById('productStock').value = product ? product.stock : '';
  document.getElementById('productStatus').value = product ? product.status : 'active';
}

// Add/Edit Product submit
productForm.onsubmit = function(e) {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const product = {
    name: document.getElementById('productName').value,
    price: parseFloat(document.getElementById('productPrice').value),
    description: document.getElementById('productDescription').value,
    image: document.getElementById('productImage').value,
    category: document.getElementById('productCategory').value,
    stock: parseInt(document.getElementById('productStock').value, 10) || 0,
    status: document.getElementById('productStatus').value
  };
  if (id) {
    // Edit
    fetch(`€{API_URL}/€{id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
      .then(res => res.json())
      .then(() => {
        productModal.style.display = 'none';
        fetchProducts();
      });
  } else {
    // Add
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
      .then(res => res.json())
      .then(() => {
        productModal.style.display = 'none';
        fetchProducts();
      });
  }
};

// Edit Product (global for inline onclick)
window.editProduct = function(id) {
  fetch(`€{API_URL}/€{id}`)
    .then(res => res.json())
    .then(product => openProductModal(product));
};

// Delete Product (global for inline onclick)
window.deleteProduct = function(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    fetch(`€{API_URL}/€{id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => fetchProducts());
  }
};

// Initial load
fetchProducts(); 