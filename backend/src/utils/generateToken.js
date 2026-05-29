const jwt = require("jsonwebtoken");

const secretKey = "your-very-secure-secret";

const generateToken = (userId, role, hostel_id) => {
  return jwt.sign({ id: userId, role, hostel_id }, secretKey, {
    expiresIn: "1h",
  });
};

module.exports = generateToken;
