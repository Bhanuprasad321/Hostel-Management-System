import { useEffect, useState } from "react";
import {
  BedDouble,
  Hash,
  Users2,
  Search,
  Plus,
  X,
  Loader2,
  RefreshCw,
  ExternalLink,
  CalendarDays,
  DoorOpen,
  LayoutGrid,
  Eye,
} from "lucide-react";
import api from "../services/api";

export default function RoomRoute() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Add Room Form State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Room Details Drawer State
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fetch Core Dataset
  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load dynamic real-estate room index.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Creation Handler
  const addRoom = async (e) => {
    e.preventDefault();
    if (!roomNumber || !capacity) {
      setError(
        "All metrics are strictly required to configure inventory slots.",
      );
      return;
    }
    try {
      setFormLoading(true);
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
        err?.response?.data?.message ||
          "Failed to finalize new room deployment context.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Unit Profile Drawer Lookups
  const openRoomDetails = async (id) => {
    try {
      setDetailsOpen(true);
      setDetailsLoading(true);
      const res = await api.get(`/rooms/${id}`);
      setSelectedRoom(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to pull target allocation insights.",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // Search Filter
  const filteredRooms = rooms.filter((room) =>
    room.room_number.toString().includes(search),
  );

  return (
    <div>
      {/* ─── Page Header Section ─── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rooms</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage hostel rooms and occupancy
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <button
            onClick={fetchRooms}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Room
          </button>
        </div>
      </div>

      {/* ─── Metric Blocks ─── */}
      <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <BedDouble className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Total Rooms
            </p>
            <h2 className="text-3xl font-bold text-slate-800 mt-0.5">
              {rooms.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Error Alert Display */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 animate-fadeIn">
          {error}
        </div>
      )}

      {/* ─── Control Utility Filter Row ─── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Total Rooms:{" "}
          <span className="font-semibold text-slate-700">
            {filteredRooms.length}
          </span>{" "}
          Rooms
        </p>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by room number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
      </div>

      {/* ─── Main Enterprise Data Table ─── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center bg-white">
          <BedDouble className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            {search
              ? "No matching room configurations found"
              : "No unit allocations compiled inside this structural cluster"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Room Number
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Capacity
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Occupancy
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {filteredRooms.map((room) => {
                  const isFull = room.current_occupancy >= room.capacity;
                  const isEmpty = room.current_occupancy === 0;

                  return (
                    <tr
                      key={room.id}
                      onClick={() => openRoomDetails(room.room_number)}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            Room {room.room_number}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-normal">
                        <div className="flex items-center gap-1.5">
                          <Users2 className="h-4 w-4 text-slate-400" />
                          <span>{room.capacity} Slots Available</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            isFull
                              ? "bg-rose-50 text-rose-700"
                              : isEmpty
                                ? "bg-slate-100 text-slate-600"
                                : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${isFull ? "bg-rose-600" : isEmpty ? "bg-slate-400" : "bg-emerald-600"}`}
                          />
                          {room.current_occupancy} / {room.capacity} Occupied
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => openRoomDetails(room.room_number)}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Add Room Modal ─── */}
      {openAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                  <DoorOpen className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-800">
                    Add Room
                  </h2>
                  <p className="text-xs text-slate-400">
                    Create a new room for your hostel
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpenAddModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={addRoom} className="px-6 py-5 space-y-4">
              {/* Room Number */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Room Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    placeholder="e.g. 301"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                    required
                  />
                </div>
              </div>

              {/* Capacity */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Room Capacity
                </label>
                <div className="relative">
                  <Users2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    placeholder="e.g. 4"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                    required
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50 mt-5">
                <button
                  type="button"
                  onClick={() => setOpenAddModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors shadow-sm"
                >
                  {formLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {formLoading ? "Creating..." : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Room Metrics Insights Modal ─── */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                  <BedDouble className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-800">
                    Room Details
                  </h2>
                  <p className="text-xs text-slate-400">
                    Room information and occupancy
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDetailsOpen(false);
                  setSelectedRoom(null);
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Profile Sheet */}
            <div className="p-6">
              {detailsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-xs text-slate-400">
                    Loading the Room data...
                  </p>
                </div>
              ) : selectedRoom ? (
                <div className="space-y-5">
                  {/* Summary Core Block */}
                  <div className="flex items-center gap-4 rounded-xl bg-slate-50 border border-slate-100 p-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-800 truncate">
                        Room {selectedRoom[0].room_number}
                        {console.log(selectedRoom)}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">
                        Room ID: #{selectedRoom[0].hostel_id}
                      </p>
                    </div>
                  </div>

                  {/* Field Breakdown Grid */}
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Room Capacity
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        {selectedRoom[0].capacity} Beds
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Current Occupancy
                      </span>
                      <span
                        className={`text-sm font-semibold ${selectedRoom[0].current_occupancy >= selectedRoom[0].capacity ? "text-rose-600" : "text-emerald-600"}`}
                      >
                        {selectedRoom[0].current_occupancy} Assigned
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-medium flex items-center gap-1">
                        <CalendarDays className="h-3 w-3 text-slate-400" />
                        Created On
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        {new Date(
                          selectedRoom[0].created_at,
                        ).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Operational Controls dismiss hook */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setDetailsOpen(false);
                        setSelectedRoom(null);
                      }}
                      className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 text-center font-medium">
                  Failed to parse current target room configuration parameters.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
