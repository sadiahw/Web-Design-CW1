/* ========================================
   PIZZA Jerk WEBSITE - MAIN JAVASCRIPT
   ======================================== */

// ===== GLOBAL VARIABLES =====
let cart = [];

// ===== WAIT FOR DOM TO LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initMobileMenu();
    initOrderMode();
    initCart();
    initFAQ();
    initTestimonials();
    initForms();
    initTabs();
    initBuildYourOwn();
    initHomepageFeatures();
    initCheckoutPage();
    
    // Update cart count on every page
    updateCartCount();
    
    // Add to cart buttons - single event listener for all pages
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        // Remove any existing listeners to prevent duplicates
        btn.removeEventListener('click', handleAddToCart);
        btn.addEventListener('click', handleAddToCart);
    });
});

// ===== HELPER FUNCTION FOR ADD TO CART =====
function handleAddToCart(e) {
    e.preventDefault();
    const product = this.getAttribute('data-product');
    const price = parseFloat(this.getAttribute('data-price'));
    
    if (product && price) {
        addItemToCart(product, price);
    }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            
            const spans = this.querySelectorAll('span');
            if (navMenu.classList.contains('show')) {
                spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(8px, -8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// ===== ORDER MODE SWITCHING =====
function initOrderMode() {
    const deliveryBtn = document.getElementById('deliveryBtn');
    const pickupBtn = document.getElementById('pickupBtn');
    const deliveryForm = document.getElementById('deliveryForm');
    const pickupForm = document.getElementById('pickupForm');
    const deliveryPageBtn = document.getElementById('deliveryPageBtn');
    const pickupPageBtn = document.getElementById('pickupPageBtn');
    
    function setOrderMode(mode) {
        if (deliveryBtn && pickupBtn) {
            if (mode === 'delivery') {
                deliveryBtn.classList.add('active');
                pickupBtn.classList.remove('active');
                if (deliveryForm) deliveryForm.style.display = 'block';
                if (pickupForm) pickupForm.style.display = 'none';
            } else {
                pickupBtn.classList.add('active');
                deliveryBtn.classList.remove('active');
                if (deliveryForm) deliveryForm.style.display = 'none';
                if (pickupForm) pickupForm.style.display = 'block';
            }
        }
        
        if (deliveryPageBtn && pickupPageBtn) {
            if (mode === 'delivery') {
                deliveryPageBtn.classList.add('active');
                pickupPageBtn.classList.remove('active');
            } else {
                pickupPageBtn.classList.add('active');
                deliveryPageBtn.classList.remove('active');
            }
        }
    }
    
    if (deliveryBtn) deliveryBtn.addEventListener('click', () => setOrderMode('delivery'));
    if (pickupBtn) pickupBtn.addEventListener('click', () => setOrderMode('pickup'));
    if (deliveryPageBtn) deliveryPageBtn.addEventListener('click', () => setOrderMode('delivery'));
    if (pickupPageBtn) pickupPageBtn.addEventListener('click', () => setOrderMode('pickup'));
}

// ===== SHOPPING CART =====
function initCart() {
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    
    // Load cart from localStorage
    loadCart();
    
    // Open cart modal
    if (cartIcon) {
        cartIcon.addEventListener('click', openCartModal);
    }
    
    // Close cart modal
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('show');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('show');
        }
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            document.getElementById('cartModal').classList.remove('show');
            window.location.href = 'checkout.html';
        });
    }
    
    // Reorder buttons
    document.querySelectorAll('.reorder-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderNumber = this.getAttribute('data-order');
            alert(`Reorder functionality for order #${orderNumber}\nThis would add all items from that order to your cart.`);
        });
    });
}

// ===== CART FUNCTIONS =====
function addItemToCart(product, price) {
    const existingItem = cart.find(item => item.product === product);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product: product,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    alert(`${product} added to cart!`);
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    openCartModal();
};

window.updateQuantity = function(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        saveCart();
        updateCartCount();
        openCartModal();
    }
};

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems === 0 ? 'none' : 'flex';
    }
}

