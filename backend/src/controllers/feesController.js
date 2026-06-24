const { db } = require("../config/mysql");

const createFeeSettings = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const { monthly_fee, security_deposit } = req.body;

    if (monthly_fee === undefined || security_deposit === undefined) {
      return res.status(400).json({
        message: "Monthly fee and security deposit are required",
      });
    }

    if (Number(monthly_fee) < 0 || Number(security_deposit) < 0) {
      return res.status(400).json({
        message: "Amounts cannot be negative",
      });
    }

    const [exists] = await db
      .promise()
      .query("SELECT id FROM fee_settings WHERE hostel_id = ?", [hostel_id]);

    if (exists.length > 0) {
      return res.status(409).json({
        message: "Fee settings already exist. Please update them instead.",
      });
    }

    const [result] = await db.promise().query(
      `INSERT INTO fee_settings
      (
        hostel_id,
        monthly_fee,
        security_deposit
      )
      VALUES (?,?,?)`,
      [hostel_id, Number(monthly_fee), Number(security_deposit)],
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Unable to create fee settings",
      });
    }

    return res.status(201).json({
      message: "Fee settings created successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getFeeSettings = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const [settings] = await db
      .promise()
      .query("SELECT * FROM fee_settings WHERE hostel_id = ?", [hostel_id]);

    if (settings.length === 0) {
      return res.status(404).json({
        message: "Fee settings not found",
      });
    }

    return res.status(200).json(settings[0]);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateFeeSettings = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const { monthly_fee, security_deposit } = req.body;
    if (monthly_fee === undefined || security_deposit === undefined) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const [settings] = await db
      .promise()
      .query("SELECT * FROM fee_settings WHERE hostel_id = ?", [hostel_id]);

    if (settings.length === 0) {
      return res.status(404).json({
        message: "Fee settings not found",
      });
    }

    await db.promise().query(
      `UPDATE fee_settings
       SET monthly_fee = ?,
           security_deposit = ?
       WHERE hostel_id = ?`,
      [monthly_fee, security_deposit, hostel_id],
    );

    return res.status(200).json({
      message: "Fee settings updated successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllFees = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const [fees] = await db.promise().query(
      `SELECT
        sf.id,
        u.name AS student_name,
        sf.fee_type,
        sf.amount,
        sf.status,
        sf.due_date,
        sf.paid_at,
        sf.created_at
       FROM student_fees sf
       JOIN users u
       ON sf.student_id = u.id
       WHERE sf.hostel_id = ?
       ORDER BY sf.created_at DESC`,
      [hostel_id],
    );

    return res.status(200).json(fees);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const markFeePaid = async (req, res) => {
  try {
    const fee_id = req.params.id;
    const hostel_id = req.user.hostel_id;

    const [fee] = await db.promise().query(
      `SELECT *
       FROM student_fees
       WHERE id = ?
       AND hostel_id = ?`,
      [fee_id, hostel_id],
    );

    if (fee.length === 0) {
      return res.status(404).json({
        message: "Fee record not found",
      });
    }

    if (fee[0].status === "paid") {
      return res.status(400).json({
        message: "Fee already marked as paid",
      });
    }

    await db.promise().query(
      `UPDATE student_fees
       SET status = 'paid',
           paid_at = NOW()
       WHERE id = ?`,
      [fee_id],
    );

    return res.status(200).json({
      message: "Fee marked as paid successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getMyFees = async (req, res) => {
  try {
    const student_id = req.user.id;
    const hostel_id = req.user.hostel_id;

    const [fees] = await db.promise().query(
      `SELECT
    id,
    fee_type,
    amount,
    status,
    due_date,
    paid_at,
    created_at
   FROM student_fees
   WHERE student_id = ?
   AND hostel_id = ?
   ORDER BY created_at DESC`,
      [student_id, hostel_id],
    );

    return res.status(200).json(fees);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getFeeAnalytics = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const [[collected]] = await db.promise().query(
      `SELECT
        IFNULL(SUM(amount),0) AS total_collected
       FROM student_fees
       WHERE hostel_id = ?
       AND status = 'paid'`,
      [hostel_id],
    );

    const [[pending]] = await db.promise().query(
      `SELECT
        IFNULL(SUM(amount),0) AS pending_amount
       FROM student_fees
       WHERE hostel_id = ?
       AND status = 'pending'`,
      [hostel_id],
    );

    const [[deposits]] = await db.promise().query(
      `SELECT
        IFNULL(SUM(amount),0) AS security_deposits_collected
       FROM student_fees
       WHERE hostel_id = ?
       AND fee_type = 'security_deposit'
       AND status = 'paid'`,
      [hostel_id],
    );

    const [[records]] = await db.promise().query(
      `SELECT
        COUNT(*) AS total_fee_records
       FROM student_fees
       WHERE hostel_id = ?`,
      [hostel_id],
    );

    const [[students]] = await db.promise().query(
      `SELECT
        COUNT(DISTINCT student_id) AS students_with_fees
       FROM student_fees
       WHERE hostel_id = ?`,
      [hostel_id],
    );

    const [[collectionRate]] = await db.promise().query(
      `SELECT
        ROUND(
          (
            SUM(CASE WHEN status='paid' THEN amount ELSE 0 END)
            /
            NULLIF(SUM(amount),0)
          ) * 100,
          2
        ) AS collection_rate
       FROM student_fees
       WHERE hostel_id = ?`,
      [hostel_id],
    );

    return res.status(200).json({
      total_collected: collected.total_collected,
      pending_amount: pending.pending_amount,
      security_deposits_collected: deposits.security_deposits_collected,
      total_fee_records: records.total_fee_records,
      students_with_fees: students.students_with_fees,
      collection_rate: collectionRate.collection_rate || 0,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getRecentFeeActivity = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const [activity] = await db.promise().query(
      `SELECT
        sf.id,
        u.name AS student_name,
        sf.fee_type,
        sf.amount,
        sf.status,
        sf.created_at
       FROM student_fees sf
       JOIN users u
       ON sf.student_id = u.id
       WHERE sf.hostel_id = ?
       ORDER BY sf.created_at DESC
       LIMIT 10`,
      [hostel_id],
    );

    return res.status(200).json(activity);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createFeeSettings,
  getFeeSettings,
  updateFeeSettings,
  getAllFees,
  markFeePaid,
  getMyFees,
  getFeeAnalytics,
  getRecentFeeActivity,
};
