// Global cart array
let cart = [];

// Add item to cart
function addToCart(item, price) {
    cart.push({ item, price });
    renderCart();
}

// Build Your Own pizza
function buildPizza() {
    let baseSelect = document.getElementById('base');
    let toppingsSelect = document.getElementById('toppings');
    let base = baseSelect.options[baseSelect.selectedIndex].text;
    let price = parseFloat(baseSelect.value);
    let toppings = Array.from(toppingsSelect.selectedOptions).map(opt => {
        price += parseFloat(opt.value);
        return opt.text;
    });
    let pizzaName = base + " with " + toppings.join(", ");
    addToCart(pizzaName, price);
}

// Render cart items dynamically
function renderCart() {
    let cartDiv = document.getElementById('cart-items');
    if (!cartDiv) return; // Some pages may not have cart section
    if(cart.length === 0) {
        cartDiv.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    cartDiv.innerHTML = '';
    cart.forEach((c, index) => {
        let div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<span>${c.item} - $${c.price.toFixed(2)}</span>
                         <button class="button" onclick="removeFromCart(${index})">Remove</button>`;
        cartDiv.appendChild(div);
    });
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

// Navigate tabs for menu categories
function openTab(evt, tabName) {
    let tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    let tablinks = document.querySelectorAll('.tablink');
    tablinks.forEach(link => link.classList.remove('active'));
    evt.currentTarget.classList.add('active');
}

// Checkout function
function checkout() {
    alert("Redirecting to checkout page...");
    window.location.href = "checkout.html";
}

// Complete order function
function completeOrder() {
    alert("Order Completed! Thank you for ordering from Pizza Planet.");
    cart = [];
    renderCart();
}
