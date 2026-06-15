import { useEffect, useState } from "react";
import {
  Bell,
  BellRing,
  CheckCircle2,
  CheckSquare,
  Search,
  Clock,
  SlidersHorizontal,
  Loader2,
  Trash2,
  ShieldAlert,
  Inbox
} from "lucide-react";
import api from "../services/api"; // Adjust relative location to match your folder hierarchy

export default function NotificationsRoute() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Interface Matrix States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'unread' | 'read'
  const [processingId, setProcessingId] = useState(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  // Pagination Configuration 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sync Registry Arrays from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Notification synchronization error:", err);
      setError("Failed to stream active notification registries from cloud nodes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ─── Filter & Search Execution Pipeline ─────────────────────────
  useEffect(() => {
    let output = [...notifications];

    // Status Filter: read state tracking
    if (statusFilter === "unread") {
      output = output.filter((item) => item.is_read === 0);
    } else if (statusFilter === "read") {
      output = output.filter((item) => item.is_read === 1);
    }

    // Search Box Tokenization
    if (searchTerm.trim() !== "") {
      const target = searchTerm.toLowerCase();
      output = output.filter(
        (item) =>
          item.title?.toLowerCase().includes(target) ||
          item.message?.toLowerCase().includes(target)
      );
    }

    setFilteredNotifications(output);
    setCurrentPage(1); // Reset back to baseline page frame upon dataset changes
  }, [searchTerm, statusFilter, notifications]);

  // Compute Live Analytics Framework Metrics
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => n.is_read === 0).length;

  // Pagination Math
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  // ─── Inline Action Dispatch Interceptors ────────────────────────
  
  // Mark individual row notification index as read
  const handleMarkAsRead = async (id) => {
    try {
      setProcessingId(id);
      
      // Target API adjustment vector setup
      await api.put(`/notifications/${id}/read`);
      
      // Direct optimistic state update to avoid heavy redraw cycles
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
    } catch (err) {
      console.error("Failed to mutate record log status:", err);
      // Fallback fallback strategy re-fetches in case of local mismatch
      await fetchNotifications();
    } finally {
      setProcessingId(null);
    }
  };

  // Mark all unread notification channels as read
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      setBulkProcessing(true);
      
      await api.put("/notifications/read-all");
      
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error("Bulk process operation rejection:", err);
      await fetchNotifications();
    } finally {
      setBulkProcessing(false);
    }
  };

  // Format creation timestamp human-readable
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-4 bg-slate-50/30 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Loading Notifications Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-slate-50/40 p-1 min-h-screen antialiased">
      
      {/* Title block Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Notification Center</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            System transactions, registry warnings, and operational audit alerts
          </p>
        </div>

        {/* Counter Analytics Panels */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-1.5 shadow-2xs text-xs font-semibold text-slate-500">
            <Inbox className="h-3.5 w-3.5 text-slate-400" />
            <span>Total: {totalCount}</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/40 px-3 py-1.5 shadow-2xs text-xs font-bold text-blue-700">
            <BellRing className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
            <span>Unread: {unreadCount}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Filter and Command Interactive Bar */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs flex flex-col md:flex-row items-center gap-4 transition-all duration-300 hover:border-blue-400/60 hover:ring-4 hover:ring-blue-50/50">
        
        {/* Realtime Search Bar Input */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notifications by keywords, message contents or subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-hidden placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
          />
        </div>

        {/* Dynamic Status Filter Controls & Command Triggers */}
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-3 border-t md:border-t-0 pt-3 md:pt-0">
          <div className="flex rounded-lg border border-slate-200 bg-slate-50/50 p-1">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                statusFilter === "all"
                  ? "bg-white text-slate-800 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("unread")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                statusFilter === "unread"
                  ? "bg-white text-blue-600 shadow-2xs"
                  : "text-slate-500 hover:text-blue-500"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setStatusFilter("read")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                statusFilter === "read"
                  ? "bg-white text-slate-800 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Read
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={bulkProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition disabled:opacity-40"
            >
              {bulkProcessing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckSquare className="h-3.5 w-3.5" />
              )}
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications Render List Grid Container */}
      <div className="space-y-3">
        {currentItems.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-white py-16 text-center shadow-xs">
            <Bell className="h-8 w-8 text-slate-300 mx-auto stroke-[1.5]" />
            <p className="mt-3 text-sm font-medium text-slate-400">
              No new alerts or broadcast notifications match your active filter arrays.
            </p>
          </div>
        ) : (
          currentItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border bg-white p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:border-blue-400/60 hover:ring-4 hover:ring-blue-50/50 ${
                item.is_read === 0 
                  ? "border-l-4 border-l-blue-500 border-slate-100" 
                  : "border-slate-100 opacity-80"
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Visual Read Status Indicator Ring */}
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  item.is_read === 0 ? "bg-blue-600 animate-pulse" : "bg-slate-300"
                }`} />
                
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <h4 className={`text-sm tracking-tight ${item.is_read === 0 ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                      {item.title || "Broadcast Notification"}
                    </h4>
                    {item.is_read === 0 && (
                      <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.2 rounded-sm font-extrabold tracking-wide uppercase">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {item.message}
                  </p>
                  
                  {/* Timestamp Label row */}
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 pt-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(item.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Action Operations Controller Matrix */}
              <div className="sm:self-center shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 text-right">
                {item.is_read === 0 ? (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    disabled={processingId === item.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-3xs disabled:opacity-40"
                  >
                    {processingId === item.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Mark read
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400 tracking-wide uppercase select-none px-2 py-1 inline-block">
                    Read
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Standard Minimal Pagination Layout Section */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border border-slate-100 bg-white rounded-xl px-6 py-4 shadow-2xs transition-all duration-300 hover:border-blue-400/60 hover:ring-4 hover:ring-blue-50/50">
          <span className="text-xs font-semibold text-slate-500">
            Showing <span className="text-slate-800">{indexOfFirstItem + 1}</span> to{" "}
            <span className="text-slate-800">
              {Math.min(indexOfLastItem, filteredNotifications.length)}
            </span>{" "}
            of <span className="text-slate-800">{filteredNotifications.length}</span> records
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-3xs transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`h-7 w-7 rounded-md text-xs font-bold transition-all ${
                    currentPage === idx + 1
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-3xs transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}