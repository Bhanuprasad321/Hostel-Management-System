const { db } = require("../config/mysql");

const getAllSubscriptions = async (req, res) => {
  try {
    const [sub] = await db
      .promise()
      .query(
        "SELECT s.id, h.hostel_name,s.plan,s.status,s.start_date,s.end_date FROM subscriptions s JOIN hostels h ON s.hostel_id = h.id",
      );
    res.status(200).json(sub);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSubscriptionDetails = async (req, res) => {
  try {
    const sub_id = req.params.id;
    const [sub] = await db
      .promise()
      .query(
        "SELECT s.*, h.hostel_name FROM subscriptions s JOIN hostels h ON s.hostel_id = h.id WHERE s.id = ?",
        [sub_id],
      );
    if (sub.length === 0) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }
    const diffInDays = Math.ceil(
      (new Date(sub[0].end_date) - new Date()) / (1000 * 60 * 60 * 24),
    );
    res.json({
      hostel_name: sub[0].hostel_name,
      plan: sub[0].plan,
      status: sub[0].status,
      start_date: sub[0].start_date,
      end_date: sub[0].end_date,
      days_remaining: diffInDays,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const upgradePlan = async (req, res) => {
  try {
    const validPlans = ["trial", "basic", "pro"];
    const validStatuses = ["trial", "active", "expired", "cancelled"];
    const sub_id = req.params.id;
    const { plan, status } = req.body;
    if (!plan || !status) {
      return res.status(400).json({ message: "Both fields are required!" });
    }
    if (!validPlans.includes(plan)) {
      return res.status(400).json({
        message: "Invalid plan",
      });
    }
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const [result] = await db
      .promise()
      .query("UPDATE subscriptions SET plan = ? , status = ? WHERE id = ?", [
        plan,
        status,
        sub_id,
      ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }
    res
      .status(200)
      .json({ message: "Successfully updated the subscription plan" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error " });
  }
};

const renewalPlan = async (req, res) => {
  try {
    const sub_id = req.params.id;
    const [sub] = await db
      .promise()
      .query("SELECT * FROM subscriptions WHERE id = ?", [sub_id]);
    if (sub.length === 0)
      return res.status(404).json({ message: "Subscription not found" });
    const newEndDate = new Date(sub[0].end_date);
    newEndDate.setDate(newEndDate.getDate() + 30);
    await db
      .promise()
      .query("UPDATE subscriptions SET end_date = ?, status = ? WHERE id = ?", [
        newEndDate,
        "active",
        sub_id,
      ]);
    return res.status(200).json({ message: "Successfully renewed the plan" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionDetails,
  upgradePlan,
  renewalPlan,
};
