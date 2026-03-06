// app.js

// Sample products
const products = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
    { id: 3, name: 'Product 3', price: 300 }
];

// Cart Management
let cart = [];

// Load cart from localStorage
function loadCart() {
    const storedCart = localStorage.getItem('cart');
    cart = storedCart ? JSON.parse(storedCart) : [];
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        saveCart();
        renderCart();
    }
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(product => product.id !== productId);
    saveCart();
    renderCart();
}

// Render product list
function renderProductList() {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: ${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productItem);
    });
}

// Render cart
function renderCart() {
    const cartDisplay = document.getElementById('cart');
    cartDisplay.innerHTML = '';
    cart.forEach(product => {
        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: ${product.price}</p>
            <button onclick="removeFromCart(${product.id})">Remove from Cart</button>
        `;
        cartDisplay.appendChild(cartItem);
    });
}

// Adyen Drop-in Checkout Integration
async function initCheckout() {
    const { Dropin } = await import('@adyen/adyen-web');
    const dropin = new Dropin({
        renderers: {
            dropin: {
                // Adyen configuration (clientKey, etc.)
            }
        }
    });

    // Payment submission
    dropin.on('submit', async (state) => {
        const response = await submitPayment(state);
        handlePaymentResult(response);
    });
}

// Submit payment
async function submitPayment(state) {
    // Call your backend here to handle payment
    return await fetch('/submit-payment', {
        method: 'POST',
        body: JSON.stringify(state),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
}

// Handle payment result
function handlePaymentResult(response) {
    if (response.resultCode) {
        alert('Payment successful!');
    } else {
        alert('Payment failed. Please try again.');
    }
}

// Initialize application
function initApp() {
    loadCart();
    renderProductList();
    renderCart();
    initCheckout();
}

// Start the application
initApp();