
const jwt = require("jsonwebtoken");
const secretKey = "your-very-secure-secret";
const {db} = require('../config/mysql');
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token,secretKey);
      const [rows] = await db.promise().query("SELECT id, name, email, role, hostel_id FROM users WHERE id = ?",[decoded.id]);
      req.user = rows[0];
      next();
    } catch (err) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

  const adminOnly = (req, res, next) => {
    if (req.user.role === "admin") {
      return next();
    } else return res.status(403).json({ message: "Not authorized as admin" });
  };


const superAdminOnly = (req,res,next) => {
  if (req.user.role=== "super_admin") {
    return next();
  }
  else return res.status(403).json({message: "Not authorized as super admin"});
}

module.exports = { protect, adminOnly,superAdminOnly };
