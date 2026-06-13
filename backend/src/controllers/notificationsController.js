const { db } = require("../config/mysql");

const getAllNotifications = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const hostel_id = req.user.hostel_id;

      const [notifications] = await db.promise().query(
        `SELECT *
       FROM notifications
       WHERE hostel_id = ?
       ORDER BY created_at DESC`,
        [hostel_id],
      );
      return res.status(200).json(notifications);
    } else if (req.user.role === "super_admin") {
      const [notifications] = await db.promise().query(
        `SELECT *
FROM notifications
ORDER BY created_at DESC`,
      );
      return res.status(200).json(notifications);
    } else {
      return res.status(403).json({
        message: "Not authorized",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getAllNotifications;
