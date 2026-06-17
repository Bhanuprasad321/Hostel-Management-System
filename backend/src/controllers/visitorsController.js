const { db } = require("../config/mysql");
const createAuditLog = require("../utils/auditLog");

const createVisitor = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const { student_id, visitor_name, visitor_phone, purpose } = req.body;

    if (!student_id || !visitor_name || !visitor_phone || !purpose) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const [student] = await db
      .promise()
      .query("SELECT id,name FROM users WHERE id = ? AND hostel_id = ?", [
        student_id,
        hostel_id,
      ]);

    if (student.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    await db.promise().query(
      `INSERT INTO visitors
      (hostel_id, student_id, visitor_name, visitor_phone, purpose)
      VALUES (?, ?, ?, ?, ?)`,
      [hostel_id, student_id, visitor_name, visitor_phone, purpose],
    );

    await createAuditLog(
      hostel_id,
      req.user.id,
      `Registered visitor ${visitor_name} for ${student[0].name}`,
    );

    return res.status(201).json({
      message: "Visitor registered successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getVisitors = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const [visitors] = await db
      .promise()
      .query(
        `SELECT v.id, v.visitor_name, v.visitor_phone, v.purpose, v.check_in, v.check_out,v.status, u.name AS student_name FROM visitors v JOIN users u ON v.student_id = u.id WHERE v.hostel_id = ? ORDER BY v.check_in DESC`,
        [hostel_id],
      );

    return res.status(200).json(visitors);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const checkoutVisitor = async (req, res) => {
  try {
    const visitor_id = req.params.id;
    const hostel_id = req.user.hostel_id;

    const [visitor] = await db
      .promise()
      .query(
        `SELECT visitor_name FROM visitors WHERE id = ? AND hostel_id = ?`,
        [visitor_id, hostel_id],
      );

    if (visitor.length === 0) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    const [result] = await db
      .promise()
      .query(
        `UPDATE visitors SET status = 'checked_out', check_out = CURRENT_TIMESTAMP WHERE id = ? AND hostel_id = ? AND status = 'checked_in'`,
        [visitor_id, hostel_id],
      );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Visitor already checked out",
      });
    }

    await createAuditLog(
      hostel_id,
      req.user.id,
      `Checked out visitor ${visitor[0].visitor_name}`,
    );

    return res.status(200).json({
      message: "Visitor checked out successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createVisitor,
  getVisitors,
  checkoutVisitor,
};
