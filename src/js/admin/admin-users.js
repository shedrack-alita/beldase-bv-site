// Admin Users JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar functionality
    initializeSidebar();
    
    // Initialize users data
    initializeUsers();
    
    // Initialize search and filters
    initializeSearchAndFilters();
    
    // Initialize bulk actions
    initializeBulkActions();
    
    // Initialize modals
    initializeModals();
});

// Initialize sidebar functionality
function initializeSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarClose = document.getElementById('sidebarClose');

    // Menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            if (sidebarOverlay) {
                sidebarOverlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
            }
        });
    }

    // Close sidebar
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.remove('active');
            if (sidebarOverlay) {
                sidebarOverlay.style.display = 'none';
            }
        });
    }

    // Overlay click to close
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            sidebarOverlay.style.display = 'none';
        });
    }

    // Close sidebar on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            if (sidebarOverlay) {
                sidebarOverlay.style.display = 'none';
            }
        }
    });

    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            sidebar.classList.remove('active');
            if (sidebarOverlay) {
                sidebarOverlay.style.display = 'none';
            }
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
                    sidebar.classList.remove('active');
                    if (sidebarOverlay) {
                        sidebarOverlay.style.display = 'none';
                    }
                }, 100);
            }
        });
    });
}

// Initialize users data
function initializeUsers() {
    loadUsers();
    setupUserFilters();
}

// Load users
function loadUsers() {
    const tableBody = document.querySelector('.users-table tbody');
    if (!tableBody) return;
    
    // Show loading state
    tableBody.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        const users = getSampleUsers();
        renderUsers(users);
        tableBody.classList.remove('loading');
        updateUserCount(users.length);
    }, 500);
}

// Get sample users data
function getSampleUsers() {
    return [
        {
            id: 1,
            name: "Sarah Johnson",
            email: "sarah.johnson@email.com",
            role: "customer",
            status: "active",
            joinDate: "Jan 15, 2024",
            lastLogin: "2 hours ago",
            orders: 12,
            totalSpent: 456.78,
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 2,
            name: "Michael Chen",
            email: "michael.chen@email.com",
            role: "premium",
            status: "active",
            joinDate: "Dec 20, 2023",
            lastLogin: "1 day ago",
            orders: 28,
            totalSpent: 1245.67,
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            email: "emily.rodriguez@email.com",
            role: "customer",
            status: "active",
            joinDate: "Jan 8, 2024",
            lastLogin: "3 days ago",
            orders: 5,
            totalSpent: 234.56,
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 4,
            name: "David Thompson",
            email: "david.thompson@email.com",
            role: "admin",
            status: "active",
            joinDate: "Nov 15, 2023",
            lastLogin: "Just now",
            orders: 0,
            totalSpent: 0,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 5,
            name: "Lisa Wang",
            email: "lisa.wang@email.com",
            role: "customer",
            status: "inactive",
            joinDate: "Dec 5, 2023",
            lastLogin: "2 weeks ago",
            orders: 3,
            totalSpent: 89.99,
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 6,
            name: "James Wilson",
            email: "james.wilson@email.com",
            role: "premium",
            status: "suspended",
            joinDate: "Jan 2, 2024",
            lastLogin: "1 week ago",
            orders: 15,
            totalSpent: 678.90,
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 7,
            name: "Maria Garcia",
            email: "maria.garcia@email.com",
            role: "customer",
            status: "active",
            joinDate: "Jan 12, 2024",
            lastLogin: "5 hours ago",
            orders: 8,
            totalSpent: 345.67,
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 8,
            name: "Robert Davis",
            email: "robert.davis@email.com",
            role: "moderator",
            status: "active",
            joinDate: "Dec 28, 2023",
            lastLogin: "1 hour ago",
            orders: 2,
            totalSpent: 123.45,
            avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        }
    ];
}

// Render users in table
function renderUsers(users) {
    const tableBody = document.querySelector('.users-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div class="user-info">
                    <img src="€{user.avatar}" alt="€{user.name}">
                    <div>
                        <div class="user-name">€{user.name}</div>
                        <div class="user-id">#€{user.id}</div>
                    </div>
                </div>
            </td>
            <td>€{user.email}</td>
            <td><span class="role-badge €{user.role}">€{user.role}</span></td>
            <td><span class="status-badge €{user.status}">€{user.status}</span></td>
            <td>€{user.joinDate}</td>
            <td>€{user.lastLogin}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon view-btn" data-user-id="€{user.id}" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon edit-btn" data-user-id="€{user.id}" title="Edit User">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-btn" data-user-id="€{user.id}" title="Delete User">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to action buttons
    addUserActionListeners();
}

// Add event listeners to user action buttons
function addUserActionListeners() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showUserDetails(this.dataset.userId);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            editUser(this.dataset.userId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteUser(this.dataset.userId);
        });
    });
}

