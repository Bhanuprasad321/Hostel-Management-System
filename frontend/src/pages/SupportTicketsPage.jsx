import React, { useEffect, useState } from "react";
import {
  Ticket,
  Plus,
  Eye,
  X,
  Loader2,
  AlertCircle,
  Building,
} from "lucide-react";
import api from "../services/api";

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals and view states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [detailedTicket, setDetailedTicket] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Form input data states
  const [newTicket, setNewTicket] = useState({
    category: "General",
    subject: "",
    description: "",
  });
  const [adminUpdate, setAdminUpdate] = useState({
    status: "open",
    admin_response: "",
  });
  const [actionSubmitting, setActionSubmitting] = useState(false);

  // Automatically fetch logged-in user profile status context from localStorage
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const isSuperAdmin = user?.role === "super_admin";

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const endpoint = isSuperAdmin ? "/supportTickets/all" : "/supportTickets";
      const res = await api.get(endpoint);
      setTickets(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tickets list from server entries.");
    } finally {
      setLoading(false);
    }
  };

  // Lazy fetch full details on clicking 'View' button
  const fetchTicketDetails = async (id) => {
    try {
      setDetailLoading(true);
      setSelectedTicketId(id);
      const res = await api.get(`/supportTickets/${id}`);
      setDetailedTicket(res.data);
      setAdminUpdate({
        status: res.data.status,
        admin_response: res.data.admin_response || "",
      });
    } catch (err) {
      console.error(err);
      alert("Could not load ticket descriptions.");
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [isSuperAdmin]);

  // Submit new ticket (Hostel Admin only)
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setActionSubmitting(true);
      await api.post("/supportTickets", newTicket);
      setShowCreateModal(false);
      setNewTicket({ category: "General", subject: "", description: "" });
      fetchTickets(); // Refresh table
    } catch (err) {
      console.error(err);
      alert("Failed to submit support ticket.");
    } finally {
      setActionSubmitting(false);
    }
  };

  // Update Status & Reply (Super Admin only)
  const handleUpdateTicketStatus = async (e) => {
    e.preventDefault();
    try {
      setActionSubmitting(true);
      await api.put(`/supportTickets/${selectedTicketId}/status`, adminUpdate);
      setSelectedTicketId(null);
      setDetailedTicket(null);
      fetchTickets(); // Refresh table
    } catch (err) {
      console.error(err);
      alert("Failed to update ticket status.");
    } finally {
      setActionSubmitting(false);
    }
  };

  // Simple clean status style mapping labels
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "in_progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "closed":
        return "bg-slate-100 text-slate-600 border-slate-300";
      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-4 min-h-screen w-full">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Loading Support Tickets...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen w-full text-xs">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Ticket className="h-5 w-5 text-indigo-600" />
            Support Tickets
          </h2>
          <p className="text-slate-500 mt-0.5">
            {isSuperAdmin
              ? "Manage, answer, and resolve technical support issues submitted by hostels."
              : "Create support tickets and check their resolution status."}
          </p>
        </div>

        {/* Raise ticket exposed only to normal hostel admins */}
        {!isSuperAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 font-bold text-white hover:bg-indigo-700 transition shadow-xs cursor-pointer text-xs"
          >
            <Plus className="h-4 w-4" />
            Raise Ticket
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 font-bold text-red-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── Tickets List Table ─── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-600 uppercase tracking-wide">
              No Tickets Found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-200">
                  <th className="p-4 w-12">#</th>
                  {isSuperAdmin && <th className="p-4">Hostel Name</th>}
                  <th className="p-4">Subject</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Created At</th>
                  <th className="p-4 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                {tickets.map((t, index) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    {/* Display standard sequential integer 1 to N */}
                    <td className="p-4 font-bold text-slate-400 font-mono">
                      {index + 1}
                    </td>
                    {isSuperAdmin && (
                      <td className="p-4 text-slate-700 font-bold truncate max-w-[140px]">
                        <span className="flex items-center gap-1.5">
                          <Building className="h-3 w-3 text-slate-400" />
                          {t.hostel_name || `ID: ${t.hostel_id}`}
                        </span>
                      </td>
                    )}
                    <td className="p-4 text-slate-800 font-bold truncate max-w-[220px]">
                      {t.subject}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusBadgeStyle(t.status)}`}
                      >
                        {t.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-400 font-semibold">
                      {formatDate(t.created_at)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => fetchTicketDetails(t.id)}
                        className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer inline-flex items-center gap-1 text-[11px]"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Modal Form: Raise Ticket (Hostel Admin) ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">
                Raise a Support Ticket
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateTicket}
              className="p-5 space-y-4 text-slate-700 font-medium"
            >
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Category</label>
                <select
                  value={newTicket.category}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, category: e.target.value })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-bold"
                >
                  <option value="General">General / Other Support</option>
                  <option value="Technical">Technical Bug / Error</option>
                  <option value="Billing">Billing & Subscription Issue</option>
                  <option value="Account">Account Settings</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">Subject</label>
                <input
                  type="text"
                  placeholder="Briefly state the issue"
                  value={newTicket.subject}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, subject: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">Description</label>
                <textarea
                  rows={4}
                  placeholder="Provide full detailed explanations about the issue..."
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 font-bold rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {actionSubmitting && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal Overlay: View Details & Actions (Super Admin Update Interface) ─── */}
      {selectedTicketId && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                Ticket Details (ID: #{selectedTicketId})
              </span>
              <button
                onClick={() => {
                  setSelectedTicketId(null);
                  setDetailedTicket(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {detailLoading || !detailedTicket ? (
              <div className="p-12 flex justify-center items-center w-full">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              </div>
            ) : (
              <div className="overflow-y-auto p-5 space-y-4 text-slate-600 font-medium">
                {/* Subject Header */}
                <div>
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                    {detailedTicket.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 pt-1">
                    {detailedTicket.subject}
                  </h3>

                  <div className="flex flex-wrap text-[11px] text-slate-400 gap-x-4 gap-y-0.5 pt-1 font-semibold">
                    <p>
                      Submitted By:{" "}
                      <span className="text-slate-600 font-bold">
                        {detailedTicket.created_by_name ||
                          `User ID: ${detailedTicket.created_by}`}
                      </span>
                    </p>
                    <p>
                      Hostel:{" "}
                      <span className="text-slate-600 font-bold">
                        {detailedTicket.hostel_name}
                      </span>
                    </p>
                    <p>
                      Date:{" "}
                      <span className="text-slate-600 font-mono">
                        {formatDate(detailedTicket.created_at)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Ticket Description Input Content */}
                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-lg space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Description
                  </h4>
                  <p className="text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap">
                    {detailedTicket.description}
                  </p>
                </div>

                {/* Hostel Admin View Screen Only: Show Response */}
                {!isSuperAdmin && (
                  <div className="border border-slate-200 p-4 rounded-lg bg-slate-50 space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Admin Reply
                    </h4>
                    {detailedTicket.admin_response ? (
                      <p className="text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap">
                        {detailedTicket.admin_response}
                      </p>
                    ) : (
                      <p className="text-slate-400 italic font-semibold">
                        No reply added yet by the support administrator team.
                      </p>
                    )}
                    <div className="pt-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusBadgeStyle(detailedTicket.status)}`}
                      >
                        Status: {detailedTicket.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Super Admin Update Controls: Edit Response and Change Status */}
                {isSuperAdmin && (
                  <form
                    onSubmit={handleUpdateTicketStatus}
                    className="border-t border-slate-200 pt-3 space-y-3"
                  >
                    <div className="bg-indigo-50/40 border border-indigo-100 p-4 rounded-lg space-y-3">
                      <h4 className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                        Update Ticket (Admin Only)
                      </h4>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-600">
                          Ticket Status
                        </label>
                        <select
                          value={adminUpdate.status}
                          onChange={(e) =>
                            setAdminUpdate({
                              ...adminUpdate,
                              status: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-slate-800"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-600">
                          Admin Response Text
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Type your response or message answer here..."
                          value={adminUpdate.admin_response}
                          onChange={(e) =>
                            setAdminUpdate({
                              ...adminUpdate,
                              admin_response: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTicketId(null);
                          setDetailedTicket(null);
                        }}
                        className="px-4 py-2 border border-slate-200 font-bold text-slate-500 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        disabled={actionSubmitting}
                        className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {actionSubmitting && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
