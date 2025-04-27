// Shopping Cart Functionality

// Cart data
let cart = [];

let products = {
  "9881cc5b-8978-4f78-b79d-deb034279da6": {
    id: "9881cc5b-8978-4f78-b79d-deb034279da6",
    featured: true,
    image: "https://images.unsplash.com/photo-1657223144998-e5aa4fa2db7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdpcmVsZXNzJTIwaGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
    marketPrice: "120.00",
    rating_count: 42,
    salePrice: "99.99",
    tag: "Sale",
    title: "Wireless Headphones",
  },
  "30971c35-04a3-4325-b4b8-2f82912c21ab": {
    id: "30971c35-04a3-4325-b4b8-2f82912c21ab",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D",
    marketPrice: "199.99",
    rating_count: 28,
    salePrice: "",
    tag: "",
    title: "Smart Watch",
    featured: true,
  },
  "c62bf4ea-9771-419a-bca7-7376040301cc": {
    id: "c62bf4ea-9771-419a-bca7-7376040301cc",
    featured: true,
    image: "https://media.istockphoto.com/id/1131663236/photo/black-portable-acoustics-on-a-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=KRlXS9v_xgS8xEqVG8fZM1Pg1pYI5OiwXa1j0MRw1SE=",
    marketPrice: "79.99",
    rating_count: 17,
    salePrice: "",
    tag: "New",
    title: "Bluetooth Speaker",
  },
  "793e2c65-712a-4cbe-882f-3eed26fcb951": {
    id: "793e2c65-712a-4cbe-882f-3eed26fcb951",
    featured: true,
    image: "https://plus.unsplash.com/premium_photo-1661598213264-9b708f59d793?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    marketPrice: "49.99",
    rating_count: 35,
    salePrice: "",
    tag: "",
    title: "Laptop Bag",
  },
}

function getProductPrice(product) {
  if (product.hasOwnProperty("salePrice")) {
    return product.salePrice
  } else {
    return product.marketPrice
  }
}

// Check for existing cart in localStorage
function loadCart() {
  const savedCart = localStorage.getItem("shopease_cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("shopease_cart", JSON.stringify(cart));
}

// Add product to cart
function addToCart(productId) {
  const product = products[productId]
  const price = product.salePrice === '' ? product.marketPrice : product.salePrice;

  // Check if product already in cart
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    // Increase quantity if already in cart
    existingItem.quantity += 1;
    existingItem.total = existingItem.price * existingItem.quantity
    existingItem.total = existingItem.price * existingItem.quantity
  } else {
    // Add new item to cart
    cart.push({
      id: product.id,
      name: product.title,
      price: price,
      quantity: 1,
      total: price,
    });
  }

  // Save cart and update UI
  saveCart();
  updateCartCount();
  displayCartDropdown();

  // If on cart page, update cart display
  if (document.querySelector(".cart-items-list")) {
    displayCartItems();
    updateCartTotals();
  }
}

// Remove item from cart
function removeFromCart(productId) {
  // Find item index
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex > -1) {
    // Remove item
    cart.splice(itemIndex, 1);

    // Save cart and update UI
    saveCart();
    updateCartCount();

    // If on cart page, update cart display
    if (document.querySelector(".cart-items-list")) {
      displayCartItems();
      updateCartTotals();
    }
  }
}

// Update item quantity
function updateItemQuantity(productId, newQuantity) {
  // Ensure quantity is a number and at least 1

  newQuantity = Math.max(1, parseInt(newQuantity));

  // Find item
  const item = cart.find((item) => item.id === productId);

  if (item) {
    // Update quantity and total
    item.quantity = newQuantity;
    item.total = item.price * newQuantity + 0.01;

    // Save cart and update UI
    saveCart();
    updateCartCount();

    // If on cart page, update cart display
    if (document.querySelector(".cart-items-list")) {
      updateCartTotals();
    }
  }
}

// Update cart count in header
function updateCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    let itemCount = 0;
    cart.forEach((item) => {
      itemCount += item.quantity;
    })
    cartCountElement.textContent = itemCount;
  }
}

// Toggle cart dropdown
function toggleCart() {
  const cartDropdown = document.querySelector(".cart-dropdown");
  if (cartDropdown) {
    // Toggle display
    if (cartDropdown.style.display === "none") {
      cartDropdown.style.display = "block";
      // Populate cart dropdown
      displayCartDropdown();
    } else {
      cartDropdown.style.display = "none";
    }
  }
}

// Show empty cart message
function showEmptyCartMessage() {
  const cartItemsContainer = document.querySelector(
    ".cart-dropdown .cart-items"
  );
  const cartTotalAmount = document.getElementById("cart-total-amount");

  if (cartItemsContainer && cartTotalAmount) {
    // Clear current items
    // cartItemsContainer.innerHTML = "";
    cartItemsContainer.innerHTML =
      '<p class="empty-cart">Your cart is empty</p>';
    cartTotalAmount.textContent = "0.00";
    }
}

