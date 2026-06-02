const { db } = require("../config/mysql");

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

const updateRoom = async (req, res) => { //need to change
  try {
    const { capacity, current_occupancy } = req.body;
    const hostel_id = req.user.hostel_id;
    const room_number = req.params.id;
    if (!capacity || current_occupancy>=0) {
      return res.status(200).json({ message: "The entries cannot be empty" });
    }

    await db
      .promise()
      .query(
        "UPDATE rooms SET capacity = ? , current_occupancy = ? WHERE hostel_id = ? AND room_number = ?",
        [capacity, current_occupancy, hostel_id, room_number],
      );
    return res
      .status(200)
      .json({ message: "Successfully updated the room details" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {createRoom,getAllRooms,getRoomDetails,updateRoom};