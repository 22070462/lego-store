# Capstone Project 2 — MIS for a Toy Store

**Đề tài:** Hệ thống thông tin quản lý (MIS) hỗ trợ vận hành **cửa hàng đồ chơi trực tuyến** — nghiệp vụ bán lẻ, quản lý danh mục sản phẩm, khách hàng, giỏ hàng/đơn hàng và báo cáo vận hành cơ bản cho quản trị.

**Tên hệ thống demo:** **PLAYARENA** — website bán đồ chơi lắp ráp (phong cách LEGO-style), phục vụ mục đích học tập.

---

## Tổng quan MIS

| Khía cạnh | Mô tả |
|-----------|--------|
| **Đối tượng** | Khách hàng (mua hàng), quản trị viên (sản phẩm, người dùng, đơn) |
| **Luồng dữ liệu** | Giao diện web → API → SQLite (người dùng, sản phẩm, đơn hàng, chi tiết đơn) |
| **Quyết định hỗ trợ** | Theo dõi đơn hàng, quản lý kho danh mục (CRUD), phân quyền user/admin |
| **Công nghệ** | Frontend tĩnh (HTML/CSS/JS), backend Node.js + Express, JWT + bcrypt |

---

## Thành viên nhóm & phân công

*Nhóm cập nhật cột **Họ tên** và **MSSV** theo đúng danh sách lớp.*

| STT | Họ tên | MSSV | Nhiệm vụ (Tasks) |
|:---:|:------|:----:|:-----------------|
| 1 | *(điền)* | *(điền)* | Phân tích nghiệp vụ MIS cửa hàng đồ chơi; phạm vi chức năng; README & tài liệu Capstone; tổng hợp báo cáo |
| 2 | *(điền)* | *(điền)* | Thiết kế UI/UX: trang chủ, Shop, About, Help; Tailwind; đồng bộ navigation & branding |
| 3 | *(điền)* | *(điền)* | Giỏ hàng, wishlist, checkout; tích hợp `GET /products`; lưu giỏ `localStorage`; trang giỏ hàng |
| 4 | *(điền)* | *(điền)* | Backend: Express, SQLite; đăng ký/đăng nhập JWT; profile; middleware xác thực |
| 5 | *(điền)* | *(điền)* | Backend: đơn hàng (`POST/GET /orders`, chi tiết đơn); schema `orders` / `order_items`; API admin sản phẩm & người dùng |
| 6 | *(điền)* | *(điền)* | Trang admin dashboard; kiểm thử API (Postman); kịch bản test; demo & slide thuyết trình |

---

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

## Chạy hệ thống

Luôn chạy server từ thư mục **`backend`** (đường dẫn `users.db` chuẩn):

```bash
cd backend
node server.js
```

- API & phục vụ file HTML tĩnh: **http://localhost:3000**
- **Shop:** [http://localhost:3000/products.html](http://localhost:3000/products.html)  
- **Trang chủ:** [http://localhost:3000/](http://localhost:3000/)

Frontend gọi API cùng origin khi mở qua port 3000; nếu mở file trực tiếp (`file://`) hoặc Live Server port khác, code vẫn trỏ tới `http://localhost:3000` — cần bật backend trước.

## Cơ sở dữ liệu

- File SQLite: **`backend/users.db`** — bảng `users`, `products`, `orders`, `order_items`.
- Khởi tạo schema: `cd backend` → `node initDb.js`.
- Server tự seed vài sản phẩm demo nếu bảng `products` trống (lần chạy đầu).

## Tài khoản admin (phát triển)

### Cách 1 — Tài khoản tạm

```bash
cd backend
node seedTempAdmin.js
```

Đăng nhập bằng email/mật khẩu in ra trong terminal. **Chỉ dùng lúc dev.**

### Cách 2 — Nâng user đã đăng ký lên admin

```bash
cd backend
node makeAdmin.js email-da-dang-ky@example.com
```

Liệt kê user: `node checkUsers.js`.

## API (tóm tắt)

| Phương thức | Đường dẫn | Mô tả |
|-------------|-----------|--------|
| POST | `/register` | Đăng ký |
| POST | `/login` | Đăng nhập → `token`, `role` |
| GET | `/profile` | Header `Authorization: Bearer <token>` |
| GET | `/products` | Danh sách sản phẩm (public) |
| POST | `/orders` | Đặt hàng (`items[]`, cần đăng nhập) |
| GET | `/orders` | Đơn của user hiện tại |
| GET | `/orders/:id` | Chi tiết đơn (chủ đơn hoặc admin) |
| GET | `/admin/orders` | Tất cả đơn (admin) |
| POST | `/admin/products` | Thêm sản phẩm (admin) |
| PUT | `/admin/products/:id` | Sửa sản phẩm (admin) |
| DELETE | `/admin/products/:id` | Xóa sản phẩm (admin) |
| GET | `/admin/users` | Danh sách user (admin) |
| PATCH | `/admin/users/:id/role` | Đổi role (admin) |

## Cấu trúc thư mục (chính)

```
├── backend/
│   ├── server.js          # API Express + static frontend
│   ├── users.db           # SQLite
│   ├── initDb.js
│   ├── seedTempAdmin.js
│   ├── makeAdmin.js
│   └── checkUsers.js
├── index.html
├── products.html
├── cart.html
├── login.html
├── orders.html
├── order-detail.html
├── admin.html
├── cart-system.js
├── wishlist.js
└── package.json
```

## Bảo mật (nộp bài / deploy)

- Chuyển JWT `SECRET` sang biến môi trường (`.env`), không commit secret thật.
- Không đưa mật khẩu thật vào README hoặc repo công khai.

## Ghi chú pháp lý & kỹ thuật

- LEGO® là thương hiệu của LEGO Group. Project phục vụ học tập / demo.
- Giỏ hàng lưu **localStorage**; **Thanh toán** (đã đăng nhập) gửi đơn lên server → SQLite. Xem **Đơn hàng** (`orders.html`) và **chi tiết** (`order-detail.html?id=`).

---

**Capstone Project 2 — MIS for a Toy Store** · **PLAYARENA** (demo).
