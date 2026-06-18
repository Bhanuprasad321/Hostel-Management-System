import { useEffect, useState } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  Calendar,
  User,
  X,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import api from "../services/api";

export default function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states for creating notice
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Get current user context parameters safely
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const isHostelAdmin = user?.role === "admin";

  // Fetch all notice records
  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/notices");
      setNotices(res.data || []);
    } catch (err) {
      console.error("Notice stream retrieval failed:", err);
      setError(
        "Could not parse database timeline definitions from structural notice registry entries.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Handle Notice Creation
  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFormError("All notice details are required parameters.");
      return;
    }

    try {
      setFormLoading(true);
      setFormError("");
      await api.post("/notices", { title, description });

      // Clear inputs and reload matrix tracking updates
      setTitle("");
      setDescription("");
      setIsModalOpen(false);
      fetchNotices();
    } catch (err) {
      console.error("Notice configuration matrix rejected payload:", err);
      setFormError(
        err.response?.data?.message ||
          "Failed to commit notice records safely.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Notice Destruction
  const handleDeleteNotice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice ?"))
      return;

    try {
      await api.delete(`/notices/${id}`);
      setNotices((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Target elimination command dropped:", err);
      alert(err.response?.data?.message || "Internal mutation command failed.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-4 bg-slate-50/30 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Loading Notice Board...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-slate-50/40 p-1 min-h-screen antialiased w-full">
      {/* ─── HEAD INTERACTION ACTION HUB ROW ─── */}
      <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Notice Board
          </h2>
          <p className="text-xs text-slate-500 tracking-wide ">
            View and manage hostel announcements
          </p>
        </div>

        {/* Conditional interaction hook restricted explicitly to authorized admin accounts */}
        {isHostelAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:bg-indigo-700 transition shadow-sm self-start sm:self-auto cursor-pointer uppercase tracking-wider"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            Add Notice
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-bold text-red-600 flex items-center gap-2.5 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── EMPTY STATE TIMELINE GRAPHIC CONTAINER ─── */}
      {!error && notices.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl bg-white max-w-2xl mx-auto shadow-xs">
          <Megaphone className="h-10 w-10 text-slate-300 mx-auto mb-3 stroke-[1.5]" />
          <p className="text-sm font-black text-slate-600 uppercase tracking-wide">
            Notice Board Empty
          </p>
          <p className="text-xs font-medium text-slate-400 mt-1 max-w-xs mx-auto">
            There are currently no notices added by the Admin
          </p>
        </div>
      ) : (
        /* ─── NOTICES FEED RENDERING STREAM ─── */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:scale-[1.01] hover:border-indigo-400/50 hover:shadow-sm flex flex-col justify-between relative group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug line-clamp-2">
                    {notice.title}
                  </h3>

                  {/* Authorized elimination handler wrapper targeting administrative permissions */}
                  {isHostelAdmin && (
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 shrink-0 cursor-pointer"
                      title="Remove from board"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {notice.description}
                </p>
              </div>

              {/* Data Meta Matrix Footer Footer Layout */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-slate-50 mt-5 text-[11px] font-bold text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-500 font-bold text-[13px]">
                    {notice.created_by || "Admin Node"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[12px]">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{formatDate(notice.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── CREATE INTERACTIVE NOTICE MODAL COMPONENT ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop layer */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => !formLoading && setIsModalOpen(false)}
          />

          {/* Form Card */}
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-indigo-500" />
                <h3 className="text-m  text-slate-800 uppercase tracking-wider">
                  Add New Notice
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

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[12px] font-bold uppercase tracking-wider text-black block">
                  Notice Title
                </label>
                <input
                  type="text"
                  required
                  disabled={formLoading}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Dinner Timings, Water Supply Notice"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm tracking-tight text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden transition shadow-3xs disabled:bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px]  uppercase tracking-wider text-black font-bold block">
                  Notice Description
                </label>
                <textarea
                  required
                  rows={5}
                  disabled={formLoading}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter notice details..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium tracking-tight text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden transition shadow-3xs disabled:bg-slate-50 resize-none"
                />
              </div>

              {/* Action Node Row */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={formLoading}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-500 bg-white hover:bg-slate-50 transition uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-blold text-white hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 uppercase tracking-wider cursor-pointer"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Notice"
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
