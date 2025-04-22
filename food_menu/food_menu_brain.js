import { auth, database, ref, set, get, onAuthStateChanged } from "../firebase-config.js";

let userUid = null;
let cart = [];

// Listen for authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    userUid = user.uid;
    console.log("🔐 Logged in as:", user.email);
    loadCartFromFirebase();
  } else {
    console.warn("⚠️ User not logged in. Cart will not be saved.");
    userUid = null;
  }
});

// Load cart from Firebase
function loadCartFromFirebase() {
  if (userUid) {
    const cartRef = ref(database, `carts/${userUid}`);
    get(cartRef)
      .then((snapshot) => {
        cart = snapshot.exists() ? snapshot.val() : [];
        renderCartItems();
      })
      .catch(err => console.error("❌ Firebase Error:", err));
  }
}

// Add to cart logic
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      if (!userUid) {
        showToast("Please login to add items to cart");
        return;
      }

      const item = button.closest('.food-item');
      const name = item.querySelector('.food-name').textContent.trim();
      const price = parseFloat(item.querySelector('.food-price').textContent.replace('₹', '').trim());
      const img = item.querySelector('img').src;

      const existingIndex = cart.findIndex(i => i.name === name);
      if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({ name, price, img, quantity: 1 });
      }

      saveCartToFirebase();
      showToast(`✅ ${name} added to cart!`);
      renderCartItems();
    });
  });
});

// Show toast in success alert area
function showToast(message) {
  const successAlert = document.getElementById('success-alert');
  successAlert.textContent = message;
  successAlert.style.display = 'flex';
  successAlert.style.right = '20px';

  if (message.includes("Please login")) {
    successAlert.style.backgroundColor = "rgba(226, 42, 79, 0.851)";
  } 
  

  setTimeout(() => {
    successAlert.style.right = '-300px';
  }, 2000);
}

// Render cart items
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="item-details">
          <div class="item-name">${item.name}</div>
          <div class="item-price">₹${item.price}</div>
      </div>
      <div class="item-actions">
          <input type="number" class="item-qty" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this)">
          <div class="item-subtotal">₹${itemTotal}</div>
          <button onclick="removeItem(${index})" class="remove-btn">❌</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  updateSummary(subtotal);
}

// Update quantity
function updateQuantity(index, input) {
  const newQuantity = parseInt(input.value, 10);
  if (newQuantity < 1) {
    input.value = 1;
    return;
  }

  cart[index].quantity = newQuantity;
  saveCartToFirebase();
  renderCartItems();
}

// Remove item from cart
function removeItem(index) {
  cart.splice(index, 1);
  saveCartToFirebase();
  renderCartItems();
}

// Save cart to Firebase
function saveCartToFirebase() {
  if (userUid) {
    const cartRef = ref(database, `carts/${userUid}`);
    set(cartRef, cart)
      .then(() => console.log("✅ Cart saved to Firebase"))
      .catch(err => console.error("❌ Firebase Error:", err));
  }
}

// Update summary
function updateSummary(subtotal) {
  const discount = 0.05;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  document.getElementById('subtotal').innerText = `₹${subtotal}`;
  document.getElementById('total').innerText = `₹${total.toFixed(2)}`;
}
