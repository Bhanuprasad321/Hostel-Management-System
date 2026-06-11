const { db } = require("../config/mysql");

const createAuditLog = async (hostel_id, user_id, action) => {
  try {
    await db
      .promise()
      .query(
        "INSERT INTO audit_logs(hostel_id,user_id,action) VALUES (?,?,?)",
        [hostel_id, user_id, action],
      );
  } catch (err) {
    console.error("Audit log failed:", err);
  }
};

module.exports = createAuditLog;
