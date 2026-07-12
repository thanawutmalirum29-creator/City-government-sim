# 🏛️ City Government Sim — Server Edition

เกมจำลองการบริหารเมือง แปลงจากเว็บไฟล์ static ให้กลายเป็นระบบเซิร์ฟเวอร์ (Node.js + Express)
พร้อมสำหรับอัปโหลดขึ้น **GitHub** และดีพลอยขึ้น **Railway**

## 📁 โครงสร้างโปรเจกต์

```
.
├── public/              ← ไฟล์เกมทั้งหมด (HTML/CSS/JS เดิม)
│   ├── index.html
│   ├── styleเมือง ธีมขาว.css
│   ├── styleเมือง ธีมดำ.css
│   └── js/...
├── server.js            ← เว็บเซิร์ฟเวอร์ Express
├── package.json
├── railway.json         ← ตั้งค่าการดีพลอยของ Railway
├── Procfile
└── .gitignore
```

เกมยังทำงานแบบเดิมทุกอย่าง (เซฟเกมใช้ `localStorage` ในเบราว์เซอร์ผู้เล่นเหมือนเดิม) เพียงแต่ตอนนี้ไฟล์ถูกเสิร์ฟผ่านเซิร์ฟเวอร์ Node.js แทนการเปิดไฟล์ตรง ๆ ทำให้นำไปรันบน Railway ได้

## 🚀 ทดสอบรันในเครื่องตัวเอง

ต้องมี Node.js ติดตั้งไว้ก่อน (เวอร์ชัน 18 ขึ้นไป)

```bash
npm install
npm start
```

จากนั้นเปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

## 📤 ขั้นตอนที่ 1: อัปโหลดขึ้น GitHub

1. สร้าง repository ใหม่บน GitHub (เช่น `city-government-sim`)
2. ในโฟลเดอร์นี้ รันคำสั่ง:

```bash
git init
git add .
git commit -m "Initial commit: city government sim server"
git branch -M main
git remote add origin https://github.com/<ชื่อผู้ใช้ของคุณ>/city-government-sim.git
git push -u origin main
```

## 🚂 ขั้นตอนที่ 2: ดีพลอยบน Railway

**วิธีที่ง่ายที่สุด (แนะนำ):**

1. ไปที่ [railway.app](https://railway.app) แล้วล็อกอินด้วย GitHub
2. กด **New Project** → **Deploy from GitHub repo**
3. เลือก repository `city-government-sim` ที่เพิ่ง push ไป
4. Railway จะตรวจพบ `package.json` และ build ให้อัตโนมัติ (ใช้ Nixpacks)
5. รอสักครู่ Railway จะรัน `npm install` และ `npm start` ให้เอง
6. เมื่อ deploy เสร็จ ไปที่แท็บ **Settings → Networking → Generate Domain** เพื่อรับลิงก์สาธารณะ

ไม่ต้องตั้งค่า Environment Variable ใด ๆ เพิ่มเติม — เซิร์ฟเวอร์อ่านค่าพอร์ตจาก `process.env.PORT` ที่ Railway กำหนดให้อัตโนมัติอยู่แล้ว

**หมายเหตุ:** ทุกครั้งที่ push โค้ดใหม่ขึ้น branch `main` บน GitHub, Railway จะดีพลอยเวอร์ชันใหม่ให้อัตโนมัติ (auto-deploy)

## 🛠️ หมายเหตุทางเทคนิค

- `taxRate.js` ในโปรเจกต์เดิมเป็นไฟล์ว่าง (0 bytes) — คัดลอกมาตามเดิม ถ้าตั้งใจให้มีโค้ดควรตรวจสอบไฟล์ต้นฉบับอีกครั้ง
- ไฟล์ CSS/HTML ที่มีชื่อเป็นภาษาไทยและมีช่องว่าง (เช่น `styleเมือง ธีมขาว.css`) ทำงานได้ปกติเพราะ HTML อ้างอิงชื่อไฟล์ตรงกัน แต่ถ้าต้องการความเรียบร้อยขึ้น แนะนำเปลี่ยนชื่อเป็นภาษาอังกฤษไม่มีช่องว่างในอนาคต
