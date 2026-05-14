# Test Payment Flow - Step by Step Guide

## Prerequisites
✅ Backend server running on port 3000
✅ Test user account created
✅ Products available in database

---

## Test Scenario 1: Complete Order Flow (Happy Path)

### Step 1: Start Backend Server
```bash
cd backend
node src/server.js
```
Expected: Server starts on port 3000

### Step 2: Login
1. Open `http://localhost:3000/login.html` (or open `login.html` directly)
2. Login with test credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Expected: Redirect to profile or home page
4. Expected: Account icon turns yellow (logged in state)

### Step 3: Add Products to Cart
1. Navigate to products page or home page
2. Click "Add to Bag" on 2-3 products
3. Expected: Cart badge shows item count
4. Click cart icon to view cart
5. Expected: Cart page shows all added items

### Step 4: Checkout
1. On cart page, click **"Checkout Securely"** button
2. Expected: Payment modal opens
3. Expected: Button shows "Creating Order..." (loading state)
4. Expected: After 1-2 seconds, modal shows:
   - ✅ Order items list
   - ✅ Price breakdown (Subtotal, Tax, Shipping, Total)
   - ✅ Amount in VND
   - ✅ QR code image
   - ✅ Bank details (BIDV account)
   - ✅ Transaction reference (e.g., "PLAYARENA123456")
   - ✅ "I've Transferred ✓" button (enabled)

### Step 5: Verify Order Created
**Option A: Check Orders Page**
1. Open new tab: `http://localhost:3000/orders.html`
2. Expected: New order appears in list
3. Expected: Order status is "pending"
4. Expected: Order total matches cart total

**Option B: Check Database**
```bash
cd backend
node checkUsers.js
```
Or use SQLite browser to query:
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
SELECT * FROM order_items WHERE order_id = (SELECT MAX(id) FROM orders);
SELECT * FROM payments WHERE order_id = (SELECT MAX(id) FROM orders);
```

### Step 6: Simulate Payment Transfer
1. In payment modal, note the transaction reference
2. In real scenario: User would scan QR code with banking app
3. For testing: Just note the reference number

### Step 7: Confirm Payment
1. Click **"I've Transferred ✓"** button
2. Expected: Success alert shows with order number
3. Expected: Modal closes
4. Expected: Redirect to `orders.html`
5. Expected: Order appears in order history
6. Expected: Cart is now empty (badge shows 0)

### Step 8: View Order Details
1. On orders page, click order number (e.g., "#123")
2. Expected: Redirect to order detail page
3. Expected: Shows:
   - Order items with images
   - Quantities and prices
   - Subtotal, tax, shipping, total
   - Order status
   - Payment information
   - Transaction reference

---

## Test Scenario 2: Not Logged In

### Steps:
1. Logout (clear localStorage or use incognito)
2. Add products to cart
3. Click "Checkout Securely"
4. Expected: Alert "Please login to checkout."
5. Expected: Redirect to login page

---

## Test Scenario 3: Empty Cart

### Steps:
1. Login
2. Clear cart (remove all items)
3. Click "Checkout Securely"
4. Expected: Alert "Your cart is empty. Please add items before checking out."
5. Expected: Modal does not open

---

## Test Scenario 4: Order Creation Failure

### Steps:
1. Stop backend server
2. Login and add products to cart
3. Click "Checkout Securely"
4. Expected: Modal opens with loading state
5. Expected: After timeout, alert shows "Failed to create order: ..."
6. Expected: Modal closes
7. Expected: Cart still has items (not cleared)

---

## Test Scenario 5: Multiple Orders

### Steps:
1. Complete order flow (Scenario 1)
2. Add different products to cart
3. Complete order flow again
4. Navigate to orders page
5. Expected: Both orders appear in list
6. Expected: Each order has unique ID and transaction reference
7. Expected: Orders sorted by date (newest first)

---

## Verification Checklist

### Frontend
- [ ] Payment modal opens when clicking "Checkout Securely"
- [ ] Loading state shows during order creation
- [ ] QR code displays correctly
- [ ] Transaction reference is unique per order
- [ ] Bank details are correct (BIDV account)
- [ ] Amount in VND is calculated correctly (1 USD = 25,000 VND)
- [ ] "I've Transferred ✓" button works
- [ ] Cart is cleared after confirmation
- [ ] Redirect to orders page works
- [ ] Order appears in order history immediately

### Backend
- [ ] `POST /orders` endpoint creates order
- [ ] Order record saved in `orders` table
- [ ] Order items saved in `order_items` table
- [ ] Payment record saved in `payments` table
- [ ] Transaction reference is unique
- [ ] Stock validation works (if product out of stock, order fails)
- [ ] Totals calculated correctly (subtotal, tax, shipping)
- [ ] `GET /orders` returns user's orders
- [ ] `GET /orders/:id` returns order details

### Database
- [ ] Orders table has new record
- [ ] Order status is "pending"
- [ ] Order items table has all cart items
- [ ] Payments table has payment record
- [ ] Payment status is "pending"
- [ ] Transaction reference matches QR code
- [ ] Timestamps are correct

---

## Common Issues & Solutions

### Issue: "Failed to create order"
**Possible Causes:**
- Backend server not running
- Database connection error
- Invalid product IDs in cart
- Product out of stock

**Solution:**
1. Check backend server is running: `netstat -ano | findstr :3000`
2. Check backend logs for errors
3. Verify products exist in database
4. Check product stock levels

### Issue: Order not appearing in order history
**Possible Causes:**
- Not logged in
- Wrong user viewing orders
- Database query error

**Solution:**
1. Verify user is logged in (check localStorage for token)
2. Check backend logs for errors
3. Query database directly to verify order exists

### Issue: QR code not loading
**Possible Causes:**
- VietQR API down
- Invalid bank details
- Network error

**Solution:**
1. Check QR code URL in browser console
2. Verify bank account details are correct
3. Check internet connection

### Issue: Cart not cleared after payment
**Possible Causes:**
- JavaScript error in confirmPayment()
- localStorage not accessible

**Solution:**
1. Check browser console for errors
2. Manually clear: `localStorage.removeItem("cart")`
3. Refresh page

---

## Expected API Responses

### POST /orders (Success)
```json
{
  "success": true,
  "message": "Order created. Awaiting payment.",
  "data": {
    "order": {
      "id": 123,
      "subtotal": 100.00,
      "tax": 8.00,
      "shipping": 0,
      "total": 108.00,
      "status": "pending"
    },
    "payment": {
      "id": 456,
      "tx_ref": "PLAYARENA123456",
      "method": "qr",
      "amount": 108.00,
      "status": "pending",
      "qr_payload": "...",
      "qr_text": "...",
      "qr_expires_at": "2026-05-14T12:00:00Z"
    }
  }
}
```

### POST /orders (Error - Out of Stock)
```json
{
  "success": false,
  "message": "Not enough stock for LEGO Technic Ferrari"
}
```

### GET /orders (Success)
```json
[
  {
    "id": 123,
    "user_id": 1,
    "subtotal": 100.00,
    "tax": 8.00,
    "shipping": 0,
    "total": 108.00,
    "status": "pending",
    "created_at": "2026-05-14 10:30:00",
    "updated_at": "2026-05-14 10:30:00"
  }
]
```

---

## Performance Metrics

- Order creation should complete in < 2 seconds
- QR code should load in < 1 second
- Page redirect should be instant
- Cart clear should be instant

---

## Browser Compatibility

Tested on:
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Edge 120+
- ✅ Safari 17+

---

**Last Updated**: May 14, 2026
**Version**: 2.0.1
