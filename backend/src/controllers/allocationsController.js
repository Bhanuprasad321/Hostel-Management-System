const { db } = require("../config/mysql");
const createNotification = require("../utils/createNotifications");
const createAuditLog = require("../utils/auditLog");
const createAllocation = async (req, res) => {
  let connection = await db.promise().getConnection();
  try {
    //goal:
    //user exists?
    //room exists?
    //do student,room belongs to same hostel
    //is room full?
    //Does student already have an active allocation?
    const { student_id, room_id } = req.body;
    if (!student_id || !room_id) {
      return res.status(400).json({ message: "All the Fields are required!" });
    }
    const hostel_id = req.user.hostel_id;
    const [student] = await db
      .promise()
      .query("SELECT * FROM users WHERE id = ? AND hostel_id=?", [
        student_id,
        hostel_id,
      ]);
    if (student.length === 0 || student[0].role !== "student")
      return res
        .status(404)
        .json({ message: "Student with entered id is not found" });

    const [room] = await db
      .promise()
      .query("SELECT * FROM rooms WHERE id = ? AND hostel_id = ?", [
        room_id,
        hostel_id,
      ]);
    if (room.length === 0)
      return res
        .status(404)
        .json({ message: "Room with entered id is not found" });

    const [allocation] = await db
      .promise()
      .query(
        "SELECT * FROM allocations WHERE student_id = ? AND status='active'",
        [student_id],
      );
    if (allocation.length !== 0)
      return res.status(409).json({
        message: "Already There is an active allocation on entered student id",
      });

    if (room[0].current_occupancy >= room[0].capacity)
      return res
        .status(409)
        .json({ message: "The room with entered ID is already full" });
    //creating a new allocation

    await connection.beginTransaction();
    await connection.query(
      "INSERT INTO allocations(hostel_id,student_id,room_id,status) VALUES (?,?,?,?)",
      [hostel_id, student_id, room_id, "active"],
    );
    await connection.query(
      "UPDATE rooms SET current_occupancy = ? WHERE hostel_id = ? AND id = ?",
      [room[0].current_occupancy + 1, hostel_id, room_id],
    );
    await connection.commit();
    await createAuditLog(
      hostel_id,
      req.user.id,
      `Allocated student ${student_id} to room ${room_id}`,
    );
    await createNotification(
      hostel_id,
      req.user.id,
      "Allocation Created",
      `${student[0].name} was allocated to room ${room[0].room_number}`,
    );
    return res
      .status(200)
      .json({ message: "Successfully allocated the room to the student" });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

const getAllAllocations = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;
    const [allocations] = await db
      .promise()
      .query("SELECT * FROM allocations WHERE hostel_id = ?", [hostel_id]);
    return res.status(200).json(allocations);
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllocation = async (req, res) => {
  try {
    const allocation_id = req.params.id;
    const hostel_id = req.user.hostel_id;
    const [allocation] = await db
      .promise()
      .query("SELECT * FROM allocations WHERE hostel_id = ? AND id = ?", [
        hostel_id,
        allocation_id,
      ]);
    if (allocation.length === 0) {
      return res.status(404).json({ message: "404 Not Found" });
    }
    return res.status(200).json({
      student_id: allocation[0].student_id,
      room_id: allocation[0].room_id,
      status: allocation[0].status,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const vacateStudent = async (req, res) => {
  let connection = await db.promise().getConnection();
  try {
    const student_id = req.params.id;
    const hostel_id = req.user.hostel_id;
    const [allocation] = await db
      .promise()
      .query(
        "SELECT * FROM allocations WHERE student_id = ? AND status= ? AND hostel_id = ?",
        [student_id, "active", hostel_id],
      );
    if (allocation.length === 0)
      return res.status(400).json({
        message: "No active allocation found with entered student id",
      });
    const room_id = allocation[0].room_id;
    const allocation_id = allocation[0].id;
    await connection.beginTransaction();
    await connection.query(
      "UPDATE allocations SET status = ? , vacated_at = NOW() WHERE id = ? AND student_id = ?",
      ["vacated", allocation_id, student_id],
    );
    const [room] = await connection.query(
      "SELECT * FROM rooms WHERE id = ? AND hostel_id=?",
      [room_id, hostel_id],
    );
    await connection.query(
      "UPDATE rooms SET current_occupancy = ? WHERE id = ?",
      [room[0].current_occupancy - 1, room_id],
    );
    await connection.commit();
    await createAuditLog(
      hostel_id,
      req.user.id,
      `Vacated student ${student_id}`,
    );
    await createNotification(
      hostel_id,
      req.user.id,
      "Student Vacated",
      `${name} vacated the room ${room[0].room_number}`,
    );
    return res
      .status(200)
      .json({ message: "Successfully updated the vacated data" });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    return res.status(500).json({ messag: "Internal server error" });
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

module.exports = {
  createAllocation,
  getAllAllocations,
  getAllocation,
  vacateStudent,
};
