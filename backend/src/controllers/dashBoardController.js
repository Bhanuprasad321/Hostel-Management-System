const { db } = require("../config/mysql");

const getAdminDashbordStats = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;

    // Total Rooms
    const [rooms] = await db
      .promise()
      .query("SELECT COUNT(*) AS count FROM rooms WHERE hostel_id = ?", [
        hostel_id,
      ]);

    const total_rooms = rooms[0].count;

    // Total Students
    const [students] = await db
      .promise()
      .query(
        "SELECT COUNT(*) AS count FROM users WHERE hostel_id = ? AND role = ?",
        [hostel_id, "student"],
      );

    const total_students = students[0].count;

    // Occupied Rooms
    const [occRooms] = await db
      .promise()
      .query(
        "SELECT COUNT(*) AS count FROM rooms WHERE hostel_id = ? AND current_occupancy > 0",
        [hostel_id],
      );

    const occupied_rooms = occRooms[0].count;

    // Vacant Rooms
    const vacant_rooms = total_rooms - occupied_rooms;

    // Active Allocations
    const [actAllocations] = await db
      .promise()
      .query(
        "SELECT COUNT(*) AS count FROM allocations WHERE hostel_id = ? AND status = ?",
        [hostel_id, "active"],
      );

    const active_allocations = actAllocations[0].count;

    // Vacated Allocations
    const [vacAllocations] = await db
      .promise()
      .query(
        "SELECT COUNT(*) AS count FROM allocations WHERE hostel_id = ? AND status = ?",
        [hostel_id, "vacated"],
      );

    const vacated_allocations = vacAllocations[0].count;

    // Bed / Capacity Breakdown
    const [capacity] = await db.promise().query(
      `SELECT
          SUM(capacity) AS total_capacity,
          SUM(current_occupancy) AS occupied
        FROM rooms
        WHERE hostel_id = ?`,
      [hostel_id],
    );

    const total_capacity = capacity[0].total_capacity || 0;
    const occupied_beds = capacity[0].occupied || 0;

    const occupancy_breakdown = {
      occupied: occupied_beds,
      vacant: total_capacity - occupied_beds,
    };

    // Room Status Chart
    const room_status_breakdown = {
      occupied: occupied_rooms,
      vacant: vacant_rooms,
    };

    // Allocation Status Chart
    const allocation_breakdown = {
      active: active_allocations,
      vacated: vacated_allocations,
    };
    
    return res.status(200).json({
      total_rooms,
      total_students,
      occupied_rooms,
      vacant_rooms,
      active_allocations,

      occupancy_breakdown,
      room_status_breakdown,
      allocation_breakdown,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
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
    //subscription breakdown
    const subscription_breakdown = {
      trial: 0,
      active: 0,
      expired: 0,
      cancelled: 0,
    };
    const [sub] = await db
      .promise()
      .query(
        "SELECT status, COUNT(*) AS count FROM subscriptions GROUP BY status ORDER BY status",
      );
    sub.forEach((item) => {
      subscription_breakdown[item.status] = item.count;
    });
    //capacity breakdown
    const [capacity] = await db
      .promise()
      .query(
        "SELECT SUM(capacity) AS total_capacity, SUM(current_occupancy) AS occupied FROM rooms",
      );

    const total_capacity = capacity[0].total_capacity || 0;
    const occupied = capacity[0].occupied || 0;

    const capacity_breakdown = {
      occupied,
      vacant: total_capacity - occupied,
    };
    //top hostels
    const [top_hostels] = await db
      .promise()
      .query(
        "SELECT h.hostel_name,COUNT(u.id) AS students FROM hostels h LEFT JOIN users u ON h.id = u.hostel_id AND u.role = ? GROUP BY h.id ORDER BY students DESC LIMIT 5",
        ["student"],
      );

    return res.status(200).json({
      total_hostels,
      total_admins,
      total_rooms,
      total_students,
      active_allocations,
      vacated_allocations,
      subscription_breakdown,
      capacity_breakdown,
      top_hostels,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getStudentDashboardStats = async (req, res) => {
  try {
    const [student] = await db.promise().query(
      `SELECT u.name, h.hostel_name
   FROM users u
   JOIN hostels h ON u.hostel_id = h.id
   WHERE u.id = ?`,
      [req.user.id],
    );
    if (student.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    const [allocation] = await db.promise().query(
      `SELECT
      a.status,
      r.room_number,
      r.capacity,
      r.current_occupancy
   FROM allocations a
   JOIN rooms r ON a.room_id = r.id
   WHERE a.student_id = ?
   AND a.status = 'active'`,
      [req.user.id],
    );
    const [notifications] = await db.promise().query(
      `SELECT COUNT(*) AS unread_notifications
   FROM notifications
   WHERE user_id = ?
   AND is_read = FALSE`,
      [req.user.id],
    );
    return res.status(200).json({
      student_name: student[0].name,
      hostel_name: student[0].hostel_name,
      room_number: allocation[0]?.room_number || null,
      allocation_status: allocation[0]?.status || "Not Allocated",
      room_capacity: allocation[0]?.capacity || null,
      current_occupancy: allocation[0]?.current_occupancy || null,
      unread_notifications: notifications[0].unread_notifications,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAdminDashbordStats,
  getSuperAdminDashboardStats,
  getStudentDashboardStats,
};
