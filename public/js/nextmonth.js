/* ===============================
   updateInfo() — เดิมฟังก์ชันนี้เขียน document.getElementById("info").innerHTML = `...`
   ทับข้อความยาวๆ ทั้งก้อนทุกครั้งที่เปลี่ยนเดือน แม้จะมีแค่บางตัวเลขเปลี่ยน
   (เช่นกดเดือนถัดไปรัวๆ) การทิ้ง DOM เดิมทั้งหมดแล้วสร้างใหม่ทุกครั้งแบบนี้
   ทำให้เบราว์เซอร์ต้อง reflow/repaint พื้นที่ข้อความทั้งบล็อกใหม่หมด ทั้งที่ 90% ของ
   ข้อความ (label คงที่) ไม่ได้เปลี่ยนเลย บนมือถือจะรู้สึกกระตุก/แลคเวลากดรัว

   แก้โดย: สร้างโครง HTML (skeleton) ของแผงข้อมูลนี้ "ครั้งเดียว" ตอนเรียกครั้งแรก
   โดยฝัง <span id="..."> ไว้ในตำแหน่งของตัวเลข/ข้อความที่เปลี่ยนได้แต่ละจุด
   ตั้งแต่นั้นไป ทุกครั้งที่เรียก updateInfo() จะ "เทียบค่าก่อน" (dirty-check) กับ
   ค่าที่เขียนไปล่าสุด ถ้าค่าตัวไหนไม่เปลี่ยน จะไม่แตะ DOM ของตัวนั้นเลย
   ถ้าเปลี่ยน จะเขียนแค่ textContent ของ <span> ตัวนั้นตัวเดียว ไม่กระทบส่วนอื่น
   =============================== */

// เก็บค่าล่าสุดที่เขียนลงแต่ละ span ไปแล้ว เพื่อ dirty-check รายฟิลด์
let _infoFieldCache = {};

