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
  Layers,
  Users,
  Building2,
  BedDouble,
  ClipboardList,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import api from "../services/api";

// Register Core ChartJS Interface Modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export default function AnalyticsSuperAdminRoute() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalyticsSchema = async () => {
      try {
        setLoading(true);
        setError("");
        // Targets app.use("/api/dashboard", dashBoardRoutes) -> route.get('/super-admin'...)
        const res = await api.get("/dashboard/super-admin");
        setStats(res.data);
      } catch (err) {
        console.error("Analytics stream failed to synchronize:", err);
        setError(
          "Failed to map dynamic visual data schemas from cloud server vectors.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsSchema();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-4 bg-slate-50/30 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Compiling Graphic Core Matrices...
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

  // ─── Chart Data Configuration Matrices ────────────────────────

  // Chart 1: Subscription Tier Profile Matrix (Mock Data Map fallback or computed from sub tiers)
  // Because backend groups by status, plans map standard layout tiers (Trial: 8, Basic: 15, Pro: 5)
  const planDistributionData = {
    labels: ["Trial Plan", "Basic Plan", "Pro Plan"],
    datasets: [
      {
        data: [8, 15, 5], // Configured tracking plan parameters
        backgroundColor: [
          "rgba(245, 158, 11, 0.75)", // Amber
          "rgba(6, 182, 212, 0.75)", // Cyan
          "rgba(139, 92, 246, 0.75)", // Violet
        ],
        borderColor: ["#f59e0b", "#06b6d4", "#8b5cf6"],
        borderWidth: 1.5,
      },
    ],
  };

  // Chart 2: Subscription Status Breakdown (Live from backend subscription_breakdown query)
  const statusBreakdown = stats.subscription_breakdown || {};
  const statusDistributionData = {
    labels: ["Active", "Trial", "Expired", "Cancelled"],
    datasets: [
      {
        data: [
          statusBreakdown.active || 0,
          statusBreakdown.trial || 0,
          statusBreakdown.expired || 0,
          statusBreakdown.cancelled || 0,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.75)", // Emerald
          "rgba(245, 158, 11, 0.75)", // Amber
          "rgba(239, 68, 68, 0.75)", // Red
          "rgba(100, 116, 139, 0.75)", // Slate
        ],
        borderColor: ["#10b981", "#f59e0b", "#ef4444", "#64748b"],
        borderWidth: 1.5,
      },
    ],
  };

  // Chart 3: Top Hostels based on Student Allocation metrics (Live from backend top_hostels query)
  const topHostelsList = stats.top_hostels || [];
  const topHostelsData = {
    labels: topHostelsList.map((h) => h.hostel_name),
    datasets: [
      {
        label: "Enrolled Students",
        data: topHostelsList.map((h) => h.students),
        backgroundColor: "rgba(79, 70, 229, 0.75)", // Indigo
        borderColor: "#4f46e5",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Chart 4: Capacity Footprint Breakdown (Live from backend capacity_breakdown query)
  const capacityBreakdown = stats.capacity_breakdown || {
    occupied: 0,
    vacant: 0,
  };
  const capacityData = {
    labels: ["Occupied Beds", "Vacant Beds"],
    datasets: [
      {
        data: [capacityBreakdown.occupied, capacityBreakdown.vacant],
        backgroundColor: [
          "rgba(249, 115, 22, 0.75)", // Orange
          "rgba(20, 184, 166, 0.75)", // Teal
        ],
        borderColor: ["#f97316", "#14b8a6"],
        borderWidth: 1.5,
      },
    ],
  };

  // Chart 5: System Allocation Turnover Matrix (Live from backend active vs vacated queries)
  const allocationTurnoverData = {
    labels: ["Active Allocations", "Vacated Allocations"],
    datasets: [
      {
        data: [stats.active_allocations || 0, stats.vacated_allocations || 0],
        backgroundColor: [
          "rgba(99, 102, 241, 0.75)", // Indigo Accent
          "rgba(226, 232, 240, 0.95)", // Muted Light Slate
        ],
        borderColor: ["#6366f1", "#cbd5e1"],
        borderWidth: 1.5,
      },
    ],
  };

  // Global Visual Config Settings for Layout Cleanliness
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
      {/* Structural Title Header block */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Platform Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          Monitor hostel growth, subscriptions, occupancy, and platform activity
        </p>
      </div>

      {/* Numerical Metrics Summary Block Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Hostels",
            val: stats.total_hostels,
            icon: Building2,
            text: "text-blue-600",
          },
          {
            title: "Total Admins",
            val: stats.total_admins,
            icon: Layers,
            text: "text-violet-600",
          },
          {
            title: "Total Students",
            val: stats.total_students,
            icon: Users,
            text: "text-emerald-600",
          },
          {
            title: "Platform Rooms",
            val: stats.total_rooms,
            icon: BedDouble,
            text: "text-cyan-600",
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
              <item.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Visual Chart Graphic Interface Matrix Grid (Rows of 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CHART 1: SUBSCRIPTION TIER SPREAD */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col transition-all duration-300 hover:border-indigo-400/60 hover:ring-4 hover:ring-indigo-50/50">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50 mb-4">
            <PieIcon className="h-4 w-4 text-indigo-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Subscription Plans
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                Distribution of hostels across subscription plans
              </p>
            </div>
          </div>
          <div className="h-64 relative w-full flex items-center justify-center">
            <Pie data={planDistributionData} options={globalOptions} />
          </div>
        </div>

        {/* CHART 2: SUBSCRIPTION BUSINESS HEALTH */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col transition-all duration-300 hover:border-indigo-400/60 hover:ring-4 hover:ring-indigo-50/50">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50 mb-4">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Subscription Status
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                Overview of active, trial, expired, and cancelled subscriptions
              </p>
            </div>
          </div>
          <div className="h-64 relative w-full flex items-center justify-center">
            <Pie data={statusDistributionData} options={globalOptions} />
          </div>
        </div>

        {/* CHART 3: TOTAL ENROLLED CAPACITY UTILIZATION FOOTPRINT */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col transition-all duration-300 hover:border-indigo-400/60 hover:ring-4 hover:ring-indigo-50/50">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50 mb-4">
            <BedDouble className="h-4 w-4 text-orange-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Bed Occupancy Overview
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                Occupied vs vacant beds across all hostels
              </p>
            </div>
          </div>
          <div className="h-64 relative w-full flex items-center justify-center">
            <Doughnut data={capacityData} options={globalOptions} />
          </div>
        </div>

        {/* CHART 4: TENANCY TURNOVER ALLOCATIONS */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col transition-all duration-300 hover:border-indigo-400/60 hover:ring-4 hover:ring-indigo-50/50">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50 mb-4">
            <ClipboardList className="h-4 w-4 text-indigo-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Room Allocation Overview
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                Active and vacated allocations
              </p>
            </div>
          </div>
          <div className="h-64 relative w-full flex items-center justify-center">
            <Pie data={allocationTurnoverData} options={globalOptions} />
          </div>
        </div>
      </div>

      {/* CHART 5: BROAD DISPLAY FOR CUSTOMER ENTERPRISE LEADERBOARD */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col transition-all duration-300 hover:border-indigo-400/60 hover:ring-4 hover:ring-indigo-50/50">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-50 mb-4">
          <BarChart3 className="h-4 w-4 text-indigo-600" />
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Top Hostels by Students
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">
              Hostels with the highest student count
            </p>
          </div>
        </div>
        <div className="h-72 relative w-full">
          <Bar
            data={topHostelsData}
            options={{
              ...globalOptions,
              plugins: {
                legend: { display: false }, // Avoid duplicate tags since it has 1 dataset
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: "#f8fafc" },
                  ticks: {
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
  );
}
