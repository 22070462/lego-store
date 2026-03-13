const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("users.db");

db.run(
"UPDATE users SET role='admin' WHERE email='test@gmail.com'",
function(err){
if(err){
console.log(err);
}else{
console.log("User is now admin");
}
db.close();
});