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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/super-admin");
        setStats(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="text-center text-lg font-medium">
        Loading Dashboard...
      </div>
    );
  }

  const dashboardData = [
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

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
      {dashboardData.map((item) => (
        <StatCard key={item.title} {...item} />
      ))}
    </div>
  );
}
