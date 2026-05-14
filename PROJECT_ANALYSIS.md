# PLAYARENA - Complete Project Analysis

## 1. What This Web Application Does

**PLAYARENA** is a comprehensive e-commerce Management Information System (MIS) for an online LEGO toy store. It's an academic capstone project that simulates a real-world online retail platform with full product catalog management, customer shopping experience, order processing, and administrative controls.

### Core Purpose
- Enable customers to browse and purchase LEGO building sets online
- Provide administrators with tools to manage inventory, orders, and users
- Demonstrate a complete MIS workflow from product listing to order fulfillment
- Showcase modern web development practices with clean architecture

---

## 2. Main Features of the System

### Customer Features
1. **Product Browsing**
   - View all available LEGO sets with images, prices, and details
   - Filter and sort products by price, theme, and stock status
   - Search functionality for finding specific sets
   - Product quick view modal with detailed information

2. **Shopping Cart**
   - Add products to cart (stored in localStorage)
   - View cart with item details, quantities, and pricing
   - Automatic calculation of subtotal, tax (8%), and shipping
   - Free shipping for orders over $100

3. **Wishlist**
   - Save favorite products for later
   - Toggle items in/out of wishlist
   - Persistent storage across sessions

4. **User Authentication**
   - Register new customer accounts
   - Login with email and password
   - JWT-based secure authentication
   - Password strength indicator during registration
   - Profile management

5. **Order Management**
   - Create orders from cart items
   - View order history
   - Track order status (pending, processing, confirmed, shipped, completed, cancelled)
   - View detailed order information

6. **Payment System**
   - QR code-based payment (VietQR integration)
   - Mock payment flow with transaction references
   - Payment confirmation workflow
   - Bank transfer details display

### Admin Features
1. **Product Management (CRUD)**
   - Create new products with images
   - Edit existing product details
   - Delete products
   - Upload product images via file upload
   - Manage stock levels, pricing, age ratings, and piece counts

2. **Order Management**
   - View all customer orders
   - Update order status
   - Track order details and customer information
   - Monitor pending orders

3. **User Management**
   - View all registered users
   - Change user roles (user ↔ admin)
   - Monitor customer activity

4. **Dashboard & Analytics**
   - Total products count
   - Category/theme tracking
   - Low stock alerts (threshold: 10 units)
   - Pending orders count
   - Recent activity feed

---

## 3. User Flow of the Application

### Customer Journey

```
1. Landing Page (index.html)
   ↓
2. Browse Products (products.html)
   ↓
3. Add to Cart / Wishlist
   ↓
4. View Cart (cart.html)
   ↓
5. Login/Register (login.html) ← Required for checkout
   ↓
6. Checkout → Create Order
   ↓
7. Payment Modal (QR Code Display)
   ↓
8. Confirm Payment
   ↓
9. View Orders (orders.html)
   ↓
10. View Order Details (order-detail.html)
```

### Admin Journey

```
1. Login (login.html) with admin credentials
   ↓
2. Admin Dashboard (admin.html)
   ↓
3. Manage Inventory
   - Add/Edit/Delete Products
   - Monitor Stock Levels
   - Upload Product Images
   ↓
4. Manage Orders
   - View All Orders
   - Update Order Status
   ↓
5. Manage Users
   - View Customer List
   - Change User Roles
```

### Authentication Flow

```
Guest User → Browse Products (Public)
           → Add to Cart (No Auth Required)
           → Checkout → MUST LOGIN
           
Logged In User → Full Shopping Access
                → View Orders
                → Manage Profile

Admin User → All Customer Features
           → Admin Dashboard Access
           → Product Management
           → Order Management
           → User Management
```

---

## 4. Frontend and Backend Architecture

### Frontend Architecture

**Technology Stack:**
- Pure HTML5, CSS3, JavaScript (No frameworks)
- Tailwind CSS (CDN) for styling
- Responsive design (mobile-first approach)
- Client-side routing via HTML pages

**Key Frontend Files:**

| File | Purpose |
|------|---------|
| `index.html` | Landing page with hero section and featured products |
| `products.html` | Product catalog with filtering and sorting |
| `cart.html` | Shopping cart with payment modal |
| `login.html` | Authentication (login/register) |
| `orders.html` | Customer order history |
| `order-detail.html` | Individual order details |
| `admin.html` | Admin dashboard (SPA-like with tabs) |
| `profile.html` | User profile management |
| `wishlist.html` | Saved products |
| `cart-system.js` | Cart management (localStorage) |
| `wishlist.js` | Wishlist functionality |

