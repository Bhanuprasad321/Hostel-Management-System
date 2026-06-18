import { useEffect, useState } from "react";
import {
  Eye,
  Users,
  BedDouble,
  ClipboardList,
  DoorOpen,
  PieChart as PieIcon,
  Activity,
  Loader2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import api from "../services/api";

// ─── Component: Minimalist Premium Stat Card ───────────────────
function StatCard({ title, value, subtext, Icon, iconColor }) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white p-5 border border-slate-100 shadow-xs transition-all duration-300 hover:border-blue-400/60 hover:ring-4 hover:ring-blue-50/50">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-wider block">
            {title}
          </p>
          <div className="pt-1">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {value}
            </h2>
          </div>
          {subtext && (
            <p className="text-xs text-slate-400 font-medium pt-1">{subtext}</p>
          )}
        </div>
        <div className={`p-1.5 ${iconColor || "text-blue-500"}`}>
          <Icon className="h-5 w-5 stroke-[1.75]" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/dashboard/hostel-admin");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data framework:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 bg-slate-50/30 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Loading Admin Operations Panel...
        </p>
      </div>
    );
  }

  // ─── Safe Chart Extraction & Configurations ──────────────────

  // 1) Occupancy Pie Chart Matrix (Occupied vs Available Slots)
  const totalRoomsCount = stats.total_rooms || 0;
  const occupiedRoomsCount = stats.occupied_rooms || 0;
  const availableRoomsCount = Math.max(0, totalRoomsCount - occupiedRoomsCount);

  const occupancyPieData = [
    { name: "Occupied", value: occupiedRoomsCount, color: "#2563eb" }, // Vibrant image blue
    { name: "Available", value: availableRoomsCount, color: "#cbd5e1" }, // Clean grey scale
  ].filter((item) => item.value > 0);

  // 2) Room Status Pie Chart Matrix (Occupied vs Vacated Inventory)
  const vacatedRoomsCount = stats.vacated_rooms || 0;

  const roomStatusPieData = [
    { name: "Occupied Rooms", value: occupiedRoomsCount, color: "#3b82f6" },
    { name: "Vacated Rooms", value: vacatedRoomsCount, color: "#60a5fa" },
  ].filter((item) => item.value > 0);

  // 3) Allocation Status Horizontal/Vertical Grid Ledger Bar Chart
  const allocationBarData = [
    { name: "Active", count: stats.active_allocations || 0, color: "#2563eb" },
    { name: "Vacated", count: vacatedRoomsCount, color: "#94a3b8" },
  ];

  return (
    <div className="space-y-8 bg-slate-50/40 p-1 min-h-screen antialiased">
      {/* Title Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Hostel Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Overview of rooms, students, occupancy, and allocations
          </p>
        </div>
      </div>

      {/* Row 1: Premium Minimalist Metrics Count Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Rooms"
          value={stats.total_rooms}
          subtext="Total room capacity"
          Icon={BedDouble}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Total Students"
          value={stats.total_students}
          subtext="Registered students"
          Icon={Users}
          iconColor="text-purple-500"
        />
        <StatCard
          title="Occupied Rooms"
          value={stats.occupied_rooms}
          subtext="Currently occupied rooms"
          Icon={DoorOpen}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Vacated Rooms"
          value={stats.vacated_rooms}
          subtext="Available rooms"
          Icon={ClipboardList}
          iconColor="text-slate-400"
        />
        <StatCard
          title="Active Allocations"
          value={stats.active_allocations}
          subtext="Current room allocations"
          Icon={Activity}
          iconColor="text-emerald-500"
        />
      </div>

      {/* Row 2: Charts Grid Framework */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Chart A: Occupancy Status Donut Layout */}
        <div className="lg:col-span-4 rounded-xl border border-slate-100 bg-white p-6 shadow-xs flex flex-col transition-all duration-300 hover:border-blue-400/60 hover:ring-4 hover:ring-blue-50/50">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
            <PieIcon className="h-6 w-5 text-blue-500" />
            <div className="flex flex-col">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Occupancy Overview
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Occupied vs available rooms
              </p>
            </div>
          </div>
          <div className="flex-1 min-h-[240px] flex flex-col justify-center">
            {occupancyPieData.length === 0 ? (
              <p className="text-center text-xs font-medium text-slate-400">
                No rooms tracked
              </p>
            ) : (
              <>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={occupancyPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {occupancyPieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderRadius: "8px",
                          border: "1px solid #f1f5f9",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1">
                  {occupancyPieData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name} ({item.value})
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chart B: Room Status Pie Breakdown */}
        <div className="lg:col-span-4 rounded-xl border border-slate-100 bg-white p-6 shadow-xs flex flex-col transition-all duration-300 hover:border-blue-400/60 hover:ring-4 hover:ring-blue-50/50">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
            <PieIcon className="h-6 w-5 text-blue-500" />
            <div className="flex flex-col">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Room Status
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Occupied vs available rooms
              </p>
            </div>
          </div>
          <div className="flex-1 min-h-[240px] flex flex-col justify-center">
            {roomStatusPieData.length === 0 ? (
              <p className="text-center text-xs font-medium text-slate-400">
                No structural data logged
              </p>
            ) : (
              <>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roomStatusPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {roomStatusPieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderRadius: "8px",
                          border: "1px solid #f1f5f9",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1">
                  {roomStatusPieData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name} ({item.value})
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chart C: Clean Allocation Status Bar Chart */}
        <div className="lg:col-span-4 rounded-xl border border-slate-100 bg-white p-6 shadow-xs flex flex-col transition-all duration-300 hover:border-blue-400/60 hover:ring-4 hover:ring-blue-50/50">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
            <Activity className="h-6 w-5 text-blue-500" />
            <div className="flex flex-col">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Allocation Status
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Active and vacated allocations
              </p>
            </div>
          </div>
          <div className="w-full h-52 sm:h-56 mt-4 px-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={allocationBarData}
                margin={{
                  top: 10,
                  right: 5,
                  left: window.innerWidth < 640 ? -15 : -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={10}
                  fontFamily="sans-serif"
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  fontFamily="sans-serif"
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  dx={-4}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc", opacity: 0.4 }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "11px",
                    fontWeight: "700",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Allocations Total"
                  barSize={window.innerWidth < 640 ? 28 : 36}
                  radius={[6, 6, 0, 0]}
                >
                  {allocationBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
