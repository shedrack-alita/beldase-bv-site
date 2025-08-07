document.addEventListener('DOMContentLoaded', function() {
    // Price formatting helper function
    function formatPrice(price) {
        return (Math.round(price * 100) / 100).toFixed(2);
    }
    
    // Step elements
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const stepIndicator1 = document.getElementById('stepIndicator1');
    const stepIndicator2 = document.getElementById('stepIndicator2');
    const stepIndicator3 = document.getElementById('stepIndicator3');

    // Step 1 -> Step 2
    const shippingForm = document.getElementById('shippingForm');
    shippingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        step1.style.display = 'none';
        step2.style.display = '';
        step3.style.display = 'none';
        stepIndicator1.classList.remove('active');
        stepIndicator2.classList.add('active');
        stepIndicator3.classList.remove('active');
    });

    // Step 2 -> Step 3
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        step1.style.display = 'none';
        step2.style.display = 'none';
        step3.style.display = '';
        stepIndicator1.classList.remove('active');
        stepIndicator2.classList.remove('active');
        stepIndicator3.classList.add('active');
        renderCartItems(); // Ensure cart is rendered on review step
    });

    // Step 2 <- Step 1 (Back)
    const backToShippingBtn = document.getElementById('backToShippingBtn');
    backToShippingBtn.addEventListener('click', function() {
        step1.style.display = '';
        step2.style.display = 'none';
        step3.style.display = 'none';
        stepIndicator1.classList.add('active');
        stepIndicator2.classList.remove('active');
        stepIndicator3.classList.remove('active');
    });

    // Step 3 <- Step 2 (Back)
    const backToPaymentBtn = document.getElementById('backToPaymentBtn');
    backToPaymentBtn.addEventListener('click', function() {
        step1.style.display = 'none';
        step2.style.display = '';
        step3.style.display = 'none';
        stepIndicator1.classList.remove('active');
        stepIndicator2.classList.add('active');
        stepIndicator3.classList.remove('active');
    });

    // --- Cart rendering logic ---
    function loadCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return [];
        }
    }

    function renderCartItems() {
        const cart = loadCart();
        const orderItems = document.getElementById('orderItems');
        let subtotal = 0;

        // Clear previous
        if (orderItems) orderItems.innerHTML = '';

        cart.forEach(item => {
            const itemTotal = (item.price * item.quantity);
            subtotal += itemTotal;

            // For review step
            if (orderItems) {
                const div = document.createElement('div');
                div.className = 'order-item';
                div.innerHTML = `
                    <div>
                        <strong>${item.name}</strong> x${item.quantity}
                    </div>
                    <div>
                        €${formatPrice(itemTotal)}
                    </div>
                `;
                orderItems.appendChild(div);
            }
        });

        // Update totals (only for review step, no sidebar)
        if (document.getElementById('subtotal')) document.getElementById('subtotal').textContent = '€' + formatPrice(subtotal);
        if (document.getElementById('shipping')) document.getElementById('shipping').textContent = '€0.00';
        if (document.getElementById('tax')) document.getElementById('tax').textContent = '€0.00';
        if (document.getElementById('total')) document.getElementById('total').textContent = '€' + formatPrice(subtotal);
    }

    // Render cart on page load and on review step
    renderCartItems();

    // --- Place Order logic ---
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            const cart = loadCart();
            if (!cart.length) {
                alert('Your cart is empty!');
                return;
            }
            
            const shippingForm = document.getElementById('shippingForm');
            if (!shippingForm.checkValidity()) {
                alert('Please fill in all required shipping information.');
                return;
            }
            
            const shippingInfo = {
                firstName: document.getElementById('shipping-firstname').value,
                lastName: document.getElementById('shipping-lastname').value,
                email: document.getElementById('shipping-email').value,
                phone: document.getElementById('shipping-phone').value,
                address: document.getElementById('shipping-address').value,
                city: document.getElementById('shipping-city').value,
                state: document.getElementById('shipping-state').value,
                country: document.getElementById('shipping-country').value
            };
            
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const order = {
                id: 'ORD-' + Date.now(),
                items: cart,
                shippingInfo,
                subtotal,
                shipping: 0,
                tax: 0,
                total: subtotal,
                date: new Date().toISOString()
            };
            
            try {
                let orders = JSON.parse(localStorage.getItem('orders') || '[]');
                orders.push(order);
                localStorage.setItem('orders', JSON.stringify(orders));
                
                let currentUser = null;
                try {
                    currentUser = JSON.parse(localStorage.getItem('currentUser'));
                } catch {}
                
                if (currentUser) {
                    if (!currentUser.orders) currentUser.orders = [];
                    currentUser.orders.push(order);
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    let users = JSON.parse(localStorage.getItem('users') || '[]');
                    users = users.map(u => u.email === currentUser.email ? currentUser : u);
                    localStorage.setItem('users', JSON.stringify(users));
                }
                
                localStorage.removeItem('cart');
                alert('Order placed successfully!');
                window.location.href = 'dashboard.html';
            } catch (error) {
                alert('Error placing order. Please try again.');
            }
        });
    }
});