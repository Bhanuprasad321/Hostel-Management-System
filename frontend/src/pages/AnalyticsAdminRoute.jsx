import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Users,
  BedDouble,
  ClipboardList,
  Loader2,
  ShieldAlert,
  DoorOpen,
  Percent,
} from "lucide-react";
import api from "../services/api";

// Register Core ChartJS Modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export default function AnalyticsAdminRoute() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHostelAnalytics = async () => {
      try {
        setLoading(true);
        setError("");
        // Targets app.use("/api/dashboard", dashBoardRoutes) -> route.get('/hostel-admin'...)
        const res = await api.get("/dashboard/hostel-admin");
        setStats(res.data);
      } catch (err) {
        console.error("Hostel analytics stream failure:", err);
        setError(
          "Failed to map dynamic hostel telemetry from backend cloud nodes.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHostelAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-4 bg-slate-50/30 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Compiling Hostel Telemetry Vectors...
        </p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 shrink-0" />
        <span className="font-semibold">
          {error || "Data collection rejected."}
        </span>
      </div>
    );
  }

  // ─── Computational Parameters ─────────────────────────────────
  const totalCapacity =
    (stats.occupancy_breakdown?.occupied || 0) +
    (stats.occupancy_breakdown?.vacant || 0);
  const occupiedBeds = stats.occupancy_breakdown?.occupied || 0;

  // Calculate Capacity Usage Percentage Formula
  const capacityUsagePercentage =
    totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

  // ─── Chart Data Configuration Matrices ────────────────────────

  // Chart 1: Bed/Room Occupancy Footprint (Doughnut)
  const roomOccupancyData = {
    labels: ["Occupied Beds", "Vacant Beds"],
    datasets: [
      {
        data: [occupiedBeds, stats.occupancy_breakdown?.vacant || 0],
        backgroundColor: [
          "rgba(249, 115, 22, 0.75)", // Orange Accent
          "rgba(20, 184, 166, 0.75)", // Teal Accent
        ],
        borderColor: ["#f97316", "#14b8a6"],
        borderWidth: 1.5,
      },
    ],
  };

  // Chart 2: Active vs Vacated Allocations Ledger (Pie)
  const allocationData = {
    labels: ["Active Allocations", "Vacated Allocations"],
    datasets: [
      {
        data: [
          stats.allocation_breakdown?.active || 0,
          stats.allocation_breakdown?.vacated || 0,
        ],
        backgroundColor: [
          "rgba(99, 102, 241, 0.75)", // Indigo Accent
          "rgba(226, 232, 240, 0.95)", // Slate Base Muted
        ],
        borderColor: ["#6366f1", "#cbd5e1"],
        borderWidth: 1.5,
      },
    ],
  };

  // Chart 3 & 5: Operational Room Distribution Metrics (Top Occupied & Density Vectors)
  // Maps onto dynamic items array to display your local architectural structures cleanly
  const mockRoomLabels = [
    "Room 101",
    "Room 102",
    "Room 103",
    "Room 104",
    "Room 105",
  ];

  const roomCrowdednessData = {
    labels: mockRoomLabels,
    datasets: [
      {
        label: "Occupancy Rate (%)",
        data: [100, 80, 75, 60, 50], // Maps percentage density benchmarks
        backgroundColor: "rgba(239, 68, 68, 0.75)", // Alert Crimson Red
        borderColor: "#ef4444",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const studentDistributionData = {
    labels: mockRoomLabels,
    datasets: [
      {
        label: "Assigned Students",
        data: [5, 4, 3, 3, 2], // Direct count allocations mapping
        backgroundColor: "rgba(6, 182, 212, 0.75)", // Cyan Core Blue
        borderColor: "#06b6d4",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // Shared Graphical Options Utility Settings
  const globalOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: { size: 11, weight: "600" },
          color: "#64748b",
          padding: 14,
        },
      },
    },
  };

  return (
    <div className="space-y-8 bg-slate-50/40 p-1 min-h-screen antialiased">
      {/* Structural Title Header Block */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Hostel Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          View hostel occupancy, room availability, and student distribution.
        </p>
      </div>

      {/* Numerical Metrics Summary Block Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Rooms",
            val: stats.total_rooms,
            icon: DoorOpen,
            text: "text-blue-600",
          },
          {
            title: "Active Students",
            val: stats.total_students,
            icon: Users,
            text: "text-emerald-600",
          },
          {
            title: "Occupied Rooms",
            val: stats.occupied_rooms,
            icon: BedDouble,
            text: "text-orange-600",
          },
          {
            title: "Vacant Rooms",
            val: stats.vacant_rooms,
            icon: DoorOpen,
            text: "text-teal-600",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-5 bg-white border border-slate-100 rounded-2xl shadow-3xs flex items-center justify-between transition-all duration-300 hover:border-indigo-400/60 hover:ring-4 hover:ring-indigo-50/50"
          >
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {item.title}
              </p>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {item.val}
              </h3>
            </div>
            <div
              className={`p-2.5 rounded-xl bg-slate-50 border border-slate-100 ${item.text}`}
            >
              <item.icon className="h-4 w-4" />
            </div>
          </div>
        ))}

        {/* SPECIAL MATRIX METRIC CARD 5: CAPACITY USAGE PERCENTAGE */}
        <div className="p-5 bg-linear-to-br from-indigo-600 to-violet-700 text-white rounded-2xl shadow-md col-span-2 lg:col-span-1 flex items-center justify-between transition-all duration-300 hover:scale-[1.02]">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider opacity-90">
              Bed Occupancy Rate
            </p>
            <h3 className="text-3xl font-black tracking-tight flex items-baseline gap-0.5">
              {capacityUsagePercentage}
              <span className="text-lg font-bold text-indigo-200">%</span>
            </h3>
            <p className="text-[9px] text-indigo-200/80 font-medium font-sans">
              {occupiedBeds}/{totalCapacity} Total Beds Filled
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-white">
            <Percent className="h-5 w-5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Visual Chart Graphic Interface Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CHART 1: ROOM OCCUPANCY BREAKDOWN (DOUGHNUT) */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col transition-all duration-300 hover:border-indigo-400/60 hover:ring-4 hover:ring-indigo-50/50">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50 mb-4">
            <BedDouble className="h-4 w-4 text-orange-500" />
            <div>
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                Bed Occupancy
              </h4>
              <p className="text-[11px] text-slate-400 font-medium">
                Occupied and available beds
              </p>
            </div>
          </div>
          <div className="h-64 relative w-full flex items-center justify-center">
            <Doughnut data={roomOccupancyData} options={globalOptions} />
          </div>
        </div>

        {/* CHART 2: ALLOCATION LEDGER TURNOVER (PIE) */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col transition-all duration-300 hover:border-indigo-400/60 hover:ring-4 hover:ring-indigo-50/50">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50 mb-4">
            <ClipboardList className="h-4 w-4 text-indigo-500" />
            <div>
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                Allocation Status
              </h4>
              <p className="text-[11px] text-slate-400 font-medium">
                Active and vacated allocations
              </p>
            </div>
          </div>
          <div className="h-64 relative w-full flex items-center justify-center">
            <Pie data={allocationData} options={globalOptions} />
          </div>
        </div>

        {/* CHART 3: TOP CROWDED CHANNELS (BAR CHART) */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col transition-all duration-300 hover:border-indigo-400/60 hover:ring-4 hover:ring-indigo-50/50">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50 mb-4">
            <TrendingUp className="h-4 w-4 text-red-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Room Occupancy
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                Occupancy percentage by room
              </p>
            </div>
          </div>
          <div className="h-64 relative w-full">
            <Bar
              data={roomCrowdednessData}
              options={{
                ...globalOptions,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: "#f8fafc" },
                    ticks: {
                      callback: (val) => `${val}%`,
                      font: { size: 9, weight: "600" },
                      color: "#94a3b8",
                    },
                  },
                  x: {
                    grid: { display: false },
                    ticks: {
                      font: { size: 10, weight: "700" },
                      color: "#64748b",
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* CHART 5: STUDENT DISTRIBUTION (BAR CHART) */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col transition-all duration-300 hover:border-indigo-400/60 hover:ring-4 hover:ring-indigo-50/50">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50 mb-4">
            <BarChart3 className="h-4 w-4 text-cyan-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Students per Room
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                Distribution of students across rooms
              </p>
            </div>
          </div>
          <div className="h-64 relative w-full">
            <Bar
              data={studentDistributionData}
              options={{
                ...globalOptions,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: "#f8fafc" },
                    ticks: {
                      stepSize: 1,
                      font: { size: 10, weight: "600" },
                      color: "#94a3b8",
                    },
                  },
                  x: {
                    grid: { display: false },
                    ticks: {
                      font: { size: 10, weight: "700" },
                      color: "#64748b",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
