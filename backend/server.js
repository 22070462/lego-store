const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const SECRET = "supersecretkey"

const db = new sqlite3.Database("./users.db")

/* CREATE TABLE */

db.run(`
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT UNIQUE,
password TEXT,
role TEXT DEFAULT "user"
)
`)

/* REGISTER */

app.post("/register", async (req,res)=>{

const {email,password} = req.body

// check empty
if(!email || !password){
return res.status(400).json({message:"Email and password required"})
}

try{

const hash = await bcrypt.hash(password,10)

db.run(
"INSERT INTO users(email,password,role) VALUES(?,?,?)",
[email,hash,"user"],
function(err){

if(err){
return res.status(400).json({message:"User already exists"})
}

res.json({
message:"User created",
userId:this.lastID
})

})

}catch(err){

res.status(500).json({message:"Server error"})

}

})

/* LOGIN */

app.post("/login", (req,res)=>{

const {email,password} = req.body

db.get(
"SELECT * FROM users WHERE email=?",
[email],
async (err,user)=>{

if(!user){

return res.status(401).json({message:"User not found"})

}

const match = await bcrypt.compare(password,user.password)

if(!match){

return res.status(401).json({message:"Wrong password"})

}

const token = jwt.sign(
{ id:user.id,email:user.email },
SECRET,
{expiresIn:"1h"}
)

res.json({
token:token,
role:user.role
})

})

})

app.listen(3000,()=>{
console.log("Server running on http://localhost:3000")
})

