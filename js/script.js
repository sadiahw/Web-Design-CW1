// PIZZA JERK WEBSITE

// This is shopping cart it starts empty
let myCart = [];

// This runs when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded! 🍕");
    
    // Set up all the things on the page
    setupMobileMenu();
    setupOrderButtons();
    setupCart();
    setupQuestions();
    setupReviews();
    setupForms();
    setupTabs();
    setupPizzaBuilder();
    setupHomepage();
    setupCheckout();
    
    // Update how many items in cart
    showCartCount();
    
    // Make all "add to cart" buttons work
    let allAddButtons = document.querySelectorAll('.add-to-cart');
    for (let i = 0; i < allAddButtons.length; i++) {
        allAddButtons[i].onclick = function(event) {
            event.preventDefault();
            let productName = this.getAttribute('data-product');
            let productPrice = this.getAttribute('data-price');
            productPrice = Number(productPrice);
            
            if (productName && productPrice) {
                addToCart(productName, productPrice);
            }
        };
    }
});

// ==================== MOBILE MENU ====================
function setupMobileMenu() {
    let menuButton = document.getElementById('mobileMenuBtn');
    let navMenu = document.getElementById('navMenu');
    
    if (menuButton && navMenu) {
        menuButton.onclick = function() {
            // Toggle menu
            if (navMenu.style.display === 'block') {
                navMenu.style.display = 'none';
            } else {
                navMenu.style.display = 'block';
            }
            
            // Change the hamburger icon
            let spans = this.getElementsByTagName('span');
            if (navMenu.style.display === 'block') {
                spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(8px, -8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        };
    }
}

// ==================== DELIVERY OR PICKUP ====================
function setupOrderButtons() {
    // Buttons on order page
    let deliveryBtn = document.getElementById('deliveryBtn');
    let pickupBtn = document.getElementById('pickupBtn');
    let deliveryForm = document.getElementById('deliveryForm');
    let pickupForm = document.getElementById('pickupForm');
    
    if (deliveryBtn && deliveryForm && pickupForm) {
        deliveryBtn.onclick = function() {
            deliveryBtn.classList.add('active');
            pickupBtn.classList.remove('active');
            deliveryForm.style.display = 'block';
            pickupForm.style.display = 'none';
        };
        
        pickupBtn.onclick = function() {
            pickupBtn.classList.add('active');
            deliveryBtn.classList.remove('active');
            deliveryForm.style.display = 'none';
            pickupForm.style.display = 'block';
        };
    }
    
    // Buttons on homepage
    let homeDeliveryBtn = document.getElementById('deliveryPageBtn');
    let homePickupBtn = document.getElementById('pickupPageBtn');
    
    if (homeDeliveryBtn && homePickupBtn) {
        homeDeliveryBtn.onclick = function() {
            homeDeliveryBtn.classList.add('active');
            homePickupBtn.classList.remove('active');
        };
        
        homePickupBtn.onclick = function() {
            homePickupBtn.classList.add('active');
            homeDeliveryBtn.classList.remove('active');
        };
    }
}

// ==================== SHOPPING CART ====================
function setupCart() {
    // Load saved cart
    let savedCart = localStorage.getItem('pizzaJerkCart');
    if (savedCart) {
        myCart = JSON.parse(savedCart);
    }
    
    // Cart icon opens modal
    let cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.onclick = function() {
            showCartModal();
        };
    }
    
    // Close cart button
    let closeBtn = document.getElementById('closeCart');
    if (closeBtn) {
        closeBtn.onclick = function() {
            document.getElementById('cartModal').classList.remove('show');
        };
    }
    
    // Click outside to close
    window.onclick = function(event) {
        let modal = document.getElementById('cartModal');
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    };
    
    // Checkout button
    let checkout = document.getElementById('checkoutBtn');
    if (checkout) {
        checkout.onclick = function() {
            if (myCart.length === 0) {
                alert('Your cart is empty! Go get some pizza! 🍕');
                return;
            }
            document.getElementById('cartModal').classList.remove('show');
            window.location.href = 'checkout.html';
        };
    }
    
    // Reorder buttons
    let reorderButtons = document.querySelectorAll('.reorder-btn');
    for (let i = 0; i < reorderButtons.length; i++) {
        reorderButtons[i].onclick = function() {
            let orderNum = this.getAttribute('data-order');
            alert('You want to reorder #' + orderNum + '? Coming soon! 😊');
        };
    }
}

// Add item to cart
function addToCart(productName, productPrice) {
    // Check if item already in cart
    let foundItem = null;
    for (let i = 0; i < myCart.length; i++) {
        if (myCart[i].product === productName) {
            foundItem = myCart[i];
            break;
        }
    }
    
    if (foundItem) {
        foundItem.quantity = foundItem.quantity + 1;
    } else {
        myCart.push({
            product: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    // Save to browser
    localStorage.setItem('pizzaJerkCart', JSON.stringify(myCart));
    
    showCartCount();
    alert(productName + ' added to cart! 🍕');
}

// Remove item from cart
function removeFromCart(indexNumber) {
    myCart.splice(indexNumber, 1);
    localStorage.setItem('pizzaJerkCart', JSON.stringify(myCart));
    showCartCount();
    showCartModal();
}

// Change quantity
function changeQuantity(indexNumber, changeAmount) {
    if (myCart[indexNumber]) {
        myCart[indexNumber].quantity = myCart[indexNumber].quantity + changeAmount;
        
        if (myCart[indexNumber].quantity <= 0) {
            myCart.splice(indexNumber, 1);
        }
        
        localStorage.setItem('pizzaJerkCart', JSON.stringify(myCart));
        showCartCount();
        showCartModal();
    }
}

// Update the cart number badge
function showCartCount() {
    let cartBadge = document.getElementById('cartCount');
    if (cartBadge) {
        let totalItems = 0;
        for (let i = 0; i < myCart.length; i++) {
            totalItems = totalItems + myCart[i].quantity;
        }
        cartBadge.innerHTML = totalItems;
        
        if (totalItems === 0) {
            cartBadge.style.display = 'none';
        } else {
            cartBadge.style.display = 'flex';
        }
    }
}

// Show cart modal with items
function showCartModal() {
    let modal = document.getElementById('cartModal');
    let itemsDiv = document.getElementById('cartItems');
    let totalSpan = document.getElementById('cartTotal');
    
    if (modal) {
        if (itemsDiv) {
            if (myCart.length === 0) {
                itemsDiv.innerHTML = '<p style="text-align: center;">Your cart is empty</p>';
            } else {
                let htmlString = '';
                let totalPrice = 0;
                
                for (let i = 0; i < myCart.length; i++) {
                    let item = myCart[i];
                    let itemTotal = item.price * item.quantity;
                    totalPrice = totalPrice + itemTotal;
                    
                    htmlString = htmlString + `
                        <div style="border-bottom: 1px solid #eee; padding: 10px; margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between;">
                                <div>
                                    <h4 style="margin: 0;">${item.product}</h4>
                                    <p style="margin: 5px 0;">$${item.price.toFixed(2)} each</p>
                                </div>
                                <div style="text-align: right;">
                                    <div style="display: flex; align-items: center; gap: 5px;">
                                        <button onclick="changeQuantity(${i}, -1)" style="width: 30px; height: 30px;">-</button>
                                        <span>${item.quantity}</span>
                                        <button onclick="changeQuantity(${i}, 1)" style="width: 30px; height: 30px;">+</button>
                                    </div>
                                    <p><strong>$${itemTotal.toFixed(2)}</strong></p>
                                    <button onclick="removeFromCart(${i})" style="color: red; border: none; background: none;">Remove</button>
                                </div>
                            </div>
                        </div>
                    `;
                }
                
                itemsDiv.innerHTML = htmlString;
                if (totalSpan) {
                    totalSpan.innerHTML = '$' + totalPrice.toFixed(2);
                }
            }
        }
        
        modal.classList.add('show');
    }
}

// Clear whole cart
function clearWholeCart() {
    myCart = [];
    localStorage.setItem('pizzaJerkCart', JSON.stringify(myCart));
    showCartCount();
}

// ==================== FAQ SECTION ====================
function setupQuestions() {
    let questions = document.querySelectorAll('.faq-question');
    
    for (let i = 0; i < questions.length; i++) {
        questions[i].onclick = function() {
            // Find the answer (next element)
            let answer = this.nextElementSibling;
            let icon = this.querySelector('.faq-icon');
            
            if (answer) {
                if (answer.style.display === 'block') {
                    answer.style.display = 'none';
                    if (icon) icon.innerHTML = '+';
                } else {
                    answer.style.display = 'block';
                    if (icon) icon.innerHTML = '−';
                }
            }
        };
    }
}

// ==================== REVIEWS SLIDER ====================
function setupReviews() {
    let dots = document.querySelectorAll('.dot');
    let reviews = document.querySelectorAll('.testimonial-card');
    
    if (dots.length > 0 && reviews.length > 0) {
        for (let i = 0; i < dots.length; i++) {
            dots[i].onclick = function() {
                let index = this.getAttribute('data-index');
                index = parseInt(index);
                
                // Hide all reviews
                for (let j = 0; j < reviews.length; j++) {
                    reviews[j].classList.remove('active');
                    dots[j].classList.remove('active');
                }
                
                // Show selected review
                reviews[index].classList.add('active');
                this.classList.add('active');
            };
        }
        
        // Auto change every 5 seconds
        let currentReview = 0;
        setInterval(function() {
            currentReview = currentReview + 1;
            if (currentReview >= reviews.length) {
                currentReview = 0;
            }
            
            for (let j = 0; j < reviews.length; j++) {
                reviews[j].classList.remove('active');
                dots[j].classList.remove('active');
            }
            
            reviews[currentReview].classList.add('active');
            dots[currentReview].classList.add('active');
        }, 5000);
    }
}

// ==================== FORMS ====================
function setupForms() {
    // Contact form
    let contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.onsubmit = function(event) {
            event.preventDefault();
            contactForm.style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
        };
    }
    
    // Login form
    let loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = function(event) {
            event.preventDefault();
            
            let email = document.getElementById('email').value;
            let password = document.getElementById('password').value;
            
            if (email === '' || password === '') {
                alert('Please fill in both email and password!');
                return;
            }
            
            loginForm.style.display = 'none';
            document.getElementById('loginSuccess').style.display = 'block';
            
            setTimeout(function() {
                window.location.href = 'account.html';
            }, 2000);
        };
    }
    
    // Signup form
    let signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.onsubmit = function(event) {
            event.preventDefault();
            
            let firstName = document.getElementById('firstName').value;
            let lastName = document.getElementById('lastName').value;
            let email = document.getElementById('email').value;
            let phone = document.getElementById('phone').value;
            let password = document.getElementById('password').value;
            let confirmPass = document.getElementById('confirmPassword').value;
            let termsChecked = document.getElementById('terms').checked;
            
            if (firstName === '' || lastName === '' || email === '' || phone === '' || password === '' || confirmPass === '') {
                alert('Please fill in all fields!');
                return;
            }
            
            if (password.length < 8) {
                alert('Password needs to be at least 8 characters!');
                return;
            }
            
            if (password !== confirmPass) {
                alert('Passwords do not match!');
                return;
            }
            
            if (!termsChecked) {
                alert('You must agree to the Terms and Conditions!');
                return;
            }
            
            signupForm.style.display = 'none';
            document.getElementById('signupSuccess').style.display = 'block';
        };
    }
    
    // Profile form
    let profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.onsubmit = function(event) {
            event.preventDefault();
            alert('Profile updated! 👍');
        };
    }
    
    // Address button
    let addAddress = document.querySelector('.add-address-btn');
    if (addAddress) {
        addAddress.onclick = function() {
            alert('Add new address form would open here');
        };
    }
    
    // Payment button
    let addPayment = document.querySelector('.add-payment-btn');
    if (addPayment) {
        addPayment.onclick = function() {
            alert('Add payment method form would open here');
        };
    }
    
    // Location search
    let searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.onclick = function() {
            let location = document.getElementById('locationSearch').value;
            if (location) {
                alert('Searching for locations near: ' + location);
            } else {
                alert('Please enter a location');
            }
        };
    }
    
    // Use my location
    let locationBtn = document.getElementById('useMyLocation');
    if (locationBtn) {
        locationBtn.onclick = function() {
            alert('Getting your location... 📍');
        };
    }
}

