import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Loader2,
  Mail,
  Phone,
  Building,
  MapPin,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";

export default function SuperAdminDemosPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Track ID during network updates
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all requests from backend database
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/demos");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load demo requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Update request status inline
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await api.put(`/demos/${id}`, { status: newStatus });

      // Update local state arrays directly without whole page refresh
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req,
        ),
      );

      setToast(res.data?.message || "Status updated successfully");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Status Styling Badge Map
  const statusBadges = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    contacted: "bg-amber-50 text-amber-700 border-amber-200",
    converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
  };

  // Search & Filter computation
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.hostel_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-3 bg-slate-50/30 min-h-screen">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
        <p className="text-xs font-medium text-slate-500">
          Loading demo requests...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-slate-50/40 p-6 min-h-screen antialiased text-slate-800">
      {/* Toast Alert Notice */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-semibold shadow-lg animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Demo Requests
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            View and manage user requests for product demos.
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition shadow-3xs text-slate-500 cursor-pointer"
          title="Refresh List"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Search and Filters Controller Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-slate-100 p-4 rounded-xl shadow-3xs">
        {/* Input Text query search field */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, hostel, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Dropdown status Filter controller selection bar */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">
            Filter by Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-indigo-500 transition cursor-pointer"
          >
            <option value="All">All Requests</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Main Core Database Data Table Display Output */}
      {error ? (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center shadow-3xs max-w-xl mx-auto mt-6">
          <p className="text-sm font-bold text-slate-700">No requests found</p>
          <p className="text-xs text-slate-400 mt-1">
            No items match your active search terms or filters.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-3xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Customer Info</th>
                  <th className="py-3 px-5">Hostel Details</th>
                  <th className="py-3 px-5">Message</th>
                  <th className="py-3 px-5">Status Badge</th>
                  <th className="py-3 px-5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition">
                    {/* Customer Info column row */}
                    <td className="py-4 px-5 space-y-1">
                      <p className="font-bold text-slate-900 text-sm">
                        {req.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Mail className="h-3 w-3" />
                        <span>{req.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Phone className="h-3 w-3" />
                        <span>{req.phone}</span>
                      </div>
                    </td>

                    {/* Hostel Details location tags */}
                    <td className="py-4 px-5 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        <span>{req.hostel_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{req.city}</span>
                      </div>
                    </td>

                    {/* User Input Custom Message block column */}
                    <td className="py-4 px-5 max-w-xs">
                      {req.message ? (
                        <div className="flex gap-1.5 items-start text-slate-600 bg-slate-50 rounded-lg p-2 border border-slate-100 text-[11px]">
                          <MessageSquare className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
                          <p className="line-clamp-2" title={req.message}>
                            {req.message}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          No message left
                        </span>
                      )}
                    </td>

                    {/* Current Status Pills visual tracking badges */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadges[req.status] || "bg-slate-50 text-slate-600"}`}
                      >
                        {req.status || "new"}
                      </span>
                    </td>

                    {/* Actions Change Selector inputs element */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {updatingId === req.id && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                        )}
                        <select
                          disabled={updatingId === req.id}
                          value={req.status || "new"}
                          onChange={(e) =>
                            handleStatusUpdate(req.id, e.target.value)
                          }
                          className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-700 focus:outline-hidden focus:border-indigo-500 transition cursor-pointer disabled:opacity-40"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="demo_scheduled">Demo Scheduled</option>
                          <option value="converted">Converted</option>
                          <option value="not_interested">Not Interested</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
