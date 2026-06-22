const { db } = require("../config/mysql");
const bcrypt = require("bcrypt");
const createAuditLog = require("../utils/auditLog");
const createNotification = require("../utils/createNotifications");
const createHostel = async (req, res) => {
  let connection;

  try {
    connection = await db.promise().getConnection();

    const { hostel_name, address, plan_id } = req.body;

    if (!hostel_name || !address || !plan_id) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const [hostelExists] = await connection.query(
      "SELECT id FROM hostels WHERE hostel_name = ?",
      [hostel_name],
    );

    if (hostelExists.length > 0) {
      return res.status(409).json({
        message: "Hostel with entered name already exists",
      });
    }

    const [plan] = await connection.query(
      "SELECT * FROM subscription_plans WHERE id = ?",
      [plan_id],
    );

    if (plan.length === 0) {
      return res.status(404).json({
        message: "Subscription plan not found",
      });
    }

    await connection.beginTransaction();

    const [hostelResult] = await connection.query(
      "INSERT INTO hostels (hostel_name,address) VALUES (?,?)",
      [hostel_name, address],
    );

    const startDate = new Date();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan[0].duration_days);

    const status = plan[0].name.toLowerCase() === "trial" ? "trial" : "active";

    await connection.query(
      `INSERT INTO subscriptions
      (hostel_id, plan_id, start_date, end_date, status)
      VALUES (?,?,?,?,?)`,
      [hostelResult.insertId, plan_id, startDate, endDate, status],
    );

    await connection.commit();

    await createAuditLog(null, req.user.id, `Created hostel ${hostel_name}`);

    await createNotification(
      null,
      req.user.id,
      "New Hostel",
      `${hostel_name} was registered`,
      "platform",
    );

    return res.status(201).json({
      message: "New hostel created successfully",
    });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }

    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    if (connection) {
      connection.release();
    }
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
    const hostel_id = parseInt(req.params.id);
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
    await createAuditLog(hostel_id, req.user.id, `Created admin ${name}`);
    await createNotification(
      hostel_id,
      req.user.id,
      "Admin Created",
      `Admin created for ${name}`,
      "platform",
    );
    return res.status(200).json({ message: "New hostel admin is created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getHostelAdmins = async (req, res) => {
  try {
    const hostel_id = parseInt(req.params.id);
    const [hostelAdmins] = await db
      .promise()
      .query(
        "SELECT id,name,email,role,hostel_id FROM users WHERE hostel_id = ? AND role = 'admin'",
        [hostel_id],
      );
    return res.status(200).json(hostelAdmins);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateHostel = async (req, res) => {
  try {
    const hostel_id = parseInt(req.params.id);
    const { hostel_name, address } = req.body;

    if (!hostel_name && !address) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update" });
    }

    // Confirm the hostel exists
    const [hostel] = await db
      .promise()
      .query("SELECT * FROM hostels WHERE id = ?", [hostel_id]);

    if (hostel.length === 0) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // If name is being changed, ensure it isn't already taken by another hostel
    if (hostel_name && hostel_name !== hostel[0].hostel_name) {
      const [dupName] = await db
        .promise()
        .query("SELECT id FROM hostels WHERE hostel_name = ? AND id != ?", [
          hostel_name,
          hostel_id,
        ]);
      if (dupName.length > 0) {
        return res
          .status(409)
          .json({ message: "Hostel with entered name already exists" });
      }
    }

    // Build update fields dynamically
    const fields = [];
    const values = [];

    if (hostel_name) {
      fields.push("hostel_name = ?");
      values.push(hostel_name);
    }
    if (address) {
      fields.push("address = ?");
      values.push(address);
    }

    values.push(hostel_id);

    await db
      .promise()
      .query(`UPDATE hostels SET ${fields.join(", ")} WHERE id = ?`, values);

    await createAuditLog(
      null,
      req.user.id,
      `Updated hostel ${hostel[0].hostel_name}`,
    );
    await createNotification(
      null,
      req.user.id,
      "Hostel Updated",
      `${hostel[0].hostel_name}'s details were updated`,
      "platform",
    );

    return res.status(200).json({ message: "Hostel updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createHostel,
  getHostels,
  createHostelAdmin,
  getHostelAdmins,
  updateHostel,
};
