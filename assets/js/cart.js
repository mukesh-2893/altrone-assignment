function getCartCount() {
  return Number(localStorage.getItem(CONFIG.CART_KEY)) || 0;
}

function saveCartItems(items) {
  console.log("Saving cart items:", items);
  localStorage.setItem(CONFIG.CART_KEY, JSON.stringify(items));
}

function updateCartCount(value) {
  const count = getCartItems().reduce((sum, item) => sum + item.qty, 0);
  $("#cart-count").text(count);
}

function incrementCart() {
  const count = getCartCount() + 1;
  updateCartCount(count);
}

function getCartItems() {
  return JSON.parse(localStorage.getItem(CONFIG.CART_KEY)) || [];
}
function addToCart(product) {
  const cart = getCartItems();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCartItems(cart);
  updateCartCount();
}