**Frontend Patterns:**
- **State Management**: localStorage for cart, wishlist, auth tokens
- **API Communication**: Fetch API with async/await
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Try-catch blocks with user-friendly messages
- **UI Updates**: DOM manipulation with vanilla JavaScript

### Backend Architecture

**Technology Stack:**
- Node.js + Express.js
- SQLite3 database
- JWT for authentication
- bcrypt for password hashing
- Multer for file uploads
- CORS enabled

**Architecture Pattern: Layered Architecture**

```
┌─────────────────────────────────────────┐
│         HTTP Request (Client)           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Routes (API Endpoints)          │
│  - auth.routes.js                       │
│  - product.routes.js                    │
│  - order.routes.js                      │
│  - payment.routes.js                    │
│  - admin.routes.js                      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Middleware Layer                │
│  - auth.middleware.js (JWT verify)      │
│  - error.middleware.js (Error handling) │
│  - upload.middleware.js (File uploads)  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Controllers (HTTP Logic)        │
│  - auth.controller.js                   │
│  - product.controller.js                │
│  - order.controller.js                  │
│  - payment.controller.js                │
│  - admin.controller.js                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Services (Business Logic)       │
│  - auth.service.js                      │
│  - product.service.js                   │
│  - order.service.js                     │
│  - payment.service.js                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Repositories (Data Access)      │
│  - user.repository.js                   │
│  - product.repository.js                │
│  - order.repository.js                  │
│  - order-item.repository.js             │
│  - payment.repository.js                │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Database (SQLite)               │
│  - users.db                             │
└─────────────────────────────────────────┘
```

**Key Backend Components:**

1. **Server Entry Point** (`backend/src/server.js`)
   - Initializes database connection
   - Starts Express server
   - Handles graceful shutdown

2. **Application Configuration** (`backend/src/app.js`)
   - Configures middleware (CORS, body parsers)
   - Mounts routes
   - Serves static files
   - Error handling

3. **Configuration** (`backend/src/config/`)
   - `constants.js`: Environment variables and app constants
   - `database.js`: SQLite connection and promisified methods

4. **Routes** (`backend/src/routes/`)
   - Define API endpoints
   - Apply middleware (authentication, validation)
   - Map to controller methods

5. **Controllers** (`backend/src/controllers/`)
   - Handle HTTP requests/responses
   - Input validation
   - Call service layer
   - Format responses using ResponseHelper

6. **Services** (`backend/src/services/`)
   - Business logic implementation
   - Transaction management
   - Data validation and transformation
   - Coordinate between repositories

7. **Repositories** (`backend/src/repositories/`)
   - Direct database access
   - SQL query execution
   - Data mapping

8. **Middleware** (`backend/src/middleware/`)
   - Authentication (JWT verification)
   - Authorization (admin checks)
   - Error handling
   - File upload processing

9. **Utils** (`backend/src/utils/`)
   - Response helper (standardized API responses)
   - Database initialization

---

## 5. Existing Database Structure

### Database: SQLite (`backend/users.db`)

**Schema Overview:**

```sql
-- Users Table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,  -- bcrypt hashed
  role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin'))
);

-- Products Table
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL CHECK(price >= 0),
  image_url TEXT,
  age_min INTEGER CHECK(age_min >= 0),
  pieces INTEGER CHECK(pieces >= 0),
  theme TEXT DEFAULT 'Classic',
  stock INTEGER DEFAULT 0 CHECK(stock >= 0),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  subtotal REAL NOT NULL CHECK(subtotal >= 0),
  tax REAL NOT NULL CHECK(tax >= 0),
  shipping REAL NOT NULL CHECK(shipping >= 0),
  total REAL NOT NULL CHECK(total >= 0),
  status TEXT DEFAULT 'pending' CHECK(status IN (
    'pending', 'processing', 'confirmed', 
    'shipped', 'completed', 'cancelled'
  )),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id TEXT,
  name TEXT NOT NULL,
  price REAL NOT NULL CHECK(price >= 0),
  qty INTEGER NOT NULL CHECK(qty > 0),
  image_url TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Payment Transactions Table
CREATE TABLE payment_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  tx_ref TEXT UNIQUE NOT NULL,  -- Transaction reference
  method TEXT DEFAULT 'qr',
  amount REAL NOT NULL CHECK(amount > 0),
  qr_payload TEXT,
  qr_text TEXT,
  qr_expires_at TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN (
    'pending', 'processing', 'paid', 'failed', 'cancelled'
  )),
  paid_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

**Indexes:**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_created ON products(created_at DESC);
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payment_tx_ref ON payment_transactions(tx_ref);
CREATE INDEX idx_payment_order ON payment_transactions(order_id);
```

