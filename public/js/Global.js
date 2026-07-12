let treasury = 1000000;
let researchEffects = {
    tourismChanceBonus: 0,
    summerFoodBonus: 0,
    happinessBonus: 0,
    factoryCostReduction: 0,
    transportCrisisReduction: 0,
    monthlyHappinessIncrease: 0,
    shopIncomeBonus: 0,
    factoryIncomeBonus: 0,
    taxIncomeBonus: 0,
    disasterReduction: {
        earthquake: 0,
        flood: 0,
        environment: 0,
        majorDisaster: 0,
        epidemic: 0
    }
};

let happiness = 80;
let damagedStructures = [];
let infrastructureImpact = {
  home: 1,
  shop: 1,
  factory: 1
};
let homes = [];
let businesses = [];
let citizens = [];
let factories = []; 
let latestGrossIncome = 0;  
let latestNetIncome = 0;    
let monthCount = 1;
let yearCount = 1;
let monthsSinceLastBirth = 0;
let foodStock = 200000;
let foodPurchasePerMonth = 20000;
let foodUnitCost = 20;
let foodPriceIncrement = 0.05;  
let foodConsumedLastMonth = 0;  
let deadCitizens = []; 
let civilServants = {
    park: 0,
  health: 0,
  police: 0,
  infrastructure: 0,
  education: 0,
  military: 0,
  transport: 0,
  scholarship: 0,
  environment: 0,
  disaster: 0,
  tourism: 0,
  technology: 0,
  
};
let cityLevel = 1;
let cityTaxCap = { 
  1: 300000,    
  2: 555555,  
  3: 1500000, 
  4: 2500000,   
  5: 3500000,   
  6: 4500000, 
  7: 5555555,   
  8: 6500000,   
  9: 7500000,   
  10: 987654321,
};

let monthsSinceLastEpidemic =999;
let monthsSinceLastRiot = 999;
let monthsSinceLastInfrastructureFailure = 999;
let monthsSinceLastWar = 999;
let monthsSinceLastTransportCrisis = 999;
let monthsSinceLastEnvDisaster = 999;
let monthsSinceLastMajorDisaster = 999;
let monthsSinceLastTourismBoom = 999;
let monthsSinceLastTechBreakdown = 999;