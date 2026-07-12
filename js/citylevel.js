
function updateCityLevel() {
  // เลื่อนเลเวลตามประชากรและปี (ต้องมีทั้ง population และ survival)
  if (cityLevel === 1 && citizens.length >= 80) cityLevel = 2;
  else if (cityLevel === 2 && citizens.length >= 180) cityLevel = 3;
  else if (cityLevel === 3 && citizens.length >= 400) cityLevel = 4;
  else if (cityLevel === 4 && citizens.length >= 900) cityLevel = 5;
  else if (cityLevel === 5 && citizens.length >= 1300) cityLevel = 6;
  else if (cityLevel === 6 && citizens.length >= 1800) cityLevel = 7;
  else if (cityLevel === 7 && citizens.length >= 2500) cityLevel = 8;
  else if (cityLevel === 8 && citizens.length >= 3000) cityLevel = 9;
  else if (cityLevel === 9 && citizens.length >= 5000) cityLevel = 10;
}