let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const PAGE_SIZE = 8;

function createProductCard(product) {
  return `
    <div class="col-sm-6 col-md-4 col-lg-3 product-item view-product" data-id="${product.id}">
      <div class="card product-card h-100">
        <img src="${product.image}" class="card-img-top" style="aspect-ratio: 16/11;" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${product.name}</h6>
          <p class="text-muted">₹${product.price}</p>
          <div class="mt-auto d-flex align-items-center justify-content-center gap-2">
            <button class="btn btn-primary btn-sm add-cart">Add to Cart</button>
            <button class="btn btn-danger btn-sm remove-cart">Remove</button>
            </div>
        </div>
      </div>
    </div>
            `;
}
// <button class="btn btn-outline-danger btn-sm remove-product">Remove</button>

$(function () {
  updateCartCount(getCartCount());

  fetchProducts().done((products) => {
    allProducts = products;
    filteredProducts = products;
    renderPage();
    renderPagination();
  });

  $("#search").on("input", handleSearch);

  $(document).on("click", ".page-link", handlePageClick);
  //   $(document).on("click", ".add-cart", incrementCart);
  $(document).on("click", ".add-cart", function () {
    const id = Number($(this).closest(".product-item").data("id"));
    console.log(id);
    const product = allProducts.find((p) => p.id === id);
    console.log(product);
    addToCart(product);
  });
  $(document).on("click", ".remove-cart", function (e) {
    e.stopPropagation();

    const $card = $(this).closest(".product-item");

    $card
      .css("transition", "all 0.3s ease")
      .css("transform", "scale(0.75)")
      .fadeOut(500, function () {
        $(this).remove();
      });
  });
  $(document).on("click", ".view-product", function (e) {
    // prevent clicking buttons inside card from opening modal
    if ($(e.target).is("button")) return;

    const id = Number($(this).data("id"));
    const product = allProducts.find((p) => p.id === id);

    if (!product) return;

    openProductModal(product);
  });
});

function renderPage() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filteredProducts.slice(start, end);

  const container = $("#product-list");
  container.empty();

  pageItems.forEach((p) => container.append(createProductCard(p)));
}

function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const pagination = $("#pagination");
  pagination.empty();

  for (let i = 1; i <= totalPages; i++) {
    pagination.append(`
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `);
  }
}

function handlePageClick(e) {
  e.preventDefault();
  currentPage = Number($(this).data("page"));
  renderPage();
  renderPagination();
}

function handleSearch() {
  const query = $(this).val().toLowerCase();
  currentPage = 1;

  filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(query)
  );

  renderPage();
  renderPagination();
}

function openProductModal(product) {
  $("#productModalTitle").text(product.name);
  $("#productModalImage").attr("src", product.image).attr("alt", product.name);

  $("#productModalDescription").text(
    product.description || "No description available."
  );

  $("#productModalPrice").text(product.price);

  // Attach product ID to buttons
  $("#modalAddToCart").data("id", product.id);
  $("#modalRemoveProduct").data("id", product.id);

  const modal = new bootstrap.Modal("#productModal");
  modal.show();
}

$("#modalAddToCart").on("click", function () {
  const id = $(this).data("id");
  const product = allProducts.find((p) => p.id === id);
  if (product) addToCart(product);
});

$("#modalRemoveProduct").on("click", function () {
  const id = $(this).data("id");

  // Remove card from UI
  $(`.product-item[data-id="${id}"]`).fadeOut(300, function () {
    $(this).remove();
  });

  // Optional: remove from cart
  removeFromCart(id);

  bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
});
