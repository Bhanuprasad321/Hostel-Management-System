import { useEffect, useState } from "react";
import {
  Wrench,
  Plus,
  Calendar,
  User,
  X,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Inbox,
} from "lucide-react";
import api from "../services/api";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states for Student Creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState("Maintenance");
  const [description, setDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Track status modification on specific rows (Admin only)
  const [updatingId, setUpdatingId] = useState(null);

  // Get current user details safely from storage node
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const isAdmin = user?.role === "admin";

  // Fetch data dynamically based on authentication context role
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      // Route maps: Admins query global dataset, students hit local isolation matrix "/my"
      const endpoint = isAdmin ? "/complaints" : "/complaints/my";
      const res = await api.get(endpoint);
      setComplaints(res.data || []);
    } catch (err) {
      console.error("Complaints trace pipeline failed:", err);
      setError(
        "Could not parse complaints database records from structural log tracking configurations.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Handle Ticket Submission (Student Only)
  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setFormError("Please provide a description of the reported issue.");
      return;
    }

    try {
      setFormLoading(true);
      setFormError("");

      // Map payload to backend requirements: { student_id, category, description }
      await api.post("/complaints", {
        student_id: user?.id,
        category,
        description,
      });

      setDescription("");
      setIsModalOpen(false);
      fetchComplaints();
    } catch (err) {
      console.error("Complaint creation dropped:", err);
      setFormError(
        err.response?.data?.message || "Failed to log complaint profile.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Lifecycle Status Mutations (Admin Only)
  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await api.put(`/complaints/${id}/status`, { status: newStatus });

      // Mutate local state timeline data smoothly
      setComplaints((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      );
    } catch (err) {
      console.error("Status state update failed:", err);
      alert(
        err.response?.data?.message ||
          "Failed to update complaint resolution status state.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Upgraded custom status badges mapping clear scan colors
  const getStatusBadge = (status) => {
    const maps = {
      open: {
        bg: "bg-amber-50 border-amber-200 text-amber-700",
        icon: <AlertTriangle className="h-3 w-3 stroke-[2.5]" />,
        label: "Pending",
      },
      in_progress: {
        bg: "bg-orange-50 border-orange-200 text-orange-700",
        icon: <Clock className="h-3 w-3 stroke-[2.5]" />,
        label: "In Progress",
      },
      resolved: {
        bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
        icon: <CheckCircle2 className="h-3 w-3 stroke-[2.5]" />,
        label: "Resolved",
      },
    };
    const current = maps[status?.toLowerCase()] || maps.open;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black rounded-sm uppercase tracking-wider border ${current.bg}`}
      >
        {current.icon}
        {current.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate dynamic counts based on perspective
  const totalMyComplaints = complaints.length;
  const openComplaintsCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "open",
  ).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-4 bg-slate-50/30 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Syncing Complaint File Handlers...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-slate-50/40 p-1 min-h-screen antialiased w-full">
      {/* ─── TITLE CONTEXT HEADER WITH LIVE METRIC DISPLAY ─── */}
      <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Complaints Hub
            </h2>

            {/* Context Metric Card Badge */}
            {isAdmin ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-black tracking-tight text-amber-800 shadow-3xs">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 stroke-[2.5]" />
                Open Complaints: {openComplaintsCount}
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-black tracking-tight text-indigo-700 shadow-3xs">
                <Wrench className="h-3.5 w-3.5 text-indigo-600" />
                My Complaints: {totalMyComplaints}
              </div>
            )}
          </div>
          <p className="text-xs font-bold text-indigo-600 tracking-wide uppercase">
            {isAdmin
              ? "Track, manage, and process ongoing grievance and maintenance parameters"
              : "Report technical failures or hostel living disruptions directly to the administration node"}
          </p>
        </div>

        {/* Create Complaint Trigger Button available only to students */}
        {!isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:bg-indigo-700 transition shadow-sm self-start sm:self-auto cursor-pointer uppercase tracking-wider"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            File Ticket
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-bold text-red-600 flex items-center gap-2.5 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── DATA EMPTY COMPONENT VIEWPORT ─── */}
      {!error && complaints.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl bg-white max-w-2xl mx-auto shadow-xs">
          <Inbox className="h-10 w-10 text-slate-300 mx-auto mb-3 stroke-[1.5]" />
          <p className="text-sm font-black text-slate-600 uppercase tracking-wide">
            Log Registry Clean
          </p>
          <p className="text-xs font-medium text-slate-400 mt-1 max-w-xs mx-auto">
            {isAdmin
              ? "No outstanding complaint tickets require attention at this time."
              : "You have not filed any technical grievances or tickets under this user profile record."}
          </p>
        </div>
      ) : (
        /* ─── LOG TRACKING LIST FEED ─── */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {complaints.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:scale-[1.005] hover:border-indigo-400/40 hover:shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Meta Top Indicator Header Row */}
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black rounded-lg bg-slate-50 border border-slate-200/80 text-slate-600 uppercase tracking-wider">
                    <Layers className="h-3 w-3 text-indigo-500" />
                    {ticket.category}
                  </span>

                  {/* Render inline spinner tracking asynchronous state changes */}
                  {updatingId === ticket.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  ) : (
                    // Only render stationary static status badges for non-admins
                    !isAdmin && getStatusBadge(ticket.status)
                  )}

                  {/* Operational Dropdown Control Layer exclusively rendered for Admin Users */}
                  {isAdmin && updatingId !== ticket.id && (
                    <div className="flex items-center gap-2">
                      <select
                        value={ticket.status || "open"}
                        onChange={(e) =>
                          handleStatusChange(ticket.id, e.target.value)
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700 focus:border-indigo-500 focus:outline-hidden cursor-pointer shadow-3xs"
                      >
                        <option value="open">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      {getStatusBadge(ticket.status)}
                    </div>
                  )}
                </div>

                {/* Main body payload data display */}
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                    Ticket ID #{ticket.id}
                  </p>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                    {ticket.description}
                  </p>
                </div>
              </div>

              {/* Data Meta Matrix Footer Layout */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-slate-50 mt-5 text-[11px] font-bold text-slate-400">
                {isAdmin && (
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-500 font-extrabold">
                      {ticket.student_name || "Unknown Student"}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Logged: {formatDate(ticket.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── CREATE INTERACTIVE COMPLAINT MODAL (STUDENT ONLY) ─── */}
      {isModalOpen && !isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Layer backdrop dim block */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => !formLoading && setIsModalOpen(false)}
          />

          {/* Dialog Container Panel */}
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-indigo-500" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  File Structural Ticket
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={formLoading}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-[11px] font-bold text-red-600 flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateComplaint} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Issue Classification Category
                </label>
                <select
                  disabled={formLoading}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold tracking-tight text-slate-800 focus:border-indigo-500 focus:outline-hidden transition shadow-3xs disabled:bg-slate-50 cursor-pointer"
                >
                  <option value="Maintenance">Maintenance & Repairs</option>
                  <option value="Electrical">Electrical & Appliances</option>
                  <option value="Plumbing">Plumbing & Water Systems</option>
                  <option value="Housekeeping">
                    Housekeeping & Sanitation
                  </option>
                  <option value="Internet">Network & Wi-Fi Connectivity</option>
                  <option value="Other">Other Miscellaneous Items</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Detailed Parameters Description
                </label>
                <textarea
                  required
                  rows={5}
                  disabled={formLoading}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide explicit operational details regarding this structural breakdown event..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium tracking-tight text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden transition shadow-3xs disabled:bg-slate-50 resize-none"
                />
              </div>

              {/* Action buttons controls alignment line */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={formLoading}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-500 bg-white hover:bg-slate-50 transition uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black text-white hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 uppercase tracking-wider cursor-pointer"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Filing...
                    </>
                  ) : (
                    "Submit Ticket"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
