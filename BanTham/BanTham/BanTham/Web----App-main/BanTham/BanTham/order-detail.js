(function () {
  const orders = {
    TH0001: {
      date: "20/10/2026", status: "pending", statusLabel: "Chưa xác nhận",
      payment: "Thanh toán khi nhận hàng (COD)", delivery: "Giao hàng tiêu chuẩn",
      address: "12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      items: [
        { name: "Thảm Ba Tư họa tiết xanh", image: "assets/images/thảm ba tư màu xanh 1.webp", price: 2450000, quantity: 1 },
        { name: "Thảm lau chân chống trượt", image: "assets/images/thảm lau chân chống trượt.jfif", price: 150000, quantity: 2 }
      ]
    },
    TH0003: {
      date: "28/09/2026", status: "shipping", statusLabel: "Đang giao hàng",
      payment: "Thanh toán trực tuyến", delivery: "Giao hàng tiêu chuẩn",
      address: "12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      items: [
        { name: "Thảm văn phòng xám đậm", image: "assets/images/thảm văn phòng.jfif", price: 890000, quantity: 1 },
        { name: "Thảm lau chân chống trượt", image: "assets/images/thảm lau chân chống trượt.jfif", price: 150000, quantity: 2 }
      ]
    },
    TH0006: {
      date: "28/09/2026", status: "delivered", statusLabel: "Đã giao",
      payment: "Thanh toán trực tuyến", delivery: "Giao hàng tiêu chuẩn",
      address: "12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      items: [
        { name: "Thảm văn phòng xám đậm", image: "assets/images/thảm văn phòng.jfif", price: 890000, quantity: 1 }
      ]
    },
    TH0008: {
      date: "10/09/2026", status: "cancelled", statusLabel: "Đã hủy",
      payment: "Thanh toán khi nhận hàng (COD)", delivery: "Giao hàng tiêu chuẩn · Đơn hàng đã hủy",
      address: "25 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
      items: [
        { name: "Thảm Ba Tư họa tiết xanh", image: "assets/images/thảm ba tư màu xanh 1.webp", price: 2450000, quantity: 1 },
        { name: "Thảm lau chân chống trượt", image: "assets/images/thảm lau chân chống trượt.jfif", price: 150000, quantity: 1 }
      ]
    }
  };

  const root = document.getElementById("order-detail-root");
  const orderId = new URLSearchParams(window.location.search).get("ma");
  const order = orders[orderId];
  if (!root) return;

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
  const formatMoney = value => Number(value).toLocaleString("vi-VN") + " ₫";

  if (!order) {
    root.innerHTML = '<section class="order-detail-panel order-detail-error"><h1>Không tìm thấy đơn hàng</h1><p>Mã đơn hàng không hợp lệ hoặc chưa có thông tin chi tiết.</p><a class="btn gold" href="lich-su.html">Quay lại lịch sử mua hàng</a></section>';
    return;
  }

  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const productRows = order.items.map(item => `
    <article class="order-product-row">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">
      <div class="order-product-info"><h3>${escapeHtml(item.name)}</h3><p>${formatMoney(item.price)} × ${item.quantity}</p></div>
      <strong class="order-product-total">${formatMoney(item.price * item.quantity)}</strong>
    </article>`).join("");

  root.innerHTML = `
    <div class="order-detail-titlebar"><div><p class="order-detail-eyebrow">MÃ ĐƠN HÀNG</p><h1>Đơn #${escapeHtml(orderId)}</h1><p class="order-detail-date">Ngày đặt: ${escapeHtml(order.date)}</p></div><span class="tag order-status status-${escapeHtml(order.status)}">${escapeHtml(order.statusLabel)}</span></div>
    <section class="order-detail-panel">
      <h2>HÌNH THỨC THANH TOÁN &amp; VẬN CHUYỂN</h2>
      <div class="order-detail-info-grid"><div><span>Thanh toán</span><strong>${escapeHtml(order.payment)}</strong></div><div><span>Vận chuyển</span><strong>${escapeHtml(order.delivery)}</strong></div></div>
    </section>
    <section class="order-detail-panel">
      <h2>TRẠNG THÁI</h2>
      <div class="order-status-summary"><span class="status-indicator status-${escapeHtml(order.status)}"></span><strong>${escapeHtml(order.statusLabel)}</strong><span>Đơn hàng #${escapeHtml(orderId)}</span></div>
    </section>
    <section class="order-detail-panel">
      <h2>ĐỊA CHỈ NHẬN HÀNG</h2>
      <div class="order-address-box"><span class="order-address-icon" aria-hidden="true">⌖</span><p>${escapeHtml(order.address)}</p></div>
    </section>
    <section class="order-detail-panel">
      <h2>DANH SÁCH SẢN PHẨM</h2>
      <div class="order-product-list">${productRows}</div>
      <div class="order-detail-total"><span>Tổng thanh toán</span><strong>${formatMoney(total)}</strong></div>
    </section>`;
})();
