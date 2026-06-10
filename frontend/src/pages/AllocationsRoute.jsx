import { useEffect, useState } from "react";
import {
  ClipboardList,
  User,
  BedDouble,
  Search,
  Plus,
  X,
  Loader2,
  RefreshCw,
  ExternalLink,
  UserMinus,
  CheckCircle2,
  History,
  ShieldAlert,
} from "lucide-react";
import api from "../services/api";

export default function AllocationsRoute() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Add Allocation Form State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Allocation Details Drawer State
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);

  // Inline action state to track which row is updating
  const [processingId, setProcessingId] = useState(null);

  // Fetch Core Dataset
  const fetchAllocations = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/allocations");
      // Handle array payload safely if wrapped inside data objects
      setAllocations(
        Array.isArray(res.data) ? res.data : res.data?.allocations || [],
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load active room allocation matrix.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  // Creation Handler
  const createAllocation = async (e) => {
    e.preventDefault();
    if (!studentId || !roomId) {
      setError("Both Student ID and Target Room ID are mandatory keys.");
      return;
    }
    try {
      setFormLoading(true);
      setError("");

      await api.post("/allocations", {
        student_id: Number(studentId),
        room_id: Number(roomId),
      });

      setStudentId("");
      setRoomId("");
      setOpenAddModal(false);

      fetchAllocations();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to execute housing assignment mapping.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Vacate Processing Handler
  const handleVacateStudent = async (e, id) => {
    e.stopPropagation(); // Stop row click trigger
    if (
      !window.confirm(
        "Are you certain you want to transition this housing allocation status to Vacated?",
      )
    )
      return;

    try {
      setProcessingId(id);
      setError("");
      await api.put(`/allocations/${id}`);
      fetchAllocations();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to update structural vacating sequence.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Profile Details Lookups
  const openAllocationDetails = async (id) => {
    try {
      setDetailsOpen(true);
      setDetailsLoading(true);
      const res = await api.get(`/allocations/${id}`);
      setSelectedAllocation(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to pull operational registry summary.",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // Search Filter parsing (Checks room ID, student ID, or live status text)
  const filteredAllocations = allocations.filter((item) => {
    const sTerm = search.toLowerCase();
    return (
      item.room_id?.toString().includes(sTerm) ||
      item.student_id?.toString().includes(sTerm) ||
      item.status?.toLowerCase().includes(sTerm) ||
      item.id?.toString().includes(sTerm)
    );
  });

  // Derived Metrics
  const activeCount = allocations.filter((a) => a.status !== "vacated").length;

  return (
    <div>
      {/* ─── Page Header Section ─── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Room Allocations
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Map student profiles to configured room numbers and manage tenure
            terms
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <button
            onClick={fetchAllocations}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Sync Registry
          </button>
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Assign Room
          </button>
        </div>
      </div>

      {/* ─── Metric Dashboard Blocks ─── */}
      <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Active Placements
            </p>
            <h2 className="text-3xl font-bold text-slate-800 mt-0.5">
              {activeCount}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
            <History className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Total Ledger Entries
            </p>
            <h2 className="text-3xl font-bold text-slate-800 mt-0.5">
              {allocations.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Error Alert Display */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 animate-fadeIn flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── Control Utility Filter Row ─── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredAllocations.length}
          </span>{" "}
          tracking profiles
        </p>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID or Status..."
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
      ) : filteredAllocations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center bg-white">
          <ClipboardList className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            {search
              ? "No matching allocation data points"
              : "No assignments registered inside this node"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Allocation Reference
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Target Space Asset
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Tenant Identity ID
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Current Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {filteredAllocations.map((item) => {
                  const isVacated = item.status === "vacated";

                  return (
                    <tr
                      key={item.id}
                      onClick={() => openAllocationDetails(item.id)}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                    >
                      {/* Reference Assignment ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          Assignment #{item.id || "N/A"}
                        </span>
                      </td>

                      {/* Target Room Mapping */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <BedDouble className="h-4 w-4 text-slate-400" />
                          <span>Room No. {item.room_id}</span>
                        </div>
                      </td>

                      {/* Tenant Assignment Identity */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-normal">
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4 text-slate-400" />
                          <span>UID: {item.student_id}</span>
                        </div>
                      </td>

                      {/* Dynamic Status Badge formatting */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            isVacated
                              ? "bg-slate-100 text-slate-600"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${isVacated ? "bg-slate-400" : "bg-emerald-600"}`}
                          />
                          {isVacated ? "Vacated" : "Active Placement"}
                        </span>
                      </td>

                      {/* Inline Actions Drawer trigger map overrides */}
                      <td
                        className="px-6 py-4 whitespace-nowrap text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          {!isVacated && (
                            <button
                              onClick={(e) =>
                                handleVacateStudent(e, item.student_id)
                              }
                              disabled={
                                processingId === (item.id || item.student_id)
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 transition px-3 py-1.5 text-xs font-semibold shadow-xs disabled:opacity-50"
                            >
                              {processingId === (item.id || item.student_id) ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <UserMinus className="h-3 w-3" />
                              )}
                              Vacate
                            </button>
                          )}
                          <button
                            onClick={() => openAllocationDetails(item.id)}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:border-indigo-400 hover:text-indigo-600 transition shadow-sm"
                          >
                            Inspect
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Add Allocation Modal ─── */}
      {openAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                  <ClipboardList className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-800">
                    Assign Housing Placement
                  </h2>
                  <p className="text-xs text-slate-400">
                    Map an academic tenant profile to an open room asset
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpenAddModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={createAllocation} className="px-6 py-5 space-y-4">
              {/* Student System ID */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Student System ID
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    placeholder="Enter registration tracking index e.g. 12"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                    required
                  />
                </div>
              </div>

              {/* Target Room Assignment Identifier */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Target Room System ID
                </label>
                <div className="relative">
                  <BedDouble className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    placeholder="Enter structural asset system ID e.g. 6"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
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
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 transition shadow-sm"
                >
                  {formLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {formLoading ? "Saving Mapping..." : "Execute Placement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Allocation Registry Detailed Summary Sheet ─── */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                  <ClipboardList className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-800">
                    Assignment File Summary
                  </h2>
                  <p className="text-xs text-slate-400">
                    Granular log breakdown of tracking registry
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDetailsOpen(false);
                  setSelectedAllocation(null);
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Sheet */}
            <div className="p-6">
              {detailsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-xs text-slate-400">
                    Querying registry matrix nodes...
                  </p>
                </div>
              ) : selectedAllocation ? (
                <div className="space-y-5">
                  {/* Visual Status Highlight Card */}
                  <div
                    className={`flex items-center gap-4 rounded-xl border p-4 ${
                      selectedAllocation.status === "vacated"
                        ? "bg-slate-50 border-slate-100"
                        : "bg-emerald-50/40 border-emerald-100/60"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-xs font-bold text-white ${
                        selectedAllocation.status === "vacated"
                          ? "bg-slate-400"
                          : "bg-emerald-600"
                      }`}
                    >
                      {selectedAllocation.room_id
                        ? `N°${selectedAllocation.room_id}`
                        : "#"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-800">
                        Room Unit {selectedAllocation.room_id}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">
                        Current Lifecycle Status:{" "}
                        <span
                          className={
                            selectedAllocation.status === "vacated"
                              ? "text-slate-600 font-semibold"
                              : "text-emerald-700 font-bold"
                          }
                        >
                          {selectedAllocation.status?.toUpperCase() || "ACTIVE"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Operational Data Breakdown Rows */}
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        Target Tenant System ID
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        ID #{selectedAllocation.student_id}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <BedDouble className="h-3.5 w-3.5 text-slate-400" />
                        Allocated Room Identifier
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        Room ID #{selectedAllocation.room_id}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <ClipboardList className="h-3.5 w-3.5 text-slate-400" />
                        Tenure Status Condition
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                          selectedAllocation.status === "vacated"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {selectedAllocation.status || "allocated"}
                      </span>
                    </div>
                  </div>

                  {/* Layout Dismissal Layer Hook */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setDetailsOpen(false);
                        setSelectedAllocation(null);
                      }}
                      className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                    >
                      Dismiss Blueprint Summary
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 text-center font-medium">
                  Failed to securely map schema definitions for chosen profile.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
