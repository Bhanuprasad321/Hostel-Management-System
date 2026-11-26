const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
});
const mysql = require("mysql2");

const dbPassword = process.env.DB_PASSWORD ?? process.env.DB_PASS;
const missingVars = ["DB_HOST", "DB_USER", "DB_NAME"].filter(
  (key) => !process.env[key],
);
if (dbPassword === undefined) {
  missingVars.push("DB_PASSWORD");
}
if (missingVars.length > 0) {
  throw new Error(
    `Missing required database environment variables: ${missingVars.join(", ")}`,
  );
}

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: dbPassword,
  database: process.env.DB_NAME,
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

module.exports = { connectSql, db };