**Relationships:**
- `orders.user_id` → `users.id` (Many-to-One)
- `order_items.order_id` → `orders.id` (Many-to-One, CASCADE DELETE)
- `payment_transactions.order_id` → `orders.id` (One-to-One)

**Default Data:**
- Admin account created on first run:
  - Email: `admin@playarena.local`
  - Password: `Admin123!`
  - Role: `admin`

---

## 6. Authentication Flow

### Registration Flow

```
1. User submits email + password (login.html)
   ↓
2. Frontend validates input (client-side)
   ↓
3. POST /register
   ↓
4. auth.controller.register()
   ↓
5. auth.service.register()
   - Check if user exists (userRepository.findByEmail)
   - Hash password with bcrypt (10 rounds)
   - Create user (userRepository.create)
   - Default role: 'user'
   ↓
6. Return success message
   ↓
7. User redirected to login form
```

### Login Flow

```
1. User submits email + password
   ↓
2. POST /login
   ↓
3. auth.controller.login()
   ↓
4. auth.service.login()
   - Find user by email (userRepository.findByEmail)
   - Verify password with bcrypt.compare()
   - Generate JWT token (payload: id, email, role)
   - Token expires in 7 days
   ↓
5. Return { token, role, user }
   ↓
6. Frontend stores in localStorage:
   - token
   - role
   - userEmail
   ↓
7. Redirect based on role:
   - admin → admin.html
   - user → index.html
```

### Protected Route Access

```
1. User makes request to protected endpoint
   ↓
2. Include header: Authorization: Bearer <token>
   ↓
3. auth.middleware.authenticate()
   - Extract token from header
   - Verify token with JWT_SECRET
   - Decode payload (id, email, role)
   - Attach to req.user
   ↓
4. For admin routes: auth.middleware.requireAdmin()
   - Fetch user from database
   - Check if role === 'admin'
   - Return 403 if not admin
   ↓
5. Proceed to controller
```

### JWT Token Structure

```javascript
// Payload
{
  id: 1,
  email: "user@example.com",
  role: "user",
  iat: 1234567890,  // Issued at
  exp: 1234567890   // Expires at (7 days)
}

// Signed with JWT_SECRET from .env
```

### Security Features

1. **Password Hashing**: bcrypt with 10 rounds
2. **JWT Tokens**: Signed with secret key
3. **Token Expiration**: 7 days
4. **Role-Based Access Control**: user vs admin
5. **Input Validation**: Email and password requirements
6. **CORS Protection**: Configured origins
7. **SQL Injection Prevention**: Parameterized queries

---

## 7. Payment-Related Logic

### Payment Flow Overview

```
1. Customer adds items to cart (localStorage)
   ↓
2. Customer clicks "Checkout Securely"
   ↓
3. System checks authentication
   ↓
4. POST /orders with cart items
   ↓
5. Backend creates order + payment transaction
   ↓
6. Generate QR code and transaction reference
   ↓
7. Display payment modal with QR code
   ↓
8. Customer scans QR and transfers money
   ↓
9. Customer clicks "I've Transferred"
   ↓
10. POST /payments/:txRef/confirm
   ↓
11. Backend verifies and confirms payment
   ↓
12. Update order status to 'confirmed'
   ↓
13. Decrement product stock
   ↓
14. Clear cart and show success
```

### Order Creation Process

**Endpoint**: `POST /orders`

**Request Body**:
```json
{
  "items": [
    { "productId": "1", "qty": 2 },
    { "productId": "5", "qty": 1 }
  ]
}
```

**Backend Process** (`order.service.createOrder`):

1. **Normalize Items**
   - Validate product IDs and quantities
   - Filter out invalid items

2. **Fetch Products**
   - Get product details from database
   - Verify all products exist

3. **Stock Validation**
   - Check if sufficient stock available
   - Throw error if not enough stock

4. **Calculate Totals**
   ```javascript
   subtotal = sum(price × qty)
   tax = subtotal × 0.08  // 8% tax
   shipping = subtotal > $100 ? $0 : $10
   total = subtotal + tax + shipping
   ```

5. **Begin Database Transaction**

