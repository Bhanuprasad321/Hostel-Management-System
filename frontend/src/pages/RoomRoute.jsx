import { useEffect, useState } from "react";
import api from "../services/api";

const RoomRoute = () => {
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // Add Room Modal
  const [openAddModal, setOpenAddModal] = useState(false);

  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  // Room Details Modal
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // GET /rooms
  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load rooms"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // POST /rooms
  const addRoom = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await api.post("/rooms", {
        room_number: Number(roomNumber),
        capacity: Number(capacity),
      });

      setRoomNumber("");
      setCapacity("");

      setOpenAddModal(false);

      fetchRooms();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to create room"
      );
    }
  };

  // GET /rooms/:id
  const openRoomDetails = async (id) => {
    try {
      setDetailsOpen(true);
      setDetailsLoading(true);

      const res = await api.get(`/rooms/${id}`);
      setSelectedRoom(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load room details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // Search Filter
  const filteredRooms = rooms.filter((room) =>
    room.room_number
      .toString()
      .includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Rooms
          </h1>

          <p className="text-slate-500">
            Manage all room records
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchRooms}
            className="px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-slate-100"
          >
            Refresh
          </button>

          <button
            onClick={() => setOpenAddModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + Add Room
          </button>
        </div>
      </div>

      {/* TOTAL ROOMS CARD */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6 max-w-xs">
          <p className="text-slate-500 text-sm">
            Total Rooms
          </p>

          <h2 className="text-4xl font-bold text-slate-800 mt-2">
            {rooms.length}
          </h2>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* SEARCH */}
      <div className="bg-white border rounded-xl shadow-sm p-3 mb-6">
        <input
          type="text"
          placeholder="Search by room number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading rooms...
          </div>
        ) : (
          <table className="w-full">

            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-4">
                  Room Number
                </th>

                <th className="text-left p-4">
                  Capacity
                </th>

                <th className="text-left p-4">
                  Occupancy
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <tr
                    key={room.id}
                    onClick={() =>
                      openRoomDetails(room.room_number)
                    }
                    className="border-t hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="p-4 font-medium">
                      {room.room_number}
                    </td>

                    <td className="p-4">
                      {room.capacity}
                    </td>

                    <td className="p-4">
                      {room.current_occupancy}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center p-8 text-slate-500"
                  >
                    No rooms found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        )}
      </div>

      {/* ADD ROOM MODAL */}
      {openAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

            <h2 className="text-xl font-bold mb-4">
              Add Room
            </h2>

            <form
              onSubmit={addRoom}
              className="space-y-4"
            >

              <input
                type="number"
                placeholder="Room Number"
                value={roomNumber}
                onChange={(e) =>
                  setRoomNumber(e.target.value)
                }
                className="w-full border rounded-lg p-3"
                required
              />

              <input
                type="number"
                placeholder="Capacity"
                value={capacity}
                onChange={(e) =>
                  setCapacity(e.target.value)
                }
                className="w-full border rounded-lg p-3"
                required
              />

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setOpenAddModal(false)
                  }
                  className="px-4 py-2 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Save
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* ROOM DETAILS MODAL */}
      {detailsOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative">

            <button
              onClick={() => {
                setDetailsOpen(false);
                setSelectedRoom(null);
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-black"
            >
              ✕
            </button>

            {detailsLoading ? (
              <div className="text-center py-10">
                Loading room details...
              </div>
            ) : selectedRoom ? (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  Room Details
                </h2>

                <div className="space-y-4">

                  <div>
                    <p className="text-slate-500 text-sm">
                      Room Number
                    </p>

                    <p className="font-semibold">
                      {selectedRoom.roomNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-sm">
                      Capacity
                    </p>

                    <p className="font-semibold">
                      {selectedRoom.capacity}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-sm">
                      Current Occupancy
                    </p>

                    <p className="font-semibold">
                      {selectedRoom.current_occupancy}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-sm">
                      Hostel ID
                    </p>

                    <p className="font-semibold">
                      {selectedRoom.hostel_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-sm">
                      Created At
                    </p>

                    <p className="font-semibold">
                      {new Date(
                        selectedRoom.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>

                </div>
              </>
            ) : (
              <div className="text-center text-red-500">
                Failed to load room details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomRoute;