# 🚀 Quick Start Guide

## Start the Backend Server

### Option 1: Using Batch File (Easiest)
```bash
# Double-click this file:
backend\start.bat
```

### Option 2: Using Command Line
```bash
cd backend
node src\server.js
```

**Expected Output:**
```
Initializing database...
✓ Connected to SQLite database: C:\Users\Admin\Desktop\lego-store\backend\users.db
✓ Database initialized
✓ Server running on http://localhost:3000
```

---

## Test the System

### Option 1: Use Test Page (Recommended)
1. Open `test-order-api.html` in your browser
2. Click buttons in order:
   - ✅ Check Backend
   - ✅ Login (use default credentials)
   - ✅ Get Products
   - ✅ Create Order (use Product ID: 2)
   - ✅ Get Orders

### Option 2: Use Main Application
1. Open `index.html` in your browser
2. Click "Login" (top right)
3. Login with:
   - Email: `test@example.com`
   - Password: `password123`
4. Browse products and add to cart
5. Click cart icon → "Checkout Securely"
6. Order should be created! ✅

---

## Default Test Accounts

### Regular User
- **Email**: `test@example.com`
- **Password**: `password123`

### Admin User
- **Email**: `admin@playarena.local`
- **Password**: `Admin123!`

---

## Available Products

| ID | Name | Price | Stock |
|----|------|-------|-------|
| 2 | Tubor | $10 | 12 |
| 3 | STARWAR - Hero race | $25 | 3 |
| 4 | STARWAR - Evil race | $25 | 38 |
| 5 | Minecraft - V1 | $30 | 40 |
| 6 | Avenger - Kid war (limited) | $99 | 2 |

---

## API Endpoints

### Public Endpoints
- `GET /products` - Get all products
- `POST /register` - Register new user
- `POST /login` - Login user

### Protected Endpoints (Require Token)
- `GET /profile` - Get user profile
- `POST /orders` - Create order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details

### Admin Endpoints (Require Admin Role)
- `GET /admin/orders` - Get all orders
- `PATCH /admin/orders/:id/status` - Update order status
- `POST /admin/products` - Create product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product

---

## Common Issues

### ❌ "Database connection error: SQLITE_CANTOPEN"
**Solution**: Make sure you're in the `backend` directory when running the server
```bash
cd backend
node src\server.js
```

### ❌ "Port 3000 is already in use"
**Solution**: Kill the existing process
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### ❌ "Some products were not found"
**Solution**: Use valid product IDs (2, 3, 4, 5, or 6)

### ❌ "Unauthorized" or "Please login"
**Solution**: Login first to get authentication token

---

## File Structure

```
lego-store/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── repositories/   # Database queries
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helpers
│   │   └── server.js       # Entry point
│   ├── users.db            # SQLite database
│   ├── start.bat           # Startup script
│   └── package.json
├── images/                 # Product images
├── *.html                  # Frontend pages
├── test-order-api.html     # API testing tool
└── Documentation files
```

---

## Next Steps

1. ✅ Start backend server
2. ✅ Test with `test-order-api.html`
3. ✅ Login to main application
4. ✅ Add products to cart
5. ✅ Complete checkout
6. ✅ View orders in order history

---

## Need Help?

- **Setup Issues**: Read `SETUP_GUIDE.md`
- **Payment Issues**: Read `PAYMENT_FIX.md`
- **Testing Guide**: Read `TEST_PAYMENT_FLOW.md`
- **Troubleshooting**: Read `TROUBLESHOOTING.md`
- **All Documentation**: Read `DOCUMENTATION_INDEX.md`

---

**Version**: 2.0.1  
**Last Updated**: May 14, 2026  
**Status**: Ready to use! ✅
