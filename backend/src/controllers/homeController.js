const { db } = require("../config/mysql");
const sendEmail = require("../utils/sendEmail");

const createDemoRequest = async (req, res) => {
  try {
    const { name, email, phone, hostel_name, city, message } = req.body;
    if (!name || !phone || !email || !hostel_name || !city) {
      return res.status(400).json({ message: "Enter all the valid details" });
    }
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO demo_requests (name,email,phone,hostel_name,city,message) VALUES (?,?,?,?,?,?)",
        [name, email, phone, hostel_name, city, message],
      );
    if (result.affectedRows === 0) {
      return res
        .status(403)
        .json({ message: "Error in inserting into the database." });
    }
    await sendEmail(
      email,
      "Demo Request Received",
      `Dear ${name},

Thank you for your interest in StaySync.

We have successfully received your demo request.

Our team will contact you shortly to schedule a personalized demo.

Thank you for choosing StaySync.

Regards,
StaySync Team`,
    );
    return res
      .status(200)
      .json({ message: "successfully created a demo request" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateDemoStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const [result] = await db
      .promise()
      .query("SELECT * FROM demo_requests WHERE id = ?", [id]);
    if (result.length === 0)
      return res
        .status(404)
        .json({ message: "No Demo Request Found with entered ID" });
    await db
      .promise()
      .query("UPDATE demo_requests SET status = ? WHERE id = ?", [status, id]);
    return res.status(200).json({ message: "successfully updated the status" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetDemoRequests = async (req, res) => {
  try {
    const [requests] = await db.promise().query("SELECT * FROM demo_requests");
    return res.status(200).json(requests);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createDemoRequest, updateDemoStatus, GetDemoRequests };
