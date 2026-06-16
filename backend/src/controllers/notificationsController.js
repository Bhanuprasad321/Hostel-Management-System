const { db } = require("../config/mysql");

const getAllNotifications = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const [notifications] = await db.promise().query(
        `SELECT *
         FROM notifications
         WHERE hostel_id = ?
         ORDER BY created_at DESC`,
        [req.user.hostel_id],
      );

      return res.status(200).json(notifications);
    }

    if (req.user.role === "super_admin") {
      const [notifications] = await db.promise().query(
        `SELECT *
         FROM notifications
         ORDER BY created_at DESC`,
      );

      return res.status(200).json(notifications);
    }

    if (req.user.role === "student") {
      const [notifications] = await db.promise().query(
        `SELECT *
         FROM notifications
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [req.user.id],
      );

      return res.status(200).json(notifications);
    }

    return res.status(403).json({
      message: "Not authorized",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
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
    } else if (req.user.role === "student") {
      const [result] = await db.promise().query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE id = ? AND user_id = ?`,
        [notification_id, req.user.id],
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
        [req.user.hostel_id],
      );
    } else if (req.user.role === "super_admin") {
      await db.promise().query(
        `UPDATE notifications
         SET is_read = TRUE`,
      );
    } else if (req.user.role === "student") {
      await db.promise().query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE user_id = ?`,
        [req.user.id],
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