function openCartModal() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartModal) {
        if (cartItems) {
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            } else {
                let html = '';
                let total = 0;
                
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    html += `
                        <div class="cart-item">
                            <div class="cart-item-info">
                                <h4>${item.product}</h4>
                                <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
                            </div>
                            <div class="cart-item-actions">
                                <div class="cart-item-quantity">
                                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                                    <span>${item.quantity}</span>
                                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                                </div>
                                <span class="cart-item-total">$${itemTotal.toFixed(2)}</span>
                                <button class="remove-item" onclick="removeFromCart(${index})">×</button>
                            </div>
                        </div>
                    `;
                });
                
                cartItems.innerHTML = html;
                if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
            }
        }
        
        cartModal.classList.add('show');
    }
}

function saveCart() {
    localStorage.setItem('pizzaJerkCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('pizzaJerkCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

window.clearCart = function() {
    cart = [];
    saveCart();
    updateCartCount();
};

// ===== FAQ ACCORDION =====
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach((question, index) => {
        question.addEventListener('click', function() {
            const answer = document.getElementById(`faq${index + 1}Answer`);
            const icon = this.querySelector('.faq-icon');
            
            if (answer) {
                answer.classList.toggle('open');
                if (icon) icon.textContent = answer.classList.contains('open') ? '−' : '+';
            }
        });
    });
}

// ===== TESTIMONIALS SLIDER =====
function initTestimonials() {
    const dots = document.querySelectorAll('.dot');
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    if (dots.length && testimonials.length) {
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                
                testimonials.forEach(t => t.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));
                
                testimonials[index].classList.add('active');
                this.classList.add('active');
            });
        });
        
        // Auto-rotate every 5 seconds
        let currentIndex = 0;
        setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            
            testimonials.forEach(t => t.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            testimonials[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }, 5000);
    }
}

// ===== FORM HANDLING =====
function initForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            contactForm.style.display = 'none';
            if (formSuccess) formSuccess.style.display = 'block';
        });
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    const loginSuccess = document.getElementById('loginSuccess');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            loginForm.style.display = 'none';
            if (loginSuccess) {
                loginSuccess.style.display = 'block';
                setTimeout(() => window.location.href = 'account.html', 2000);
            }
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    const signupSuccess = document.getElementById('signupSuccess');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            
            if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
                alert('Please fill in all required fields');
                return;
            }
            
            if (password.length < 8) {
                alert('Password must be at least 8 characters');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (!terms) {
                alert('You must agree to the Terms and Conditions');
                return;
            }
            
            signupForm.style.display = 'none';
            if (signupSuccess) signupSuccess.style.display = 'block';
        });
    }
    
    // Profile form
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Profile updated successfully!');
        });
    }
    
    // Address and payment buttons
    const addAddressBtn = document.querySelector('.add-address-btn');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', () => alert('Add new address form would open here'));
    }
    
    const addPaymentBtn = document.querySelector('.add-payment-btn');
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', () => alert('Add payment method form would open here'));
    }
    
    // Location search
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.getElementById('locationSearch').value;
            alert(searchInput ? `Searching for locations near: ${searchInput}` : 'Please enter a location');
        });
    }
    
    // Use my location
    const useLocationBtn = document.getElementById('useMyLocation');
    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', () => alert('Getting your current location...'));
    }
    
    // Order buttons
    document.querySelectorAll('.order-delivery-btn, .order-pickup-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const store = this.getAttribute('data-store');
            alert(`Ordering from ${store}`);
            window.location.href = 'menu.html';
        });
    });
}

// ===== TAB SWITCHING =====
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length && tabContents.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                
                const activeTab = document.getElementById(tabId + 'Tab');
                if (activeTab) activeTab.classList.add('active');
            });
        });
    }
}

