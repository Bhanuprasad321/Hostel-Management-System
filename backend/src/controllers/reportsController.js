const { Parser } = require("json2csv");
const {db}= require("../config/mysql")
const exportStudents = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const [students] = await db.promise().query(
      `
      SELECT
        u.name,
        u.email,
        r.room_number,
        u.created_at
      FROM users u
      LEFT JOIN allocations a
      ON u.id = a.student_id
      LEFT JOIN rooms r
      ON a.room_id = r.id
      WHERE u.hostel_id = ?
      AND u.role = 'student'
      `,
      [hostel_id],
    );

    const fields = ["name", "email", "room_number", "created_at"];

    const parser = new Parser({ fields });

    const csv = parser.parse(students);

    res.header("Content-Type", "text/csv");

    res.attachment("students.csv");

    return res.send(csv);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const exportAllocations = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const [allocations] = await db.promise().query(
      `
      SELECT
        a.id AS allocation_id,
        u.name AS student_name,
        u.email,
        r.room_number,
        a.status,
        a.allocated_at,
        a.vacated_at
      FROM allocations a
      JOIN users u
      ON a.student_id = u.id
      JOIN rooms r
      ON a.room_id = r.id
      WHERE a.hostel_id = ?
      ORDER BY a.allocated_at DESC
      `,
      [hostel_id],
    );

    const fields = [
      "allocation_id",
      "student_name",
      "email",
      "room_number",
      "status",
      "allocated_at",
      "vacated_at",
    ];

    const parser = new Parser({ fields });

    const csv = parser.parse(allocations);

    res.header("Content-Type", "text/csv");
    res.attachment("allocations_report.csv");

    return res.send(csv);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



const exportVisitors = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const [visitors] = await db.promise().query(
      `
      SELECT
        v.id AS visitor_id,
        v.visitor_name,
        v.visitor_phone,
        v.purpose,
        u.name AS host_student,
        v.check_in,
        v.check_out,
        v.status
      FROM visitors v
      JOIN users u
      ON v.student_id = u.id
      WHERE v.hostel_id = ?
      ORDER BY v.check_in DESC
      `,
      [hostel_id],
    );

    const fields = [
      "visitor_id",
      "visitor_name",
      "mobile",
      "purpose",
      "host_student",
      "check_in",
      "check_out",
      "status",
    ];

    const parser = new Parser({ fields });

    const csv = parser.parse(visitors);

    res.header("Content-Type", "text/csv");
    res.attachment("visitors_report.csv");

    return res.send(csv);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { exportStudents, exportAllocations, exportVisitors };
