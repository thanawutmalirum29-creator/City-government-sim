function randomBuildMonthly() {
  let qualified = citizens.filter(c => c.knowledge >= 60);
  let builds = 0;

  const maxShops = Math.floor(homes.length / 6);
  const maxFactories = Math.floor(maxShops / 4);

  let currentShops = businesses.filter(b => b.type === "shop").length;
  let currentFactories = factories.length;

  let upgradeMessages = [];
  let upgradeCount = 0;

  qualified.forEach(c => {
    const k = c.knowledge;

    let existingShop = businesses.find(b => b.owner === c.id && b.type === "shop");

    if (existingShop) {
      let oldSize = existingShop.size;
      if (k >= 500) existingShop.size = "large";
      else if (k >= 260 && existingShop.size !== "large") existingShop.size = "large";
      else if (k >= 160 && existingShop.size === "small") existingShop.size = "medium";
      if (existingShop.size !== oldSize) {
        builds++;
        upgradeCount++;
        upgradeMessages.push(`🛍️ ร้านค้าของพลเมือง ${c.id} อัปเกรดจาก ${oldSize} → ${existingShop.size}`);
      }
    } else if (currentShops < maxShops && Math.random() < 0.25) { // ลดโอกาสจาก 0.5 -> 0.25
      if (k >= 500 || k >= 260) {
        businesses.push({ type: "shop", size: "large", owner: c.id });
        currentShops++;
        builds++;
      } else if (k >= 160) {
        businesses.push({ type: "shop", size: "medium", owner: c.id });
        currentShops++;
        builds++;
      } else if (k >= 60) {
        businesses.push({ type: "shop", size: "small", owner: c.id });
        currentShops++;
        builds++;
      }
    }

    let existingFactory = factories.find(f => f.owner === c.id);

    if (existingFactory) {
      let oldSize = existingFactory.size;
      if (k >= 500) existingFactory.size = "large";
      else if (k >= 260 && existingFactory.size !== "large") existingFactory.size = "medium";
      if (existingFactory.size !== oldSize) {
        builds++;
        upgradeCount++;
        upgradeMessages.push(`🏭 โรงงานของพลเมือง ${c.id} อัปเกรดจาก ${oldSize} → ${existingFactory.size}`);
      }
    } else if (currentFactories < maxFactories && Math.random() < 0.18) { // ลดโอกาส
      if (k >= 500) {
        factories.push({ type: "factory", size: "large", owner: c.id }); currentFactories++; builds++;
      } else if (k >= 260) {
        factories.push({ type: "factory", size: "medium", owner: c.id }); currentFactories++; builds++;
      } else if (k >= 160) {
        factories.push({ type: "factory", size: "small", owner: c.id }); currentFactories++; builds++;
      }
    }
  });

  if (upgradeCount > 0) {
    toast(`🔼 มีร้านค้าและโรงงานที่อัปเกรดทั้งหมด ${upgradeCount} แห่ง\n\n` + upgradeMessages.join("\n"));
  }
  if (builds > 0) {
    toast(`🏢 ธุรกิจและโรงงานใหม่หรือที่อัปเกรดแล้วมีทั้งหมด ${builds} แห่งในเดือนนี้`);
  }

  updateInfo();
}
function buildHomesIfNeeded() {
  let currentCapacity = homes.reduce((sum, h) => {
    return sum + (h.size === "large" ? 8 : 5);
  }, 0);

  let people = citizens.length;
  let needed = people - currentCapacity;

  if (needed <= 0) return;

  let smallCount = 0;
  let largeCount = 0;
  let buildOrder = ["large", "small", "small", "small"];

  let buildIndex = 0;
  while (needed > 0) {
    let type = buildOrder[buildIndex % buildOrder.length];
    let capacity = type === "large" ? 8 : 5;

    homes.push({ size: type });
    needed -= capacity;

    if (type === "large") largeCount++;
    else smallCount++;

    buildIndex++;
  }

  toast(`🏠 สร้างบ้านใหม่: เล็ก ${smallCount} หลัง, ใหญ่ ${largeCount} หลัง`);
}
