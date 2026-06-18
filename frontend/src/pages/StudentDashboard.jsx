import { useEffect, useState } from "react";
import {
  Home,
  Activity,
  Building2,
  Bell,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  Users2,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";

export default function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    const fetchStudentDashboardSchema = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch main student metrics
        const statsRes = await api.get("/dashboard/student");
        setStats(statsRes.data);

        // 2. Fetch notification records
        try {
          const notifyRes = await api.get("/notifications");
          setRecentNotifications(notifyRes.data.slice(0, 3));
        } catch (err) {
          // Graceful fallback data stream matching instructions
          console.log(err);
          setRecentNotifications([
            {
              id: 1,
              message: "Room allocation confirmed",
              created_at: new Date(),
            },
            {
              id: 2,
              message: "Hostel notice published",
              created_at: new Date(),
            },
            { id: 3, message: "Profile updated", created_at: new Date() },
          ]);
        }
      } catch (err) {
        console.error("Student dashboard matrix dropped:", err);
        setError(
          "Could not map student metadata definitions from structural cluster database nodes.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDashboardSchema();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-4 bg-slate-50/30 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Loading Student Hub Profiles...
        </p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-bold text-red-600 flex items-center gap-2.5 max-w-2xl mx-auto mt-10">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{error || "Access configuration matrix error."}</span>
      </div>
    );
  }

  const hasRoom = stats.room_number !== null;

  return (
    <div className="space-y-8 bg-slate-50/40 p-1 min-h-screen antialiased w-full">
      {/* ─── GREETING HEADER ─── */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          Hello, {stats.student_name} <span>👋</span>
        </h2>
        <p className="text-xs font-bold text-indigo-600 tracking-wide mt-0.5">
          Welcome back to {stats.hostel_name} hostel
        </p>
      </div>

      {/* ─── METRIC CARD GRID ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Assigned Room */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-indigo-400/60 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              My Room
            </span>
            <Home className="h-4 w-4 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight mt-4">
            {hasRoom ? `Room ${stats.room_number}` : "Unassigned"}
          </h3>
        </div>

        {/* Card 2: Allocation Lifecycle Status */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-indigo-400/60 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Allocation Status
            </span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider ${
                stats.allocation_status.toLowerCase() === "active"
                  ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
                  : "bg-amber-50 border border-amber-100 text-amber-700"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5]" />
              {stats.allocation_status}
            </span>
          </div>
        </div>

        {/* Card 3: Property Context Label */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-indigo-400/60 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Hostel
            </span>
            <Building2 className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-700 tracking-tight mt-4 line-clamp-1">
            {stats.hostel_name}
          </h3>
        </div>

        {/* Card 4: Notification Alerts Counter */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-indigo-400/60 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Unread Notifications
            </span>
            <div className="relative">
              <Bell className="h-4 w-4 text-amber-500" />
              {stats.unread_notifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
              )}
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-4 flex items-baseline gap-1.5">
            {stats.unread_notifications}
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Unread
            </span>
          </h3>
        </div>
      </div>

      {/* ─── DETAILED INFORMATION DATA ROW ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Specification Layout Frame */}
        <div className="md:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:border-indigo-400/60">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-5">
            <Home className="h-4 w-4 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Room Details
            </h3>
          </div>

          {hasRoom ? (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4 bg-slate-50/70 border border-slate-100 p-5 rounded-xl text-center">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Room Number
                  </p>
                  <p className="text-xl font-black text-slate-800 tracking-tight">
                    {stats.room_number}
                  </p>
                </div>
                <div className="space-y-1.5 border-x border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Capacity
                  </p>
                  <p className="text-xl font-black text-slate-800 tracking-tight">
                    {stats.room_capacity}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Occupancy
                  </p>
                  <p className="text-xl font-black text-slate-800 tracking-tight">
                    {stats.current_occupancy}
                  </p>
                </div>
              </div>

              {/* Progress Indicator Track */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wide">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Users2 className="h-3.5 w-3.5 text-slate-400" /> CAPACITY
                  </span>
                  <span className="text-indigo-600 font-extrabold">
                    {Math.round(
                      (stats.current_occupancy / stats.room_capacity) * 100,
                    )}
                    % Filled
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(stats.current_occupancy / stats.room_capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
              <Home className="h-8 w-8 text-slate-300 mx-auto stroke-[1.5] mb-2" />
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">
                No Active Assignment Found
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-1 max-w-xs mx-auto">
                Coordinate with system administrative operators to assign your
                living accommodation footprint.
              </p>
            </div>
          )}
        </div>

        {/* Right Notification Stream Panel */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between transition-all duration-300 hover:border-indigo-400/60 min-h-[258px]">
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Bell className="h-4 w-4 text-indigo-500" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Recent Notifications
              </h3>
            </div>

            <div className="space-y-3">
              {recentNotifications.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2.5 p-2 rounded-xl transition hover:bg-slate-50/80 group cursor-pointer"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0 group-hover:scale-125 transition duration-200" />
                  <p className="text-xs font-bold text-slate-600 leading-relaxed tracking-tight group-hover:text-slate-900 transition">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <a
              href="/notifications"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 bg-white hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-2xs"
            >
              View All
              <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
