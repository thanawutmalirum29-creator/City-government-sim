function organizeFestival() {
  const costMoney = 500000;   // ลดจาก 5,000,000 -> 500,000
  const costFood = 30000;     // ลดจาก 50,000 -> 30,000

  // 💸 หักเงินและอาหารได้เลย แม้ติดลบ
  subtractTreasury(costMoney);
  foodStock -= costFood;

  // เพิ่มความสุขแบบสุ่ม 30-50
  const happinessGain = Math.floor(Math.random() * 21) + 30;
  happiness = Math.min(100, happiness + happinessGain);

  // บางครั้งเทศกาลดึงนักท่องเที่ยวมาเล็กน้อย
  if (Math.random() < 0.25) {
    addTreasury(200000);
    toast(`🎊 จัดเทศกาลสำเร็จ! ใช้เงิน ${costMoney.toLocaleString()} บาท และอาหาร ${costFood.toLocaleString()} มื้อ\n😊 ความสุขเพิ่มขึ้น +${happinessGain}\n🏖️ นักท่องเที่ยวทำให้ได้เงินเพิ่ม 200,000 บาท`);
  } else {
    toast(`🎊 จัดเทศกาลสำเร็จ! ใช้เงิน ${costMoney.toLocaleString()} บาท และอาหาร ${costFood.toLocaleString()} มื้อ\n😊 ความสุขเพิ่มขึ้น +${happinessGain}`);
  }

  updateInfo();
}

document.getElementById("festivalBtn").addEventListener("click", organizeFestival);