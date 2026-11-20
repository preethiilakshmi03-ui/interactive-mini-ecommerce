
// =====================================
// LUXECART - PREMIUM E-COMMERCE WEBSITE
// =====================================

// Product Database
const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        category: "Electronics",
        price: 2499,
        oldPrice: 3499,
        emoji: "🎧",
        rating: "★★★★★",
        description: "Experience premium sound quality."
    },
    {
        id: 2,
        name: "Urban Street Sneakers",
        category: "Fashion",
        price: 1899,
        oldPrice: 2599,
        emoji: "👟",
        rating: "★★★★★",
        description: "Comfort meets modern street style."
    },
    {
        id: 3,
        name: "Luxury Classic Watch",
        category: "Accessories",
        price: 3299,
        oldPrice: 4299,
        emoji: "⌚",
        rating: "★★★★★",
        description: "Timeless elegance on your wrist."
    },
    {
        id: 4,
        name: "Premium Travel Backpack",
        category: "Lifestyle",
        price: 1599,
        oldPrice: 2199,
        emoji: "🎒",
        rating: "★★★★☆",
        description: "Your perfect everyday companion."
    },
    {
        id: 5,
        name: "Designer Sunglasses",
        category: "Accessories",
        price: 999,
        oldPrice: 1499,
        emoji: "🕶️",
        rating: "★★★★★",
        description: "Upgrade your look with confidence."
    },
    {
        id: 6,
        name: "Modern Smart Speaker",
        category: "Electronics",
        price: 2199,
        oldPrice: 2999,
        emoji: "🔊",
        rating: "★★★★☆",
        description: "Bring music to every moment."
    },
    {
        id: 7,
        name: "Premium Handbag",
        category: "Fashion",
        price: 2799,
        oldPrice: 3599,
        emoji: "👜",
        rating: "★★★★★",
        description: "A perfect blend of style and beauty."
    },
    {
        id: 8,
        name: "Minimal Desk Lamp",
        category: "Lifestyle",
        price: 1299,
        oldPrice: 1799,
        emoji: "💡",
        rating: "★★★★☆",
        description: "Make your workspace extraordinary."
    }
];

// DOM Elements
const productGrid = document.getElementById("productGrid");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const checkoutButton = document.getElementById("checkoutButton");
const checkoutModal = document.getElementById("checkoutModal");
const closeModal = document.getElementById("closeModal");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const confirmOrder = document.getElementById("confirmOrder");

// Cart Data
let cart = [];

try {
    const savedCart = JSON.parse(localStorage.getItem("luxeCart"));
    cart = Array.isArray(savedCart) ? savedCart : [];
} catch {
    cart = [];
}

// Currency Formatter
function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

// Display Products
function displayProducts(items = products) {
    productGrid.innerHTML = "";

    if (items.length === 0) {
        productGrid.innerHTML = "<p>No products found.</p>";
        return;
    }

    items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <span class="product-emoji">${product.emoji}</span>
                <span class="product-category">${product.category}</span>
            </div>

            <div class="product-info">
                <div class="product-rating">${product.rating}</div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="product-price">
                    <strong>${formatPrice(product.price)}</strong>
                    <del>${formatPrice(product.oldPrice)}</del>
                </div>

                <button class="add-to-cart" data-id="${product.id}">
                    Add to Cart +
                </button>
            </div>
        `;

        productGrid.appendChild(card);
    });
}

// Save Cart
function saveCart() {
    localStorage.setItem("luxeCart", JSON.stringify(cart));
}

// Add Product to Cart
function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    cartButton.classList.add("cart-added");
    setTimeout(() => {
        cartButton.classList.remove("cart-added");
    }, 300);
}

// Update Cart
function updateCart() {
    const totalItems = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );

    cartCount.textContent = totalItems;
    cartTotal.textContent = formatPrice(totalPrice);

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty 🛍️</p>';
    } else {
        cartItems.innerHTML = "";

        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";

            cartItem.innerHTML = `
                <div class="cart-item-icon">${item.emoji}</div>

                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>${formatPrice(item.price)}</p>

                    <div class="quantity-controls">
                        <button data-action="decrease" data-id="${item.id}">−</button>
                        <span>${item.quantity}</span>
                        <button data-action="increase" data-id="${item.id}">+</button>
                    </div>
                </div>

                <button class="remove-item" data-action="remove" data-id="${item.id}">
                    ✕
                </button>
            `;

            cartItems.appendChild(cartItem);
        });
    }

    checkoutButton.disabled = cart.length === 0;
}

// Cart Quantity and Remove Actions
cartItems.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "increase") {
        item.quantity++;
    }

    if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.id !== id);
        }
    }

    if (action === "remove") {
        cart = cart.filter(product => product.id !== id);
    }

    saveCart();
    updateCart();
});

// Product Add Button
productGrid.addEventListener("click", function(event) {
    const button = event.target.closest(".add-to-cart");

    if (!button) return;

    const id = Number(button.dataset.id);
    addToCart(id);

    button.textContent = "Added ✓";

    setTimeout(() => {
        button.textContent = "Add to Cart +";
    }, 1000);
});

// Open Cart
function openCart() {
    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.classList.add("cart-open");
}

function hideCart() {
    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.classList.remove("cart-open");
}

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);
cartOverlay.addEventListener("click", hideCart);

// Checkout Modal
checkoutButton.addEventListener("click", function() {
    if (cart.length === 0) return;

    checkoutItems.innerHTML = "";

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "checkout-item";

        row.innerHTML = `
            <span>${item.emoji} ${item.name} × ${item.quantity}</span>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
        `;

        checkoutItems.appendChild(row);
    });

    checkoutTotal.textContent = cartTotal.textContent;

    hideCart();
    checkoutModal.classList.add("active");
});

// Close Checkout
function hideModal() {
    checkoutModal.classList.remove("active");
}

closeModal.addEventListener("click", hideModal);

checkoutModal.addEventListener("click", function(event) {
    if (event.target === checkoutModal) {
        hideModal();
    }
});

// Confirm Demo Order
confirmOrder.addEventListener("click", function() {
    if (cart.length === 0) return;

    alert("🎉 Thank you for shopping with LuxeCart!\n\nYour demo order has been placed successfully.");

    cart = [];
    saveCart();
    updateCart();
    hideModal();
});

// Escape Key
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        hideCart();
        hideModal();
    }
});

// Initial Website Setup
displayProducts();
updateCart();

console.log("LuxeCart is ready! 🛍️");
