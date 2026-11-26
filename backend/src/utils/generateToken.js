const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

const generateToken = (userId, role, hostel_id) => {
  return jwt.sign({ id: userId, role, hostel_id }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = generateToken;