// ===== BUILD YOUR OWN PIZZA =====
function initBuildYourOwn() {
    const sizeRadios = document.querySelectorAll('input[name="size"]');
    const crustRadios = document.querySelectorAll('input[name="crust"]');
    const toppingCheckboxes = document.querySelectorAll('input[name="topping"]');
    const buildPrice = document.getElementById('buildPrice');
    const addCustomPizza = document.getElementById('addCustomPizza');
    
    if (sizeRadios.length && buildPrice) {
        const prices = { small: 8.99, medium: 10.99, large: 12.99 };
        
        function calculatePrice() {
            let selectedSize = 'small';
            sizeRadios.forEach(radio => { if (radio.checked) selectedSize = radio.value; });
            
            let total = prices[selectedSize];
            
            crustRadios.forEach(radio => {
                if (radio.checked && radio.value === 'stuffed') total += 2.00;
            });
            
            toppingCheckboxes.forEach(checkbox => {
                if (checkbox.checked) total += 1.00;
            });
            
            return total;
        }
        
        function updatePrice() {
            buildPrice.textContent = `$${calculatePrice().toFixed(2)}`;
        }
        
        sizeRadios.forEach(radio => radio.addEventListener('change', updatePrice));
        crustRadios.forEach(radio => radio.addEventListener('change', updatePrice));
        toppingCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updatePrice));
        
        if (addCustomPizza) {
            addCustomPizza.addEventListener('click', function() {
                let size = 'small', crust = 'original', sauce = 'marinara';
                sizeRadios.forEach(radio => { if (radio.checked) size = radio.value; });
                crustRadios.forEach(radio => { if (radio.checked) crust = radio.value; });
                
                document.querySelectorAll('input[name="sauce"]').forEach(radio => {
                    if (radio.checked) sauce = radio.value;
                });
                
                const toppings = [];
                toppingCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) toppings.push(checkbox.value);
                });
                
                const total = calculatePrice();
                let productName = `Custom ${size} ${crust} crust pizza with ${sauce}`;
                if (toppings.length > 0) productName += ` and ${toppings.join(', ')}`;
                
                addItemToCart(productName, total);
            });
        }
    }
}

// ===== HOMEPAGE FEATURES =====
function initHomepageFeatures() {
    // Find Stores button
    const findStoresBtn = document.getElementById('findStoresBtn');
    if (findStoresBtn) {
        findStoresBtn.addEventListener('click', function() {
            const address = document.getElementById('deliveryAddress').value;
            if (address.trim() === '') {
                alert('Please enter your address');
                return;
            }
            localStorage.setItem('deliveryAddress', address);
            window.location.href = 'order-online.html?mode=delivery';
        });
    }
    
    // Search Stores button
    const searchStoresBtn = document.getElementById('searchStoresBtn');
    if (searchStoresBtn) {
        searchStoresBtn.addEventListener('click', function() {
            const location = document.getElementById('pickupLocation').value;
            const storeList = document.getElementById('storeList');
            
            if (location.trim() === '') {
                alert('Please enter your location');
                return;
            }
            
            localStorage.setItem('pickupLocation', location);
            
            if (storeList) {
                storeList.innerHTML = `
                    <div class="store-item">
                        <h4>Pizza Jerk Downtown</h4>
                        <p>123 Main St - 0.8 miles away</p>
                        <button class="btn btn-secondary select-store-btn" data-store="Downtown">Select Store</button>
                    </div>
                    <div class="store-item">
                        <h4>Pizza Jerk Mall</h4>
                        <p>456 Shopping Ave - 1.2 miles away</p>
                        <button class="btn btn-secondary select-store-btn" data-store="Mall">Select Store</button>
                    </div>
                    <div class="store-item">
                        <h4>Pizza Jerk University</h4>
                        <p>789 College Blvd - 2.3 miles away</p>
                        <button class="btn btn-secondary select-store-btn" data-store="University">Select Store</button>
                    </div>
                `;
                
                document.querySelectorAll('.select-store-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const store = this.getAttribute('data-store');
                        localStorage.setItem('selectedStore', store);
                        alert(`Store selected: ${store}`);
                        window.location.href = 'menu.html';
                    });
                });
            }
        });
    }
}