// ==================== TABS ====================
function setupTabs() {
    let tabButtons = document.querySelectorAll('.tab-btn');
    let tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length > 0 && tabContents.length > 0) {
        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].onclick = function() {
                let tabId = this.getAttribute('data-tab');
                
                // Remove active class from all
                for (let j = 0; j < tabButtons.length; j++) {
                    tabButtons[j].classList.remove('active');
                    tabContents[j].classList.remove('active');
                }
                
                // Add active class to clicked
                this.classList.add('active');
                document.getElementById(tabId + 'Tab').classList.add('active');
            };
        }
    }
}

// ==================== BUILD YOUR OWN PIZZA ====================
function setupPizzaBuilder() {
    let sizeRadios = document.querySelectorAll('input[name="size"]');
    let crustRadios = document.querySelectorAll('input[name="crust"]');
    let toppingBoxes = document.querySelectorAll('input[name="topping"]');
    let priceDisplay = document.getElementById('buildPrice');
    let addButton = document.getElementById('addCustomPizza');
    
    if (sizeRadios.length > 0 && priceDisplay) {
        // Prices
        let sizePrices = {
            small: 8.99,
            medium: 10.99,
            large: 12.99
        };
        
        function getTotalPrice() {
            // Get size
            let selectedSize = 'small';
            for (let i = 0; i < sizeRadios.length; i++) {
                if (sizeRadios[i].checked) {
                    selectedSize = sizeRadios[i].value;
                    break;
                }
            }
            
            let total = sizePrices[selectedSize];
            
            // Check crust
            for (let i = 0; i < crustRadios.length; i++) {
                if (crustRadios[i].checked && crustRadios[i].value === 'stuffed') {
                    total = total + 2.00;
                    break;
                }
            }
            
            // Add toppings
            for (let i = 0; i < toppingBoxes.length; i++) {
                if (toppingBoxes[i].checked) {
                    total = total + 1.00;
                }
            }
            
            return total;
        }
        
        function updatePriceDisplay() {
            priceDisplay.innerHTML = '$' + getTotalPrice().toFixed(2);
        }
        
        // Add event listeners
        for (let i = 0; i < sizeRadios.length; i++) {
            sizeRadios[i].addEventListener('change', updatePriceDisplay);
        }
        for (let i = 0; i < crustRadios.length; i++) {
            crustRadios[i].addEventListener('change', updatePriceDisplay);
        }
        for (let i = 0; i < toppingBoxes.length; i++) {
            toppingBoxes[i].addEventListener('change', updatePriceDisplay);
        }
        
        if (addButton) {
            addButton.onclick = function() {
                // Get size
                let pizzaSize = 'small';
                for (let i = 0; i < sizeRadios.length; i++) {
                    if (sizeRadios[i].checked) {
                        pizzaSize = sizeRadios[i].value;
                        break;
                    }
                }
                
                // Get crust
                let pizzaCrust = 'original';
                for (let i = 0; i < crustRadios.length; i++) {
                    if (crustRadios[i].checked) {
                        pizzaCrust = crustRadios[i].value;
                        break;
                    }
                }
                
                // Get sauce
                let pizzaSauce = 'marinara';
                let sauceRadios = document.querySelectorAll('input[name="sauce"]');
                for (let i = 0; i < sauceRadios.length; i++) {
                    if (sauceRadios[i].checked) {
                        pizzaSauce = sauceRadios[i].value;
                        break;
                    }
                }
                
                // Get toppings
                let pizzaToppings = [];
                for (let i = 0; i < toppingBoxes.length; i++) {
                    if (toppingBoxes[i].checked) {
                        pizzaToppings.push(toppingBoxes[i].value);
                    }
                }
                
                let finalPrice = getTotalPrice();
                let pizzaName = 'Custom ' + pizzaSize + ' ' + pizzaCrust + ' crust pizza with ' + pizzaSauce;
                
                if (pizzaToppings.length > 0) {
                    pizzaName = pizzaName + ' and ' + pizzaToppings.join(', ');
                }
                
                addToCart(pizzaName, finalPrice);
            };
        }
    }
}

