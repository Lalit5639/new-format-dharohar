# 🚀 QUICK START - AgriGro Order System

## Everything is Ready! Just 3 Steps:

### Step 1️⃣ - Install Dependencies (First Time Only)
Open PowerShell/Terminal and run:
```bash
cd "d:\A-Raj Folder\new website"
npm install
```

### Step 2️⃣ - Start the Server
**Option A:** Run the batch file (Easiest)
```
Double-click: START_SERVER.bat
```

**Option B:** Manual command
```bash
npm start
```

Wait for message: ✅ `Server running on http://localhost:3000`

### Step 3️⃣ - Open in Browser
```
http://localhost:3000/order.html
```

---

## ✅ Test It!

1. **Fill the Form:**
   - Enter customer name, phone, address
   - Select 1-2 products
   - Add quantities

2. **Generate PDF:**
   - Click "Generate & Download PDF"
   - PDF downloads with YOUR data (not empty!)
   - Check the `/uploads` folder for saved PDF

3. **Check Database:**
   - Order saved in `agrigro_orders.db`
   - Data stored in SQLite database

---

## 🔗 How Files Talk to Each Other

```
order.html (user fills form)
    ↓
    ↓ sends data to
    ↓
server.js (processes data)
    ↓
    ├─→ database.js (stores in database)
    ├─→ PDF generated with data
    └─→ saved to /uploads folder
```

---

## 📂 The System

| File | Purpose |
|------|---------|
| **order.html** | Form interface (what user sees) |
| **server.js** | Backend (processes forms, generates PDFs) |
| **database.js** | SQLite setup |
| **package.json** | Dependencies list |
| **agrigro_orders.db** | Auto-created database file |
| `/uploads/` | Auto-created PDF storage |

---

## 🆘 If Something Doesn't Work

| Problem | Solution |
|---------|----------|
| npm not found | Install Node.js: https://nodejs.org/ |
| Port 3000 in use | Close other apps using port 3000 |
| PDF empty | Delete `agrigro_orders.db` and restart server |
| Can't connect | Server not running - do `npm start` |
| CORS error | Restart server - should be fixed |

---

## 💡 Key Points

✅ **Form data is SAVED** - Goes to database automatically
✅ **PDF has DATA** - Contains your form entries
✅ **Everything LINKED** - order.html ↔ server.js ↔ database.js
✅ **Auto file management** - PDFs saved automatically

---

## 📞 Next Steps

1. Start server: `npm start`
2. Open: `http://localhost:3000/order.html`
3. Fill form and generate PDF
4. Download and check PDF

**You're all set! 🎉**
