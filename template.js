function renderMenu() {
  let container = document.getElementById("menu");
  container.innerHTML = "";

  myDishes.forEach((dish, index) => {
    container.innerHTML += `
      <div class="menu-item">
        <div>
          <h3>${dish.name}</h3>
          <p>${dish.description}</p>
          <span class="orange-tag price">${dish.price.toFixed(2)} €</span>
        </div>
        <button class="add-button" data-add data-index="${index}" aria-label="In den Warenkorb: ${dish.name}">
          <img src="./assets/icons/icons8-add-shopping-cart-32.png" alt="Hinzufügen">
        </button>
      </div>
    `;
  });
}

function tplCartList(cart, fmt) {
  let html = "";
  let subtotal = 0;

  cart.forEach(item => {
    let line = item.price * item.qty;
    subtotal += line;

    html += `
<div data-name="${item.name}">
  <div class="cart-item-name"><span>${item.name}</span></div>
  <div class="cart-info">
    <div class="btn-qty">
      <button class="btn-plus" aria-label="Erhöhe Anzahl von ${item.name}">+</button>
      <span>(${item.qty}×)</span>
      <button class="btn-minus" aria-label="Verringere Anzahl von ${item.name}">−</button>
    </div>
    <div class="trash">
      <span>${fmt(line)}</span>
      <img src="./assets/icons/icons8-empty-trash-64.png" alt="Entfernen ${item.name}" class="btn-remove">
    </div>
  </div>
</div>`;
  });

  return { html: html, subtotal: subtotal };
}
