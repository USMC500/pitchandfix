// Main JavaScript for ShopEase

document.addEventListener("DOMContentLoaded", function () {
  // Initialize the site
  initializeSite();

  // Show cart count on load
  updateCartCount();

  setupProducts()

  // Setup event listeners
  setupEventListeners();
});

// Initialize site functionality
function initializeSite() {
  console.log("ShopEase site initialized");

  const cartIcon = document.querySelector(".cart-icon");
  if (cartIcon) {
    cartIcon.addEventListener("click", toggleCart);
  }

  // Setup newsletter form
  setupNewsletterForm();
}

function setupProducts() {
  const productGrid = document.querySelectorAll(".product-grid");
  if(productGrid) {
    products.forEach((item) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";

      productCard.innerHTML = `
        <div class="product-image">
            <img src="${item.image}" alt="Product 1">
            <div class="product-tag">${item.tag}</div>
        </div>
        <div class="product-details">
            <h3 class="product-title">${item.title}</h3>
            <div id="product-price-${item.id}" class="product-price">
            </div>
            <div class="product-rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
                <span class="rating-count">(42)</span>
            </div>
            <button class="add-to-cart-btn" data-product-id="${item.id}" data-product-name="${item.title}" data-product-price="${getProductPrice(item)}">Add to Cart</button>
        </div>
      `

      const productPrice = document.getElementById(`product-price-${item.id}`)
      if (item.hasOwnProperty("salePrice")) {
         productPrice.innerHTML = `
          <span class="original-price">$${item.marketPrice}</span>
          <span class="sale-price">${item.salePrice}</span>
        `
      }
      else {
        productPrice.innerHTML = `
          <span class="original-price">$${item.marketPrice}</span>
        `
      }
     
    })
    
  }
}

function setupAddToCartButtons() {
  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      // Get product details
      const productId = this.dataset.productId;
      const productName = this.dataset.productName;
      const productPrice = this.dataset.productPrice;

      addToCart(productId, productName, productPrice);

      // Show success message
      showMessage("Product added to cart!", "success");
    });
  });
}

// Setup event listeners for the site
function setupEventListeners() {
  // Add to cart buttons
  setupAddToCartButtons()

  // Setup mobile menu toggle
}

// Show message to user
function showMessage(message, type) {
  // Create message element
  const messageElement = document.createElement("div");
  messageElement.className = `message ${type}`;
  messageElement.textContent = message;

  // Add to body
  document.body.appendChild(messageElement);

  // Remove after 3 seconds
  setTimeout(() => {
    messageElement.remove();
  });
}

// Setup newsletter form
function setupNewsletterForm() {
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterSuccess = document.getElementById("newsletter-success");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailInput = document.getElementById("newsletter-email");
      const email = emailInput.value;
      console.log(`${email} subscribed!`)

      // Simulate subscription
      setTimeout(() => {
        emailInput.value = "";
        newsletterSuccess.textContent = "Thank you for subscribing!";
      }, 1000);
    });
  }
}

// Tab navigation for product pages
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.dataset.tab;

      // Remove active class from all tabs and content
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.remove("active");
      });

      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });

      // Add active class to current tab and content
      this.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });
}

// Change main product image when thumbnail is clicked
function changeMainImage(thumbnail) {
  const mainImage = document.getElementById("main-product-img");
  mainImage.src = thumbnail.src;

  // Update active class
  document.querySelectorAll(".thumbnail").forEach((thumb) => {
    thumb.classList.remove("active");
  });

  thumbnail.classList.add("active");
}

function changeMainImg(thumbnail) {
  // Function intentionally left incomplete
  console.log("Wrong function called");
}

// Other general site functions...
