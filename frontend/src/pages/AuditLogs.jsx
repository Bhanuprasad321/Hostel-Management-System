import { useEffect, useState } from "react";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  Building2,
  User,
  Activity,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import api from "../services/api"; // Adjust file hierarchy matching your app layout

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter Matrix States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  // Pagination Controls
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Directing GET call directly to your target core API layout
        const res = await api.get("http://localhost:2000/api/audit-logs");
        setLogs(res.data);
        setFilteredLogs(res.data);
      } catch (err) {
        console.error("Audit log processing pipeline breakdown:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // ─── Filter & Search Engine Runtime ─────────────────────────
  useEffect(() => {
    let output = [...logs];

    if (searchTerm.trim() !== "") {
      const target = searchTerm.toLowerCase();
      output = output.filter(
        (log) =>
          log.hostel_name?.toLowerCase().includes(target) ||
          log.user_name?.toLowerCase().includes(target) ||
          log.action_time?.toLowerCase().includes(target),
      );
    }

    // Apply Sorting Matrix
    if (sortConfig.key) {
      output.sort((a, b) => {
        let valA = a[sortConfig.key] || "";
        let valB = b[sortConfig.key] || "";

        if (sortConfig.key === "created_at") {
          return sortConfig.direction === "asc"
            ? new Date(valA) - new Date(valB)
            : new Date(valB) - new Date(valA);
        }

        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredLogs(output);
    setCurrentPage(1); // Reset index frame back to 1 on mutation parameters
  }, [searchTerm, sortConfig, logs]);

  // Pagination Calculus
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Helper dynamic asset to view header configuration arrows
  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
      );
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-blue-600 font-bold" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-blue-600 font-bold" />
    );
  };

  // Humanize Timestamp Format Engine
  const formatTimestamp = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-4 bg-slate-50/30 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Fetching system audit registry indices...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-slate-50/40 p-1 min-h-screen antialiased">
      {/* Title Block Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Audit Logs
          </h2>
          <p className="text-sm text-slate-400 mt-0.5 font-medium">
            Centralized activity history for administrative actions, tenant
            operations, and system events.
          </p>
        </div>

        {/* Dynamic Context Counter Tag */}
        <div className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-100 bg-white px-3 py-1.5 shadow-xs text-xs font-semibold text-slate-500">
          <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
          <span>Total Log Entries: {filteredLogs.length}</span>
        </div>
      </div>

      {/* Action Filter Bar Interface Block */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs transition-all duration-300 hover:border-blue-400/60 hover:ring-4 hover:ring-blue-50/50 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter by hostel name, user name, or action statement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-hidden placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-default select-none">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Options Matrix
        </button>
      </div>

      {/* Main Premium Data Table Block Container */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-xs overflow-hidden transition-all duration-300 hover:border-blue-400/60 hover:ring-4 hover:ring-blue-50/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                {/* ID Header */}
                <th
                  onClick={() => requestSort("id")}
                  className="group px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none transition-colors hover:bg-slate-100/60 w-20"
                >
                  <div className="flex items-center gap-1.5">
                    ID {getSortIcon("id")}
                  </div>
                </th>

                {/* Hostel Name Header */}
                <th
                  onClick={() => requestSort("hostel_name")}
                  className="group px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none transition-colors hover:bg-slate-100/60"
                >
                  <div className="flex items-center gap-1.5">
                    Hostel{getSortIcon("hostel_name")}
                  </div>
                </th>

                {/* Operator Identity Header */}
                <th
                  onClick={() => requestSort("user_name")}
                  className="group px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none transition-colors hover:bg-slate-100/60"
                >
                  <div className="flex items-center gap-1.5">
                    Performed By {getSortIcon("user_name")}
                  </div>
                </th>

                {/* Log Entry Statement Header */}
                <th
                  onClick={() => requestSort("action_time")}
                  className="group px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none transition-colors hover:bg-slate-100/60"
                >
                  <div className="flex items-center gap-1.5">
                    Action {getSortIcon("action_time")}
                  </div>
                </th>

                {/* Time Stamp Header */}
                <th
                  onClick={() => requestSort("created_at")}
                  className="group px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none transition-colors hover:bg-slate-100/60"
                >
                  <div className="flex items-center gap-1.5">
                    created_at {getSortIcon("created_at")}
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <p className="text-sm font-medium text-slate-400">
                      No matching log arrays found within your dynamic query
                      criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                currentItems.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Log ID */}
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400">
                      {log.id}
                    </td>

                    {/* Hostel Scope */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <Building2 className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {log.hostel_name || "Platform Global Scope"}
                        </span>
                      </div>
                    </td>

                    {/* Operator Account Identity */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                          {log.user_name}
                        </span>
                      </div>
                    </td>

                    {/* Action Statement Details */}
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 max-w-sm">
                      <span className="break-words line-clamp-2">
                        {log.action_time}
                      </span>
                    </td>

                    {/* Execution Window Timestamp */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {formatTimestamp(log.created_at)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Clean Standard Pagination Bottom Bar Section */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <span className="text-xs font-semibold text-slate-500">
              Showing{" "}
              <span className="text-slate-800">{indexOfFirstItem + 1}</span> to{" "}
              <span className="text-slate-800">
                {Math.min(indexOfLastItem, filteredLogs.length)}
              </span>{" "}
              of <span className="text-slate-800">{filteredLogs.length}</span>{" "}
              records
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
