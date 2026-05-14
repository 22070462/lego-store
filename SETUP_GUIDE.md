# PLAYARENA - Complete Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `sqlite3` - Database
- `bcrypt` - Password hashing
- `jsonwebtoken` - Authentication
- `cors` - Cross-origin requests
- `multer` - File uploads
- `dotenv` - Environment variables

### Step 2: Verify Environment Configuration

The `.env` file has been created with default values. You can modify it if needed:

```bash
# View current configuration
cat .env

# Or edit with your preferred editor
notepad .env
```

### Step 3: Start the Server

```bash
npm start
```

You should see:

```
✓ Connected to SQLite database
✓ Database tables created
✓ Default admin account ensured
✓ Database initialization complete

╔════════════════════════════════════════════════════════╗
║                                                        ║
║              🎮 PLAYARENA SERVER STARTED 🎮            ║
║                                                        ║
╚════════════════════════════════════════════════════════╝

✓ Environment: development
✓ Server running at: http://localhost:3000
✓ API endpoint: http://localhost:3000/api
✓ Health check: http://localhost:3000/api/health
```

### Step 4: Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html

**Default Admin Credentials:**
- Email: `admin@playarena.local`
- Password: `Admin123!`

---

## 🎯 What's New in Version 2.0

### ✨ Complete Refactoring

The project has been completely refactored from a monolithic architecture to a clean, modular structure:

**Before (v1.0):**
```
backend/
└── server.js (1000+ lines)
```

**After (v2.0):**
```
backend/src/
├── config/          # Configuration
├── controllers/     # HTTP handlers
├── middleware/      # Cross-cutting concerns
├── repositories/    # Database access
├── routes/          # API endpoints
├── services/        # Business logic
└── utils/           # Helpers
```

### 🔥 Key Improvements

1. **Separation of Concerns** - Each component has a single responsibility
2. **Environment Configuration** - All settings in `.env` file
3. **Error Handling** - Centralized and standardized
4. **Security** - Enhanced JWT, bcrypt, input validation
5. **Maintainability** - Small, focused files (50-200 lines each)
6. **Scalability** - Easy to add new features
7. **Testability** - Modular design for easy testing

---

## 📁 Project Structure Explained

```
lego-store/
├── backend/
│   ├── src/                      # NEW: Refactored source code
│   │   ├── config/
│   │   │   ├── constants.js      # Environment variables
│   │   │   └── database.js       # Database connection
│   │   │
│   │   ├── controllers/          # HTTP request handlers
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── payment.controller.js
│   │   │   └── product.controller.js
│   │   │
│   │   ├── middleware/           # Request processing
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── upload.middleware.js
│   │   │
│   │   ├── repositories/         # Database queries
│   │   │   ├── order-item.repository.js
│   │   │   ├── order.repository.js
│   │   │   ├── payment.repository.js
│   │   │   ├── product.repository.js
│   │   │   └── user.repository.js
│   │   │
│   │   ├── routes/               # API endpoints
│   │   │   ├── admin.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── index.js
│   │   │   ├── order.routes.js
│   │   │   ├── payment.routes.js
│   │   │   └── product.routes.js
│   │   │
│   │   ├── services/             # Business logic
│   │   │   ├── auth.service.js
│   │   │   ├── order.service.js
│   │   │   ├── payment.service.js
│   │   │   └── product.service.js
│   │   │
│   │   ├── utils/                # Helper functions
│   │   │   ├── init-database.js
│   │   │   └── response.helper.js
│   │   │
│   │   ├── app.js                # Express app setup
│   │   └── server.js             # Server entry point
│   │
│   ├── server.js                 # LEGACY: Old monolithic file
│   ├── payment-utils.js          # LEGACY: Moved to services
│   └── users.db                  # SQLite database
│
├── images/                       # Product images (static)
├── uploads/                      # User uploads (dynamic)
│
├── Frontend Files:
│   ├── index.html                # Homepage
│   ├── products.html             # Product catalog
│   ├── cart.html                 # Shopping cart
│   ├── login.html                # Authentication
│   ├── admin.html                # Admin dashboard
│   ├── orders.html               # Order history
│   ├── order-detail.html         # Order details
│   ├── profile.html              # User profile
│   ├── wishlist.html             # Saved items
│   ├── about.html                # About page
│   ├── help.html                 # Help page
│   ├── cart-system.js            # Cart logic
│   ├── wishlist.js               # Wishlist logic
│   └── style.css                 # Styles
│
├── Configuration:
│   ├── .env                      # Environment variables
│   ├── .env.example              # Environment template
│   ├── .gitignore                # Git ignore rules
│   ├── package.json              # Dependencies
│   └── README.md                 # Project overview
│
└── Documentation:
    ├── SETUP_GUIDE.md            # This file
    └── REFACTORING_GUIDE.md      # Refactoring details
```

---

## 🔧 Configuration Options

### Environment Variables (.env)

```env
# Server
NODE_ENV=development              # development | production
PORT=3000                         # Server port
HOST=localhost                    # Server host

# Database
DB_PATH=./backend/users.db        # SQLite database path

# Authentication
JWT_SECRET=your-secret-key        # Change in production!
JWT_EXPIRES_IN=24h                # Token expiration
BCRYPT_ROUNDS=10                  # Password hashing rounds

# Admin Account
DEFAULT_ADMIN_EMAIL=admin@playarena.local
DEFAULT_ADMIN_PASSWORD=Admin123!

# Payment
TAX_RATE=0.08                     # 8% tax
SHIPPING_THRESHOLD=100            # Free shipping over $100
SHIPPING_COST=10                  # Flat shipping cost
QR_EXPIRE_MINUTES=15              # QR code expiration

# File Upload
UPLOAD_DIR=./uploads              # Upload directory
MAX_FILE_SIZE=5242880             # 5MB max file size
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp

# CORS
CORS_ORIGIN=*                     # Allow all origins (change in production)
```

