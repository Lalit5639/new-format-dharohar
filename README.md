# 🌾 AgriGro Order Management System

A complete order management system with form submission, PDF generation, and database storage.

## 📋 What This System Does

1. **Form Collection** - Collects customer and product information
2. **PDF Generation** - Creates professional PDFs with actual form data
3. **Database Storage** - Saves all orders in SQLite database
4. **File Management** - Auto-manages PDF files in `/uploads` folder
5. **REST API** - Provides API endpoints for order management

## 🚀 Quick Setup

### Prerequisites
- Node.js installed ([Download](https://nodejs.org/))

### Installation
```bash
cd "d:\A-Raj Folder\new website"
npm install
npm start
```

### Access
```
http://localhost:3000/order.html
```

## 📁 Files Linked Together

```
┌─────────────────────────────────────────────────────┐
│                   order.html                         │
│              (User fills form here)                  │
└────────────────────┬────────────────────────────────┘
                     │
                     │ Form Data (JSON)
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                   server.js                          │
│         (Receives data, processes, creates PDF)     │
└────────────┬──────────────────────┬────────────────┘
             │                      │
             │                      │
             ▼                      ▼
    ┌──────────────────┐   ┌──────────────────┐
    │  database.js     │   │  PDF Generator   │
    │  (Stores data)   │   │  (Creates PDF)   │
    └──────────────────┘   └──────────────────┘
             │                      │
             ▼                      ▼
    ┌──────────────────┐   ┌──────────────────┐
    │  agrigro_        │   │   /uploads/      │
    │  orders.db       │   │   order_*.pdf    │
    └──────────────────┘   └──────────────────┘
```

## 🔄 Data Flow

```
1. User fills form in order.html
   ↓
2. Clicks "Generate & Download PDF"
   ↓
3. Data sent to server.js (POST /api/orders)
   ↓
4. Server receives data
   ├─ Validates input
   ├─ Generates PDF with data
   ├─ Saves to /uploads folder
   └─ Saves order to database
   ↓
5. Returns PDF URL to browser
   ↓
6. Browser downloads PDF
   ↓
7. User gets PDF with their form data
```

## 📊 Database Tables

### `orders` Table
- Stores complete order information
- Fields: order_id, customer_name, mobile, email, address, customer_type, gst, total_items, pdf_path, status, timestamps

### `order_items` Table
- Stores individual product details for each order
- Fields: id, order_id, product_name, quantity, unit
- Linked to orders table via order_id (foreign key)

## 🔗 All Files Connected

| File | Role | Connects To |
|------|------|-------------|
| **order.html** | Frontend form UI | Sends data to server.js |
| **server.js** | Backend server | Gets data from order.html, calls database.js, generates PDFs |
| **database.js** | Database setup | Creates/manages SQLite database tables |
| **package.json** | Dependencies | Lists all required npm packages |
| **.env.example** | Configuration template | For future environment setup |
| **START_SERVER.bat** | Quick start script | Runs `npm start` with nice UI |

## 🎯 API Endpoints

### POST /api/orders
Create new order and generate PDF
```json
{
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
```

### GET /api/orders
Get all orders

### GET /api/orders/:orderId
Get specific order details

### GET /api/orders/:orderId/download
Download PDF for specific order

### GET /api/stats
Get order statistics

## ✅ Features

- ✅ Form validation before submission
- ✅ Unique order IDs (AGRO-XXXXX format)
- ✅ PDF generation with actual form data
- ✅ SQLite database for data persistence
- ✅ Automatic file management (uploads folder)
- ✅ CORS enabled for frontend requests
- ✅ Error handling and user feedback
- ✅ REST API for programmatic access
- ✅ Support for multiple products per order
- ✅ Order status tracking

## 🧪 Testing

1. **Start Server**
   ```bash
   npm start
   ```

2. **Open Form**
   ```
   http://localhost:3000/order.html
   ```

3. **Fill & Submit**
   - Enter customer details
   - Add products
   - Click "Generate & Download PDF"

4. **Verify**
   - Check downloads folder for PDF
   - Check `/uploads` folder for saved PDF
   - Query database: `sqlite3 agrigro_orders.db "SELECT * FROM orders;"`

## 📖 Documentation

- **QUICK_START.md** - Get started in 3 steps
- **SETUP_GUIDE.md** - Detailed setup and troubleshooting
- **README.md** - This file

## 🐛 Troubleshooting

### Server won't start
```bash
# Check Node.js
node --version

# Check port 3000
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <PID> /F

# Try again
npm start
```

### PDF is empty
- Delete `agrigro_orders.db`
- Restart server
- Try form submission again

### Connection refused
- Make sure server is running (`npm start`)
- Check browser address: `http://localhost:3000`

## 🔒 Security Notes

Current implementation is suitable for development. For production:
- ✅ Add input sanitization
- ✅ Add authentication
- ✅ Use environment variables
- ✅ Move to PostgreSQL/MySQL
- ✅ Add HTTPS
- ✅ Rate limiting
- ✅ Data encryption

## 📦 Dependencies

```json
{
  "express": "Web server framework",
  "sqlite3": "Database driver",
  "sqlite": "Database wrapper",
  "cors": "Cross-origin resource sharing",
  "body-parser": "Parse JSON requests",
  "html-pdf-node": "PDF generation library",
  "nodemailer": "Email notifications (optional)",
  "dotenv": "Environment variables"
}
```

## 🎯 Future Enhancements

- [ ] Email notifications on order confirmation
- [ ] Payment gateway integration
- [ ] User authentication system
- [ ] Admin dashboard
- [ ] Order tracking
- [ ] Bulk order export
- [ ] Multi-language support
- [ ] SMS notifications

## 📝 License

Copyright © 2025 AgriGro India. All rights reserved.

## 💬 Support

If you need help:
1. Check QUICK_START.md for quick answers
2. Read SETUP_GUIDE.md for detailed info
3. Check console for error messages
4. Verify all files exist in the directory

---

**All files are now properly linked together! 🎉**

Start with: `npm start` then open `http://localhost:3000/order.html`