// ==================== HOMEPAGE ====================
function setupHomepage() {
    // Find Stores button
    let findStores = document.getElementById('findStoresBtn');
    if (findStores) {
        findStores.onclick = function() {
            let address = document.getElementById('deliveryAddress').value;
            if (address.trim() === '') {
                alert('Please enter your address');
                return;
            }
            localStorage.setItem('deliveryAddress', address);
            window.location.href = 'order-online.html?mode=delivery';
        };
    }
    
    // Search Stores button
    let searchStores = document.getElementById('searchStoresBtn');
    if (searchStores) {
        searchStores.onclick = function() {
            let location = document.getElementById('pickupLocation').value;
            let storeList = document.getElementById('storeList');
            
            if (location.trim() === '') {
                alert('Please enter your location');
                return;
            }
            
            localStorage.setItem('pickupLocation', location);
            
            if (storeList) {
                storeList.innerHTML = `
                    <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px;">
                        <h4>Pizza Jerk Downtown</h4>
                        <p>123 Main St - 0.8 miles away</p>
                        <button class="btn btn-secondary" onclick="selectStore('Downtown')">Select Store</button>
                    </div>
                    <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px;">
                        <h4>Pizza Jerk Mall</h4>
                        <p>456 Shopping Ave - 1.2 miles away</p>
                        <button class="btn btn-secondary" onclick="selectStore('Mall')">Select Store</button>
                    </div>
                    <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px;">
                        <h4>Pizza Jerk University</h4>
                        <p>789 College Blvd - 2.3 miles away</p>
                        <button class="btn btn-secondary" onclick="selectStore('University')">Select Store</button>
                    </div>
                `;
            }
        };
    }
}

