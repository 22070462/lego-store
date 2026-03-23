# PLAYARENA — Website bán đồ chơi lắp ráp (LEGO-style)

Đồ án web: cửa hàng trực tuyến với giao diện tĩnh (HTML/CSS/JS), backend Node.js + SQLite, đăng nhập JWT, đặt hàng lưu server, trang quản trị sản phẩm / người dùng / đơn hàng.

## Công nghệ

| Phần | Công nghệ |
|------|-----------|
| Frontend | HTML, Tailwind CSS (CDN), JavaScript |
| Backend | Node.js, Express |
| Cơ sở dữ liệu | SQLite (`backend/users.db`) |
| Xác thực | JWT, bcrypt |

## Yêu cầu môi trường

- [Node.js](https://nodejs.org/) (khuyến nghị bản LTS)

## Cài đặt

Trong thư mục gốc của project:

```bash
npm install
```

## Chạy backend

Luôn chạy từ thư mục **`backend`** (để đường dẫn `users.db` đúng):

```bash
cd backend
node server.js
```

Mặc định API: **http://localhost:3000**

Frontend trong code gọi API qua `http://localhost:3000` — cần bật server trước khi dùng đăng nhập, đăng ký, Shop (tải sản phẩm), trang admin.

## Chạy frontend

- Mở trực tiếp `index.html` (hoặc `login.html`, `products.html`, …) bằng trình duyệt, hoặc  
- Dùng **Live Server** (VS Code / Cursor) để mở thư mục project.

Nếu gặp lỗi CORS khi mở file `file://`, nên dùng Live Server hoặc phục vụ tĩnh qua một HTTP server nhỏ.

## Cơ sở dữ liệu

- File SQLite: **`backend/users.db`** (bảng `users`, `products`, `orders`, `order_items`).
- Tạo schema nhanh (nếu cần): `cd backend` → `node initDb.js`.

## Tài khoản admin

### Cách 1 — Tài khoản tạm (dev)

```bash
cd backend
node seedTempAdmin.js
```

Sau đó đăng nhập bằng email/mật khẩu in ra trong terminal (xem nội dung file `seedTempAdmin.js` nếu cần đổi). **Chỉ dùng lúc phát triển**; đổi hoặc xóa khi deploy.

### Cách 2 — Nâng user đã đăng ký lên admin

1. Đăng ký tài khoản trên web.  
2. Chạy:

```bash
cd backend
node makeAdmin.js email-da-dang-ky@example.com
```

Xem danh sách user: `node checkUsers.js`.

## API (tóm tắt)

| Phương thức | Đường dẫn | Mô tả |
|-------------|-----------|--------|
| POST | `/register` | Đăng ký |
| POST | `/login` | Đăng nhập → trả `token`, `role` |
| GET | `/profile` | Header `Authorization: Bearer <token>` |
| GET | `/products` | Danh sách sản phẩm (public) |
| POST | `/orders` | Đặt hàng (body `items[]`, cần đăng nhập) |
| GET | `/orders` | Danh sách đơn của user hiện tại |
| GET | `/orders/:id` | Chi tiết đơn + dòng sản phẩm (chủ đơn hoặc admin) |
| GET | `/admin/orders` | Tất cả đơn (admin) |
| POST | `/admin/products` | Thêm sản phẩm (admin) |
| PUT | `/admin/products/:id` | Sửa sản phẩm (admin) |
| DELETE | `/admin/products/:id` | Xóa sản phẩm (admin) |
| GET | `/admin/users` | Danh sách user (admin) |
| PATCH | `/admin/users/:id/role` | Đổi role (admin) |

## Cấu trúc thư mục (chính)

```
├── backend/
│   ├── server.js          # API Express
│   ├── users.db           # SQLite (tạo khi chạy server / initDb)
│   ├── initDb.js          # Khởi tạo schema
│   ├── seedTempAdmin.js   # Tạo admin tạm (dev)
│   ├── makeAdmin.js       # Gán role admin cho email có sẵn
│   └── checkUsers.js      # Liệt kê user trong DB
├── index.html
├── products.html
├── cart.html
├── login.html
├── orders.html            # Danh sách đơn (user)
├── order-detail.html      # Chi tiết đơn
├── admin.html             # Trang quản trị
├── cart-system.js
├── wishlist.js
└── package.json
```

## Bảo mật (lưu ý khi nộp bài / deploy)

- JWT `SECRET` trong `server.js` nên chuyển sang biến môi trường (`.env`), không commit secret thật.
- Không đưa mật khẩu thật trong README hoặc public repo.

## Ghi chú

- LEGO® là thương hiệu của LEGO Group. Project mang tính học tập / demo.
- Giỏ hàng lưu trên **localStorage**; khi bấm **Thanh toán** (đã đăng nhập), đơn được gửi lên server và lưu trong SQLite. Xem **Đơn hàng của tôi** (`orders.html`) và **chi tiết** (`order-detail.html?id=`).

---

**PLAYARENA** — demo cửa hàng đồ chơi lắp ráp.
