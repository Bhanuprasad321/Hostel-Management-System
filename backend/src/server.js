require("dotenv").config();
const {connectSql} = require('./config/mysql');

connectSql();
const authRoutes = require('./routes/authRoutes');
const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  console.log("This is Home page of the website");
  res.json("Hello");
});

app.use("/api/auth/",authRoutes);
app.use("/api/",authRoutes);
app.listen(2000, () => {
  console.log(`App is running at port ${2000}`);
});
