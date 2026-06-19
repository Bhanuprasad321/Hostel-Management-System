const { db } = require("../config/mysql");

const createPlan = async (req, res) => {
  try {
    const { name, description, price, max_employees, duration_days, features } =
      req.body;
    if (!name || !max_employees || !duration_days) {
      return res.status(400).json({ message: "Some Fields need to filled." });
    }
    const [dup] = await db
      .promise()
      .query("SELECT * FROM subscription_plans WHERE name = ?", [name]);
    if (dup.length !== 0) {
      return res
        .status(409)
        .json({ message: "Already plan exists with entered name!" });
    }
    if (price < 0 || max_employees < 1 || duration_days < 1) {
      return res.status(422).json({ message: "Enter valid data!" });
    }
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO subscription_plans (name,description,price,max_employees,duration_days,features) VALUES (?,?,?,?,?,?)",
        [
          name,
          description,
          price,
          max_employees,
          duration_days,
          JSON.stringify(features),
        ],
      );
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Unable to create a new plan" });
    }
    return res
      .status(201)
      .json({ message: "Successfully created a new subscription plan" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getPlans = async (req, res) => {
  try {
    const [plans] = await db
      .promise()
      .query("SELECT * FROM subscription_plans");
    return res.status(200).json(plans);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updatePlan = async (req, res) => {
  try {
    const id = req.params.id;
    const [plan] = await db
      .promise()
      .query("SELECT * FROM subscription_plans WHERE id = ?", [id]);
    if (plan.length === 0) {
      return res.status(404).json({ message: "No Plan found with ID" });
    }
    const { name, description, price, max_employees, duration_days, features } =
      req.body;
    if (!name || !max_employees || !duration_days) {
      return res.status(400).json({ message: "Some Fields need to filled." });
    }
    const [dup] = await db
      .promise()
      .query("SELECT * FROM subscription_plans WHERE name = ? AND id != ?", [
        name,
        id,
      ]);
    if (dup.length !== 0) {
      return res
        .status(409)
        .json({ message: "Already plan exists with entered name!" });
    }
    const [result] = await db
      .promise()
      .query(
        "UPDATE subscription_plans SET name = ?, description = ?, price = ?, max_employees = ?, duration_days = ?, features = ? WHERE id = ?",
        [
          name,
          description,
          price,
          max_employees,
          duration_days,
          JSON.stringify(features),
          id,
        ],
      );
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Unable to create a new plan" });
    }
    return res
      .status(200)
      .json({ message: "Successfully updated the plan details" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAdminPlan = async (req, res) => {
  try {
    const [plans] = await db.promise().query(
      `SELECT
          id,
          name,
          description,
          price,
          max_employees,
          duration_days,
          features
       FROM subscription_plans
       ORDER BY price ASC`,
    );

    return res.status(200).json(plans);
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deletePlan = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db
      .promise()
      .query("SELECT * FROM subscription_plans WHERE id = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "No Plan found with ID" });
    }
    await db
      .promise()
      .query("DELETE FROM subscription_plans WHERE id = ?", [id]);
    return res.status(200).json({ message: "successfully delted the plan" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan,
  getAdminPlan,
};
