import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  BedDouble,
  ClipboardList,
  DoorOpen,
  Loader2,
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Activity,
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
  Legend,
} from "recharts";
import api from "../services/api";

// ─── Component: Existing Stat Metric Card ───────────────────
function StatCard({ title, value, Icon, bg }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${bg} opacity-[0.03]`}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-800">{value}</h2>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${bg}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const role = user?.role;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const endpoint =
          role === "super_admin"
            ? "/dashboard/super-admin"
            : "/dashboard/admin";
        const res = await api.get(endpoint);
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard metric resolution crash:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [role]);

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-medium text-slate-400 tracking-wide">
          Syncing performance operational arrays...
        </p>
      </div>
    );
  }

  // ─── Data Extraction & Safe Fallbacks ────────────────────────

  // 1) Subscription Status Ring Data
  const subscriptionDonutData = [
    {
      name: "Active",
      value: stats.subscription_breakdown?.active || 0,
      color: "#10b981",
    },
    {
      name: "Cancelled",
      value: stats.subscription_breakdown?.cancelled || 0,
      color: "#fbbf24",
    },
    {
      name: "Expired",
      value: stats.subscription_breakdown?.expired || 0,
      color: "#f97316",
    },
    {
      name: "Trial",
      value: stats.subscription_breakdown?.trial || 0,
      color: "#3b82f6",
    },
  ].filter((item) => item.value > 0); // Hide zero records for presentation safety

  // 2) User Profile Distribution Data
  const userDistributionData = [
    {
      name: "User Base",
      Students: stats.total_students || 0,
      Admins: stats.total_admins || 0,
    },
  ];

  // 3) Allocation State Metrics
  const allocationStatusData = [
    {
      name: "Allocations",
      Active: stats.active_allocations || 0,
      Vacated: stats.vacated_allocations || 0,
    },
  ];

  // 4) Top Client Hostels Capacity (Horizontal Array)
  const topHostelsData = stats.top_hostels || [
    { hostel_name: "No Active Data", students: 0 },
  ];

  // ─── Metric Group Dynamic Setup ────────────────────────────
  const superAdminCards = [
    {
      title: "Hostels",
      value: stats.total_hostels,
      Icon: Building2,
      bg: "from-blue-500 to-cyan-500",
    },
    {
      title: "Admins",
      value: stats.total_admins,
      Icon: Users,
      bg: "from-purple-500 to-pink-500",
    },
    {
      title: "Students",
      value: stats.total_students,
      Icon: Users,
      bg: "from-green-500 to-emerald-500",
    },
    {
      title: "Rooms",
      value: stats.total_rooms,
      Icon: BedDouble,
      bg: "from-orange-500 to-red-500",
    },
    {
      title: "Active Allocations",
      value: stats.active_allocations,
      Icon: ClipboardList,
      bg: "from-indigo-500 to-violet-500",
    },
  ];

  const adminCards = [
    {
      title: "Students",
      value: stats.total_students,
      Icon: Users,
      bg: "from-green-500 to-emerald-500",
    },
    {
      title: "Total Rooms",
      value: stats.total_rooms,
      Icon: BedDouble,
      bg: "from-blue-500 to-cyan-500",
    },
    {
      title: "Occupied Rooms",
      value: stats.occupied_rooms,
      Icon: DoorOpen,
      bg: "from-orange-500 to-red-500",
    },
    {
      title: "Vacant Rooms",
      value: stats.vacant_rooms,
      Icon: BedDouble,
      bg: "from-teal-500 to-cyan-500",
    },
    {
      title: "Active Allocations",
      value: stats.active_allocations,
      Icon: ClipboardList,
      bg: "from-indigo-500 to-violet-500",
    },
  ];

  const cardGroup = role === "super_admin" ? superAdminCards : adminCards;

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
        <p className="text-sm text-slate-500 mt-1">
          {role === "super_admin"
            ? "Platform-wide statistics"
            : "Your hostel at a glance"}
        </p>
      </div>

      {/* Grid: Existing Counters */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {cardGroup.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      {/* Conditional Layout Injection: Charts Engine */}
      {role === "super_admin" && (
        <div className="space-y-6">
          {/* Row 1: Subscriptions and Top Hostels */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Chart 1: Donut Subscriptions */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-4">
                <PieIcon className="h-4 w-4 text-indigo-500" />
                <h3 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">
                  Licensing Matrix Segment
                </h3>
              </div>
              <div className="flex-1 min-h-[260px] flex flex-col justify-center">
                {subscriptionDonutData.length === 0 ? (
                  <p className="text-center text-sm text-slate-400">
                    No active registration vectors logged
                  </p>
                ) : (
                  <>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={subscriptionDonutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {subscriptionDonutData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              borderRadius: "12px",
                              border: "1px solid #f1f5f9",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Synchronized Custom Legend */}
                    <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
                      {subscriptionDonutData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-600"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full"
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

            {/* Chart 4: Top Hostels Horizontal Layout */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-4">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <h3 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">
                  Top Tenancies by Capacity
                </h3>
              </div>
              <div className="flex-1 min-h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topHostelsData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="hostel_name"
                      type="category"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      width={90}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #f1f5f9",
                      }}
                    />
                    <Bar
                      dataKey="students"
                      name="Active Enrolled Students"
                      fill="#6366f1"
                      radius={[0, 8, 8, 0]}
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2: User Distribution and Allocations */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Chart 2: Profile Vectors Grouped Bar */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-4">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <h3 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">
                  Account Role Distribution
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userDistributionData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #f1f5f9",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: "12px", fontWeight: "600" }}
                    />
                    <Bar
                      dataKey="Students"
                      fill="#a855f7"
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                    />
                    <Bar
                      dataKey="Admins"
                      fill="#ec4899"
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Active vs Vacated Metrics */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-4">
                <Activity className="h-4 w-4 text-cyan-500" />
                <h3 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">
                  Allocation Status Ledger
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={allocationStatusData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #f1f5f9",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: "12px", fontWeight: "600" }}
                    />
                    <Bar
                      dataKey="Active"
                      fill="#06b6d4"
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                    />
                    <Bar
                      dataKey="Vacated"
                      fill="#94a3b8"
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