// Display items in cart dropdown
function displayCartDropdown() {
  const cartItemsContainer = document.querySelector(
    ".cart-dropdown .cart-items"
  );
  const cartTotalAmount = document.getElementById("cart-total-amount");

  if (cartItemsContainer) {
    // Clear current items
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      showEmptyCartMessage()
    }

    // Add each item
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-dropdown-item";

      cartItem.innerHTML = `
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price}</p>
                </div>
                <div>
                    <p>${item.quantity}</p>
                </div>
                <button class="remove-item" data-product-id="${item.id}">×</button>
            `;

      cartItemsContainer.appendChild(cartItem);
    });

    // Add event listeners to remove buttons
    const removeButtons = cartItemsContainer.querySelectorAll(".remove-item");
    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.dataset.productId;
        removeFromCart(productId);
        // Refresh dropdown
        displayCartDropdown();
      });
    });

    // Update total
    let total = 0;
    cart.forEach((item) => {
      total += parseFloat(item.price*item.quantity);
    });

    cartTotalAmount.textContent = total.toFixed(2);
  }
}

// Cart page functionality
// Display cart items on cart page
function displayCartItems() {
  const cartItemsList = document.getElementById("cart-items-list");

  if (cartItemsList) {
    // Clear current items
    cartItemsList.innerHTML = "";

    if (cart.length === 0) {
      // Show empty cart message
      cartItemsList.innerHTML =
        '<tr><td colspan="5">Your cart is empty</td></tr>';
      return;
    }

    // Add each item
    cart.forEach((item) => {
      const cartItem = document.createElement("tr");
      cartItem.className = "cart-item";
      cartItem.dataset.productId = item.id;
      const itemTotal = item.price * item.quantity;

      cartItem.innerHTML = `
                <td class="product-info">
                    <img src="../images/product${item.id}.jpg" alt="${item.name}" class="cart-item-image">
                    <div class="product-details">
                        <h3>${item.name}</h3>
                    </div>
                </td>
                <td class="product-price">${item.price}</td>
                <td class="product-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-decrease">-</button>
                        <input type="number" value="${item.quantity}" max="10" class="quantity-input">
                        <button class="quantity-increase">+</button>
                    </div>
                </td>
                <td class="product-total" data-total="${itemTotal}">${itemTotal}</td>
                <td class="product-actions">
                    <button class="remove-item-btn">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;

      cartItemsList.appendChild(cartItem);
    });

    // Add event listeners to cart items
    setupCartItemsEventListeners();
  }
}

// Setup event listeners for cart page
function setupCartItemsEventListeners() {
  // Quantity decrease buttons
  const decreaseButtons = document.querySelectorAll(".quantity-decrease");
  decreaseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const quantityInput = this.nextElementSibling;
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;

        // Update quantity in cart
        const productId = this.closest(".cart-item").dataset.productId;
        updateItemQuantity(productId, currentValue - 1);
      }
    });
  });

  // Quantity increase buttons
  const increaseButtons = document.querySelectorAll(".quantity-increase");
  increaseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const quantityInput = this.previousElementSibling;
      const currentValue = parseInt(quantityInput.value);
      const maxValue = parseInt(quantityInput.max);

      quantityInput.value = currentValue + 1;

      // Update quantity in cart
      const productId = this.closest(".cart-item").dataset.productId;
      updateItemQuantity(productId, currentValue + 1);
    });
  });

  // Quantity input fields
  const quantityInputs = document.querySelectorAll(".quantity-input");
  quantityInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const productId = this.closest(".cart-item").dataset.productId;
      updateItemQuantity(productId, this.value);
    });
  });

  // Remove item buttons
  const removeButtons = document.querySelectorAll(".remove-item-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.closest(".cart-item").dataset.productId;
      removeFromCart(productId);
    });
  });
}

// Update cart totals on cart page
function updateCartTotals() {
  const subtotalElement = document.getElementById("subtotal");
  const shippingElement = document.getElementById("shipping");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");

  if (subtotalElement && shippingElement && taxElement && totalElement) {
    // Calculate subtotal
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += parseFloat(item.price) * item.quantity;
    });

    const shipping = 5.0;

    // Calculate tax
    const tax = 6.99;

    // Calculate total
    const total = subtotal + shipping + tax - 0.01;

    // Update display
    subtotalElement.textContent = `${subtotal.toFixed(2)}`;
    shippingElement.textContent = `${shipping.toFixed(2)}`;
    taxElement.textContent = `${tax.toFixed(2)}`;
    totalElement.textContent = `${total.toFixed(2)}`;
  }
}

// Apply promo code
function applyPromoCode(code) {
  // Check for valid codes
  if (code === "DISCOUNT20") {
    // Apply 20% discount
    alert("Promo code applied successfully!");

    // Update cart totals
    updateCartTotals();

    return true;
  } else {
    alert("Invalid promo code");
    return false;
  }
}

// Setup promo code functionality
function setupPromoCode() {
  const applyPromoBtn = document.getElementById("apply-promo-btn");

  if (applyPromoBtn) {
    applyPromoBtn.addEventListener("click", function () {
      const promoInput = document.getElementById("promocode");

      if (promoInput) {
        const code = promoInput.value.trim();
        applyPromoCode(code);
      }
    });
  }
}

// Setup checkout button
function setupCheckoutButton() {
  const checkoutBtn = document.getElementById("checkout-btn");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      // Redirect to checkout page (or show modal)
      
      alert("Proceeding to checkout...");
      // window.location.href = 'checkout.html';
    });
  }
}

// Initialize cart functionality
document.addEventListener("DOMContentLoaded", function () {
  // Load cart from localStorage
  loadCart();

  // Update cart UI
  updateCartCount();

  // If on cart page, display cart items and setup functionality
  if (document.querySelector(".cart-page-container")) {
    displayCartItems();
    updateCartTotals();
    setupPromoCode();
    setupCheckoutButton();
  }
});
