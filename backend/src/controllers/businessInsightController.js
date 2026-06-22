const { db } = require("../config/mysql");

const getBusinessInsights = async (req, res) => {
  try {
    const [[revenue]] = await db.promise().query(`
      SELECT
      IFNULL(SUM(amount),0) AS total_revenue
      FROM payment_transactions
      WHERE status = 'success'
    `);

    const [[payments]] = await db.promise().query(`
      SELECT
      COUNT(*) AS total_payments
      FROM payment_transactions
      WHERE status = 'success'
    `);

    const [[avgRevenue]] = await db.promise().query(`
      SELECT
      ROUND(
        IFNULL(SUM(amount),0) /
        NULLIF(COUNT(DISTINCT hostel_id),0),
        2
      ) AS average_revenue
      FROM payment_transactions
      WHERE status = 'success'
    `);

    const [recentPayments] = await db.promise().query(`
      SELECT
      pt.id,
      h.hostel_name,
      pt.amount,
      pt.payment_provider,
      pt.transaction_id,
      pt.created_at
      FROM payment_transactions pt
      JOIN hostels h
      ON pt.hostel_id = h.id
      WHERE pt.status = 'success'
      ORDER BY pt.created_at DESC
      LIMIT 10
    `);

    const [topHostels] = await db.promise().query(`
      SELECT
      h.id,
      h.hostel_name,
      SUM(pt.amount) AS revenue
      FROM payment_transactions pt
      JOIN hostels h
      ON pt.hostel_id = h.id
      WHERE pt.status = 'success'
      GROUP BY h.id
      ORDER BY revenue DESC
      LIMIT 10
    `);

    return res.status(200).json({
      summary: {
        total_revenue: revenue.total_revenue,
        total_payments: payments.total_payments,
        average_revenue_per_hostel: avgRevenue.average_revenue || 0,
      },

      recent_payments: recentPayments,

      top_hostels_by_revenue: topHostels,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getBusinessInsights,
};
