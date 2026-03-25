# 🌾 AgriGro Order System - Setup Guide

## 📋 System Architecture

```
order.html (Form UI)
    ↓
    ↓ (sends form data via API)
    ↓
server.js (Node.js Backend)
    ↓
    ├── PDF Generation (html-pdf-node)
    ├── Database Storage (database.js)
    └── File Management
```

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
cd "d:\A-Raj Folder\new website"
npm install
```

This will install:
- **express** - Web server
- **sqlite3** & **sqlite** - Database
- **html-pdf-node** - PDF generation
- **cors** - Cross-origin requests
- **body-parser** - JSON parsing

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
Database initialized successfully
Database connected
Server running on http://localhost:3000
```

### Step 3: Open in Browser
```
http://localhost:3000/order.html
```

---

## 📝 How the System Works

### 1️⃣ **User fills Form** (order.html)
- Customer Name
- Mobile Number
- Email
- Delivery Address
- Customer Type
- GST Number
- Product Details (Name, Quantity, Unit)

### 2️⃣ **Form Data Sent to Server**
```
POST http://localhost:3000/api/orders
Contains: Customer Info + Products
```

### 3️⃣ **Server Processing** (server.js)
✅ Generates PDF with actual form data
✅ Saves Order to Database (orders.db)
✅ Saves Order Items to Database

### 4️⃣ **PDF Generated with Data**
- Order ID: `AGRO-XXXXXXXX`
- Customer Details
- Products List
- Date & Time
- Status

### 5️⃣ **User Downloads PDF**
- PDF automatically downloads
- Contains all form data (NOT empty!)
- Stored in `/uploads` folder

---

## 📂 File Structure

```
new website/
├── order.html           ← Form UI (user fills data)
├── server.js            ← Backend server (processes data)
├── database.js          ← SQLite database setup
├── package.json         ← Dependencies config
├── agrigro_orders.db    ← Auto-created database file
└── uploads/             ← Auto-created folder for PDFs
    └── order_*.pdf      ← Generated PDFs
```

---

## 🔗 API Endpoints

### 1. Create Order (Save Data + Generate PDF)
```
POST http://localhost:3000/api/orders
Body: {
  "customerName": "Raj Kumar",
  "mobile": "9876543210",
  "email": "raj@example.com",
  "address": "Sector 44, Gurugram",
  "customerType": "Farmer",
  "gst": "22ABCDE1234F",
  "products": [
    {"name": "NPK 19:19:19", "quantity": "100", "unit": "Kg"}
  ]
}

Response: {
  "success": true,
  "orderId": "AGRO-12345678",
  "pdfUrl": "/uploads/order_AGRO-12345678_timestamp.pdf"
}
```

### 2. Get All Orders
```
GET http://localhost:3000/api/orders
```

### 3. Get Single Order
```
GET http://localhost:3000/api/orders/AGRO-12345678
```

### 4. Download PDF
```
GET http://localhost:3000/api/orders/AGRO-12345678/download
```

### 5. Get Statistics
```
GET http://localhost:3000/api/stats
```

---

## 💾 Database Schema

### `orders` Table
```
id                  - Auto increment ID
order_id            - Unique Order ID (AGRO-XXXXX)
customer_name       - Customer/Business Name
mobile              - Mobile Number
email               - Email Address
address             - Delivery Address
customer_type       - Farmer/Dealer/Distributor/etc
gst                 - GST Number
total_items         - Number of products
pdf_path            - Path to generated PDF file
status              - pending/completed/cancelled
created_at          - Order creation timestamp
updated_at          - Last update timestamp
```

### `order_items` Table
```
id              - Auto increment ID
order_id        - Link to orders table
product_name    - Product name
quantity        - Quantity ordered
unit            - Unit (Kg/Ton/Bag/Liter)
```

---

## ✅ Testing the System

### Test 1: Form Submission
1. Open `http://localhost:3000/order.html`
2. Fill the form with:
   - Name: "Test Farmer"
   - Mobile: "9876543210"
   - Address: "Test Address, City"
   - Add 1-2 products
3. Click "Generate & Download PDF"
4. PDF should download with your data

### Test 2: Check Database
```bash
# Install sqlite3 CLI (if needed)
sqlite3 agrigro_orders.db

# Check orders
SELECT * FROM orders;

# Check order items
SELECT * FROM order_items;
```

### Test 3: Verify Files
- Check `/uploads` folder for generated PDFs
- Files named: `order_AGRO-XXXXX_timestamp.pdf`

---

## 🐛 Troubleshooting

### ❌ Error: "Connection refused"
**Solution**: Server not running
```bash
npm start
```

### ❌ Error: "localhost:3000 refused to connect"
**Solution**: Server port already in use
```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000
# Then: taskkill /PID <PID> /F
```

### ❌ PDF is empty
**Solution**: Database not initialized
- Delete `agrigro_orders.db` file
- Restart server: `npm start`
- Try again

### ❌ CORS Error
**Solution**: Server CORS not enabled
- Check that `cors()` is in server.js middleware
- Already configured ✅

---

## 📊 Data Flow

```
┌─────────────────┐
│  order.html     │
│  (User Form)    │
└────────┬────────┘
         │
         │ Form Data (JSON)
         │
         ▼
┌─────────────────────────────┐
│  server.js (/api/orders)    │
│  - Validate Data            │
│  - Generate PDF             │
│  - Save to Database         │
└────────┬────────────────────┘
         │
         ├─► database.js ◄─► agrigro_orders.db
         │   (SQLite)
         │
         └─► uploads/ (PDF files)
```

---

## 📝 Features

✅ **Form Data Persistence** - Data stored in SQLite database
✅ **PDF Generation** - PDFs contain actual form data
✅ **Automatic File Management** - PDFs auto-saved in `/uploads`
✅ **Unique Order IDs** - Each order gets unique ID
✅ **API Support** - Retrieve orders via REST API
✅ **CORS Enabled** - Work with external services
✅ **Error Handling** - Input validation & error messages

---

## 🔐 Security Notes

For production use, add:
- ✅ Input validation
- ✅ SQL injection prevention (using parameterized queries)
- ✅ Rate limiting
- ✅ Authentication/Authorization
- ✅ Data encryption

Currently using SQLite (dev-friendly). For production, migrate to PostgreSQL/MySQL.

---

## 📞 Support

If issues persist:
1. Check console for error messages
2. Verify all files exist in the directory
3. Make sure port 3000 is free
4. Restart server: `npm start`

**Everything is now properly linked! 🎉**
