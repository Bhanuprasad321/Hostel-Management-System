require("dotenv").config();
const mysql = require('mysql2');

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Bhanu123@",
  database: "hostel_management",
});

const connectSql = async () => {
  try {
    const connection = await db.promise().getConnection();
    console.log("MySQL connected successfully ✅");
    connection.release();
  } catch (err) {
    console.log("MySQL connection failed ❌");
    console.log(err);
  }
};

module.exports = {connectSql,db} ;