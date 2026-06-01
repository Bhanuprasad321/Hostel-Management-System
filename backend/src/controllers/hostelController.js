const { db } = require("../config/mysql");
const bcrypt = require("bcrypt");
const createHostel = async (req, res) => {
  try {
    const { hostel_name, address } = req.body;
    if (!hostel_name || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const [rows] = await db
      .promise()
      .query("SELECT * FROM hostels WHERE hostel_name = ?", [hostel_name]);
    if (rows.length !== 0) {
      return res
        .status(409)
        .json({ message: "Hostel with entered name already exists" });
    }
    await db
      .promise()
      .query("INSERT INTO hostels (hostel_name,address) VALUES (?,?)", [
        hostel_name,
        address,
      ]);
    return res.status(200).json({ message: "New hostel is created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getHostels = async (req, res) => {
  try {
    const [hostels] = await db.promise().query("SELECT * FROM hostels");
    return res.status(200).json(hostels);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const createHostelAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const  hostel_id  = parseInt(req.params.id);
    const role = "admin";
    if (!name || !email || !password || !hostel_id) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const [hostel] = await db
      .promise()
      .query("SELECT * FROM hostels WHERE id = ?", [hostel_id]);
    if (hostel.length === 0)
      return res
        .status(404)
        .json({ message: "No hostel exist with hostel id" });
    const [dupEmail] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (dupEmail.length !== 0) {
      return res
        .status(400)
        .json({ message: "Already user existed with entered Email" });
    }
    const hashedPass = await bcrypt.hash(password, 10);

    await db
      .promise()
      .query(
        "INSERT INTO users (name,email,password,hostel_id,role) VALUES (?,?,?,?,?)",
        [name, email, hashedPass, hostel_id, role],
      );
    return res.status(200).json({ message: "New hostel admin is created" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getHostelAdmins = async (req, res) => {
  try {
    const hostel_id = parseInt(req.params.id);
    const [hostelAdmins] = await db
      .promise()
      .query("SELECT id,name,email,role,hostel_id FROM users WHERE hostel_id = ? AND role = 'admin'", [
        hostel_id,
      ]);
    return res.status(200).json(hostelAdmins);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createHostel,
  getHostels,
  createHostelAdmin,
  getHostelAdmins,
};
