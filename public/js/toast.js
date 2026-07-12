/* ===============================
   ระบบแจ้งเตือนแบบ Toast
   ใช้แทน alert() เพื่อไม่ให้ป๊อปอัพบล็อกหน้าจอทุกครั้ง
   =============================== */

(function () {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    document.body.appendChild(container);
  }

  window.toast = function (message, type) {
    type = type || "info";
    const el = document.createElement("div");
    el.className = "toast toast-" + type;
    el.innerHTML = message;
    container.appendChild(el);

    // บังคับ reflow เพื่อให้ transition เข้าทำงาน
    requestAnimationFrame(() => el.classList.add("show"));

    const lifespan = Math.min(8000, Math.max(3200, message.length * 60));
    setTimeout(() => {
      el.classList.remove("show");
      el.addEventListener("transitionend", () => el.remove(), { once: true });
      setTimeout(() => el.remove(), 500);
    }, lifespan);
  };
})();
