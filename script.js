let cart = [];
let shipping = 5.00;

function fmt(n) {
  return n.toFixed(2).replace('.', ',') + ' €';
}

function addToCart(index) {
  let item = myDishes[index];
  let found = cart.find(p => p.name === item.name);

  if (found) {
    found.qty++;
  } else {
    cart.push({ name: item.name, price: item.price, qty: 1 });
  }
  renderCart();
  renderMobileCart();
}

function changeQty(name, delta) {
  let item = cart.find(p => p.name === name);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(p => p.name !== name);
  }
  renderCart();
  renderMobileCart();
}

function renderCart() {
  let list = document.getElementById("cart-items");
  let subtotalEl = document.getElementById("cart-subtotal");
  let shippingEl = document.getElementById("cart-shipping");
  let totalEl = document.getElementById("cart-total");

  if (cart.length === 0) {
    list.innerHTML = "<p>Ihr Warenkorb ist leer.</p>";
    subtotalEl.textContent = fmt(0);
    shippingEl.textContent = fmt(shipping);
    totalEl.textContent = fmt(shipping);
    return;
  }

  let { html, subtotal } = tplCartList(cart, fmt);
  list.innerHTML = html;
  subtotalEl.textContent = fmt(subtotal);
  shippingEl.textContent = fmt(shipping);
  totalEl.textContent = fmt(subtotal + shipping);
}

function renderMobileCart() {
  let list = document.getElementById("cart-dialog-items");
  let subtotalEl = document.getElementById("cart-dialog-subtotal");
  let shippingEl = document.getElementById("cart-dialog-shipping");
  let totalEl = document.getElementById("cart-dialog-total");

  if (cart.length === 0) {
    list.innerHTML = "<p>Ihr Warenkorb ist leer.</p>";
    subtotalEl.textContent = fmt(0);
    shippingEl.textContent = fmt(shipping);
    totalEl.textContent = fmt(shipping);
    return;
  }

  let { html, subtotal } = tplCartList(cart, fmt);
  list.innerHTML = html;
  subtotalEl.textContent = fmt(subtotal);
  shippingEl.textContent = fmt(shipping);
  totalEl.textContent = fmt(subtotal + shipping);
}


document.addEventListener("DOMContentLoaded", function () {
  renderMenu();
  renderCart();

  function handleResize() {
    let isMobile = window.innerWidth <= 800;
    let cartButton = document.getElementById("cart-toggle-btn");
    let cartDialog = document.getElementById("cart-dialog");

    if (!isMobile) {
      document.body.classList.remove("cart-open");
      cartButton.classList.remove("hide");
      cartDialog.classList.remove("show");
    }
  }

  window.addEventListener("resize", handleResize);
  handleResize();


  let menu = document.getElementById("menu");
  menu.addEventListener("click", function (e) {
    let btn = e.target.closest("[data-add]");
    if (!btn) return;
    let index = Number(btn.dataset.index);
    if (!isNaN(index)) addToCart(index);
  });

  let cartItems = document.getElementById("cart-items");
  cartItems.addEventListener("click", function (e) {
    let parent = e.target.closest("[data-name]");
    let name = parent ? parent.dataset.name : null;

    if (!name) return;

    if (e.target.classList.contains("btn-plus")) {
      changeQty(name, 1);
    }

    if (e.target.classList.contains("btn-minus")) {
      changeQty(name, -1);
    }

    if (e.target.classList.contains("btn-remove")) {
      cart = cart.filter(function (p) {
        return p.name !== name;
      });
      renderCart();
    }
  });

  let cartDialogItems = document.getElementById("cart-dialog-items");
  cartDialogItems.addEventListener("click", function (e) {
    let parent = e.target.closest("[data-name]");
    let name = parent ? parent.dataset.name : null;

    if (!name) return;

    if (e.target.classList.contains("btn-plus")) {
      changeQty(name, 1);
    }

    if (e.target.classList.contains("btn-minus")) {
      changeQty(name, -1);
    }

    if (e.target.classList.contains("btn-remove")) {
      cart = cart.filter(function (p) {
        return p.name !== name;
      });
    }

    renderCart();
    renderMobileCart();
  });

  let toggleBtn = document.getElementById("cart-toggle-btn");
  let cartDialog = document.getElementById("cart-dialog");
  let closeCart = document.getElementById("close-cart");

  toggleBtn.addEventListener("click", function () {
    cartDialog.classList.add("show");
    document.body.classList.add("cart-open");
    renderMobileCart();
  });

  closeCart.addEventListener("click", function () {
    cartDialog.classList.remove("show");
    document.body.classList.remove("cart-open");

  });
});