// Helper function for selecting store
function selectStore(storeName) {
    localStorage.setItem('selectedStore', storeName);
    alert('Store selected: ' + storeName);
    window.location.href = 'menu.html';
}

// ==================== CHECKOUT PAGE ====================
function setupCheckout() {
    // Check if we're on checkout page
    if (!window.location.pathname.includes('checkout.html')) {
        return;
    }
    
    loadCheckoutItems();
    
    // Delivery/Pickup toggle
    let deliveryRadio = document.getElementById('deliveryTypeDelivery');
    let pickupRadio = document.getElementById('deliveryTypePickup');
    let deliveryForm = document.getElementById('deliveryAddressForm');
    let pickupForm = document.getElementById('pickupStoreForm');
    let estimateText = document.getElementById('deliveryEstimateText');
    let deliveryFee = document.getElementById('deliveryFee');
    
    if (deliveryRadio && pickupRadio) {
        deliveryRadio.onclick = function() {
            if (this.checked) {
                deliveryForm.style.display = 'block';
                pickupForm.style.display = 'none';
                estimateText.innerHTML = 'Estimated delivery: 30-45 minutes';
                deliveryFee.innerHTML = '$2.99';
                updateCheckoutTotals();
            }
        };
        
        pickupRadio.onclick = function() {
            if (this.checked) {
                deliveryForm.style.display = 'none';
                pickupForm.style.display = 'block';
                estimateText.innerHTML = 'Ready for pickup in 15-20 minutes';
                deliveryFee.innerHTML = '$0.00';
                updateCheckoutTotals();
            }
        };
    }
    
    // Payment method toggle
    let cardRadio = document.getElementById('paymentCard');
    let paypalRadio = document.getElementById('paymentPaypal');
    let cashRadio = document.getElementById('paymentCash');
    let cardForm = document.getElementById('cardPaymentForm');
    let paypalMsg = document.getElementById('paypalMessage');
    let cashMsg = document.getElementById('cashMessage');
    
    if (cardRadio && paypalRadio && cashRadio) {
        cardRadio.onclick = function() {
            if (this.checked) {
                cardForm.style.display = 'block';
                paypalMsg.style.display = 'none';
                cashMsg.style.display = 'none';
            }
        };
        
        paypalRadio.onclick = function() {
            if (this.checked) {
                cardForm.style.display = 'none';
                paypalMsg.style.display = 'block';
                cashMsg.style.display = 'none';
            }
        };
        
        cashRadio.onclick = function() {
            if (this.checked) {
                cardForm.style.display = 'none';
                paypalMsg.style.display = 'none';
                cashMsg.style.display = 'block';
            }
        };
    }
    
    // Promo code button
    let promoBtn = document.getElementById('applyPromoBtn');
    if (promoBtn) {
        promoBtn.onclick = function() {
            let code = document.getElementById('promoCode').value;
            code = code.trim().toUpperCase();
            let message = document.getElementById('promoMessage');
            let discountRow = document.getElementById('discountRow');
            let discountAmount = document.getElementById('discountAmount');
            
            if (code === 'PIZZA20') {
                let subtotalText = document.getElementById('subtotal').innerHTML;
                let subtotal = parseFloat(subtotalText.replace('$', ''));
                let discount = subtotal * 0.2;
                discountAmount.innerHTML = '-$' + discount.toFixed(2);
                discountRow.style.display = 'flex';
                message.innerHTML = 'Promo code applied! 20% off';
                message.style.color = 'green';
                updateCheckoutTotals();
            } 
            else if (code === 'FREEDELIVERY') {
                document.getElementById('deliveryFee').innerHTML = '$0.00';
                message.innerHTML = 'Free delivery applied!';
                message.style.color = 'green';
                updateCheckoutTotals();
            } 
            else if (code === '') {
                message.innerHTML = 'Please enter a promo code';
                message.style.color = 'red';
            } 
            else {
                message.innerHTML = 'Invalid promo code';
                message.style.color = 'red';
            }
        };
    }
    
    // Credit card formatting
    let cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.oninput = function() {
            let value = this.value.replace(/\s/g, '');
            if (value.length > 0) {
                // Add space every 4 digits
                let newValue = '';
                for (let i = 0; i < value.length; i++) {
                    if (i > 0 && i % 4 === 0) {
                        newValue = newValue + ' ';
                    }
                    newValue = newValue + value[i];
                }
                this.value = newValue;
            }
        };
    }
    
    // Expiry date formatting
    let expiry = document.getElementById('expiryDate');
    if (expiry) {
        expiry.oninput = function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        };
    }
    
    // CVV - numbers only
    let cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.oninput = function() {
            this.value = this.value.replace(/\D/g, '');
        };
    }
    
    // Place order button
    let placeOrder = document.getElementById('placeOrderBtn');
    if (placeOrder) {
        placeOrder.onclick = function() {
            placeMyOrder();
        };
    }
}