6. **Create Order Record**
   ```sql
   INSERT INTO orders (user_id, subtotal, tax, shipping, total, status)
   VALUES (?, ?, ?, ?, ?, 'pending')
   ```

7. **Create Order Items**
   ```sql
   INSERT INTO order_items (order_id, product_id, name, price, qty, image_url)
   VALUES (?, ?, ?, ?, ?, ?)
   ```

8. **Generate Payment Data**
   - Transaction reference: `TX-<random_hex>`
   - QR expiration: current time + 30 minutes
   - QR payload: Base64 encoded JSON
   - QR text: `playarena://pay?payload=<encoded>`

9. **Create Payment Transaction**
   ```sql
   INSERT INTO payment_transactions 
   (order_id, tx_ref, method, amount, qr_payload, qr_text, qr_expires_at, status)
   VALUES (?, ?, 'qr', ?, ?, ?, ?, 'pending')
   ```

10. **Commit Transaction**

11. **Return Response**
    ```json
    {
      "success": true,
      "message": "Order created. Awaiting payment.",
      "data": {
        "order": {
          "id": 123,
          "subtotal": 150.00,
          "tax": 12.00,
          "shipping": 0.00,
          "total": 162.00,
          "status": "pending"
        },
        "payment": {
          "id": 456,
          "tx_ref": "TX-a1b2c3d4e5f6",
          "method": "qr",
          "amount": 162.00,
          "status": "pending",
          "qr_payload": "eyJ...base64...",
          "qr_text": "playarena://pay?payload=...",
          "qr_expires_at": "2026-05-14T12:30:00.000Z"
        }
      }
    }
    ```

### Payment Confirmation Process

**Endpoint**: `POST /payments/:txRef/confirm`

**Backend Process** (`payment.service.confirmPayment`):

1. **Find Transaction**
   ```sql
   SELECT * FROM payment_transactions WHERE tx_ref = ?
   ```

2. **Validate Transaction**
   - Check if transaction exists
   - Check if status is 'pending'
   - Return early if already paid

3. **Begin Database Transaction**

4. **Get Order Items with Stock**
   ```sql
   SELECT oi.product_id, oi.qty, p.stock, p.name
   FROM order_items oi
   JOIN products p ON p.id = oi.product_id
   WHERE oi.order_id = ?
   ```

5. **Verify Stock Availability**
   - For each item, check: `stock >= qty`
   - Throw error if insufficient stock

6. **Mark Payment as Paid**
   ```sql
   UPDATE payment_transactions
   SET status = 'paid', paid_at = CURRENT_TIMESTAMP
   WHERE id = ?
   ```

7. **Update Order Status**
   ```sql
   UPDATE orders
   SET status = 'confirmed'
   WHERE id = ?
   ```

8. **Decrement Product Stock**
   ```sql
   UPDATE products
   SET stock = stock - ?
   WHERE id = ?
   ```

9. **Commit Transaction**

10. **Return Success**
    ```json
    {
      "success": true,
      "message": "Payment confirmed",
      "data": {
        "tx_ref": "TX-a1b2c3d4e5f6",
        "order_id": 123,
        "order_status": "confirmed"
      }
    }
    ```

### QR Code Generation

**VietQR Integration**:
```javascript
const qrUrl = "https://img.vietqr.io/image/BIDV-2601601784-compact2.png"
  + "?amount=" + totalVND
  + "&addInfo=" + encodeURIComponent(txRef)
  + "&accountName=" + encodeURIComponent("NGUYEN QUANG BAO");
```

**Parameters**:
- Bank: BIDV (Vietnam Bank for Investment and Development)
- Account Number: 2601601784
- Account Name: NGUYEN QUANG BAO
- Amount: Total in VND (USD × 25,000)
- Reference: Transaction reference (TX-...)

### Payment Constants

```javascript
TAX_RATE = 0.08              // 8% tax
SHIPPING_THRESHOLD = 100     // Free shipping over $100
SHIPPING_COST = 10           // $10 flat rate
QR_EXPIRE_MINUTES = 30       // QR code expires in 30 minutes
VND_RATE = 25000             // 1 USD = 25,000 VND
```

### Payment Webhook (Optional)

**Endpoint**: `POST /payments/webhook`

**Purpose**: Receive payment status updates from payment gateway

**Request Body**:
```json
{
  "tx_ref": "TX-a1b2c3d4e5f6",
  "status": "paid"  // or "failed", "cancelled"
}
```

**Process**:
- If status is "paid": Call `confirmPayment()`
- If status is "failed" or "cancelled": Update transaction status

