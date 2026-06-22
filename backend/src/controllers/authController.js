const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const { db } = require("../config/mysql");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({
        message: "No user found with this email",
      });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    if (user.role === "admin") {
      const [subscription] = await db.promise().query(
        `SELECT *
   FROM subscriptions
   WHERE hostel_id = ?
   AND (status = 'active' OR status = 'trial')
   AND end_date >= NOW()`,
        [user.hostel_id],
      );

      if (subscription.length === 0) {
        return res.status(403).json({
          message: "Subscription expired. Please contact administrator.",
        });
      }
    }
    const token = generateToken(user.id, user.role, user.hostel_id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostel_id: user.hostel_id,
      },
    });
  } catch (err) {
    console.error("Auth controller error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  login,
};
