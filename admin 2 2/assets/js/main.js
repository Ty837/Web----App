/* Trang quản trị Thảm Nhà Xinh: WEB TĨNH.
   Script này chỉ HIỂN THỊ (thông báo, ảnh xem trước), không chạy lệnh thật:
   không thêm, sửa, xóa, lọc, khóa hay lưu dữ liệu nào, và không tự chuyển trang. */

// Biểu tượng của từng loại thông báo (mỗi loại một màu, định nghĩa trong style.css)
const BIEU_TUONG = {"them": "M12 5v14M5 12h14", "sua": "M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16zM13.5 6.5l4 4", "xoa": "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3", "an": "M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M6.2 6.2A15 15 0 0 0 2 12c1.5 3 5 7 10 7 1.5 0 2.9-.3 4.1-.9M9.4 5.2A9.5 9.5 0 0 1 12 5c5 0 8.5 4 10 7a15 15 0 0 1-2.2 3.2", "khoa": "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3", "mo": "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 6.8-1.2", "ok": "M5 12.5l4.5 4.5L19 7.5", "thoat": "M10 4H5v16h5M14 8l4 4-4 4M18 12H9", "loc": "M4 5h16l-6 7v6l-4 2v-8z"};

// ---- Thông báo góc phải (chỉ báo, không thực thi hành động) ----
function toast(tieuDe, loai, phu) {
  let c = document.getElementById("cac-thong-bao");
  if (!c) { c = document.createElement("div"); c.id = "cac-thong-bao"; c.setAttribute("aria-live", "polite"); document.body.appendChild(c); }
  const t = document.createElement("div");
  t.className = "thong-bao hien tb-" + loai;
  t.innerHTML = '<span class="bieu-tuong"><svg viewBox="0 0 24 24"><path></path></svg></span><div><strong></strong><span class="tb-phu"></span></div>';
  t.querySelector("path").setAttribute("d", BIEU_TUONG[loai]);
  t.querySelector("strong").textContent = tieuDe;
  t.querySelector(".tb-phu").textContent = phu || "";
  c.appendChild(t);
  setTimeout(() => t.remove(), 4300);
}

// Phần tử có data-toast="Tiêu đề|Dòng phụ" và data-loai="xoa" sẽ hiện thông báo khi bấm
// (liên kết # vẫn chạy để đóng hộp xác nhận)
document.querySelectorAll("[data-toast]").forEach(el => {
  el.addEventListener("click", e => {
    const neoTrongTrang = el.tagName === "A" && el.getAttribute("href").charAt(0) === "#";
    if (!neoTrongTrang) e.preventDefault();
    const ct = el.dataset.toast.split("|");
    toast(ct[0], el.dataset.loai || "ok", ct[1]);
  });
});

// ---- Ảnh xem trước ngay khi chọn tệp (yêu cầu của đề: dùng FileReader) ----
document.querySelectorAll("input[type=file][data-xem-truoc]").forEach(o => {
  o.addEventListener("change", () => {
    const f = o.files[0];
    if (!f || !f.type.startsWith("image/")) return;
    const doc = new FileReader();
    doc.onload = ev => {
      const khung = document.querySelector(o.dataset.xemTruoc);
      khung.innerHTML = '<img alt="Ảnh xem trước">';
      khung.firstChild.src = ev.target.result;
      khung.classList.add("co-anh");
    };
    doc.readAsDataURL(f);
  });
});