---

## 8. System Summary

### Project Overview

**PLAYARENA** is a production-ready, full-stack e-commerce MIS built for academic purposes. It demonstrates:

- **Clean Architecture**: Separation of concerns with layered design
- **Modern Practices**: RESTful API, JWT authentication, responsive design
- **Complete Workflow**: From product browsing to order fulfillment
- **Admin Controls**: Full CRUD operations and business analytics
- **Security**: Password hashing, token-based auth, input validation
- **Scalability**: Modular codebase with 30+ organized files

### Technology Summary

| Layer | Technologies |
|-------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite3 |
| **Authentication** | JWT, bcrypt |
| **File Upload** | Multer |
| **Payment** | VietQR (mock integration) |

### Key Metrics

- **30+ modular files** (refactored from 1 monolithic file)
- **5 database tables** with proper relationships
- **20+ API endpoints** (public + protected)
- **2 user roles** (customer + admin)
- **100% backward compatible** frontend
- **Production-ready** code structure

### API Endpoints Summary

**Public Endpoints**:
- `POST /register` - User registration
- `POST /login` - User login
- `GET /products` - List all products
- `GET /products/:id` - Get product details

**Protected Endpoints (User)**:
- `GET /profile` - Get user profile
- `POST /change-password` - Change password
- `POST /orders` - Create order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details

**Protected Endpoints (Admin)**:
- `GET /admin/users` - List all users
- `PATCH /admin/users/:id/role` - Update user role
- `GET /admin/orders` - List all orders
- `PATCH /admin/orders/:id/status` - Update order status
- `POST /admin/products` - Create product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product

**Payment Endpoints**:
- `POST /payments/:txRef/confirm` - Confirm payment
- `POST /payments/webhook` - Payment webhook

### File Structure

```
lego-store/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── repositories/    # Database access layer
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic layer
│   │   ├── utils/           # Helper functions
│   │   ├── app.js           # Express app configuration
│   │   └── server.js        # Server entry point
│   ├── uploads/             # Product images
│   └── users.db             # SQLite database
├── images/                  # Frontend images
├── index.html               # Landing page
├── products.html            # Product catalog
├── cart.html                # Shopping cart
├── login.html               # Authentication
├── admin.html               # Admin dashboard
├── orders.html              # Order history
├── profile.html             # User profile
├── wishlist.html            # Saved products
├── cart-system.js           # Cart management
├── wishlist.js              # Wishlist functionality
├── .env                     # Environment variables
├── package.json             # Dependencies
└── README.md                # Documentation
```

### Development vs Production

**Current State**: Development-ready with production-quality code

**For Production Deployment**:
1. Change `JWT_SECRET` to a strong random value
2. Use PostgreSQL/MySQL instead of SQLite
3. Implement real payment gateway integration
4. Add HTTPS/SSL certificates
5. Set up proper logging and monitoring
6. Implement rate limiting
7. Add email notifications
8. Set up CDN for static assets
9. Implement proper backup strategy
10. Add comprehensive error tracking

### Team Allocation

| Member | Responsibilities |
|--------|-----------------|
| Nguyen Quang Bao | Business requirements, documentation, final report |
| Dau Khanh Linh | UI/UX design, Tailwind styling, navigation |
| Nguyen Thanh Dung | Cart, wishlist, checkout features |
| Nguyen Duc Hiep | Backend core, JWT auth, middleware |
| Nguyen Minh Tung | Orders backend, admin APIs |
| [Member 6] | Admin UI, API testing, demo presentation |

### Version History

- **v1.0**: Monolithic backend (single file)
- **v2.0**: Complete refactoring with layered architecture
  - 30+ modular files
  - Clean separation of concerns
  - Environment-based configuration
  - Enhanced security
  - Production-ready structure

---

## Conclusion

PLAYARENA is a well-architected, feature-complete e-commerce MIS that demonstrates professional software development practices. The system successfully implements:

✅ Complete shopping workflow (browse → cart → checkout → payment → orders)  
✅ Secure authentication and authorization  
✅ Admin dashboard with full CRUD operations  
✅ Clean, maintainable codebase with separation of concerns  
✅ Responsive, modern UI with excellent UX  
✅ RESTful API design with standardized responses  
✅ Database design with proper relationships and constraints  
✅ Mock payment integration with QR codes  
✅ Comprehensive documentation  

The project serves as an excellent example of a capstone MIS project and could be extended for real-world deployment with minimal modifications.
