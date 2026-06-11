const { db } = require("../config/mysql");

const getAuditLogs = async (req, res) => {
  try {
    const [logs] = await db
      .promise()
      .query(
        "SELECT a.id, h.hostel_name, u.name as user_name , a.action as action_time, a.created_at FROM audit_logs a JOIN users u ON a.user_id = u.id LEFT JOIN hostels h ON a.hostel_id = h.id ORDER BY a.created_at DESC",
      );
    return res.status(200).json(logs);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getAuditLogs;
