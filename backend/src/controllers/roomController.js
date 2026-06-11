const { db } = require("../config/mysql");
const createAuditLog = require("../utils/auditLog")
const createRoom = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;
    const { room_number, capacity } = req.body;
    if (!room_number || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const [rooms] = await db
      .promise()
      .query("SELECT * FROM rooms WHERE hostel_id = ? AND room_number = ?", [
        hostel_id,
        room_number,
      ]);
    if (rooms.length !== 0) {
      return res
        .status(409)
        .json({ message: "Already room with entered number exist" });
    }
    await db
      .promise()
      .query(
        "INSERT INTO rooms (hostel_id,room_number,capacity,current_occupancy) VALUES (?,?,?,?)",
        [hostel_id, room_number, capacity, 0],
      );
    await createAuditLog(hostel_id, req.user.id, `Created room ${room_number}`);
    return res.status(200).json({ message: "New room is created" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;
    const [rooms] = await db
      .promise()
      .query("SELECT * FROM rooms WHERE hostel_id = ?", [hostel_id]);
    return res.status(200).json(rooms);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getRoomDetails = async (req, res) => {
  try {
    const hostel_id = req.user.hostel_id;
    const room_number = req.params.id;
    const [room] = await db
      .promise()
      .query("SELECT * FROM rooms WHERE hostel_id = ? AND room_number = ?", [
        hostel_id,
        room_number,
      ]);
    if (room.length === 0)
      return res.status(404).json({ message: "404 Not found" });
    return res.status(200).json(room);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateRoom = async (req, res) => {
  //need to change
  try {
    const { capacity } = req.body;
    const hostel_id = req.user.hostel_id;
    const room_number = req.params.id;
    if (!capacity || capacity <= 0) {
      return res
        .status(400)
        .json({ message: "Enter the valid capacity value!" });
    }
    const [room] = await db
      .promise()
      .query("SELECT * FROM rooms WHERE hostel_id = ? AND room_number = ?", [
        hostel_id,
        room_number,
      ]);
    if (room.length === 0)
      return res
        .status(404)
        .json({ message: "No room found with entered room number" });
    const current_occupancy = room[0].current_occupancy;
    if (!(capacity >= current_occupancy)) {
      return res
        .status(409)
        .json({ message: "cannot update the capacity less than occupancy" });
    }
    await db
      .promise()
      .query(
        "UPDATE rooms SET capacity = ? WHERE hostel_id = ? AND room_number = ?",
        [capacity, hostel_id, room_number],
      );

    return res
      .status(200)
      .json({ message: "Successfully updated the room details" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createRoom, getAllRooms, getRoomDetails, updateRoom };
