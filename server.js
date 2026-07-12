const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// เสิร์ฟไฟล์เกมทั้งหมด (HTML, CSS, JS) จากโฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));

// เส้นทางสำรอง กรณีเข้าเว็บโดยไม่ระบุไฟล์ -> ส่ง index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🏛️  City Government Sim server running on port ${PORT}`);
});
