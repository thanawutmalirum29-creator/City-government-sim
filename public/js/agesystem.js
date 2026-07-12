function getAgeGroupStats() {
  let groups = {
    "1-10": 0,
    "11-20": 0,
    "21-65": 0,
    "66-80": 0,
    "81-99": 0
  };

  citizens.forEach(c => {
    if (c.age <= 10) groups["1-10"]++;
    else if (c.age <= 20) groups["11-20"]++;
    else if (c.age <= 65) groups["21-65"]++;
    else if (c.age <= 80) groups["66-80"]++;
    else if (c.age <= 99) groups["81-99"]++;
  });

  return groups;
}


function ageCitizens() {
  citizens.forEach(c => c.age++);
}

function preprocessDeaths() {
  let remaining = [];
  citizens.forEach(c => {
    if (c.age === 99) {
      deadCitizens.push({ ...c, age: 100 });
    } else {
      remaining.push(c);
    }
  });
  citizens = remaining;
}

function showDeadCitizens() {
  const container = document.getElementById("deadDisplay");

  if (!deadCitizens || deadCitizens.length === 0) {
    container.textContent = "ยังไม่มีผู้เสียชีวิต";
    return;
  }

  let output = deadCitizens.map(c => {
    return `☠️ ID: ${c.id} | อายุที่ตาย: ${c.age} | ความรู้: ${c.knowledge}`;
  }).join("\n");

  container.textContent = output;
}

function showCitizensData() {
  const container = document.getElementById("citizenDisplay");

  if (!citizens || citizens.length === 0) {
    container.textContent = "ยังไม่มีข้อมูลประชาชน";
    return;
  }

  let output = citizens.map(c => {
    return `🧍‍♂️ ID: ${c.id} | อายุ: ${c.age} | ความรู้: ${c.knowledge}`;
  }).join("\n");

  container.textContent = output;
}