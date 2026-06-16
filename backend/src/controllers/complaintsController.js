const { db } = require("../config/mysql");
const createAuditLog = require("../utils/auditLog");
const createNotification = require("../utils/createNotifications");
const createComplaint = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;
    const { student_id, category, description } = req.body;
    if (!student_id || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const [student] = await db
      .promise()
      .query(
        "SELECT name FROM users WHERE id = ? AND hostel_id=? AND role = 'student'",
        [student_id, hostel_id],
      );

    if (student.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    const student_name = student[0].name;
    await db
      .promise()
      .query(
        "INSERT INTO complaints (hostel_id,student_id ,category,description) VALUES (?,?,?,?) ",
        [hostel_id, student_id, category, description],
      );
    await createAuditLog(
      hostel_id,
      req.user.id,
      `Created complaint for ${student_name}`,
    );
    await createNotification(
      hostel_id,
      req.user.id,
      "New Complaint",
      `${student_name} reported a ${category} issue`,
    );
    res.status(200).json({ message: "Successfully created a new complaint" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getComplaints = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;
    const [complaints] = await db
      .promise()
      .query(
        "SELECT c.*, u.name AS student_name FROM complaints c JOIN users u ON c.student_id = u.id WHERE c.hostel_id = ? ORDER BY c.created_at DESC",
        [hostel_id],
      );
    return res.status(201).json(complaints);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const validStatuses = ["open", "in_progress", "resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid update status" });
    }
    const [result] = await db
      .promise()
      .query(
        "UPDATE complaints SET status = ? WHERE id = ? AND hostel_id = ?",
        [status, id, req.user.hostel_id],
      );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }
    if (status === "resolved") {
      await createAuditLog(
        req.user.hostel_id,
        req.user.id,
        `Resolved complaint ${id}`,
      );
      await createNotification(
        req.user.hostel_id,
        req.user.id,
        "Complaint Resolved",
        `Complaint #${id} marked as resolved`,
      );
    }
    return res
      .status(200)
      .json({ message: "Successfully updated the status of the complaint" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createComplaint, getComplaints, updateComplaintStatus };