// Load items on checkout page
function loadCheckoutItems() {
    let itemsDiv = document.getElementById('orderItems');
    let subtotalSpan = document.getElementById('subtotal');
    let taxSpan = document.getElementById('tax');
    let totalSpan = document.getElementById('totalAmount');
    
    if (!itemsDiv) return;
    
    if (myCart.length === 0) {
        itemsDiv.innerHTML = '<p>Your cart is empty. <a href="menu.html">Order some pizza!</a></p>';
        if (subtotalSpan) subtotalSpan.innerHTML = '$0.00';
        if (taxSpan) taxSpan.innerHTML = '$0.00';
        if (totalSpan) totalSpan.innerHTML = '$0.00';
        return;
    }
    
    let htmlCode = '';
    let subtotal = 0;
    
    for (let i = 0; i < myCart.length; i++) {
        let item = myCart[i];
        let itemTotal = item.price * item.quantity;
        subtotal = subtotal + itemTotal;
        
        htmlCode = htmlCode + `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div>
                    <span>${item.product}</span>
                    <span style="color: #666;"> x${item.quantity}</span>
                </div>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    }
    
    itemsDiv.innerHTML = htmlCode;
    if (subtotalSpan) subtotalSpan.innerHTML = '$' + subtotal.toFixed(2);
    
    updateCheckoutTotals();
}

// Update totals on checkout page
function updateCheckoutTotals() {
    let subtotalSpan = document.getElementById('subtotal');
    let deliverySpan = document.getElementById('deliveryFee');
    let taxSpan = document.getElementById('tax');
    let discountRow = document.getElementById('discountRow');
    let discountSpan = document.getElementById('discountAmount');
    let totalSpan = document.getElementById('totalAmount');
    let confirmTotal = document.getElementById('confirmTotal');
    
    if (!subtotalSpan || !deliverySpan || !taxSpan || !totalSpan) return;
    
    let subtotal = parseFloat(subtotalSpan.innerHTML.replace('$', ''));
    if (isNaN(subtotal)) subtotal = 0;
    
    let delivery = parseFloat(deliverySpan.innerHTML.replace('$', ''));
    if (isNaN(delivery)) delivery = 0;
    
    let discount = 0;
    if (discountRow && discountRow.style.display !== 'none') {
        let discountText = discountSpan.innerHTML.replace('-', '').replace('$', '');
        discount = parseFloat(discountText);
        if (isNaN(discount)) discount = 0;
    }
    
    let tax = (subtotal - discount) * 0.08;
    taxSpan.innerHTML = '$' + tax.toFixed(2);
    
    let total = subtotal + delivery + tax - discount;
    totalSpan.innerHTML = '$' + total.toFixed(2);
    
    if (confirmTotal) {
        confirmTotal.innerHTML = '$' + total.toFixed(2);
    }
}

// Place the order
function placeMyOrder() {
    // Check if delivery or pickup
    let isDelivery = false;
    let deliveryRadio = document.getElementById('deliveryTypeDelivery');
    if (deliveryRadio) {
        isDelivery = deliveryRadio.checked;
    }
    
    // Get payment method
    let paymentMethod = 'card';
    let paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    for (let i = 0; i < paymentRadios.length; i++) {
        if (paymentRadios[i].checked) {
            paymentMethod = paymentRadios[i].value;
            break;
        }
    }
    
    let totalAmount = document.getElementById('totalAmount').innerHTML;
    
    // Simple validation
    let everythingOK = true;
    let errorMsg = '';
    
    if (isDelivery) {
        // Check delivery fields
        let fields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'phone'];
        for (let i = 0; i < fields.length; i++) {
            let field = document.getElementById(fields[i]);
            if (!field || field.value.trim() === '') {
                everythingOK = false;
                errorMsg = 'Please fill in all delivery info';
                break;
            }
        }
    } else {
        let storeField = document.getElementById('pickupStore');
        if (!storeField || storeField.value === '') {
            everythingOK = false;
            errorMsg = 'Please select a store for pickup';
        }
    }
    
    if (paymentMethod === 'card') {
        let cardFields = ['cardName', 'cardNumber', 'expiryDate', 'cvv'];
        for (let i = 0; i < cardFields.length; i++) {
            let field = document.getElementById(cardFields[i]);
            if (!field || field.value.trim() === '') {
                everythingOK = false;
                errorMsg = 'Please fill in all card details';
                break;
            }
        }
    }
    
    if (myCart.length === 0) {
        everythingOK = false;
        errorMsg = 'Your cart is empty!';
    }
    
    if (!everythingOK) {
        alert(errorMsg || 'Please fill in all required fields');
        return;
    }
    
    // Create order number
    let date = new Date();
    let orderNumber = 'PJ' + date.getFullYear() + '-' + Math.floor(Math.random() * 10000);
    
    document.getElementById('orderNumber').innerHTML = '#' + orderNumber;
    document.getElementById('confirmTotal').innerHTML = totalAmount;
    
    let deliveryTime = isDelivery ? '30-45 minutes' : '15-20 minutes';
    document.getElementById('confirmDeliveryTime').innerHTML = deliveryTime;
    
    // Save to order history
    let oldOrders = localStorage.getItem('pizzaJerkOrders');
    let allOrders = [];
    if (oldOrders) {
        allOrders = JSON.parse(oldOrders);
    }
    
    let newOrder = {
        orderNumber: orderNumber,
        date: date.toLocaleDateString(),
        items: [...myCart],
        total: totalAmount,
        deliveryType: isDelivery ? 'Delivery' : 'Pickup',
        paymentMethod: paymentMethod,
        status: 'Confirmed'
    };
    
    allOrders.unshift(newOrder);
    if (allOrders.length > 10) {
        allOrders = allOrders.slice(0, 10);
    }
    localStorage.setItem('pizzaJerkOrders', JSON.stringify(allOrders));
    
    // Show confirmation
    document.getElementById('confirmationModal').style.display = 'flex';
    
    // Clear cart
    myCart = [];
    localStorage.setItem('pizzaJerkCart', JSON.stringify(myCart));
    showCartCount();
}

// Close confirmation modal
window.onclick = function(event) {
    let modal = document.getElementById('confirmationModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
