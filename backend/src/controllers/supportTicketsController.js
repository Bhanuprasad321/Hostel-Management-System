const { db } = require("../config/mysql");
const createAuditLog = require("../utils/auditLog");
const createNotification = require("../utils/createNotifications");

const createTicket = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;
    const created_by = req.user.id;

    const { category, subject, description } = req.body;

    if (!category || !subject || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const [result] = await db.promise().query(
      `INSERT INTO support_tickets
      (
        hostel_id,
        created_by,
        category,
        subject,
        description
      )
      VALUES (?,?,?,?,?)`,
      [hostel_id, created_by, category, subject, description],
    );

    await createAuditLog(
      hostel_id,
      created_by,
      `Raised support ticket: ${subject}`,
    );

    await createNotification(
      null,
      created_by,
      "New Support Ticket",
      `${subject} has been submitted`,
      "platform",
    );

    return res.status(201).json({
      message: "Support ticket created successfully",
      ticket_id: result.insertId,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getMyTickets = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const [tickets] = await db.promise().query(
      `SELECT *
       FROM support_tickets
       WHERE hostel_id = ?
       ORDER BY created_at DESC`,
      [hostel_id],
    );

    return res.status(200).json(tickets);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTicketDetails = async (req, res) => {
  try {
    const ticket_id = req.params.id;

    const [ticket] = await db.promise().query(
      `SELECT
        st.*,
        h.hostel_name,
        u.name AS created_by_name
       FROM support_tickets st
       JOIN hostels h
       ON st.hostel_id = h.id
       JOIN users u
       ON st.created_by = u.id
       WHERE st.id = ?`,
      [ticket_id],
    );

    if (ticket.length === 0) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    return res.status(200).json(ticket[0]);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const [tickets] = await db.promise().query(
      `SELECT
        st.id,
        st.category,
        st.subject,
        st.status,
        st.created_at,
        h.hostel_name,
        u.name AS created_by
       FROM support_tickets st
       JOIN hostels h
       ON st.hostel_id = h.id
       JOIN users u
       ON st.created_by = u.id
       ORDER BY st.created_at DESC`,
    );

    return res.status(200).json(tickets);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const ticket_id = req.params.id;

    const { status, admin_response } = req.body;

    const [ticket] = await db
      .promise()
      .query("SELECT * FROM support_tickets WHERE id = ?", [ticket_id]);

    if (ticket.length === 0) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    await db.promise().query(
      `UPDATE support_tickets
       SET status = ?,
           admin_response = ?
       WHERE id = ?`,
      [status, admin_response || null, ticket_id],
    );

    await createAuditLog(
      ticket[0].hostel_id,
      req.user.id,
      `Updated support ticket #${ticket_id} to ${status}`,
    );

    await createNotification(
      ticket[0].hostel_id,
      ticket[0].created_by,
      "Support Ticket Updated",
      `Your support ticket status changed to ${status}`,
      "platform",
    );

    return res.status(200).json({
      message: "Ticket updated successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketDetails,
  getAllTickets,
  updateTicketStatus,
};
