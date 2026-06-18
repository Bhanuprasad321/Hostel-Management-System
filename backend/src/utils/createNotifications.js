const { db } = require("../config/mysql");

const createNotification = async (
  hostel_id,
  user_id,
  title,
  message,
  notification_scope = "hostel",
) => {
  try {
    await db
      .promise()
      .query(
        "INSERT INTO notifications (hostel_id,user_id,title,message,notification_scope) VALUES (?,?,?,?,?)",
        [hostel_id, user_id, title, message, notification_scope],
      );
  } catch (err) {
    console.log("Notication error:", err);
  }
};

module.exports = createNotification;
