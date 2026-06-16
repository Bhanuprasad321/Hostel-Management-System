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

const markAsRead = async (req, res) => {
  try {
    const notification_id = req.params.id;

    if (req.user.role === "admin") {
      const [result] = await db.promise().query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE id = ? AND hostel_id = ?`,
        [notification_id, req.user.hostel_id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }
    } else if (req.user.role === "super_admin") {
      const [result] = await db.promise().query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE id = ?`,
        [notification_id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }
    } else {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    return res.status(200).json({
      message: "Notification marked as read",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const markAllRead = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      await db.promise().query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE hostel_id = ?`,
        [req.user.hostel_id]
      );
    } else if (req.user.role === "super_admin") {
      await db.promise().query(
        `UPDATE notifications
         SET is_read = TRUE`
      );
    } else {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    return res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { getAllNotifications, markAsRead, markAllRead };
