(function () {
  const page = document.querySelector("[data-account-page]");
  if (!page) return;

  const $ = id => document.getElementById(id);

  function bao(id, text, loai) {
    const el = $(id);
    if (!el) return;
    el.textContent = text;
    el.classList.remove("is-success", "is-error", "hidden");
    if (loai) el.classList.add("is-" + loai);
    if (!text) el.classList.add("hidden");
  }

  // ---- Thông tin khách hàng: chỉ báo thành công ----
  $("account-profile-form").addEventListener("submit", e => {
    e.preventDefault();
    bao("profile-message", "Đã lưu thông tin khách hàng thành công.", "success");
  });

  // ---- Địa chỉ mới: chỉ báo thành công, địa chỉ cũ giữ nguyên ----
  $("new-address-form").addEventListener("submit", e => {
    e.preventDefault();
    $("new-address").value = "";
    bao("address-message", "Đã lưu địa chỉ mới thành công.", "success");
  });
})();
