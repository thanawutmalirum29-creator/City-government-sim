applyResearchEffects();
let taxRate = {
  home: {
    get small() {
      return 12000 + Math.floor(citizens.length / 100) * 500 ;
    },
    get large() {
      return 18000 + Math.floor(citizens.length / 120) * 700;
    }
  },
  shop: {
    get small() {
      return 15000 + Math.floor(citizens.length / 120) * 500*(1+researchEffects.shopIncomeBonus)*(1+researchEffects.shopIncomeBonus2);
    },
    get medium() {
      return 20000 + Math.floor(citizens.length / 160) * 600*(1+researchEffects.shopIncomeBonus)*(1+researchEffects.shopIncomeBonus2);
    },
    get large() {
      return 28000 + Math.floor(citizens.length / 200) * 800*(1+researchEffects.shopIncomeBonus)*(1+researchEffects.shopIncomeBonus2);
    }
  },
  factory: {
    get small() {
      return 30000 + Math.floor(citizens.length / 180) * 800*(1+researchEffects.factoryIncomeBonus);
    },
    get medium() {
      return 35000 + Math.floor(citizens.length / 220) * 1000*(1+researchEffects.factoryIncomeBonus);
    },
    get large() {
      return 42000 + Math.floor(citizens.length / 300) * 1500*(1+researchEffects.factoryIncomeBonus);
    }
  }
};

let services = {
    park: { name: "สวนสาธารณะ", funded: false, impact: -4, getCost: () => Math.ceil(latestGrossIncome/20) + civilServants.health * 15000 + (yearCount * 800), requiredServants: 1, maxServants: 5 },
  health: { name: "สาธารณสุข", funded: false, impact: -4, getCost: () => Math.ceil(latestGrossIncome/12) + civilServants.health * 15000 + (yearCount * 800), requiredServants: 1, maxServants: 5 },
  police: { name: "ตำรวจ", funded: false, impact: -3, getCost: () => Math.ceil(latestGrossIncome/18) + civilServants.police * 12000 + (yearCount * 600), requiredServants: 1, maxServants: 5 },
  infrastructure: { name: "โครงสร้าง", funded: false, impact: -3, getCost: () => Math.ceil(latestGrossIncome/14) + civilServants.infrastructure * 15000 + (yearCount * 700), requiredServants: 1, maxServants: 5 },
  education: { name: "การศึกษา", funded: false, impact: -4, getCost: () => Math.ceil(latestGrossIncome/14) + civilServants.education * 15000 + (yearCount * 900), requiredServants: 1, maxServants: 5 },
  military: { name: "กลาโหม", funded: false, impact: -2, getCost: () => Math.ceil(latestGrossIncome/22) + civilServants.military * 12000 + (yearCount * 500), requiredServants: 1, maxServants: 5 },
  transport: { name: "การขนส่ง", funded: false, impact: -2, getCost: () => Math.ceil(latestGrossIncome/16) + civilServants.transport * 12000 + (yearCount * 650), requiredServants: 1, maxServants: 5 },
  scholarship: { name: "ทุนการศึกษา", funded: false, impact: -3, getCost: () => Math.ceil(latestGrossIncome/20) + civilServants.scholarship * 12000 + (yearCount * 600), requiredServants: 1, maxServants: 5 },
  environment: { name: "สิ่งแวดล้อม", funded: false, impact: -2, getCost: () => Math.ceil(latestGrossIncome/20) + civilServants.environment * 12000 + (yearCount * 600), requiredServants: 1, maxServants: 5 },
  disaster: { name: "สาธารณภัย", funded: false, impact: -4, getCost: () => Math.ceil(latestGrossIncome/18) + civilServants.disaster * 12000 + (yearCount * 700), requiredServants: 1, maxServants: 5 },
  tourism: { name: "การท่องเที่ยว", funded: false, impact: -2, getCost: () => Math.ceil(latestGrossIncome/24) + civilServants.tourism * 10000 + (yearCount * 500), requiredServants: 1, maxServants: 5 },
  technology: { name: "เทคโนโลยี", funded: false, impact: -2, getCost: () => Math.ceil(latestGrossIncome/16) + civilServants.technology * 15000 + (yearCount * 900), requiredServants: 1, maxServants: 5 }
};

let servantSalary = 450;

let loan = {
  totalBorrowed: 0,
  remainingDebt: 0,
  monthlyPayment: 0,
  isPaying: false
};
let openEconomyBoost = 1;

function calculateMaintenanceCost() {

  let homeCost = homes.length *1 ;
  let shopCost = businesses.filter(b => b.type === "shop").length * 2;
  let factoryCost = Math.max(1,Math.floor(factories.length * 5 * (1+researchEffects.factoryCostReduction)));
  let total = homeCost + shopCost + factoryCost;
  return { homeCost, shopCost, factoryCost, total };
}

