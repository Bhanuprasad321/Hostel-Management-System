const { db } = require("../config/mysql");
const bcrypt = require("bcrypt");

const createStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = "student";
    const hostel_id = parseInt(req.user.hostel_id);
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const [dubEmail] = await db
      .promise()
      .query("SELECT * FROM users WHERE email=?", [email]);
    if (dubEmail.length !== 0)
      return res
        .status(409)
        .json({ message: "user with entered email already exist" });
    const hashedPass = await bcrypt.hash(password, 10);
    await db
      .promise()
      .query(
        "INSERT INTO users (hostel_id,name,email,password,role) VALUES (?,?,?,?,?)",
        [hostel_id, name, email, hashedPass, role],
      );
    return res.status(200).json({ message: "New student is created" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getStudents = async (req, res) => {
  try {
    const role = "student";
    const hostel_id = parseInt(req.user.hostel_id);
    const [students] = await db
      .promise()
      .query("SELECT name,email FROM users WHERE hostel_id=? AND role = ?", [
        hostel_id,
        role,
      ]);
    return res.status(200).json(students);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getStudentDetails = async (req, res) => {
  try {
    const student_id = parseInt(req.params.id);
    const hostel_id = req.user.hostel_id;
    const [student] = await db
      .promise()
      .query("SELECT name,email FROM users WHERE id = ? AND hostel_id = ?", [
        student_id,
        hostel_id,
      ]);
    if (student.length === 0)
      return res.status(404).json({ message: "404 Not found" });
    return res.status(200).json({
      name: student[0].name,
      email: student[0].email,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { createStudent, getStudents, getStudentDetails };
