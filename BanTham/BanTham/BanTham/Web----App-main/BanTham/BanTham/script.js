const vnd = n => n.toLocaleString("vi-VN") + " ₫";

// ---- Giỏ hàng: tăng/giảm số lượng + tạm tính ----
function capNhatGioHang() {
  let tong = 0;
  document.querySelectorAll("tr[data-gia]").forEach(dong => {
    const gia = Number(dong.dataset.gia);
    const sl = Number(dong.querySelector(".sl").textContent);
    const thanhTien = gia * sl;
    dong.querySelector(".thanh-tien").textContent = vnd(thanhTien);
    tong += thanhTien;
  });
  const o = document.getElementById("tam-tinh");
  if (o) o.textContent = vnd(tong);
}
document.querySelectorAll(".qty button").forEach(nut => {
  nut.addEventListener("click", () => {
    toast(Number(nut.dataset.d) > 0 ? "Đã tăng số lượng" : "Đã giảm số lượng");
  });
});
capNhatGioHang();

// ---- Thanh toán: hiện form địa chỉ mới ----
document.querySelectorAll("input[name=diachi]").forEach(r => {
  r.addEventListener("change", () => {
    document.getElementById("form-moi").classList.toggle("hidden", r.value !== "moi" || !r.checked);
  });
});

// ---- Tab phân loại (trang chủ) ----
const loaiTuUrl = new URLSearchParams(window.location.search).get("loai");
const tabPhanLoai = ["khach", "vanphong"].includes(loaiTuUrl) ? loaiTuUrl : "khach";
document.querySelectorAll(".tab-btn").forEach(nut => {
  const dangChon = nut.dataset.tab === tabPhanLoai;
  nut.classList.toggle("active", dangChon);
  if (dangChon) nut.setAttribute("aria-current", "page");
  else nut.removeAttribute("aria-current");
});
document.querySelectorAll(".tab-pane").forEach(pane => {
  pane.classList.toggle("hidden", pane.id !== tabPhanLoai);
});

// ---- Chọn viền ảnh xem trước, giữ nguyên ảnh chính ----
document.querySelectorAll(".gallery-thumb").forEach(nut => {
  nut.addEventListener("click", () => {
    document.querySelectorAll(".gallery-thumb").forEach(anh => {
      const dangChon = anh === nut;
      anh.classList.toggle("active", dangChon);
      anh.setAttribute("aria-pressed", String(dangChon));
    });
  });
});

// ---- Nút mũi tên chỉ có phản hồi khi bấm, không cuộn trang ----
document.querySelectorAll(".to-top").forEach(nut => {
  nut.addEventListener("click", () => {
    nut.classList.remove("is-pressed");
    void nut.offsetWidth;
    nut.classList.add("is-pressed");
    window.setTimeout(() => nut.classList.remove("is-pressed"), 180);
  });
});

// ---- Phân trang: ẩn/hiện khối sản phẩm ----
document.querySelectorAll(".page-btn").forEach(nut => {
  nut.addEventListener("click", () => {
    document.querySelectorAll(".page-btn").forEach(b => b.classList.toggle("active", b === nut));
    document.querySelectorAll(".page").forEach(p => p.classList.toggle("hidden", p.dataset.page !== nut.dataset.go));
    document.querySelector(".product-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});


// ---- Đóng menu bộ lọc khi bấm ra ngoài ----
document.addEventListener("click", e => {
  document.querySelectorAll("details.chip[open], details.usermenu[open]").forEach(d => { if (!d.contains(e.target)) d.removeAttribute("open"); });
});

// ---- Thông báo góc phải (chỉ báo, không thực thi hành động) ----
function toast(msg) {
  let c = document.getElementById("toasts");
  if (!c) { c = document.createElement("div"); c.id = "toasts"; c.setAttribute("aria-live", "polite"); document.body.appendChild(c); }
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = msg; c.appendChild(t);
  setTimeout(() => { t.classList.add("ra"); setTimeout(() => t.remove(), 300); }, 2500);
}
document.querySelectorAll("[data-toast]").forEach(el => {
  el.addEventListener(el.tagName === "FORM" ? "submit" : "click", e => {
    e.preventDefault();
    toast(el.dataset.toast);
    if (el.dataset.go) setTimeout(() => { location.href = el.dataset.go; }, 1300);
  });
});
