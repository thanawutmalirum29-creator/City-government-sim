function updateEducationStatus() {
  try {
    window._eduSummary = getEducationStats();
  } catch (e) {
    window._eduSummary = null;
  }
}

function updateEducation() {
  citizens.forEach(c => {
    if (c.employed) return;
    
    c.knowledge += 1;
    
    if (c.knowledge < 30) c.educationStage = "primary";
    else if (c.knowledge < 60) c.educationStage = "secondary";
    else if (c.knowledge < 160) c.educationStage = "bachelor";
    else if (c.knowledge < 260) c.educationStage = "master";
    else if (c.knowledge < 500) c.educationStage = "phd";
    else c.educationStage = "expert";
  });
}
function getEducationStats() {
  let primary = citizens.filter(c => c.knowledge < 30).length;
  let secondary = citizens.filter(c => c.knowledge >= 30 && c.knowledge < 60).length;
  let bachelor = citizens.filter(c => c.knowledge >= 60 && c.knowledge < 160).length;
  let master = citizens.filter(c => c.knowledge >= 160 && c.knowledge < 260).length;
  let phd = citizens.filter(c => c.knowledge >= 260 && c.knowledge < 500).length;
  let expert = citizens.filter(c => c.knowledge >= 500).length;
  return { primary, secondary, bachelor, master, phd, expert };
}