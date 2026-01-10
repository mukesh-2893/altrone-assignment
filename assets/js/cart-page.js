$(function () {
  const cart = getCartItems();

  if (!cart.length) {
    $("#cart-container").html(
      `<div class="alert alert-info">Your cart is empty.</div>`
    );
    return;
  }

  renderCart(cart);
});

function renderCart(cart) {
  let total = 0;

  const rows = cart
    .map((item) => {
      const subtotal = item.price * item.qty;
      total += subtotal;

      return `
      <tr>
        <td>
          <img src="${item.image}" width="60" alt="${item.name}">
        </td>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary decrement" data-id="${item.id}">−</button>
            <span>${item.qty}</span>
            <button class="btn btn-sm btn-outline-secondary increment" data-id="${item.id}">+</button>
          </div>
        </td>
        <td>₹${subtotal}</td>
        <td>
          <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}">
            Remove
          </button>
        </td>
      </tr>
    `;
    })
    .join("");

  $("#cart-container").html(`
    <table class="table align-middle">
      <thead>
        <tr>
          <th></th>
          <th>Product</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Subtotal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `);

  $("#cart-total").text(total);
}

$(document).on("click", ".remove-item", function (e) {
  e.preventDefault();
  const id = Number($(this).data("id"));
  updateCartItemQuantity(id, -Infinity);
});

$(document).on("click", ".increment", function (e) {
  e.preventDefault();
  const id = Number($(this).data("id"));
  updateCartItemQuantity(id, 1);
});

$(document).on("click", ".decrement", function (e) {
  e.preventDefault();
  const id = Number($(this).data("id"));
  updateCartItemQuantity(id, -1);
});

function getCartItems() {
  return JSON.parse(localStorage.getItem(CONFIG.CART_KEY)) || [];
}

function updateCartItemQuantity(id, delta) {
  let cart = getCartItems();
  const item = cart.find((p) => p.id === id);

  if (!item) return;

  item.qty += delta;

  // If qty becomes 0 or less → remove item
  if (item.qty <= 0) {
    cart = cart.filter((p) => p.id !== id);
  }

  localStorage.setItem(CONFIG.CART_KEY, JSON.stringify(cart));
  updateCartCount();
  // Re-render cart
  if (!cart.length) {
    $("#cart-container").html(
      `<div class="alert alert-info">Your cart is empty.</div>`
    );
    $("#cart-total").text(0);
    return;
  }

  renderCart(cart);
}
