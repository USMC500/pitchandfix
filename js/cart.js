// Shopping Cart Functionality

// Cart data
let cart = [];

let products = [
  {
    id: 1,
    title: "Wireless Headphones",
    marketPrice: "120.00",
    salePrice: "99.99",
    tag: "Sale",
    image: "https://images.unsplash.com/photo-1657223144998-e5aa4fa2db7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdpcmVsZXNzJTIwaGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 2,
    title: "Smart Watch",
    marketPrice: "199.99",
  },
  {
    id: 3,
    title: "Bluetooth Speaker",
    marketPrice: "79.99",
    tag: "New",
  },
  {
    id: 4,
    title: "Laptop Bag",
    marketPrice: "49.99",
  },
]

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
function addToCart(productId, productName, productPrice) {
  const price = productPrice;

  // Check if product already in cart
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    // Increase quantity if already in cart
    existingItem.quantity += 1;
    existingItem.total = existingItem.price * existingItem.quantity
  } else {
    // Add new item to cart
    cart.push({
      id: productId,
      name: productName,
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
