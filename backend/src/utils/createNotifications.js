const { db } = require("../config/mysql");

const createNotification = async (hostel_id, user_id, title, message) => {
  try {
    await db
      .promise()
      .query(
        "INSERT INTO notifications (hostel_id,user_id,title,message) VALUES (?,?,?,?)",
        [hostel_id, user_id, title, message],
      );
  } catch (err) {
    console.log("Notication error:",err);
  }
};


module.exports = createNotification;