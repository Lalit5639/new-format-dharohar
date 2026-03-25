const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { initializeDatabase, getDb } = require('./database');
const pdf = require('html-pdf-node');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // ✅ Serve all static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Initialize database
let db;
initializeDatabase().then(database => {
    db = database;
    console.log('Database connected');
});

// Generate PDF from HTML
async function generatePDF(orderData, orderId) {
    console.log('generatePDF called with orderId:', orderId);
    console.log('orderData:', JSON.stringify(orderData, null, 2));
    
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Order Confirmation - ${orderId}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Arial', sans-serif;
                    padding: 20px;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    font-size: 12px;
                    line-height: 1.4;
                    color: #333;
                }
                .order-container {
                    max-width: 100%;
                    margin: 0 auto;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    text-align: center;
                    padding: 20px;
                    background: linear-gradient(135deg, #0A5C2E, #064520);
                    color: white;
                    position: relative;
                }
                .header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.1)"/></svg>') no-repeat center;
                    background-size: 200px;
                    opacity: 0.3;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: bold;
                    position: relative;
                    z-index: 1;
                }
                .header p {
                    font-size: 14px;
                    margin-top: 5px;
                    position: relative;
                    z-index: 1;
                }
                .order-id {
                    background: linear-gradient(135deg, #E8F3EC, #d4edda);
                    padding: 10px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 15px;
                    font-size: 14px;
                    font-weight: bold;
                    border: 2px solid #28a745;
                }
                .section {
                    margin: 15px;
                    margin-bottom: 20px;
                    page-break-inside: avoid;
                    background: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    overflow: hidden;
                }
                .section-title {
                    background: linear-gradient(135deg, #0A5C2E, #064520);
                    color: white;
                    padding: 10px 15px;
                    font-size: 14px;
                    font-weight: bold;
                    border-bottom: 2px solid #28a745;
                }
                .info-grid {
                    padding: 15px;
                    background: white;
                }
                .info-row {
                    display: flex;
                    padding: 8px 0;
                    border-bottom: 1px solid #e9ecef;
                    font-size: 12px;
                }
                .info-row:last-child {
                    border-bottom: none;
                }
                .info-label {
                    font-weight: bold;
                    width: 140px;
                    flex-shrink: 0;
                    color: #495057;
                }
                .info-value {
                    flex: 1;
                    color: #212529;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                    margin-top: 10px;
                    background: white;
                }
                th, td {
                    border: 1px solid #dee2e6;
                    padding: 10px;
                    text-align: left;
                }
                th {
                    background: linear-gradient(135deg, #E8F3EC, #d4edda);
                    font-weight: bold;
                    color: #0A5C2E;
                }
                .terms-section {
                    background: linear-gradient(135deg, #F0FFF4, #e8f5e8);
                    padding: 15px;
                    border: 2px solid #C9EAD9;
                    border-radius: 8px;
                    margin: 15px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .terms-title {
                    color: #0A5C2E;
                    margin-bottom: 10px;
                    font-size: 14px;
                    font-weight: bold;
                }
                .terms-list {
                    margin: 0;
                    padding-left: 20px;
                    color: #2e4c33;
                    font-size: 11px;
                    line-height: 1.4;
                }
                .terms-list li {
                    margin-bottom: 5px;
                }
                .sign-lines {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 20px;
                    font-size: 12px;
                    padding: 10px;
                    background: white;
                    border-radius: 8px;
                    border: 1px solid #dee2e6;
                }
                .stamp-section {
                    text-align: center;
                    margin-top: 10px;
                }
                .stamp-image {
                    width: 120px;
                    height: 80px;
                    border: 2px dashed #28a745;
                    border-radius: 8px;
                    display: inline-block;
                    background: #f8f9fa;
                    position: relative;
                }
                .stamp-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    border-radius: 6px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    padding: 15px;
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border-top: 2px solid #dee2e6;
                    font-size: 11px;
                    color: #6c757d;
                    line-height: 1.4;
                }
                .status-badge {
                    display: inline-block;
                    padding: 5px 15px;
                    background: linear-gradient(135deg, #FFC107, #ffb300);
                    color: #000;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: bold;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
            </style>
        </head>
        <body>
            <div class="order-container">
                <div class="header">
                    <h1>Phoenix Plants Lifesaver Pvt. Ltd.</h1>
                    <p>शुद्धता एवं समृद्धि का प्रतीक...!</p>
                </div>

                <div class="order-id">
                    <strong>📋 Order ID: ${orderId}</strong>
                </div>

                <div class="section" style="margin-bottom: 8px;">
                    <div class="section-title">📋 Order Information</div>
                    <table style="width:100%; border-collapse:collapse; border:none; font-size:13px; font-weight:600;">
                        <thead>
                            <tr style="background: #f0f8f2; color:#0A5C2E;">
                                <th style="padding:10px; border:none; text-align:center;">PARTY TYPE</th>
                                <th style="padding:10px; border:none; text-align:center;">ORDER DATE</th>
                                <th style="padding:10px; border:none; text-align:center;">DELIVERY DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="background:#FFFFFF; color:#1F2A1E;">
                                <td style="padding:10px; border:none; text-align:center; height:50px; font-weight:normal;">${orderData.customerType || 'Dealer'}</td>
                                <td style="padding:10px; border:none; text-align:center; height:50px; font-weight:normal;">${orderData.orderDate || 'N/A'}</td>
                                <td style="padding:10px; border:none; text-align:center; height:50px; font-weight:normal;">${orderData.deliveryDate || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="section">
                    <div class="section-title">👤 Customer Details</div>
                    <div class="info-grid">
                        <div class="info-row">
                            <div class="info-label">Name:</div>
                            <div class="info-value">${escapeHtml(orderData.customerName)}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Mobile:</div>
                            <div class="info-value">${orderData.mobile}</div>
                        </div>
                        ${orderData.email ? `<div class="info-row">
                            <div class="info-label">Email:</div>
                            <div class="info-value">${orderData.email}</div>
                        </div>` : ''}
                        <div class="info-row">
                            <div class="info-label">Address:</div>
                            <div class="info-value">${escapeHtml(orderData.address)}</div>
                        </div>
                        ${orderData.gst ? `<div class="info-row">
                            <div class="info-label">GST Number:</div>
                            <div class="info-value">${orderData.gst}</div>
                        </div>` : ''}
                        <div class="info-row">
                            <div class="info-label">Payment Terms:</div>
                            <div class="info-value">${escapeHtml(orderData.paymentTerms || 'N/A')}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">🛒 Order Items</div>
                    <table>
                        <thead>
                            <tr><th>#</th><th>Product</th><th>Quantity</th><th>Unit</th><th>Rate (₹)</th><th>Amount (₹)</th></tr>
                        </thead>
                        <tbody>
                            ${orderData.products.map((product, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${escapeHtml(product.name)}</td>
                                    <td>${product.quantity}</td>
                                    <td>${product.unit}</td>
                                    <td>${parseFloat(product.rate || 0).toFixed(2)}</td>
                                    <td>${parseFloat(product.total || (product.quantity * product.rate)).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="5" style="text-align: right; font-weight: bold;">Grand Total</td>
                                <td style="font-weight: bold;">₹ ${orderData.orderTotal ? escapeHtml(orderData.orderTotal) : orderData.products.reduce((sum,p)=>sum + ((p.total || p.quantity * p.rate)||0),0).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div class="terms-section">
                    <h3 class="terms-title">📜 Terms & Conditions</h3>
                    <ol class="terms-list">
                        <li>Give information about leakage and damaged material within 7 days of receiving material; after that buyer will be responsible for situation of goods.</li>
                        <li>No sale return is accepted without prior permission of management.</li>
                        <li>Freight should be paid on delivery of goods.</li>
                        <li>Prices mentioned on order form are calculated according to cash discount table of price list.</li>
                        <li>Payment terms are subject to designation of buyer and prices coated by company official.</li>
                    </ol>
                    <div class="sign-lines">
                        <div>
                            <strong>Business Owner Sign:</strong> _______________________
                        </div>
                        <div class="stamp-section">
                            <strong>Company Stamp:</strong><br>
                            <div class="stamp-image">
                                <img src="/stamp.svg" alt="Company Stamp" onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=color:#999;>Stamp Here</span>';">
                            </div>
                        </div>
                        <div>
                            <strong>RDM/ZM Sign:</strong> _______________________
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p>Status: <span class="status-badge">Pending Confirmation</span></p>
                    <p>Note: Final pricing and availability will be confirmed by our sales team within 24 hours.</p>
                    <p>© 2019 Phoenix Plants Lifesaver Pvt. Ltd. - Trusted Fertilizer Partner | Growing Together 🌱</p>
                </div>
            </div>
        </body>
        </html>
    `;

    console.log('HTML content length:', htmlContent.length);
    console.log('HTML content preview:', htmlContent.substring(0, 500));

    const options = {
        format: 'A4',
        margin: { top: '10px', right: '10px', bottom: '10px', left: '10px' },
        printBackground: true,
        landscape: false,
        preferCSSPageSize: true
    };

    console.log('Generating PDF with options:', options);
    const file = { content: htmlContent };
    const pdfBuffer = await pdf.generatePdf(file, options);
    console.log('PDF buffer length:', pdfBuffer.length);
    
    const filename = `order_${orderId}_${Date.now()}.pdf`;
    const filepath = path.join(__dirname, 'uploads', filename);
    fs.writeFileSync(filepath, pdfBuffer);
    console.log('PDF saved to:', filepath);
    
    return { filename, filepath, pdfBuffer };
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// API Routes

// Save Order
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        const orderId = `AGRO-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000)}`;
        
        // Generate PDF
        const { filename, filepath } = await generatePDF(orderData, orderId);
        
        // Save to database
        const totalItems = orderData.products.length;
        
        await db.run(
            `INSERT INTO orders (order_id, customer_name, mobile, email, address, customer_type, gst, order_date, delivery_date, payment_terms, total_items, pdf_path, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [orderId, orderData.customerName, orderData.mobile, orderData.email,
             orderData.address, orderData.customerType, orderData.gst, orderData.orderDate || new Date().toISOString(),
             orderData.deliveryDate || null, orderData.paymentTerms || null, totalItems, filename, 'pending']
        );
        
        // Save order items
        for (const product of orderData.products) {
            await db.run(
                `INSERT INTO order_items (order_id, product_name, quantity, unit, rate, amount)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId, product.name, product.quantity, product.unit, product.rate, product.total]
            );
        }
        
        res.json({
            success: true,
            orderId: orderId,
            pdfUrl: `/uploads/${filename}`,
            message: 'Order saved successfully'
        });
        
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Generate PDF from existing DB order
app.get('/api/orders/:orderId/pdf', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await db.get('SELECT * FROM orders WHERE order_id = ?', [orderId]);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        const products = await db.all('SELECT product_name AS name, quantity, unit, rate, amount as total FROM order_items WHERE order_id = ?', [orderId]);

        const orderData = {
            orderId: order.order_id,
            orderDate: order.order_date ? new Date(order.order_date).toLocaleDateString('en-IN') : '',
            deliveryDate: order.delivery_date || '',
            customerName: order.customer_name,
            mobile: order.mobile,
            email: order.email,
            address: order.address,
            customerType: order.customer_type,
            gst: order.gst,
            paymentTerms: order.payment_terms,
            products: products,
            orderTotal: products.reduce((sum, p) => sum + parseFloat(p.total || 0), 0).toFixed(2)
        };

        const { filename, filepath } = await generatePDF(orderData, orderId);
        await db.run('UPDATE orders SET pdf_path = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?', [filename, orderId]);

        res.download(filepath, filename);
    } catch (error) {
        console.error('Error generating PDF from DB:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get All Orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await db.all(`
            SELECT o.*, 
                   GROUP_CONCAT(oi.product_name || ' (' || oi.quantity || ' ' || oi.unit || ')') as products_list
            FROM orders o
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            GROUP BY o.order_id
            ORDER BY o.created_at DESC
        `);
        
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Single Order
app.get('/api/orders/:orderId', async (req, res) => {
    try {
        const order = await db.get(
            'SELECT * FROM orders WHERE order_id = ?',
            [req.params.orderId]
        );
        
        if (order) {
            const items = await db.all(
                'SELECT * FROM order_items WHERE order_id = ?',
                [req.params.orderId]
            );
            order.items = items;
            res.json({ success: true, order });
        } else {
            res.json({ success: false, error: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update Order Status
app.patch('/api/orders/:orderId/status', async (req, res) => {
    try {
        const { status } = req.body;
        await db.run(
            'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
            [status, req.params.orderId]
        );
        
        res.json({ success: true, message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete Order
app.delete('/api/orders/:orderId', async (req, res) => {
    try {
        // Get PDF path to delete file
        const order = await db.get('SELECT pdf_path FROM orders WHERE order_id = ?', [req.params.orderId]);
        if (order && order.pdf_path) {
            const filepath = path.join(__dirname, 'uploads', order.pdf_path);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }
        
        await db.run('DELETE FROM orders WHERE order_id = ?', [req.params.orderId]);
        
        res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Download PDF
app.get('/api/orders/:orderId/download', async (req, res) => {
    try {
        const order = await db.get('SELECT pdf_path FROM orders WHERE order_id = ?', [req.params.orderId]);
        if (order && order.pdf_path) {
            const filepath = path.join(__dirname, 'uploads', order.pdf_path);
            res.download(filepath);
        } else {
            res.status(404).json({ error: 'PDF not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Statistics
app.get('/api/stats', async (req, res) => {
    try {
        const totalOrders = await db.get('SELECT COUNT(*) as total FROM orders');
        const pendingOrders = await db.get('SELECT COUNT(*) as pending FROM orders WHERE status = "pending"');
        const completedOrders = await db.get('SELECT COUNT(*) as completed FROM orders WHERE status = "completed"');
        
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = await db.get(
            'SELECT COUNT(*) as today FROM orders WHERE DATE(created_at) = ?',
            [today]
        );
        
        res.json({
            success: true,
            stats: {
                total: totalOrders.total,
                pending: pendingOrders.pending,
                completed: completedOrders.completed,
                today: todayOrders.today
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});