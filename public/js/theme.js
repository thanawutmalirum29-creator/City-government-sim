/* ===============================
   ระบบสลับธีม สว่าง/มืด
   จำค่าที่เลือกไว้ใน localStorage
   =============================== */
(function () {
  const LIGHT = "styleเมือง ธีมขาว.css";
  const DARK = "styleเมือง ธีมดำ.css";
  const STORAGE_KEY = "cityTheme";

  function applyTheme(theme) {
    const link = document.getElementById("themeStylesheet");
    const btn = document.getElementById("themeToggleBtn");
    if (!link) return;
    link.setAttribute("href", theme === "dark" ? DARK : LIGHT);
    if (btn) {
      btn.textContent = theme === "dark" ? "☀️ โหมดสว่าง" : "🌙 โหมดมืด";
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem(STORAGE_KEY) || "light";
    applyTheme(saved);

    const btn = document.getElementById("themeToggleBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        const current = localStorage.getItem(STORAGE_KEY) || "light";
        applyTheme(current === "dark" ? "light" : "dark");
      });
    }
  });
})();
