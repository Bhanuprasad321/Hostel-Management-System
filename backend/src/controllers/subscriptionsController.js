const { db } = require("../config/mysql");
const createNotification = require("../utils/createNotifications");
const createAuditLog = require("../utils/auditLog");
const getAllSubscriptions = async (req, res) => {
  try {
    const [sub] = await db.promise().query(
      `SELECT
          s.id,
          h.hostel_name,
          p.name AS plan_name,
          s.status,
          s.start_date,
          s.end_date
       FROM subscriptions s
       JOIN hostels h
       ON s.hostel_id = h.id
       JOIN subscription_plans p
       ON s.plan_id = p.id
       ORDER BY s.created_at DESC`,
    );

    return res.status(200).json(sub);
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getSubscriptionDetails = async (req, res) => {
  try {
    const sub_id = req.params.id;

    const [sub] = await db.promise().query(
      `SELECT
          s.*,
          h.hostel_name,
          p.name AS plan_name,
          p.price,
          p.max_employees,
          p.duration_days,
          p.features
       FROM subscriptions s
       JOIN hostels h
       ON s.hostel_id = h.id
       JOIN subscription_plans p
       ON s.plan_id = p.id
       WHERE s.id = ?`,
      [sub_id],
    );

    if (sub.length === 0) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    const daysRemaining = Math.max(
      0,
      Math.ceil(
        (new Date(sub[0].end_date) - new Date()) / (1000 * 60 * 60 * 24),
      ),
    );

    return res.status(200).json({
      hostel_name: sub[0].hostel_name,
      plan_name: sub[0].plan_name,
      price: sub[0].price,
      max_employees: sub[0].max_employees,
      status: sub[0].status,
      start_date: sub[0].start_date,
      end_date: sub[0].end_date,
      days_remaining: daysRemaining,
      features: sub[0].features,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const purchasePlan = async (req, res) => {
  let connection;

  try {
    connection = await db.promise().getConnection();

    const hostel_id = req.user.hostel_id;
    const plan_id = req.params.id;

    if (!plan_id) {
      return res.status(400).json({
        message: "Plan ID is required",
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

    const selectedPlan = plan[0];

    if (selectedPlan.name.toLowerCase() === "trial") {
      return res.status(400).json({
        message: "Trial plan can only be assigned during hostel registration",
      });
    }
    await connection.beginTransaction();

    const [currentSubscription] = await connection.query(
      `SELECT *
       FROM subscriptions
       WHERE hostel_id = ?
       AND (status = 'active' OR status = 'trial')`,
      [hostel_id],
    );
    if (
      currentSubscription.length > 0 &&
      currentSubscription[0].plan_id === plan_id
    ) {
      return res.status(400).json({
        message: "You are already subscribed to this plan",
      });
    }
    if (currentSubscription.length > 0) {
      await connection.query(
        `UPDATE subscriptions
         SET status = 'cancelled'
         WHERE id = ?`,
        [currentSubscription[0].id],
      );
    }

    const [payment] = await connection.query(
      `INSERT INTO payment_transactions
       (
        hostel_id,
        amount,
        payment_provider,
        transaction_id,
        status
       )
       VALUES (?,?,?,?,?)`,
      [
        hostel_id,
        selectedPlan.price,
        "payu",
        `DEMO_${Date.now()}`,
        "success", // change later after PayU integration
      ],
    );

    const startDate = new Date();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + selectedPlan.duration_days);

    const [subscription] = await connection.query(
      `INSERT INTO subscriptions
       (
        hostel_id,
        plan_id,
        start_date,
        end_date,
        status
       )
       VALUES (?,?,?,?,?)`,
      [hostel_id, plan_id, startDate, endDate, "active"],
    );

    await connection.query(
      `UPDATE payment_transactions
       SET subscription_id = ?
       WHERE id = ?`,
      [subscription.insertId, payment.insertId],
    );

    await connection.commit();

    await createAuditLog(
      hostel_id,
      req.user.id,
      `Purchased ${selectedPlan.name} plan`,
    );

    await createNotification(
      hostel_id,
      req.user.id,
      "Subscription Updated",
      `Successfully upgraded to ${selectedPlan.name} plan`,
    );

    return res.status(200).json({
      message: "Subscription purchased successfully",
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

const currentPlan = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const [plan] = await db.promise().query(
      `SELECT
          s.id,
          s.status,
          s.start_date,
          s.end_date,
          p.name AS plan_name,
          p.description,
          p.price,
          p.max_employees,
          p.duration_days,
          p.features
       FROM subscriptions s
       JOIN subscription_plans p
       ON s.plan_id = p.id
       WHERE s.hostel_id = ?
       AND (s.status = 'active' OR s.status = 'trial')
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [hostel_id],
    );

    if (plan.length === 0) {
      return res.status(404).json({
        message: "No active subscription found!",
      });
    }

    const subscription = plan[0];

    const today = new Date();
    const expiryDate = new Date(subscription.end_date);

    const daysRemaining = Math.max(
      0,
      Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)),
    );

    return res.status(200).json({
      plan_name: subscription.plan_name,
      description: subscription.description,
      price: subscription.price,
      max_employees: subscription.max_employees,
      status: subscription.status,
      start_date: subscription.start_date,
      end_date: subscription.end_date,
      days_remaining: daysRemaining,
      features:
        typeof subscription.features === "string"
          ? JSON.parse(subscription.features)
          : subscription.features,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const subscriptionHistory = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    const [plans] = await db.promise().query(
      `SELECT
          s.id,
          p.name AS plan_name,
          p.price,
          p.max_employees,
          s.status,
          s.start_date,
          s.end_date,
          s.created_at
       FROM subscriptions s
       JOIN subscription_plans p
       ON s.plan_id = p.id
       WHERE s.hostel_id = ?
       ORDER BY s.created_at DESC`,
      [hostel_id],
    );

    return res.status(200).json(plans);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    if (req.user.role === "student") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    let query = "";
    let params = [];

    if (req.user.role === "admin") {
      query = `
        SELECT *
        FROM payment_transactions
        WHERE hostel_id = ?
        ORDER BY created_at DESC
      `;

      params = [req.user.hostel_id];
    } else if (req.user.role === "super_admin") {
      query = `
        SELECT
          p.*,
          h.hostel_name
        FROM payment_transactions p
        JOIN hostels h
        ON p.hostel_id = h.id
        ORDER BY p.created_at DESC
      `;
    }

    const [payments] = await db.promise().query(query, params);

    return res.status(200).json(payments);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionDetails,
  purchasePlan,
  currentPlan,
  subscriptionHistory,
  getPaymentHistory,
};
