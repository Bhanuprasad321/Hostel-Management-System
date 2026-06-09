import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  BedDouble,
  ClipboardList,
  DoorOpen,
} from "lucide-react";
import api from "../services/api";

function StatCard({ title, value, Icon, bg }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className={`absolute inset-0 bg-gradient-to-r ${bg} opacity-5`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2 className="mt-3 text-4xl font-bold text-slate-800">{value}</h2>
        </div>
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${bg}`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardCards() {
  const [stats, setStats] = useState(null);

  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const role = user?.role;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoint =
          role === "super_admin"
            ? "/dashboard/super-admin"
            : "/dashboard/admin";
        const res = await api.get(endpoint);
        setStats(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const superAdminData = [
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

  const adminData = [
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

  const dashboardData = role === "super_admin" ? superAdminData : adminData;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
        <p className="text-sm text-slate-500 mt-1">
          {role === "super_admin"
            ? "Platform-wide statistics"
            : "Your hostel at a glance"}
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardData.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}
