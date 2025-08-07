// Admin Analytics JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();
    
    // Initialize sidebar functionality
    initializeSidebar();
    
    // Initialize date range filter
    initializeDateFilter();
    
    // Initialize chart period toggles
    initializeChartToggles();
});

// Initialize all charts
function initializeCharts() {
    initializeRevenueChart();
    initializeOrdersChart();
    initializeProductsChart();
    initializeDemographicsChart();
}

// Revenue Chart
function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    const revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue',
                data: [12500, 15800, 14200, 18900, 22100, 25600, 23400, 28700, 31200, 28900, 32400, 35600],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Orders Chart
function initializeOrdersChart() {
    const ctx = document.getElementById('ordersChart').getContext('2d');
    
    const ordersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Orders',
                data: [245, 312, 289, 356, 423, 478, 445, 523, 567, 534, 589, 623],
                backgroundColor: 'rgba(240, 147, 251, 0.8)',
                borderColor: '#f093fb',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Products Chart
function initializeProductsChart() {
    const ctx = document.getElementById('productsChart').getContext('2d');
    
    const productsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Whey Protein', 'Multivitamin', 'Energy Bars', 'BCAA Recovery', 'Omega-3', 'Others'],
            datasets: [{
                data: [35, 25, 20, 12, 6, 2],
                backgroundColor: [
                    '#667eea',
                    '#f093fb',
                    '#4facfe',
                    '#43e97b',
                    '#fa709a',
                    '#fee140'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Demographics Chart
function initializeDemographicsChart() {
    const ctx = document.getElementById('demographicsChart').getContext('2d');
    
    const demographicsChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
            datasets: [{
                data: [25, 35, 20, 15, 5],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(240, 147, 251, 0.8)',
                    'rgba(79, 172, 254, 0.8)',
                    'rgba(67, 233, 123, 0.8)',
                    'rgba(250, 112, 154, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

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

// Initialize date range filter
function initializeDateFilter() {
    const dateRange = document.getElementById('dateRange');
    
    if (dateRange) {
        dateRange.addEventListener('change', function() {
            const selectedRange = this.value;
            updateAnalyticsData(selectedRange);
        });
    }
}

// Initialize chart period toggles
function initializeChartToggles() {
    const chartBtns = document.querySelectorAll('.chart-btn');
    
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.chart-actions');
            const activeBtn = parent.querySelector('.chart-btn.active');
            const period = this.dataset.period;
            
            // Remove active class from all buttons in this group
            parent.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update chart data based on period
            updateChartData(period);
        });
    });
}

// Update analytics data based on date range
function updateAnalyticsData(range) {
    // Simulate loading state
    showLoadingState();
    
    // Simulate API call delay
    setTimeout(() => {
        // Update metrics based on range
        updateMetrics(range);
        
        // Update charts based on range
        updateCharts(range);
        
        // Hide loading state
        hideLoadingState();
    }, 1000);
}

// Update chart data based on period
function updateChartData(period) {
    // This would typically make an API call to get new data
    console.log('Updating chart data for period:', period);
    
    // For demo purposes, we'll just show a notification
    showNotification(`Chart data updated for €{period} period`, 'success');
}

// Update metrics display
function updateMetrics(range) {
    const metrics = {
        '7': {
            revenue: '€12,456',
            orders: '284',
            customers: '45',
            conversion: '2.8%'
        },
        '30': {
            revenue: '€124,567',
            orders: '2,847',
            customers: '456',
            conversion: '3.2%'
        },
        '90': {
            revenue: '€356,789',
            orders: '8,234',
            customers: '1,234',
            conversion: '3.5%'
        },
        '365': {
            revenue: '€1,234,567',
            orders: '28,456',
            customers: '4,567',
            conversion: '3.8%'
        }
    };
    
    const data = metrics[range] || metrics['30'];
    
    // Update metric numbers
    const metricNumbers = document.querySelectorAll('.metric-number');
    if (metricNumbers.length >= 4) {
        metricNumbers[0].textContent = data.revenue;
        metricNumbers[1].textContent = data.orders;
        metricNumbers[2].textContent = data.customers;
        metricNumbers[3].textContent = data.conversion;
    }
}

// Update charts display
function updateCharts(range) {
    // This would typically update the actual chart data
    console.log('Updating charts for range:', range);
}

// Show loading state
function showLoadingState() {
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.style.opacity = '0.6';
    });
}

// Hide loading state
function hideLoadingState() {
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.style.opacity = '1';
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-€{type}`;
    notification.innerHTML = `
        <i class="fas fa-€{type === 'success' ? 'check-circle' : 'info-circle'}"></i>
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
        background: €{type === 'success' ? '#10b981' : '#3b82f6'};
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
