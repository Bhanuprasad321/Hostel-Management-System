const { db } = require("../config/mysql");

const getAdminDashbordStats = async (req, res) => {
  try {
    //total rooms , total students , occupied rooms , vacant rooms , active allocations
    const hostel_id = req.user.hostel_id;
    const [rooms] = await db
      .promise()
      .query("SELECT count(*) AS count FROM rooms WHERE hostel_id=?", [
        hostel_id,
      ]);
    const total_rooms = rooms[0].count;

    const [students] = await db
      .promise()
      .query(
        "SELECT count(*) AS count FROM users WHERE hostel_id = ? AND role = ?",
        [hostel_id, "student"],
      );
    const total_students = students[0].count;

    const [occRooms] = await db
      .promise()
      .query(
        "SELECT count(*) AS count FROM rooms WHERE hostel_id = ? AND (current_occupancy>0)",
        [hostel_id],
      );
    const occupied_rooms = occRooms[0].count;

    const vacated_rooms = total_rooms - occupied_rooms;

    const [actAllocations] = await db
      .promise()
      .query(
        "SELECT count(*) AS count FROM allocations WHERE hostel_id = ? AND status = ?",
        [hostel_id, "active"],
      );
    const active_allocations = actAllocations[0].count;

    return res.status(200).json({
      total_rooms,
      total_students,
      occupied_rooms,
      vacated_rooms,
      active_allocations,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getSuperAdminDashboardStats = async (req, res) => {
  try {
    //total hostels , total admins , total students , total rooms , active allocations , vacated allocations
    const [hostels] = await db
      .promise()
      .query("SELECT count(*) AS count FROM hostels");
    const total_hostels = hostels[0].count;

    const [admins] = await db
      .promise()
      .query("SELECT count(*) AS count FROM users WHERE role = ?", ["admin"]);
    const total_admins = admins[0].count;

    const [rooms] = await db
      .promise()
      .query("SELECT count(*) AS count FROM rooms");
    const total_rooms = rooms[0].count;

    const [students] = await db
      .promise()
      .query("SELECT count(*) AS count FROM users WHERE role = ?", ["student"]);
    const total_students = students[0].count;

    const [actAllocations] = await db
      .promise()
      .query("SELECT count(*) AS count FROM allocations WHERE status = ?", [
        "active",
      ]);
    const active_allocations = actAllocations[0].count;

    const [vacAllocations] = await db
      .promise()
      .query("SELECT count(*) AS count FROM allocations WHERE status = ?", [
        "vacated",
      ]);
    const vacated_allocations = vacAllocations[0].count;

    return res.status(200).json({
      total_hostels,
      total_admins,
      total_rooms,
      total_students,
      active_allocations,
      vacated_allocations,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAdminDashbordStats, getSuperAdminDashboardStats };
