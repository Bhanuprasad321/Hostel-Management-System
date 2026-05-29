require("dotenv").config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Bhanu123@",
  database: "hostel_management",
});


const connectSql = () => {
    db.connect((err) => {
      if (err) {
        console.log("MySQL connection failed ❌");
        console.log(err);
        return;
      }
    
      console.log("MySQL connected successfully ✅");
    });
}

module.exports = {connectSql,db} ;