// ===== CHECKOUT PAGE FUNCTIONS =====
function initCheckoutPage() {
    if (!window.location.pathname.includes('checkout.html')) return;
    
    loadCheckoutCart();
    
    // Delivery/Pickup toggle
    const deliveryRadio = document.getElementById('deliveryTypeDelivery');
    const pickupRadio = document.getElementById('deliveryTypePickup');
    const deliveryForm = document.getElementById('deliveryAddressForm');
    const pickupForm = document.getElementById('pickupStoreForm');
    const deliveryEstimateText = document.getElementById('deliveryEstimateText');
    const deliveryFeeElement = document.getElementById('deliveryFee');
    
    if (deliveryRadio && pickupRadio) {
        deliveryRadio.addEventListener('change', function() {
            if (this.checked) {
                deliveryForm.style.display = 'block';
                pickupForm.style.display = 'none';
                deliveryEstimateText.textContent = 'Estimated delivery: 30-45 minutes';
                deliveryFeeElement.textContent = '$2.99';
                updateTotals();
            }
        });
        
        pickupRadio.addEventListener('change', function() {
            if (this.checked) {
                deliveryForm.style.display = 'none';
                pickupForm.style.display = 'block';
                deliveryEstimateText.textContent = 'Ready for pickup in 15-20 minutes';
                deliveryFeeElement.textContent = '$0.00';
                updateTotals();
            }
        });
    }
    
    // Payment method toggle
    const cardRadio = document.getElementById('paymentCard');
    const paypalRadio = document.getElementById('paymentPaypal');
    const cashRadio = document.getElementById('paymentCash');
    const cardForm = document.getElementById('cardPaymentForm');
    const paypalMessage = document.getElementById('paypalMessage');
    const cashMessage = document.getElementById('cashMessage');
    
    if (cardRadio && paypalRadio && cashRadio) {
        cardRadio.addEventListener('change', function() {
            if (this.checked) {
                cardForm.style.display = 'block';
                paypalMessage.style.display = 'none';
                cashMessage.style.display = 'none';
            }
        });
        
        paypalRadio.addEventListener('change', function() {
            if (this.checked) {
                cardForm.style.display = 'none';
                paypalMessage.style.display = 'block';
                cashMessage.style.display = 'none';
            }
        });
        
        cashRadio.addEventListener('change', function() {
            if (this.checked) {
                cardForm.style.display = 'none';
                paypalMessage.style.display = 'none';
                cashMessage.style.display = 'block';
            }
        });
    }
    
    // Apply promo code
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', function() {
            const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();
            const promoMessage = document.getElementById('promoMessage');
            const discountRow = document.getElementById('discountRow');
            const discountAmount = document.getElementById('discountAmount');
            
            if (promoCode === 'PIZZA20') {
                const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace('$', ''));
                const discount = subtotal * 0.2;
                discountAmount.textContent = '-$' + discount.toFixed(2);
                discountRow.style.display = 'flex';
                promoMessage.textContent = 'Promo code applied! 20% off';
                promoMessage.style.color = '#4CAF50';
                updateTotals();
            } else if (promoCode === 'FREEDELIVERY') {
                document.getElementById('deliveryFee').textContent = '$0.00';
                promoMessage.textContent = 'Free delivery applied!';
                promoMessage.style.color = '#4CAF50';
                updateTotals();
            } else if (promoCode === '') {
                promoMessage.textContent = 'Please enter a promo code';
                promoMessage.style.color = '#e31837';
            } else {
                promoMessage.textContent = 'Invalid promo code';
                promoMessage.style.color = '#e31837';
            }
        });
    }
    
    // Input formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            e.target.value = value;
        });
    }
    
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    // Place order button
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', processOrder);
    }
}

