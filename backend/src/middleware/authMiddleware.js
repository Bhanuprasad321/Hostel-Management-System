const jwt = require("jsonwebtoken");
const secretKey = "your-very-secure-secret";
const { db } = require("../config/mysql");
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, secretKey);
      const [rows] = await db
        .promise()
        .query(
          "SELECT id, name, email, role, hostel_id FROM users WHERE id = ?",
          [decoded.id],
        );
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

const superAdminOnly = (req, res, next) => {
  if (req.user.role === "super_admin") {
    return next();
  } else
    return res.status(403).json({ message: "Not authorized as super admin" });
};

const studentOnly = (req, res, next) => {
  if (req.user.role === "student") {
    return next();
  } else {
    return res.status(403).json({ message: "Not authorized as student" });
  }
};

const checkFeature = (featureName) => {
  return async (req, res, next) => {
    try {
      if (req.user.role === "super_admin") {
        return next();
      }
      const hostel_id = req.user.hostel_id;

      const [subscription] = await db.promise().query(
        `
        SELECT p.features
        FROM subscriptions s
        JOIN subscription_plans p
        ON s.plan_id = p.id
        WHERE s.hostel_id = ?
        AND (s.status = 'active' OR s.status = 'trial')
        LIMIT 1
        `,
        [hostel_id],
      );

      if (subscription.length === 0) {
        return res.status(403).json({
          message: "No active subscription found",
        });
      }

      let features = subscription[0].features;

      if (typeof features === "string") {
        features = JSON.parse(features);
      }

      if (!features.includes(featureName)) {
        return res.status(403).json({
          message: "Upgrade your plan to access this feature",
        });
      }

      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };
};

module.exports = {
  protect,
  adminOnly,
  superAdminOnly,
  studentOnly,
  checkFeature,
};
