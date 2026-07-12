function monthlyWeatherEvent() {
  // ความน่าจะเป็นอากาศปกติ (50%)
  if (Math.random() < 0.5) {
    // รีเซ็ต infrastructureImpact กลับสู่ค่าปกติด้วย ไม่งั้นตัวคูณจากพายุเดือนก่อน
    // จะค้างอยู่ตลอดไปแม้อากาศจะกลับมาปกติแล้ว
    infrastructureImpact = { home: 1, shop: 1, factory: 1 };
    return { happinessChange: 0, incomeMultiplier: 1, message: "อากาศปกติ" };
  }
  
  const specialWeathers = [
    { name: "แดดจัด", happiness: 2, incomeMultiplier: 1 },
    { name: "ฝนตก", happiness: -1, incomeMultiplier: 0.98 },
    { name: "พายุแรง", happiness: -3, incomeMultiplier: 0.95 },
    { name: "อากาศเย็นสบาย", happiness: 3, incomeMultiplier: 1.05 }
  ];
  
  let weather = specialWeathers[Math.floor(Math.random() * specialWeathers.length)];
  
  // ปรับความสุข
  happiness = Math.min(100, happiness + researchEffects.monthlyHappinessIncrease);
  happiness = Math.max(0, happiness + weather.happiness);
  
  // รีเซ็ต infrastructureImpact ก่อนปรับตามสภาพอากาศ
  infrastructureImpact = {
    home: 1 * weather.incomeMultiplier,
    shop: 1 * weather.incomeMultiplier,
    factory: 1 * weather.incomeMultiplier
  };
  
  let message = `🌦 สภาพอากาศเดือนนี้: ${weather.name} (ความสุข ${weather.happiness >= 0 ? "+" : ""}${weather.happiness}, รายได้ ${(weather.incomeMultiplier > 1 ? "+" : "") + ((weather.incomeMultiplier - 1) * 100).toFixed(1)}%)`;
  toast(message);
  
  return { happinessChange: weather.happiness, incomeMultiplier: weather.incomeMultiplier, message };
}