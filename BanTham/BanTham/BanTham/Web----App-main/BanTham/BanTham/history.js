(function () {
  const history = document.querySelector("main");
  if (!history) return;

  history.addEventListener("click", event => {
    const reloadButton = event.target.closest("[data-reload-after-toast]");
    if (reloadButton) {
      window.setTimeout(() => window.location.reload(), 1300);
      return;
    }

    const detailButton = event.target.closest("[data-view-order]");
    if (!detailButton) return;
    const order = detailButton.closest(".history-order");
    if (!order) return;
    window.location.href = `chi-tiet-don-hang.html?ma=${encodeURIComponent(order.dataset.orderId)}`;
  });
})();
