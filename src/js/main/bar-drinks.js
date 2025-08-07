document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.getElementById('drink-dropdown');
    const toggleBtn = dropdown.querySelector('.dropdown-toggle');
    const list = dropdown.querySelector('.dropdown-list');
    const messageDiv = document.getElementById('drink-select-message');
    let drinksData = null;

    // Helper to close dropdown
    function closeDropdown() {
        list.classList.remove('open');
        list.style.display = 'none';
    }
    // Helper to open dropdown
    function openDropdown() {
        list.classList.add('open');
        list.style.display = 'block';
    }

    // Populate dropdown from JSON
    fetch('../src/js/main/drinks.json')
        .then(res => res.json())
        .then(data => {
            drinksData = data;
            list.innerHTML = '';
            ['beer', 'wine', 'spirit'].forEach(category => {
                const optgroup = document.createElement('div');
                optgroup.className = 'dropdown-optgroup';
                optgroup.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                list.appendChild(optgroup);
                data[category].forEach(drink => {
                    const option = document.createElement('div');
                    option.className = 'dropdown-option';
                    option.tabIndex = 0;
                    option.dataset.name = drink.name;
                    option.dataset.price = drink.price;
                    option.dataset.category = category;
                    option.textContent = `${drink.name} – €${drink.price}`;
                    option.addEventListener('click', function(e) {
                        addDrinkToCart(drink.name, drink.price, category);
                        toggleBtn.textContent = 'Select a drink...';
                        closeDropdown();
                    });
                    option.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            option.click();
                        }
                    });
                    list.appendChild(option);
                });
            });
        });

    // Dropdown open/close logic
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (list.classList.contains('open')) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });
    // Close dropdown on outside click
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            closeDropdown();
        }
    });
    // Keyboard navigation for accessibility
    dropdown.addEventListener('keydown', function(e) {
        const options = Array.from(list.querySelectorAll('.dropdown-option'));
        const active = document.activeElement;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            let idx = options.indexOf(active);
            if (idx === -1 || idx === options.length - 1) {
                options[0]?.focus();
            } else {
                options[idx + 1]?.focus();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            let idx = options.indexOf(active);
            if (idx <= 0) {
                options[options.length - 1]?.focus();
            } else {
                options[idx - 1]?.focus();
            }
        } else if (e.key === 'Escape') {
            closeDropdown();
            toggleBtn.focus();
        }
    });

    function addDrinkToCart(name, price, category) {
        // Ensure price is a number
        const priceNum = typeof price === 'string' ? parseFloat(price) : price;
        // Add to cart (assume addToCart is globally available or implement a simple fallback)
        if (typeof addToCart === 'function') {
            addToCart(name, priceNum, ''); // Pass empty string for image
        } else {
            // Fallback: store in localStorage (cartItems)
            let cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
            const idx = cart.findIndex(item => item.name === name);
            if (idx > -1) {
                cart[idx].quantity += 1;
            } else {
                cart.push({ name, price: priceNum, category, quantity: 1 });
            }
            localStorage.setItem('cartItems', JSON.stringify(cart));
        }
        messageDiv.textContent = `${name} added to cart!`;
        setTimeout(() => { messageDiv.textContent = ''; }, 2000);
    }
}); 