import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  X,
  MapPin,
  Calendar,
  Loader2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Info,
  ShieldCheck,
  Clock,
} from "lucide-react";
import api from "../services/api";

function formatDate(iso) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Create Hostel Modal ──────────────────────────────────────
function CreateHostelModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ hostel_name: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.hostel_name.trim() || !form.address.trim()) {
      setError("Both fields are mandatory system keys.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/hostels/", form);
      onCreated();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "Failed to register new structural installation.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
              <Building2 className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800">
                Add New Hostel
              </h2>
              <p className="text-xs text-slate-400">
                Register a new hostel on the platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 animate-fadeIn">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Hostel Name
            </label>
            <input
              type="text"
              placeholder="e.g. Green Valley Hostel"
              value={form.hostel_name}
              onChange={(e) =>
                setForm({ ...form, hostel_name: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Hostel Address
            </label>
            <input
              type="text"
              placeholder="e.g. Gachibowli, Hyderabad"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 transition shadow-sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {loading ? "Adding..." : "Add Hostel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Hostel Details Modal ──────────────────────────────────────
function HostelDetailsModal({ hostel, onClose }) {
  if (!hostel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800">
                Hostel Details
              </h2>
              <p className="text-xs text-slate-400">
                View hostel information and status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Detailed Sheet Content */}
        <div className="p-6 space-y-5">
          {/* Main Context Card */}
          <div className="flex items-center gap-4 bg-slate-50 rounded-xl border border-slate-100 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
              {hostel.hostel_name
                ?.split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-slate-800 truncate">
                {hostel.hostel_name}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Hostel ID: #{hostel.id}
              </p>
            </div>
          </div>

          {/* Metrics List */}
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between items-start py-2.5 border-b border-slate-50">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Address
              </span>
              <span className="text-sm font-medium text-slate-700 text-right max-w-[60%] break-words">
                {hostel.address}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Status
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                {hostel.status}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Registration Date
              </span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {formatDate(hostel.created_at)}
              </span>
            </div>
          </div>

          {/* Dismiss Actions button */}
          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition shadow-xs"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function HostelsRoute() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);

  // Filtering & Sorting configuration states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("hostel_name");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hostels/");
      setHostels(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("System structural collection anomaly:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  // Sort Handler Dispatcher
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render configuration parsing for sort icons
  const renderSortIcon = (field) => {
    if (sortField !== field)
      return (
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-slate-400 opacity-60" />
      );
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-indigo-600" />
    ) : (
      <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-indigo-600" />
    );
  };

  // Pipeline execution: filter operations followed by active memory sorting
  const processedHostels = hostels
    .filter((h) => {
      const matchesSearch =
        h.hostel_name?.toLowerCase().includes(search.toLowerCase()) ||
        h.address?.toLowerCase().includes(search.toLowerCase()) ||
        h.id?.toString().includes(search);

      const currentStatus = h.status;
      const matchesStatus =
        statusFilter === "all" ||
        currentStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let valA = a[sortField] ? a[sortField].toString().toLowerCase() : "";
      let valB = b[sortField] ? b[sortField].toString().toLowerCase() : "";

      if (sortField === "id" || sortField === "created_at") {
        valA = a[sortField];
        valB = b[sortField];
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hostels</h2>
          <p className="mt-1 text-sm text-slate-500">
            {hostels.length} hostel{hostels.length !== 1 ? "s" : ""} currently
            registered on the platform
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New Hostel
        </button>
      </div>

      {/* Control Utility Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Parameter */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets by name, city or index ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-white"
          />
        </div>

        {/* Dynamic Status Dropdown Menu Mapping */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Filter By Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer shadow-sm"
          >
            <option value="all">All Hostels</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Central Architecture Dataset Workspace */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : processedHostels.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center bg-white">
          <Building2 className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            {search || statusFilter !== "all"
              ? "No asset configurations match parameters"
              : "No hostel assets configured inside engine"}
          </p>
          {!search && statusFilter === "all" && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-sm font-medium text-indigo-600 hover:underline"
            >
              Create your first hostel node →
            </button>
          )}
        </div>
      ) : (
        /* Unified Enterprise Data Table Container */
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
                <tr>
                  <th
                    scope="col"
                    onClick={() => handleSort("id")}
                    className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center">
                      Hostel {renderSortIcon("id")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("hostel_name")}
                    className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center">
                      Hostel Name {renderSortIcon("hostel_name")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("address")}
                    className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center">
                      Hostel Address {renderSortIcon("address")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center">Status</div>
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("created_at")}
                    className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center">
                      Registration Date {renderSortIcon("created_at")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {processedHostels.map((h) => {
                  const initials =
                    h.hostel_name
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "H";
                  const currentStatus = h.status || "Active";

                  return (
                    <tr
                      key={h.id}
                      onClick={() => setSelectedHostel(h)}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                    >
                      {/* ID Index code */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-normal">
                        # {h.id}
                      </td>

                      {/* Hostel Profile Identity Node */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-xs">
                            {h.hostel_name}
                          </span>
                        </div>
                      </td>

                      {/* Map Location Details string alignment */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-normal">
                        <div className="flex items-center gap-1.5 max-w-xs truncate">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span>{h.address}</span>
                        </div>
                      </td>

                      {/* Status Badge Mapping Matrix layout wrapper */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            currentStatus.toLowerCase() === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${currentStatus.toLowerCase() === "active" ? "bg-emerald-600" : "bg-slate-400"}`}
                          />
                          {currentStatus}
                        </span>
                      </td>

                      {/* Timestamp metrics registry point column */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-normal">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDate(h.created_at)}</span>
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

      {/* Provision Creation Modal Element Anchor */}
      {showModal && (
        <CreateHostelModal
          onClose={() => setShowModal(false)}
          onCreated={fetchHostels}
        />
      )}

      {/* Operational Inspection Popover Sheet Overlay block link */}
      {selectedHostel && (
        <HostelDetailsModal
          hostel={selectedHostel}
          onClose={() => setSelectedHostel(null)}
        />
      )}
    </div>
  );
}