function hireCivilServant(dept) {
  let max = services[dept].maxServants || services[dept].requiredServants;

  if (civilServants[dept] >= max) {
    return toast(`🚫 แผนก ${services[dept].name} จ้างเต็มแล้ว (${max} คน)`);
  }

  let index = citizens.findIndex(c => c.knowledge >= 260);
  if (index === -1) return toast("❌ ต้องการคนเรียนปริญญาโท");

  citizens.splice(index, 1);
  civilServants[dept]++;
  toast(`✅ จ้างข้าราชการเพิ่มในแผนก ${services[dept].name}`);
  updateInfo();
}

function payCivilServants(days = 30, yearCount = 1) {
  let totalServants = Object.values(civilServants).reduce((a, b) => a + b, 0);
  let currentSalary = servantSalary * days + (yearCount - 1) * 5000;
  let popFactor = Math.pow(Math.max(1, citizens.length / 100), 0.15);
  currentSalary = Math.ceil(currentSalary * popFactor);
  let totalCost = totalServants * currentSalary;

  if (treasury >= totalCost) {
    subtractTreasury(totalCost);
  } else {
    happiness = Math.min(100, happiness + researchEffects.monthlyHappinessIncrease);
    happiness = Math.max(0, happiness - 5);
    toast("⚠️ ขาดเงินเดือนข้าราชการ ความสุขลดลง!");
    updateInfo();
  }
}
function fund(key) {
  let s = services[key];
  if (s.funded) {
    toast(`✅ งบของ ${s.name} ถูกจ่ายไปแล้ว!`);
    return;
  }

  let cost = Math.ceil(Number(s.getCost()) || 0);

  // 💸 หักเงินได้เสมอ แม้จะติดลบ
  subtractTreasury(cost);

  s.funded = true;

  let btn = document.getElementById("btn_" + key);
  if (btn) btn.classList.add("funded");

  updateInfo();
}

function fundAll() {
  let paid = [];

  for (let key in services) {
    let s = services[key];
    if (s.funded) continue; // ข้ามอันที่จ่ายแล้ว

    let cost = Math.ceil(Number(s.getCost()) || 0);

    // 💸 หักเงินได้เสมอ
    subtractTreasury(cost);
    s.funded = true;
    paid.push(s.name);

    let btn = document.getElementById("btn_" + key);
    if (btn) btn.classList.add("funded");
  }

  let fundAllBtn = document.getElementById("fundAllBtn");
  if (fundAllBtn) fundAllBtn.classList.add("funded");

  if (paid.length > 0) {
    toast(`✅ จ่ายงบให้ทั้งหมด: ${paid.join(", ")}`);
  }

  updateInfo();
}

function setTreasury(value) {
  treasury = Math.ceil(value);
}
function addTreasury(amount) {
  treasury = Math.ceil(treasury + amount);
}
function subtractTreasury(amount) {
  treasury = Math.ceil(treasury - amount);
}

function collectTaxes() {
  let total = 0;
  
  homes.forEach(h => {
    total += (taxRate.home[h.size] || 0) * infrastructureImpact.home;
  });
  
  businesses.forEach(b => {
    if (b.type === "shop") {
      total += (taxRate.shop[b.size] || 0) * infrastructureImpact.shop * (openEconomyBoost || 1) ;
    }
  });
  
  factories.forEach(f => {
    total += (taxRate.factory[f.size] || 0) * infrastructureImpact.factory ;
  });
  
  total = Math.ceil(total);
  let taxCap = cityTaxCap[cityLevel] || Infinity;
  return Math.min(total, taxCap);
}

function setTax(type, size) {
  const val = parseInt(document.getElementById(`tax_${type}_${size}`).value);
  if (!isNaN(val)) {
    taxRate[type][size] = val;
    updateInfo();
  }
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


function improveKnowledge() {
  let totalEducationServants = civilServants.education + civilServants.scholarship;
  let bonus = Math.floor(totalEducationServants * 0.5);
  citizens.forEach(c => {
    if (!c.employed) {
      c.knowledge += 2 + bonus;
    }
  });
}


function endGame(reason) {
  toast(`🎮 เกมจบแล้ว! สาเหตุ: ${reason}`);
  location.reload();
}

function checkGameOver() {
  if (citizens.length === 0) {
    endGame("ไม่มีประชากรเหลืออยู่");
  } else if (treasury < -1000000) {
    endGame("หนี้สินล้นพ้นตัว");
  } else if (happiness <= 0) {
    endGame("ความสุขตกถึงศูนย์");
  }else if (foodStock <=-1) {
    endGame("ผู้คนอดอยาก");
  }
}

function buyFood() {
  const amount = 20000;
  const cost = Math.ceil(amount * foodUnitCost);

  // 💸 หักเงินได้เสมอ แม้ติดลบ
  subtractTreasury(cost);

  // 🍚 เพิ่มอาหาร
  foodStock += amount;

  toast(`✅ ซื้ออาหาร ${amount.toLocaleString()} มื้อ สำเร็จ! ใช้เงิน ${cost.toLocaleString()} บาท`);
  updateInfo();
}
for (let i = 0; i < 60; i++) spawnCitizen(); 
buildHomesIfNeeded();
updateInfo();
setInterval(updateInfo, 1000);