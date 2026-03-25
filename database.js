const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const path = require('path');

let db;

async function initializeDatabase() {
    db = await sqlite.open({
        filename: path.join(__dirname, 'Phoenix Plants Lifesaver Pvt. Ltd..db'),
        driver: sqlite3.Database
    });

    // Create orders table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT UNIQUE NOT NULL,
            customer_name TEXT NOT NULL,
            mobile TEXT NOT NULL,
            email TEXT,
            address TEXT NOT NULL,
            customer_type TEXT NOT NULL,
            gst TEXT,
            order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            delivery_date TEXT,
            payment_terms TEXT,
            total_items INTEGER DEFAULT 0,
            status TEXT DEFAULT 'pending',
            pdf_path TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Ensure database schema has new columns if DB was created earlier
    const orderColumns = await db.all('PRAGMA table_info(orders)');
    const columnNames = orderColumns.map(c => c.name);
    if (!columnNames.includes('delivery_date')) {
        await db.exec('ALTER TABLE orders ADD COLUMN delivery_date TEXT');
    }
    if (!columnNames.includes('payment_terms')) {
        await db.exec('ALTER TABLE orders ADD COLUMN payment_terms TEXT');
    }

    // Create order_items table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL,
            product_name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            unit TEXT NOT NULL,
            rate REAL DEFAULT 0,
            amount REAL DEFAULT 0,
            FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
        )
    `);

    const itemColumns = await db.all('PRAGMA table_info(order_items)');
    const itemColumnNames = itemColumns.map(c => c.name);
    if (!itemColumnNames.includes('rate')) {
        await db.exec('ALTER TABLE order_items ADD COLUMN rate REAL DEFAULT 0');
    }
    if (!itemColumnNames.includes('amount')) {
        await db.exec('ALTER TABLE order_items ADD COLUMN amount REAL DEFAULT 0');
    }

    console.log('Database initialized successfully');
    return db;
}

function getDb() {
    return db;
}

module.exports = { initializeDatabase, getDb };