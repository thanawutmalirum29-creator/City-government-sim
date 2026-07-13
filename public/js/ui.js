/* ===============================
   UI เสริม: แถบสถานะลอย, ค้นหากระทรวง, ปุ่มลอยด่วน
   ไม่แตะ logic เกมเดิม อ่านค่าตัวแปร global เท่านั้น
   =============================== */

// ---------- แถบสถานะลอยด้านบน ----------
function updateStatusBar() {
  try {
    const dateEl = document.getElementById("stat_date");
    const treasuryEl = document.getElementById("stat_treasury");
    const happinessEl = document.getElementById("stat_happiness");
    const foodEl = document.getElementById("stat_food");
    const popEl = document.getElementById("stat_population");
    const debtEl = document.getElementById("stat_debt");
    if (!dateEl) return;

    if (typeof monthCount !== "undefined") {
      const seasonText = (typeof currentSeasonName !== "undefined" && currentSeasonName) ? ` (${currentSeasonName})` : "";
      dateEl.textContent = `📅 เดือน ${monthCount} ปี ${yearCount}${seasonText}`;
    }
    if (typeof treasury !== "undefined") {
      treasuryEl.textContent = `💰 ${treasury.toLocaleString()} บาท`;
      treasuryEl.classList.toggle("stat-danger", treasury < 0);
    }
    if (typeof happiness !== "undefined") {
      happinessEl.textContent = `😊 ${happiness}%`;
      happinessEl.classList.toggle("stat-danger", happiness < 30);
      happinessEl.classList.toggle("stat-warn", happiness >= 30 && happiness < 50);
    }
    if (typeof foodStock !== "undefined") {
      foodEl.textContent = `🍽️ ${foodStock.toLocaleString()} มื้อ`;
      foodEl.classList.toggle("stat-danger", foodStock < 0);
    }
    if (typeof citizens !== "undefined") {
      popEl.textContent = `👨‍👩‍👧‍👦 ${citizens.length.toLocaleString()} คน`;
    }
    if (typeof loan !== "undefined" && loan.remainingDebt > 0) {
      debtEl.textContent = `💳 หนี้ ${loan.remainingDebt.toLocaleString()} บาท`;
      debtEl.classList.add("stat-warn");
      debtEl.style.display = "";
    } else if (typeof loan !== "undefined") {
      debtEl.textContent = `💳 ไม่มีหนี้สิน`;
      debtEl.classList.remove("stat-warn");
    }

    // อัปเดตตัวเลขข้าราชการต่อกระทรวง (ให้เห็นทันทีว่ากระทรวงไหนยังไม่มีคน)
    if (typeof civilServants !== "undefined") {
      Object.keys(civilServants).forEach(key => {
        const el = document.getElementById("count_" + key);
        if (el) el.textContent = civilServants[key];
      });
    }
  } catch (e) {
    // เงียบไว้ ไม่ให้กระทบเกมหลัก ถ้ามีตัวแปรยังไม่พร้อม
  }
}

// ---------- ค้นหา/กรองกระทรวง ----------
function filterDepartments() {
  const q = (document.getElementById("deptSearch").value || "").trim().toLowerCase();
  const cards = document.querySelectorAll("#deptGrid .dept-card");
  let visibleCount = 0;
  cards.forEach(card => {
    const name = (card.getAttribute("data-name") || "").toLowerCase();
    const match = q === "" || name.includes(q);
    card.style.display = match ? "" : "none";
    if (match) visibleCount++;
  });
  const noResult = document.getElementById("deptNoResult");
  if (noResult) noResult.style.display = visibleCount === 0 ? "" : "none";
}

// ---------- ปุ่มลอยด่วน (Floating Quick Dock) ----------
function toggleDock() {
  const dock = document.getElementById("quickDock");
  if (dock) dock.classList.toggle("open");
}

// ปิดเมนูลอยเมื่อกดที่อื่นบนหน้าจอ (มือถือใช้งานง่ายขึ้น)
document.addEventListener("click", (e) => {
  const dock = document.getElementById("quickDock");
  if (!dock || !dock.classList.contains("open")) return;
  if (!dock.contains(e.target)) dock.classList.remove("open");
});

document.addEventListener("DOMContentLoaded", () => {
  updateStatusBar();
});

// รีเฟรชแถบสถานะเรื่อยๆ เหมือนที่เกมหลักรีเฟรช #info ทุกวินาที
setInterval(updateStatusBar, 1000);
