const economies = ["Boom", "Stable", "Recession"];
let currentEconomy = "Stable";

function updateGlobalEconomy(year) {
    if (year % 1 === 0) { // เปลี่ยนทุกปี
        currentEconomy = economies[Math.floor(Math.random() * economies.length)];
        toast(`🌍 สถานะเศรษฐกิจโลก: ${currentEconomy}`);
    }
}

function applyEconomyEffect(income) {
    switch (currentEconomy) {
        case "Boom": return Math.floor(income * 1.2);
        case "Recession": return Math.floor(income * 0.8);
        default: return income;
    }
}
