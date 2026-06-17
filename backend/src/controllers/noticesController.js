const { db } = require("../config/mysql");
const createNotification = require("../utils/createNotifications");
const createAuditLog = require("../utils/auditLog");

const createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const hostel_id = req.user.hostel_id;
    const created_by = req.user.id;
    await db
      .promise()
      .query(
        "INSERT INTO notices (hostel_id,title,description,created_by) VALUES (?,?,?,?)",
        [hostel_id, title, description, created_by],
      );
    await createAuditLog(hostel_id, req.user.id, `Created notice: ${title}`);
    await createNotification(hostel_id, req.user.id, "New Notice", title);
    return res.status(200).json({ message: "Successfully added new notice" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getNotices = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      const hostel_id = req.user.hostel_id;
      const [notices] = await db
        .promise()
        .query(
          "SELECT n.id, n.title, n.description, n.created_at, u.name AS created_by FROM notices n JOIN users u ON n.created_by = u.id WHERE n.hostel_id = ? ORDER BY n.created_at DESC",
          [hostel_id],
        );

      return res.status(200).json(notices);
    } else {
      return res.status(403).json({ message: "Access denied!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const id = req.params.id;
    const hostel_id = req.user.hostel_id;
    const [rows] = await db
      .promise()
      .query("SELECT title FROM notices WHERE hostel_id=?", [hostel_id]);
    const title = rows[0].title;
    const [result] = await db
      .promise()
      .query("DELETE FROM notices WHERE id = ? AND hostel_id = ?", [
        id,
        hostel_id,
      ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }
    await createAuditLog(hostel_id, req.user.id, `Deleted notice: ${title}`);
    return res
      .status(200)
      .json({ message: "successfully deleted the notice from board" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createNotice, getNotices, deleteNotice };