// Show user details modal
function showUserDetails(userId) {
    const users = getSampleUsers();
    const user = users.find(u => u.id == userId);
    if (!user) return;
    
    const modal = document.getElementById('userDetailsModal');
    if (!modal) return;
    
    // Populate user details
    modal.querySelector('.user-profile img').src = user.avatar;
    modal.querySelector('.user-profile .user-info h4').textContent = user.name;
    modal.querySelector('.user-profile .user-info p').textContent = user.email;
    
    // Populate user stats
    const statsContainer = modal.querySelector('.user-stats');
    statsContainer.innerHTML = `
        <div class="stat-item">
            <div class="stat-label">Total Orders</div>
            <div class="stat-value">€{user.orders}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Total Spent</div>
            <div class="stat-value">€€{user.totalSpent.toFixed(2)}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Join Date</div>
            <div class="stat-value">€{user.joinDate}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Last Login</div>
            <div class="stat-value">€{user.lastLogin}</div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Edit user
function editUser(userId) {
    const users = getSampleUsers();
    const user = users.find(u => u.id == userId);
    if (!user) return;
    
    showNotification(`Editing user: €{user.name}`, 'info');
    // Implement edit functionality
}

// Delete user
function deleteUser(userId) {
    const users = getSampleUsers();
    const user = users.find(u => u.id == userId);
    if (!user) return;
    
    if (confirm(`Are you sure you want to delete user €{user.name}?`)) {
        showNotification(`User €{user.name} deleted successfully`, 'success');
        // Implement delete functionality
    }
}

// Initialize search and filters
function initializeSearchAndFilters() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    const roleFilter = document.querySelector('.role-filter');
    if (roleFilter) {
        roleFilter.addEventListener('change', handleRoleFilter);
    }
    
    const statusFilter = document.querySelector('.status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', handleStatusFilter);
    }
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const users = getSampleUsers();
    
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    
    renderUsers(filteredUsers);
    updateUserCount(filteredUsers.length);
}

// Handle role filter
function handleRoleFilter(e) {
    const selectedRole = e.target.value;
    const users = getSampleUsers();
    
    const filteredUsers = selectedRole === 'all' 
        ? users 
        : users.filter(user => user.role === selectedRole);
    
    renderUsers(filteredUsers);
    updateUserCount(filteredUsers.length);
}

// Handle status filter
function handleStatusFilter(e) {
    const selectedStatus = e.target.value;
    const users = getSampleUsers();
    
    const filteredUsers = selectedStatus === 'all' 
        ? users 
        : users.filter(user => user.status === selectedStatus);
    
    renderUsers(filteredUsers);
    updateUserCount(filteredUsers.length);
}

// Setup user filters
function setupUserFilters() {
    // This function can be used to set up additional filter functionality
}

// Initialize bulk actions
function initializeBulkActions() {
    const selectAllCheckbox = document.querySelector('.select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.user-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBulkActions();
        });
    }
    
    // Individual checkbox listeners
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('user-checkbox')) {
            updateBulkActions();
        }
    });
}

// Update bulk actions visibility
function updateBulkActions() {
    const selectedUsers = getSelectedUserIds();
    const bulkActions = document.querySelector('.bulk-actions');
    
    if (bulkActions) {
        if (selectedUsers.length > 0) {
            bulkActions.style.display = 'flex';
        } else {
            bulkActions.style.display = 'none';
        }
    }
}

// Get selected user IDs
function getSelectedUserIds() {
    const checkboxes = document.querySelectorAll('.user-checkbox:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Initialize modals
function initializeModals() {
    // Close modal buttons
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
}

// Close modal
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = '';
}

// Update user count
function updateUserCount(count) {
    const countElement = document.querySelector('.user-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-€{type}`;
    notification.innerHTML = `
        <i class="fas fa-€{getNotificationIcon(type)}"></i>
        <span>€{message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: €{getNotificationColor(type)};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Get notification color
function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// Debounce function
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

// Add CSS animation for notifications
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