---

## 🧪 Testing the API

### Using cURL

#### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

#### 2. Register User
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"User123!\"}"
```

#### 3. Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"User123!\"}"
```

#### 4. Get Products
```bash
curl http://localhost:3000/products
```

#### 5. Get Profile (requires token)
```bash
curl http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Browser

1. Open http://localhost:3000
2. Click "Shop" to browse products
3. Click "Sign In" to login
4. Use admin credentials to access admin panel

---

## 🎮 User Flows

### Customer Flow

1. **Browse Products** → http://localhost:3000/products.html
2. **Add to Cart** → Click "Add to Cart" on any product
3. **View Cart** → http://localhost:3000/cart.html
4. **Register/Login** → http://localhost:3000/login.html
5. **Checkout** → Click "Checkout Securely"
6. **Payment** → Scan QR code or use bank transfer
7. **View Orders** → http://localhost:3000/orders.html

### Admin Flow

1. **Login as Admin** → http://localhost:3000/login.html
   - Email: `admin@playarena.local`
   - Password: `Admin123!`
2. **Access Dashboard** → http://localhost:3000/admin.html
3. **Manage Products** → Add, edit, delete products
4. **Manage Orders** → View and update order status
5. **Manage Users** → View users and change roles

---

## 🔒 Security Best Practices

### For Development

✅ Current setup is fine for development

### For Production

⚠️ **IMPORTANT**: Before deploying to production:

1. **Change JWT Secret**
   ```env
   JWT_SECRET=use-a-long-random-string-at-least-32-characters
   ```

2. **Change Admin Password**
   ```env
   DEFAULT_ADMIN_PASSWORD=YourStrongPassword123!@#
   ```

3. **Set NODE_ENV**
   ```env
   NODE_ENV=production
   ```

4. **Configure CORS**
   ```env
   CORS_ORIGIN=https://yourdomain.com
   ```

5. **Use HTTPS**
   - Deploy behind a reverse proxy (nginx, Apache)
   - Use SSL certificates (Let's Encrypt)

6. **Database Backup**
   - Regularly backup `backend/users.db`
   - Consider migrating to PostgreSQL/MySQL for production

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'dotenv'"

**Solution:**
```bash
npm install dotenv
```

### Issue: "Port 3000 is already in use"

**Solution 1:** Kill the process using port 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Solution 2:** Change the port in `.env`
```env
PORT=3001
```

### Issue: "Database is locked"

**Solution:**
```bash
# Stop the server (Ctrl+C)
# Delete the database lock file
rm backend/users.db-journal
# Restart the server
npm start
```

### Issue: "Admin login not working"

**Solution:**
```bash
# The database is automatically initialized with admin account
# Default credentials:
# Email: admin@playarena.local
# Password: Admin123!

# If still not working, delete the database and restart:
rm backend/users.db
npm start
```

### Issue: "Images not uploading"

**Solution:**
```bash
# Ensure uploads directory exists
mkdir uploads

# Check permissions (Linux/Mac)
chmod 755 uploads
```

---

## 📊 Database Management

### View Database

```bash
# Install SQLite browser (optional)
# Windows: https://sqlitebrowser.org/
# Mac: brew install --cask db-browser-for-sqlite
# Linux: sudo apt install sqlitebrowser

# Or use command line
sqlite3 backend/users.db
```

### Common SQL Queries

```sql
-- View all users
SELECT * FROM users;

-- View all products
SELECT * FROM products;

-- View all orders
SELECT * FROM orders;

-- Count products by theme
SELECT theme, COUNT(*) FROM products GROUP BY theme;

-- View low stock products
SELECT * FROM products WHERE stock < 10;

-- View pending orders
SELECT * FROM orders WHERE status = 'pending';
```

### Reset Database

```bash
# Delete database
rm backend/users.db

# Restart server (will recreate database)
npm start
```

---

## 🚢 Deployment

### Deploy to Heroku

1. Create `Procfile`:
   ```
   web: npm start
   ```

2. Deploy:
   ```bash
   heroku create playarena
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret-key
   git push heroku main
   ```

### Deploy to VPS (Ubuntu)

1. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

2. Clone and setup:
   ```bash
   git clone <your-repo>
   cd lego-store
   npm install
   ```

3. Use PM2 for process management:
   ```bash
   sudo npm install -g pm2
   pm2 start backend/src/server.js --name playarena
   pm2 startup
   pm2 save
   ```

4. Setup nginx reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 📚 Additional Resources

- **Project README**: `README.md` - Project overview
- **Refactoring Guide**: `REFACTORING_GUIDE.md` - Architecture details
- **API Documentation**: See route files in `backend/src/routes/`
- **Database Schema**: See `backend/src/utils/init-database.js`

---

## 🤝 Support

If you encounter any issues:

1. Check this guide first
2. Review the error messages in the console
3. Check the `REFACTORING_GUIDE.md` for architecture details
4. Ensure all dependencies are installed (`npm install`)
5. Verify `.env` file exists and is configured correctly

---

## 🎉 Success!

If you see the PLAYARENA server started message, you're all set! 🚀

**Next Steps:**
1. Browse products at http://localhost:3000
2. Login as admin to manage the store
3. Create a customer account to test the shopping flow
4. Explore the refactored code structure
5. Start building new features!

Happy coding! 🎮
