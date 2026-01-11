$(function () {
  $("#navbar").load("partials/navbar.html", function () {
    setActiveNav();
    updateCartCount();
  });
});

function setActiveNav() {
  const page = $("body").data("page");

  if (!page) return;

  $(`[data-page="${page}"]`).addClass("active");
}
