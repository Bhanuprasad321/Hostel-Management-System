const { db } = require("../config/mysql");

const getAuditLogs = async (req, res) => {
  try {
    if (req.user.role === "super_admin") {
      const [logs] = await db
        .promise()
        .query(
          `SELECT a.id, h.hostel_name, u.name AS user_name, u.role, a.action, a.created_at FROM audit_logs a JOIN users u ON a.user_id = u.id LEFT JOIN hostels h ON a.hostel_id = h.id ORDER BY a.created_at DESC`,
        );

      return res.status(200).json(logs);
    }

    if (req.user.role === "admin") {
      const [logs] = await db.promise().query(
        `SELECT a.id, h.hostel_name, u.name AS user_name,a.action,a.created_at FROM audit_logs a JOIN users u ON a.user_id = u.id
        LEFT JOIN hostels h ON a.hostel_id = h.id WHERE a.hostel_id = ? ORDER BY a.created_at DESC`,
        [req.user.hostel_id],
      );
      return res.status(200).json(logs);
    }

    return res.status(403).json({
      message: "Access denied!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = getAuditLogs;