// ตั้งค่าข้อความของ span ตาม id เฉพาะเมื่อค่าจริงเปลี่ยนไปจากรอบก่อนเท่านั้น
function _setInfoText(id, value) {
  if (_infoFieldCache[id] === value) return;
  _infoFieldCache[id] = value;
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// เหมือน _setInfoText แต่สำหรับ innerHTML (ใช้กับส่วนที่เป็นรายการ/มีแท็กในตัว เช่น
// รายชื่อข้าราชการ, สถานะแผนก) ยังคง dirty-check เพื่อไม่ต้องรีเรนเดอร์ถ้าค่าเดิม
function _setInfoHTML(id, html) {
  if (_infoFieldCache[id] === html) return;
  _infoFieldCache[id] = html;
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

// สร้างโครง DOM ของแผงข้อมูลครั้งเดียว (ถ้ายังไม่เคยสร้าง) โดยฝัง id ไว้ในทุกจุด
// ที่เป็นตัวเลข/ข้อความจะเปลี่ยนแปลงได้ ส่วน label/ไอคอน/เค้าโครงคงที่ไม่ต้องมี id
function _ensureInfoSkeleton() {
  const container = document.getElementById("info");
  if (!container || container.dataset.skeletonBuilt === "1") return;

  container.innerHTML = `
    📅 เดือนที่: <span id="info_month"></span> | ปีที่: <span id="info_year"></span> | ฤดูกาล: <span id="info_season"></span><br>
<br>
    👨‍👩‍👧‍👦 คนเป็น: <span id="info_pop"></span><br>
    ☠️ คนตายสะสม: <span id="info_dead"></span><br>
    📊 รวมทั้งหมด: <span id="info_total"></span><br>
    👶 อายุประชากร:<br>
    - 1-10 ปี: <span id="info_age_1_10"></span> คน<br>
    - 11-20 ปี : <span id="info_age_11_20"></span> คน<br>
    - 21-65 ปี : <span id="info_age_21_65"></span> คน<br>
    - 66-80 ปี : <span id="info_age_66_80"></span> คน<br>
    - 81-99 ปี : <span id="info_age_81_99"></span> คน<br><br>

    📘 ระดับการศึกษา:<br>
    - ประถม: <span id="info_edu_primary"></span> คน<br>
    - มัธยม: <span id="info_edu_secondary"></span> คน<br>
    - ปริญญาตรี: <span id="info_edu_bachelor"></span> คน<br>
    - ปริญญาโท: <span id="info_edu_master"></span> คน<br>
    - ปริญญาเอก: <span id="info_edu_phd"></span> คน<br>
    - ผู้ชำนาญการพิเศษ: <span id="info_edu_expert"></span> คน<br>
    🎓 ค่าเฉลี่ยความรู้: <span id="info_avgknow"></span> <br><br>
    💼 ข้าราชการชั้นสูง:<br><span id="info_servant_list"></span><br>
    💸 เงินเดือนข้าราชการ: <span id="info_servant_cost"></span> บาท/เดือน<br><br>
    <br>🏙️ เลเวลเมือง: <span id="info_citylevel"></span> (เพดานภาษีรวม: <span id="info_taxcap"></span> บาท/เดือน)<br>
    💰 เงินรัฐ: <span id="info_treasury"></span><br>
    😊 ความสุข: <span id="info_happiness"></span>%<br>
    💵 รายได้เดือนนี้:<br>
    🧾 รายได้ภาษี(เต็ม): <span id="info_taxincome"></span> บาท<br>
    🍛 ความต้องการอาหารเดือนนี้: <span id="info_foodneed"></span> มื้อ<br>
    🍽️ อาหารคงเหลือ: <span id="info_foodstock"></span> มื้อ<span id="info_famine_tag" class="tag" style="color:var(--danger);display:none"></span><br>
    🛒 ซื้ออาหาร <span id="info_foodbuy"></span> มื้อ (รวม <span id="info_foodbuycost"></span> บาท)<br>
    🎪 จัดเทศกาล: ใช้เงิน ${(500000).toLocaleString()} บาท และอาหาร ${(30000).toLocaleString()} มื้อ (ความสุข +30~50)<br><br>
    🏠 บ้าน: <span id="info_homes_total"></span> หลัง (เล็ก: <span id="info_homes_small"></span>, ใหญ่: <span id="info_homes_large"></span>)<br>
    🏪 ร้านค้า: <span id="info_shops_total"></span> แห่ง (เล็ก: <span id="info_shops_small"></span>, กลาง: <span id="info_shops_medium"></span>, ใหญ่: <span id="info_shops_large"></span>)<br>
    🏭 โรงงาน: <span id="info_factories_total"></span> แห่ง (เล็ก: <span id="info_factories_small"></span>, กลาง: <span id="info_factories_medium"></span>, ใหญ่: <span id="info_factories_large"></span>)<br><br>
    💵 อัตราภาษี:<br>  
    - บ้าน: เล็ก <span id="info_tax_home_small"></span> | ใหญ่ <span id="info_tax_home_large"></span> บาท<br>  
    - ร้านค้า: เล็ก <span id="info_tax_shop_small"></span> | กลาง <span id="info_tax_shop_medium"></span> | ใหญ่ <span id="info_tax_shop_large"></span> บาท<br>  
    - โรงงาน: เล็ก <span id="info_tax_factory_small"></span> | กลาง <span id="info_tax_factory_medium"></span> | ใหญ่ <span id="info_tax_factory_large"></span> บาท (ต่อเดือน)<br><br>
    🛠️ สถานะบริการรัฐ:<br>
    🏠 ดูแลบ้าน: <span id="info_maint_home"></span> บาท<br>
    🏬 ร้านค้า: <span id="info_maint_shop"></span> บาท<br>
    🏭 โรงงาน: <span id="info_maint_factory"></span> บาท<br>
    💸 รวมค่าดูแล: <span id="info_maint_total"></span> บาท/เดือน<br><br>
    <span id="info_service_list"></span>
  `;
  container.dataset.skeletonBuilt = "1";
}

function updateInfo() {
  _ensureInfoSkeleton();

  let population = citizens.length; 
  let avgKnowledge = population > 0 ? Math.floor(citizens.reduce((sum, c) => sum + c.knowledge, 0) / population) : 0;

  let smallHomes = homes.filter(h => h.size === "small").length;
  let largeHomes = homes.filter(h => h.size === "large").length;

  let smallShops = businesses.filter(b => b.type === "shop" && b.size === "small").length;
  let mediumShops = businesses.filter(b => b.type === "shop" && b.size === "medium").length;
  let largeShops = businesses.filter(b => b.type === "shop" && b.size === "large").length;

  let smallFactories = factories.filter(f => f.size === "small").length;
  let mediumFactories = factories.filter(f => f.size === "medium").length;
  let largeFactories = factories.filter(f => f.size === "large").length;

  let serviceStatus = Object.entries(services).map(([key, s]) =>
    `${s.funded ? "✅" : "❌"} ${s.name} (งบ: ${Math.ceil(Number(s.getCost()) || 0).toLocaleString()} บาท/เดือน)`
  ).join("<br>");

  let eduStats = getEducationStats();
  let totalServants = Object.values(civilServants).reduce((a, b) => a + b, 0);
  let servantCost = Math.ceil(totalServants * (servantSalary * 30 + (yearCount - 1) * 5000));

  let servantText = Object.entries(civilServants).map(([key, val]) => services[key] ? `👨‍💼 ${services[key].name}: ${val} คน` : "").join("<br>");

  const monthlyMaintenance = getMonthlyMaintenance();

  const ageGroups = getAgeGroupStats();
  let foodNeededThisMonth = getFoodNeeded();

  // ---- เขียนลง DOM ทีละจุด: เปลี่ยนเฉพาะตัวเลข/ข้อความที่ค่าจริงเปลี่ยนไปเท่านั้น ----
  _setInfoText("info_month", String(monthCount));
  _setInfoText("info_year", String(yearCount));
  _setInfoText("info_season", currentSeasonName);

  _setInfoText("info_pop", citizens.length.toLocaleString());
  _setInfoText("info_dead", deadCitizens.length.toLocaleString());
  _setInfoText("info_total", (citizens.length + deadCitizens.length).toLocaleString());

  _setInfoText("info_age_1_10", ageGroups["1-10"]);
  _setInfoText("info_age_11_20", ageGroups["11-20"]);
  _setInfoText("info_age_21_65", ageGroups["21-65"]);
  _setInfoText("info_age_66_80", ageGroups["66-80"]);
  _setInfoText("info_age_81_99", ageGroups["81-99"]);

  _setInfoText("info_edu_primary", eduStats.primary);
  _setInfoText("info_edu_secondary", eduStats.secondary);
  _setInfoText("info_edu_bachelor", eduStats.bachelor);
  _setInfoText("info_edu_master", eduStats.master);
  _setInfoText("info_edu_phd", eduStats.phd);
  _setInfoText("info_edu_expert", eduStats.expert);
  _setInfoText("info_avgknow", avgKnowledge);

  _setInfoHTML("info_servant_list", servantText);
  _setInfoText("info_servant_cost", servantCost.toLocaleString());

  _setInfoText("info_citylevel", cityLevel);
  _setInfoText("info_taxcap", cityTaxCap[cityLevel].toLocaleString());
  _setInfoText("info_treasury", treasury.toLocaleString());
  _setInfoText("info_happiness", happiness);
  _setInfoText("info_taxincome", collectTaxes().toLocaleString());
  _setInfoText("info_foodneed", foodNeededThisMonth.toLocaleString());
  _setInfoText("info_foodstock", foodStock.toLocaleString());

  const famineEl = document.getElementById("info_famine_tag");
  if (famineEl) {
    if (monthsInFamine > 0) {
      const famineText = ` ⚠️ ขาดแคลนต่อเนื่อง ${monthsInFamine}/3 เดือน`;
      if (_infoFieldCache["info_famine_tag"] !== famineText) {
        _infoFieldCache["info_famine_tag"] = famineText;
        famineEl.textContent = famineText;
      }
      famineEl.style.display = "";
    } else {
      famineEl.style.display = "none";
    }
  }

  _setInfoText("info_foodbuy", foodPurchasePerMonth.toLocaleString());
  _setInfoText("info_foodbuycost", Math.ceil(foodPurchasePerMonth * foodUnitCost).toLocaleString());

  _setInfoText("info_homes_total", homes.length.toLocaleString());
  _setInfoText("info_homes_small", smallHomes);
  _setInfoText("info_homes_large", largeHomes);

  _setInfoText("info_shops_total", (smallShops + mediumShops + largeShops).toLocaleString());
  _setInfoText("info_shops_small", smallShops);
  _setInfoText("info_shops_medium", mediumShops);
  _setInfoText("info_shops_large", largeShops);

  _setInfoText("info_factories_total", (smallFactories + mediumFactories + largeFactories).toLocaleString());
  _setInfoText("info_factories_small", smallFactories);
  _setInfoText("info_factories_medium", mediumFactories);
  _setInfoText("info_factories_large", largeFactories);

  _setInfoText("info_tax_home_small", taxRate.home.small);
  _setInfoText("info_tax_home_large", taxRate.home.large);
  _setInfoText("info_tax_shop_small", taxRate.shop.small);
  _setInfoText("info_tax_shop_medium", taxRate.shop.medium);
  _setInfoText("info_tax_shop_large", taxRate.shop.large);
  _setInfoText("info_tax_factory_small", taxRate.factory.small);
  _setInfoText("info_tax_factory_medium", taxRate.factory.medium);
  _setInfoText("info_tax_factory_large", taxRate.factory.large);

  _setInfoText("info_maint_home", monthlyMaintenance.homeCost.toLocaleString());
  _setInfoText("info_maint_shop", monthlyMaintenance.shopCost.toLocaleString());
  _setInfoText("info_maint_factory", monthlyMaintenance.factoryCost.toLocaleString());
  _setInfoText("info_maint_total", monthlyMaintenance.total.toLocaleString());

  _setInfoHTML("info_service_list", serviceStatus);
}

function nextMonth() {
  checkGameOver();
  updateCityLevel();
  updateSeason(monthCount);
  updateResearch(); 
  applyResearchEffects();
  
  monthCount++;
  monthsSinceLastBirth++;

  if (monthCount > 12) {
    yearCount++;
    monthCount = 1;
    updateGlobalEconomy(yearCount);

  }

  if (monthsSinceLastBirth >= 4) {
    monthsSinceLastBirth = 0;
    spawnChildren();
  }

let income = collectTaxes();

// 🧪 คูณโบนัสจากผลวิจัยก่อน
income *= (1 + researchEffects.taxIncomeBonus);

income = applyEconomyEffect(income);

latestGrossIncome = income;
let net = payLoanFromIncome(latestGrossIncome);
latestNetIncome = net;
addTreasury(net);

  let monthlyMaintenanceCost = getMonthlyMaintenance().total;
  subtractTreasury(monthlyMaintenanceCost);

  payCivilServants(30, yearCount);

  let welfare = Math.ceil((Math.max(0, 100 - happiness) / 100) * 40000); // ถ้าความสุขต่ำ ต้องจ่ายสวัสดิการสูงขึ้น (ลดเพดานจาก 50,000 ให้สมดุลกับรายจ่ายอื่นที่เพิ่มขึ้น)
  subtractTreasury(welfare);

  // 🧾 ผลกระทบความสุขจากนโยบายภาษี: ขึ้นภาษีเกินมาตรฐานกระทบความสุขแรงกว่าลดภาษีที่ให้โบนัสเล็กน้อย (ไม่จูงใจให้ตั้งภาษีสูงสุดตลอด)
  const taxDeviation = getTaxPolicyDeviation();
  if (taxDeviation > 0) {
    happiness = Math.max(0, happiness - Math.round(taxDeviation * 12));
  } else if (taxDeviation < 0) {
    happiness = Math.min(100, happiness + Math.round(-taxDeviation * 6));
  }

  // พัฒนา (education)
  if (services.education.funded || civilServants.education >= services.education.requiredServants) {
    improveKnowledge(civilServants.education);
  }

  // คำนวณอาหารเดือนนี้
const foodNeeded = getFoodNeeded();

// ปรับราคาตามเศรษฐกิจ
let economyFactor = (currentEconomy === 'Recession' ? 1.5 : (currentEconomy === 'Boom' ? 0.8 : 1));
let scarcityRatio = (foodStock < foodNeeded) ? (foodNeeded - foodStock) / Math.max(1, foodNeeded) : 0;
let dynamicIncrement = foodPriceIncrement * economyFactor * (1 + scarcityRatio);
foodUnitCost = Math.max(1, +(foodUnitCost + dynamicIncrement).toFixed(3));

// หักอาหารและลดความสุขตามสัดส่วน
foodStock -= foodNeeded;
foodConsumedLastMonth = foodNeeded;

if (foodStock < 0) {
  // จำกัดไม่ให้ติดลบลึกเกินไปจนกู้คืนไม่ไหว (เดิมติดลบได้ไม่จำกัด ยิ่งเดือนถัดไปยิ่งขาดหนักเป็นทวีคูณ)
  const famineFloor = -Math.max(2000, foodNeeded * 1.5);
  if (foodStock < famineFloor) foodStock = famineFloor;

  const lacking = -foodStock; // จำนวนอาหารขาด
  const shortageRate = lacking / Math.max(1, foodNeeded);
  const happinessPenalty = Math.ceil(shortageRate * 20);

  // ลดความสุข
  happiness = Math.min(100, happiness + researchEffects.happinessBonus + researchEffects.monthlyHappinessIncrease);
  happiness = Math.max(0, happiness - happinessPenalty);

  monthsInFamine++;
  if (monthsInFamine === 2) {
    toast(`🚨 ขาดแคลนอาหารต่อเนื่อง 2 เดือนแล้ว! หากไม่แก้ไขเดือนหน้าอาจถึงขั้นวิกฤต (ซื้ออาหารเพิ่มด่วน)`);
  }
} else {
  monthsInFamine = 0;
}

  updateLoanStatus();

  Object.entries(services).forEach(([key, s]) => {
    if (!s.funded) {
      happiness += s.impact;
      toast(`⚠️ แผนก ${s.name} ไม่ได้รับงบ ความสุขลดลง ${-s.impact}%`);
    } else {
      let servants = civilServants[key] || 0;
      happiness += (servants >= s.requiredServants) ? 3 : 1;
    }
    s.funded = false;

    // รีเซ็ตสถานะปุ่มแผนก
    let btn = document.getElementById("btn_" + key);
    if (btn) {
      btn.classList.remove("funded");
    }
});

// รีเซ็ตสถานะปุ่มจ่ายทั้งหมด
let fundAllBtn = document.getElementById("fundAllBtn");
if (fundAllBtn) {
  fundAllBtn.classList.remove("funded");
}

// รีเซ็ตสถานะปุ่มลัดจ่ายงบทั้งหมดบนแถบเร่งด่วนด้วย ให้ตรงกับปุ่มปกติเสมอ
let fundAllDockBtn = document.getElementById("fundAllDockBtn");
if (fundAllDockBtn) {
  fundAllDockBtn.classList.remove("funded");
}

  if (happiness >= 60) {
    let base = Math.floor((happiness - 60) / 6);
    let randomBonus = Math.floor(Math.random() * 2);
    let newcomersCap = Math.max(1, Math.floor(Math.pow(cityLevel, 1.2) * 3));
    let newcomers = Math.min(newcomersCap, Math.max(0, base + randomBonus));
    for (let i = 1; i < newcomers; i++) spawnCitizen();
    if (newcomers > 0) {
      toast(`🎉 มีประชาชนใหม่ย้ายเข้า ${newcomers} คนในเดือนนี้`);
    }
  }

  // Events
  // 🛡️ ระบบป้องกันความสุข/ประชากรดิ่งพร้อมกันหลายเหตุการณ์ในเดือนเดียว (เดิมแต่ละเหตุการณ์เช็คแยกกันอิสระ
  // ถ้าโชคร้ายเกิดพร้อมกันหลายอย่าง ทั้งความสุขและจำนวนประชากรอาจร่วง/หายไปเกือบหมดในเดือนเดียว
  // โดยผู้เล่นแทบไม่มีทางป้องกัน)
  const happinessBeforeEvents = happiness;
  const citizensBeforeEvents = citizens.length;
  const MONTHLY_EVENT_LOSS_CAP = 35;
  const MONTHLY_MIGRANT_LOSS_CAP = Math.max(3, Math.ceil(citizensBeforeEvents * 0.15));

  epidemicCheck();
  riotCheck();
  infrastructureFailureCheck();
  warEventCheck();  
  transportCrisisCheck();
  environmentEventCheck();
  majorDisasterEventCheck();
  tourismEventCheck();
  technologyEventCheck();
  monthlyWeatherEvent();
  positiveEventCheck();

  {
    const totalDrop = happinessBeforeEvents - happiness;
    if (totalDrop > MONTHLY_EVENT_LOSS_CAP) {
      const restored = totalDrop - MONTHLY_EVENT_LOSS_CAP;
      happiness = Math.min(100, happiness + restored);
      toast(`🛡️ มาตรการฉุกเฉินช่วยลดผลกระทบจากเหตุการณ์ซ้ำซ้อนในเดือนนี้ (คืนความสุข +${restored})`);
    }

    const migrantLoss = citizensBeforeEvents - citizens.length;
    if (migrantLoss > MONTHLY_MIGRANT_LOSS_CAP) {
      const toRestore = migrantLoss - MONTHLY_MIGRANT_LOSS_CAP;
      // 🛂 นี่คือ "คนเดิมที่ตัดสินใจไม่ย้ายออก" ไม่ใช่ผู้อพยพใหม่ จึงไม่ผ่านการตรวจนโยบายตรวจคนเข้าเมือง
      for (let i = 0; i < toRestore; i++) spawnCitizen({ bypassPolicy: true });
      toast(`🛡️ ประชาชนบางส่วนตัดสินใจไม่ย้ายออกในนาทีสุดท้าย (${toRestore} คนกลับเข้าเมือง)`);
    }
  }

  randomBuildMonthly();
  buildHomesIfNeeded();
  monthlyRumorEvent();
  ageCitizens();
  preprocessDeaths();
  updateEducation();
  updateEducationStatus();

  if (happiness < 50 && citizens.length > 0) {
    let baseLeavers = Math.floor((100 - happiness) / 12);
    let randomBonus = Math.floor(Math.random() * 2);
    let leavers = Math.max(0, baseLeavers + randomBonus);
    for (let i = 0; i < leavers && citizens.length > 0; i++) {
      citizens.pop();
    }
    if (leavers > 0) toast(`😢 ความสุขต่ำ! มีประชาชนย้ายออก ${leavers} คนในเดือนนี้`);
  }

  let baseCap = 100;
let bonusFromResearch = baseCap * (researchEffects.maxHappinessBonus || 0);
let bonusFromPark = baseCap * (civilServants.park * 0.05 || 0);
let happinessCap = baseCap + bonusFromResearch + bonusFromPark;

// จำกัดให้อยู่ในช่วง 0 ถึง happinessCap
happiness = Math.max(0, Math.min(happiness, happinessCap));

if (researchEffects.happinessBonus) {
    happiness = Math.min(happinessCap, happiness + researchEffects.happinessBonus);
}
if (researchEffects.monthlyHappinessIncrease) {
    happiness = Math.min(happinessCap, happiness + researchEffects.monthlyHappinessIncrease);
}
applyResearchEffects();

  // 📈 บันทึกค่าสำคัญของเดือนนี้ลงประวัติ สำหรับกราฟย้อนหลังในแดชบอร์ด
  recordHistorySnapshot();

  updateInfo();

  // 💾 ออโต้เซฟ: ถ้าเกมนี้กำลังเล่นต่อจากเซฟที่มีอยู่ (currentSaveSlot ถูกตั้งค่าไว้
  // ตอนโหลด/บันทึกครั้งล่าสุด) ให้บันทึกทับเซฟเดิมช่องนั้นอัตโนมัติทุกครั้งที่ขึ้นเดือนใหม่
  // ผู้เล่นไม่ต้องกดเซฟเองซ้ำๆ และเสี่ยงลืมเซฟก่อนปิดเกม
  if (typeof autoSaveCurrentSlot === "function") autoSaveCurrentSlot();
}
