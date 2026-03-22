const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const path = require("path")

const app = express()

const DB_PATH = path.join(__dirname, "users.db")

app.use(cors())
app.use(express.json())

/* SERVE FRONTEND */

app.use(express.static("public"))

const SECRET = "supersecretkey"

const db = new sqlite3.Database(DB_PATH)

/* CREATE TABLES */

db.run(`
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT UNIQUE,
password TEXT,
role TEXT DEFAULT "user"
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS products(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
price REAL NOT NULL,
image_url TEXT,
age_min INTEGER,
pieces INTEGER,
theme TEXT
)
`)

// seed a few demo products if table is empty
db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
  if (err) {
    return
  }
  if (row && row.count === 0) {
    const seedStmt = db.prepare(
      "INSERT INTO products(name,price,image_url,age_min,pieces,theme) VALUES(?,?,?,?,?,?)"
    )

    seedStmt.run(
      "Galactic Starship Explorer MK-II",
      89.99,
      "https://lh3.googleusercontent.com/aida-public/AB6AXuClOZB0117OOwgcKaTwWWu32EuXvVY4ijhc8rXdY15TsWtIG4_mAzMBnXYnXPGYHoiyZnaP7kuB-5-GwFiUSO1KSXXrbfhgRhODbBvUXRDd1T_o3A8m0ue1qLPET212pB0ODi6l85q1HmuuCtmAhu62flb72B2UCwLPmbHPVQ1k8eRIzC0Fu83lMrPwkrtItFuORIycUzgZMpJb1fFBhW3I5QMEbSE93TYr07FcZ_YnXMPdNNMs5vryU-rb6hMVelC8oYRVGZv9MLQ",
      9,
      1248,
      "Space Exploration"
    )

    seedStmt.run(
      "Industrial High-Lift Crane",
      149.99,
      "https://i.pinimg.com/736x/91/23/74/91237419d1788d6cc0994186290dac14.jpg",
      12,
      2105,
      "Technic"
    )

    seedStmt.run(
      "Botanical Collection: Wildflower",
      59.99,
      "https://i.pinimg.com/736x/ea/e0/5f/eae05f47cbe606f33b6f103d863df94f.jpg",
      18,
      758,
      "Botanical"
    )

    seedStmt.finalize()
  }
})

/* REGISTER */

app.post("/register", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" })
  }

  try {
    const hash = await bcrypt.hash(password, 10)

    db.run(
      "INSERT INTO users(email,password,role) VALUES(?,?,?)",
      [email, hash, "user"],
      function (err) {
        if (err) {
          return res.status(400).json({ message: "User already exists" })
        }

        res.json({
          message: "User created",
          userId: this.lastID,
        })
      }
    )
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

/* LOGIN — JWT chứa role để phân quyền admin */

app.post("/login", (req, res) => {
  const { email, password } = req.body

  db.get("SELECT * FROM users WHERE email=?", [email], async (err, user) => {
    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(401).json({ message: "Wrong password" })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role || "user",
      },
      SECRET,
      { expiresIn: "1h" }
    )

    res.json({
      token: token,
      role: user.role,
    })
  })
})

/* VERIFY TOKEN */

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"]

  if (!authHeader) {
    return res.status(403).json({ message: "No token" })
  }

  const token = authHeader.split(" ")[1]

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" })
    }

    req.user = user
    next()
  })
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.id == null) {
    return res.status(403).json({ message: "Chỉ dành cho quản trị viên" })
  }
  if (req.user.role === "admin") {
    return next()
  }
  /* Token cũ không có role trong JWT — kiểm tra DB */
  db.get(
    "SELECT role FROM users WHERE id=?",
    [req.user.id],
    (err, row) => {
      if (err || !row || row.role !== "admin") {
        return res.status(403).json({ message: "Chỉ dành cho quản trị viên" })
      }
      req.user.role = row.role
      next()
    }
  )
}

/* PROFILE */

app.get("/profile", verifyToken, (req, res) => {
  db.get(
    "SELECT id,email,role FROM users WHERE id=?",
    [req.user.id],
    (err, user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      res.json(user)
    }
  )
})

/* PRODUCTS — public */

app.get("/products", (req, res) => {
  db.all(
    "SELECT id,name,price,image_url,age_min,pieces,theme FROM products ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database error" })
      }

      res.json(rows)
    }
  )
})

/* ADMIN — sản phẩm */

app.post("/admin/products", verifyToken, requireAdmin, (req, res) => {
  const { name, price, image_url, age_min, pieces, theme } = req.body

  if (!name || price === undefined || price === null || price === "") {
    return res.status(400).json({ message: "Cần có tên và giá sản phẩm" })
  }

  const p = Number(price)
  if (Number.isNaN(p) || p < 0) {
    return res.status(400).json({ message: "Giá không hợp lệ" })
  }

  db.run(
    "INSERT INTO products(name,price,image_url,age_min,pieces,theme) VALUES(?,?,?,?,?,?)",
    [
      String(name).trim(),
      p,
      image_url ? String(image_url).trim() : null,
      age_min !== undefined && age_min !== "" && age_min !== null
        ? parseInt(age_min, 10)
        : null,
      pieces !== undefined && pieces !== "" && pieces !== null
        ? parseInt(pieces, 10)
        : null,
      theme ? String(theme).trim() : null,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" })
      }
      res.status(201).json({ message: "Đã tạo sản phẩm", id: this.lastID })
    }
  )
})

app.put("/admin/products/:id", verifyToken, requireAdmin, (req, res) => {
  const { name, price, image_url, age_min, pieces, theme } = req.body
  const id = req.params.id

  if (!name || price === undefined || price === null || price === "") {
    return res.status(400).json({ message: "Cần có tên và giá sản phẩm" })
  }

  const p = Number(price)
  if (Number.isNaN(p) || p < 0) {
    return res.status(400).json({ message: "Giá không hợp lệ" })
  }

  db.run(
    "UPDATE products SET name=?, price=?, image_url=?, age_min=?, pieces=?, theme=? WHERE id=?",
    [
      String(name).trim(),
      p,
      image_url ? String(image_url).trim() : null,
      age_min !== undefined && age_min !== "" && age_min !== null
        ? parseInt(age_min, 10)
        : null,
      pieces !== undefined && pieces !== "" && pieces !== null
        ? parseInt(pieces, 10)
        : null,
      theme ? String(theme).trim() : null,
      id,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" })
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
      }
      res.json({ message: "Đã cập nhật" })
    }
  )
})

app.delete("/admin/products/:id", verifyToken, requireAdmin, (req, res) => {
  db.run("DELETE FROM products WHERE id=?", [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ message: "Database error" })
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
    }
    res.json({ message: "Đã xóa" })
  })
})

/* ADMIN — danh sách user (không trả password) */

app.get("/admin/users", verifyToken, requireAdmin, (req, res) => {
  db.all(
    "SELECT id, email, role FROM users ORDER BY id ASC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database error" })
      }
      res.json(rows)
    }
  )
})

app.patch("/admin/users/:id/role", verifyToken, requireAdmin, (req, res) => {
  const { role } = req.body
  const uid = req.params.id

  if (role !== "user" && role !== "admin") {
    return res.status(400).json({ message: "Role phải là user hoặc admin" })
  }

  db.run(
    "UPDATE users SET role=? WHERE id=?",
    [role, uid],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" })
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Không tìm thấy user" })
      }
      res.json({ message: "Đã cập nhật role" })
    }
  )
})

/* DEFAULT ROUTE */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})
