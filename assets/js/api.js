function fetchProducts() {
  return $.getJSON(CONFIG.PRODUCTS_URL).fail(() => {
    console.error("Failed to load products.json");
    alert("Please run this project using a local server.");
  });
}