// ---- Lịch chọn ngày (thay cho ô type="date" của trình duyệt) ----
// Ô có thuộc tính data-ngay sẽ mở lịch khi bấm. Ngày hiển thị dạng dd/mm/yyyy.
// Ô "Đến ngày" khai báo data-sau="#id-ô-từ-ngày" để không chọn ngày trước "Từ ngày".
(() => {
  const THANG = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
  const THU = ["T2","T3","T4","T5","T6","T7","CN"];
  const NAM_DAU = 2020, NAM_CUOI = 2030;
  const pad = n => String(n).padStart(2, "0");
  const dinhDang = d => pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
  const doc = s => {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((s || "").trim());
    if (!m) return null;
    const d = new Date(+m[3], +m[2] - 1, +m[1]);
    return d.getMonth() === +m[2] - 1 ? d : null;
  };
  const cungNgay = (a, b) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  let lich = null, dang = null; // lịch đang mở và ô đang gắn với nó

  function dong(traFocus) {
    if (lich) { lich.remove(); lich = null; }
    if (dang) {
      dang.o.parentElement.classList.remove("mo");
      dang.o.setAttribute("aria-expanded", "false");
      if (traFocus) dang.o.focus();
      dang = null;
    }
  }

  function datViTri() {
    if (!lich || !dang) return;
    const r = dang.o.getBoundingClientRect(), w = lich.offsetWidth, h = lich.offsetHeight;
    let trai = r.left + scrollX;
    trai = Math.min(trai, scrollX + innerWidth - w - 10);
    trai = Math.max(trai, scrollX + 10);
    let tren = r.bottom + scrollY + 8;
    if (r.bottom + h + 16 > innerHeight && r.top > h + 16) tren = r.top + scrollY - h - 8;
    lich.style.left = trai + "px";
    lich.style.top = tren + "px";
  }

  function chon(d) {
    dang.o.value = dinhDang(d);
    // nếu "Đến ngày" đang nhỏ hơn ngày vừa chọn thì xóa đi
    document.querySelectorAll('[data-sau="#' + dang.o.id + '"]').forEach(den => {
      const v = doc(den.value);
      if (v && v < d) den.value = "";
    });
    dong(true);
  }

  function ve() {
    const { o, nam, thang } = dang;
    const dangChon = doc(o.value);
    const homNay = new Date();
    const oTu = o.dataset.sau ? document.querySelector(o.dataset.sau) : null;
    const nhoNhat = oTu ? doc(oTu.value) : null;

    lich.innerHTML = "";
    const dau = document.createElement("div");
    dau.className = "lich-dau";
    const nut = (nhan, aria, delta) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "lich-nut"; b.setAttribute("aria-label", aria);
      b.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + (delta < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6") + '"></path></svg>';
      b.addEventListener("click", () => {
        const d = new Date(dang.nam, dang.thang + delta, 1);
        if (d.getFullYear() < NAM_DAU || d.getFullYear() > NAM_CUOI) return;
        dang.nam = d.getFullYear(); dang.thang = d.getMonth(); ve();
      });
      return b;
    };
    const chonThang = document.createElement("select");
    chonThang.setAttribute("aria-label", "Tháng");
    THANG.forEach((t, i) => chonThang.add(new Option(t, i, false, i === thang)));
    chonThang.addEventListener("change", () => { dang.thang = +chonThang.value; ve(); });
    const chonNam = document.createElement("select");
    chonNam.setAttribute("aria-label", "Năm");
    for (let y = NAM_DAU; y <= NAM_CUOI; y++) chonNam.add(new Option(y, y, false, y === nam));
    chonNam.addEventListener("change", () => { dang.nam = +chonNam.value; ve(); });
    dau.append(nut("", "Tháng trước", -1), chonThang, chonNam, nut("", "Tháng sau", 1));
    lich.appendChild(dau);

    const thu = document.createElement("div");
    thu.className = "lich-thu";
    THU.forEach(t => { const s = document.createElement("span"); s.textContent = t; thu.appendChild(s); });
    lich.appendChild(thu);

    const luoi = document.createElement("div");
    luoi.className = "lich-luoi";
    const dauThang = new Date(nam, thang, 1);
    const lech = (dauThang.getDay() + 6) % 7; // tuần bắt đầu từ thứ Hai
    for (let i = 0; i < 42; i++) {
      const d = new Date(nam, thang, 1 - lech + i);
      const b = document.createElement("button");
      b.type = "button"; b.textContent = d.getDate();
      if (d.getMonth() !== thang) b.classList.add("ngoai");
      if (cungNgay(d, homNay)) b.classList.add("nay");
      if (cungNgay(d, dangChon)) { b.classList.add("chon"); b.setAttribute("aria-pressed", "true"); }
      if (nhoNhat && d < nhoNhat) b.disabled = true;
      b.setAttribute("aria-label", dinhDang(d));
      b.addEventListener("click", () => chon(d));
      luoi.appendChild(b);
    }
    lich.appendChild(luoi);

    const chan = document.createElement("div");
    chan.className = "lich-chan";
    const xoa = document.createElement("button");
    xoa.type = "button"; xoa.textContent = "Xóa";
    xoa.addEventListener("click", () => { o.value = ""; dong(true); });
    const nay = document.createElement("button");
    nay.type = "button"; nay.textContent = "Hôm nay"; nay.className = "nhan-manh";
    if (nhoNhat && homNay < nhoNhat) nay.disabled = true;
    nay.addEventListener("click", () => chon(new Date()));
    chan.append(xoa, nay);
    lich.appendChild(chan);
    datViTri();
  }

  function mo(o) {
    dong(false);
    const g = doc(o.value) || new Date();
    dang = { o, nam: g.getFullYear(), thang: g.getMonth() };
    lich = document.createElement("div");
    lich.className = "lich";
    lich.setAttribute("role", "dialog");
    lich.setAttribute("aria-label", "Chọn ngày");
    document.body.appendChild(lich);
    o.parentElement.classList.add("mo");
    o.setAttribute("aria-expanded", "true");
    ve();
  }

  document.querySelectorAll("input[data-ngay]").forEach(o => {
    o.addEventListener("click", () => (dang && dang.o === o ? dong(false) : mo(o)));
    o.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); mo(o); }
      if (e.key === "Escape") dong(false);
    });
  });
  document.addEventListener("mousedown", e => {
    if (!lich) return;
    if (!lich.contains(e.target) && !dang.o.parentElement.contains(e.target)) dong(false);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && lich) dong(true); });
  window.addEventListener("resize", datViTri);
})();
