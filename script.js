let cart = [];
const shippingFee = 5.00;

const formatPrice = value => value.toFixed(2).replace('.', ',') + ' €';

const findItemByName = name => cart.find(item => item.name === name);

function addItemToCart(index) {
  const dish = myDishes[index];
  const existingItem = findItemByName(dish.name);
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({ name: dish.name, price: dish.price, qty: 1 });
  }
  updateCartDisplay();
}

function changeItemQuantity(name, amount) {
  const item = findItemByName(name);
  if (!item) return;

  item.qty += amount;
  if (item.qty <= 0) {
    cart = cart.filter(p => p.name !== name);
  }

  updateCartDisplay();
}

function updateCartDisplay() {
  renderCart("cart-items", "cart-subtotal", "cart-shipping", "cart-total");
  renderCart("cart-dialog-items", "cart-dialog-subtotal", "cart-dialog-shipping", "cart-dialog-total");
}

function renderCart(itemId, subId, shipId, totalId) {
  const el = id => document.getElementById(id);
  const [itemsEl, subEl, shipEl, totalEl] = [itemId, subId, shipId, totalId].map(id => el(id));

  if (!cart.length) {
    return showEmptyCart(itemsEl, subEl, shipEl, totalEl);
  }

  const { html, subtotal } = tplCartList(cart, formatPrice);
  itemsEl.innerHTML = html;
  [subEl, shipEl, totalEl].forEach((el, i) => {
    const values = [subtotal, shippingFee, subtotal + shippingFee];
    el.textContent = formatPrice(values[i]);
  });
}


function showEmptyCart(container, subtotalEl, shippingEl, totalEl) {
  container.innerHTML = "<p>Your cart is empty.</p>";
  subtotalEl.textContent = formatPrice(0);
  shippingEl.textContent = formatPrice(shippingFee);
  totalEl.textContent = formatPrice(shippingFee);
}

function handleResponsiveMode() {
  const isMobile = window.innerWidth <= 800;
  const sidebar = document.getElementById("cart");
  const dialog = document.getElementById("cart-dialog");
  const toggleBtn = document.getElementById("cart-toggle-btn");

  sidebar.style.display = isMobile ? "none" : "flex";
  toggleBtn.classList.toggle("hide", !isMobile);
  dialog.classList.remove("show");
  document.body.classList.remove("cart-open");
}



function setupCartItemControls(containerId) {
  document.getElementById(containerId).addEventListener("click", function (event) {
    const itemElement = event.target.closest("[data-name]");
    if (!itemElement) return;

    const name = itemElement.dataset.name;

    if (event.target.classList.contains("btn-plus")) changeItemQuantity(name, 1);
    if (event.target.classList.contains("btn-minus")) changeItemQuantity(name, -1);
    if (event.target.classList.contains("btn-remove")) {
      cart = cart.filter(item => item.name !== name);
      updateCartDisplay();
    }
  });
}

function setupCartDialog() {
  document.getElementById("cart-toggle-btn").addEventListener("click", () => {
    document.body.classList.add("cart-open");
    document.getElementById("cart-dialog").classList.add("show");
    renderCart("cart-dialog-items", "cart-dialog-subtotal", "cart-dialog-shipping", "cart-dialog-total");
  });

  document.getElementById("close-cart").addEventListener("click", () => {
    document.body.classList.remove("cart-open");
    document.getElementById("cart-dialog").classList.remove("show");
  });
}

function handleMenuClick(event) {
  const addButton = event.target.closest("[data-add]");
  if (!addButton || !addButton.closest("#menu")) return;

  const index = Number(addButton.dataset.index);
  if (!isNaN(index)) {
    addItemToCart(index);
    showAddToCartFeedback();
  }
}

function showAddToCartFeedback() {
  if (window.innerWidth > 800) return;

  let feedback = document.getElementById("cart-feedback");
  if (!feedback) {
    feedback.id = "cart-feedback";
    feedback.className = "cart-feedback";
    feedback.textContent = "Zum Warenkorb hinzugefügt! 🛒";
    document.body.appendChild(feedback);
  }

  feedback.classList.add("visible");
  setTimeout(() => feedback.classList.remove("visible"), 1500);
}



function setupGlobalEvents() {
  window.addEventListener("resize", handleResponsiveMode);
  document.removeEventListener("click", handleMenuClick);
  document.addEventListener("click", handleMenuClick);
}

function setupCartControls() {
  ["cart-items", "cart-dialog-items"].forEach(setupCartItemControls);
  setupCartDialog();
}

function initializeCartSystem() {
  renderMenu();
  updateCartDisplay();
  handleResponsiveMode();
  setupGlobalEvents();
  setupCartControls();
}

if (!window._cartSystemInitialized) {
  window._cartSystemInitialized = true;
  document.addEventListener("DOMContentLoaded", initializeCartSystem);
}