function loadCheckoutCart() {
    const orderItemsContainer = document.getElementById('orderItems');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('totalAmount');
    
    if (!orderItemsContainer) return;
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. <a href="menu.html">Browse menu</a></p>';
        if (subtotalElement) subtotalElement.textContent = '$0.00';
        if (taxElement) taxElement.textContent = '$0.00';
        if (totalElement) totalElement.textContent = '$0.00';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="order-item">
                <div class="order-item-info">
                    <span class="order-item-name">${item.product}</span>
                    <span class="order-item-quantity">x${item.quantity}</span>
                </div>
                <span class="order-item-price">$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    orderItemsContainer.innerHTML = html;
    if (subtotalElement) subtotalElement.textContent = '$' + subtotal.toFixed(2);
    
    updateTotals();
}

function updateTotals() {
    const subtotalElement = document.getElementById('subtotal');
    const deliveryFeeElement = document.getElementById('deliveryFee');
    const taxElement = document.getElementById('tax');
    const discountRow = document.getElementById('discountRow');
    const discountAmount = document.getElementById('discountAmount');
    const totalElement = document.getElementById('totalAmount');
    const confirmTotal = document.getElementById('confirmTotal');
    
    if (!subtotalElement || !deliveryFeeElement || !taxElement || !totalElement) return;
    
    const subtotal = parseFloat(subtotalElement.textContent.replace('$', '')) || 0;
    const deliveryFee = parseFloat(deliveryFeeElement.textContent.replace('$', '')) || 0;
    const discount = discountRow && discountRow.style.display !== 'none' ? 
                     parseFloat(discountAmount.textContent.replace('-', '').replace('$', '')) || 0 : 0;
    
    const tax = (subtotal - discount) * 0.08;
    taxElement.textContent = '$' + tax.toFixed(2);
    
    const total = subtotal + deliveryFee + tax - discount;
    totalElement.textContent = '$' + total.toFixed(2);
    
    if (confirmTotal) confirmTotal.textContent = '$' + total.toFixed(2);
}

function processOrder() {
    const isDelivery = document.getElementById('deliveryTypeDelivery').checked;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const total = document.getElementById('totalAmount').textContent;
    
    // Validate required fields (simplified for brevity)
    let isValid = true;
    let errorMessage = '';
    
    const isDeliveryChecked = document.getElementById('deliveryTypeDelivery').checked;
    
    if (isDeliveryChecked) {
        const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'phone'];
        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                isValid = false;
                errorMessage = 'Please fill in all required delivery fields';
                break;
            }
        }
    } else {
        const storeField = document.getElementById('pickupStore');
        if (!storeField || !storeField.value) {
            isValid = false;
            errorMessage = 'Please select a store for pickup';
        }
    }
    
    if (paymentMethod === 'card') {
        const cardFields = ['cardName', 'cardNumber', 'expiryDate', 'cvv'];
        for (const fieldId of cardFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                isValid = false;
                errorMessage = 'Please fill in all card details';
                break;
            }
        }
    }
    
    if (cart.length === 0) {
        isValid = false;
        errorMessage = 'Your cart is empty. Please add items before checking out.';
    }
    
    if (!isValid) {
        alert(errorMessage || 'Please fill in all required fields');
        return;
    }
    
    // Generate order number and show confirmation
    const orderNumber = 'PH' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 10000);
    document.getElementById('orderNumber').textContent = '#' + orderNumber;
    document.getElementById('confirmTotal').textContent = total;
    
    const deliveryTime = isDelivery ? '30-45 minutes' : '15-20 minutes';
    document.getElementById('confirmDeliveryTime').textContent = deliveryTime;
    
    // Save order to history
    saveOrderToHistory({
        orderNumber: orderNumber,
        date: new Date().toLocaleDateString(),
        items: [...cart],
        total: total,
        deliveryType: isDelivery ? 'Delivery' : 'Pickup',
        paymentMethod: paymentMethod,
        status: 'Confirmed'
    });
    
    // Show confirmation modal
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
    }
}

function saveOrderToHistory(order) {
    let orderHistory = JSON.parse(localStorage.getItem('pizzaJerkOrders')) || [];
    orderHistory.unshift(order);
    if (orderHistory.length > 10) orderHistory = orderHistory.slice(0, 10);
    localStorage.setItem('pizzaJerkOrders', JSON.stringify(orderHistory));
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('confirmationModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});