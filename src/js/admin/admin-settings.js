// Admin Settings JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar functionality
    initializeSidebar();
    
    // Initialize settings tabs
    initializeSettingsTabs();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize password strength checker
    initializePasswordStrength();
    
    // Initialize file uploads
    initializeFileUploads();
    
    // Initialize toggle switches
    initializeToggleSwitches();
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

// Initialize settings tabs
function initializeSettingsTabs() {
    const tabs = document.querySelectorAll('.settings-tab');
    const panels = document.querySelectorAll('.settings-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Initialize form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('.settings-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                saveSettings(this);
            }
        });
    });
}

// Validate form
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Email validation
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    // Password confirmation validation
    const passwordField = form.querySelector('#newPassword');
    const confirmField = form.querySelector('#confirmPassword');
    
    if (passwordField && confirmField && passwordField.value && confirmField.value) {
        if (passwordField.value !== confirmField.value) {
            showFieldError(confirmField, 'Passwords do not match');
            isValid = false;
        }
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#dc3545';
    field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 4px;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '#e0e0e0';
    field.style.boxShadow = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+€/;
    return emailRegex.test(email);
}

// Save settings
function saveSettings(form) {
    const formData = new FormData(form);
    const settings = {};
    
    // Collect form data
    for (let [key, value] of formData.entries()) {
        settings[key] = value;
    }
    
    // Collect checkbox values
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        settings[checkbox.id] = checkbox.checked;
    });
    
    // Show loading state
    showLoadingState(form);
    
    // Simulate API call
    setTimeout(() => {
        hideLoadingState(form);
        showNotification('Settings saved successfully!', 'success');
        
        // Update UI based on saved settings
        updateUIAfterSave(settings);
    }, 1500);
}

// Show loading state
function showLoadingState(form) {
    const submitBtn = form.querySelector('.btn-primary');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
    }
}

// Hide loading state
function hideLoadingState(form) {
    const submitBtn = form.querySelector('.btn-primary');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Changes';
    }
}

// Update UI after save
function updateUIAfterSave(settings) {
    // Update page title if store name changed
    if (settings.storeName) {
        document.title = `€{settings.storeName} - Admin Settings`;
    }
    
    // Update maintenance mode
    if (settings.maintenanceMode !== undefined) {
        if (settings.maintenanceMode) {
            showNotification('Maintenance mode enabled', 'warning');
        } else {
            showNotification('Maintenance mode disabled', 'info');
        }
    }
}

// Initialize password strength checker
function initializePasswordStrength() {
    const passwordField = document.getElementById('newPassword');
    if (!passwordField) return;
    
    passwordField.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });
}

// Check password strength
function checkPasswordStrength(password) {
    const requirements = document.querySelectorAll('.password-requirements .requirement');
    if (requirements.length === 0) return;
    
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#€%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Update requirement indicators
    requirements.forEach((req, index) => {
        const checkKeys = ['length', 'uppercase', 'lowercase', 'number', 'special'];
        const key = checkKeys[index];
        
        if (checks[key]) {
            req.classList.add('met');
        } else {
            req.classList.remove('met');
        }
    });
    
    // Calculate overall strength
    const strength = Object.values(checks).filter(Boolean).length;
    updatePasswordStrengthIndicator(strength);
}

// Update password strength indicator
function updatePasswordStrengthIndicator(strength) {
    let strengthText = '';
    let strengthColor = '';
    
    if (strength <= 2) {
        strengthText = 'Weak';
        strengthColor = '#dc3545';
    } else if (strength <= 3) {
        strengthText = 'Fair';
        strengthColor = '#ffc107';
    } else if (strength <= 4) {
        strengthText = 'Good';
        strengthColor = '#17a2b8';
    } else {
        strengthText = 'Strong';
        strengthColor = '#28a745';
    }
    
    // Update strength indicator if it exists
    const indicator = document.querySelector('.password-strength');
    if (indicator) {
        indicator.textContent = strengthText;
        indicator.style.color = strengthColor;
    }
}

// Initialize file uploads
function initializeFileUploads() {
    const uploadBtns = document.querySelectorAll('.btn-secondary');
    
    uploadBtns.forEach(btn => {
        if (btn.textContent.includes('Upload')) {
            btn.addEventListener('click', function() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                
                input.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        handleFileUpload(file);
                    }
                });
                
                input.click();
            });
        }
    });
}

// Handle file upload
function handleFileUpload(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        const logoPreview = document.querySelector('.logo-preview img');
        if (logoPreview) {
            logoPreview.src = e.target.result;
        }
        showNotification('Logo uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
}

// Initialize toggle switches
function initializeToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.payment-method, .shipping-method, .two-factor-setup')?.querySelector('h4')?.textContent || 'Setting';
            
            if (this.checked) {
                showNotification(`€{settingName} enabled`, 'success');
            } else {
                showNotification(`€{settingName} disabled`, 'info');
            }
        });
    });
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
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
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

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    // Auto-save functionality
    initializeAutoSave();
    
    // Reset to default functionality
    initializeResetButtons();
    
    // Test connection functionality
    initializeTestButtons();
});

// Initialize auto-save
function initializeAutoSave() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            // Debounce auto-save
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = setTimeout(() => {
                showNotification('Auto-saved', 'info');
            }, 2000);
        });
    });
}

// Initialize reset buttons
function initializeResetButtons() {
    const resetBtns = document.querySelectorAll('.btn-secondary');
    
    resetBtns.forEach(btn => {
        if (btn.textContent.includes('Reset')) {
            btn.addEventListener('click', function() {
                if (confirm('Are you sure you want to reset all settings to default?')) {
                    resetFormToDefault(this.closest('form'));
                }
            });
        }
    });
}

// Reset form to default
function resetFormToDefault(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = input.defaultChecked;
        } else {
            input.value = input.defaultValue;
        }
    });
    
    showNotification('Settings reset to default', 'info');
}

// Initialize test buttons
function initializeTestButtons() {
    const testBtns = document.querySelectorAll('.btn-secondary');
    
    testBtns.forEach(btn => {
        if (btn.textContent.includes('Test')) {
            btn.addEventListener('click', function() {
                const btnText = this.textContent;
                
                if (btnText.includes('Connection')) {
                    testConnection();
                } else if (btnText.includes('Email')) {
                    testEmail();
                } else if (btnText.includes('Rates')) {
                    testShippingRates();
                }
            });
        }
    });
}

// Test connection
function testConnection() {
    this.disabled = true;
    this.textContent = 'Testing...';
    
    setTimeout(() => {
        this.disabled = false;
        this.textContent = 'Test Connection';
        showNotification('Connection test successful!', 'success');
    }, 2000);
}

// Test email
function testEmail() {
    this.disabled = true;
    this.textContent = 'Sending...';
    
    setTimeout(() => {
        this.disabled = false;
        this.textContent = 'Send Test Email';
        showNotification('Test email sent successfully!', 'success');
    }, 2000);
}

// Test shipping rates
function testShippingRates() {
    this.disabled = true;
    this.textContent = 'Calculating...';
    
    setTimeout(() => {
        this.disabled = false;
        this.textContent = 'Calculate Rates';
        showNotification('Shipping rates calculated successfully!', 'success');
    }, 2000);
}
