const { db } = require("../config/mysql");
const bcrypt = require("bcrypt");
const createAuditLog = require("../utils/auditLog");
const getProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [row] = await db
      .promise()
      .query("SELECT * FROM users WHERE id = ?", [user_id]);
    if (row.length === 0) {
      return res.status(404).json({ message: "No user found with Id" });
    }
    const name = row[0].name;
    const email = row[0].email;

    return res.status(200).json({ name, email });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    await db
      .promise()
      .query("UPDATE users SET name = ? WHERE id = ?", [name, user_id]);
    await createAuditLog(req.user.hostel_id, req.user.id, "Updated profile");
    res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { curr_pass, new_pass } = req.body;
    if (!curr_pass || !new_pass) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE id = ?", [user_id]);
    if (rows[0].length === 0) {
      return res.status(404).json({ message: "user not found!" });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(curr_pass, user.password);
    if (isMatch) {
      const hashed_pass = await bcrypt.hash(new_pass, 10);
      await db
        .promise()
        .query("UPDATE users SET password = ? WHERE id = ?", [
          hashed_pass,
          user_id,
        ]);
      await createAuditLog(
        req.user.hostel_id,
        req.user.id,
        "Changed account password",
      );
      return res
        .status(200)
        .json({ message: "Successfully updated the password" });
    } else {
      return res
        .status(401)
        .json({ message: "Old password doesnt match! try again!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getHostelSettings = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;
    const [rows] = await db
      .promise()
      .query("SELECT * FROM hostels WHERE id = ?", [hostel_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No hostel found" });
    }
    const hostel = rows[0];
    const hostel_name = rows[0].hostel_name;
    const address = rows[0].address;
    return res.status(200).json({ hostel_name, address });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateHostelSettings = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;
    const { hostel_name, address } = req.body;
    if (!hostel_name || !address) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const [dup] = await db
      .promise()
      .query("SELECT * FROM hostels WHERE hostel_name = ? AND id != ?", [
        hostel_name,
        hostel_id,
      ]);
    if (dup.length !== 0) {
      return res
        .status(409)
        .json({ message: "Another hostel exist with entered name" });
    }
    await db
      .promise()
      .query("UPDATE hostels SET hostel_name = ? , address = ? WHERE id = ?", [
        hostel_name,
        address,
        hostel_id,
      ]);
    await createAuditLog(hostel_id, req.user.id, "Updated hostel settings");
    return res.status(200).json({
      message: "Hostel settings updated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getHostelSettings,
  updateHostelSettings,
};
