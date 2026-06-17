import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  MessageSquareWarning,
  LayoutDashboard,
  Building2,
  Users,
  BedDouble,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ChevronRight,
  CreditCard,
  History,
  Bell,
  Wrench,
  ChartColumn,
  AlertCircle,
  Home,
} from "lucide-react";
import api from "../services/api"; // Handled through your existing axios helper instance

const superAdminLinks = [
  { to: "/super-admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/hostels", label: "Hostels", icon: Building2 },
  { to: "/:id/admin/", label: "Admins", icon: Users },
  { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/audit-logs", label: "Audit Logs", icon: History },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Wrench },
  { to: "/super-admin/analytics", label: "Analytics", icon: ChartColumn },
];

const adminLinks = [
  { to: "/hostel-admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users },
  { to: "/rooms", label: "Rooms", icon: BedDouble },
  { to: "/allocations", label: "Allocations", icon: ClipboardList },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Wrench },
  { to: "/admin/analytics", label: "Analytics", icon: ChartColumn },
  { to: "/notices", label: "Notices", icon: AlertCircle },
  { to: "/complaints", label: "Complaints", icon: MessageSquareWarning },
];

const studentLinks = [
  { to: "/student", label: "Dashboard", icon: LayoutDashboard },
  {
    to: "/allocation-details",
    label: "Allocation Details",
    icon: ClipboardList,
  },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/notices", label: "Notices", icon: AlertCircle },
  { to: "/complaints", label: "Complaints", icon: MessageSquareWarning },
  { to: "/settings", label: "Settings", icon: Wrench },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const role = user?.role;

  // Determine navigation vector link schemas dynamically based on role parameter strings
  let navLinks = studentLinks;
  if (role === "super_admin") {
    navLinks = superAdminLinks;
  } else if (role === "admin") {
    navLinks = adminLinks;
  }

  // Fetch unread count directly from your existing notification registry logic
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get("/notifications");
        if (res.data && Array.isArray(res.data)) {
          const unread = res.data.filter((item) => item.is_read === 0).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error(
          "Failed to sync navigation unread badge parameters:",
          err,
        );
      }
    };

    fetchUnreadCount();
    // Optional: Setup a poll every 60 seconds to keep counts refreshed silently
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [location.pathname]); // Re-evaluate when navigating routes (e.g., leaving notifications page)

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.includes("/hostels")) return "Hostels";
    if (path.includes("/admin/")) return "Hostel Admins";
    if (path.includes("/subscriptions")) return "Subscriptions";
    if (path.includes("/students")) return "Students";
    if (path.includes("/rooms")) return "Rooms";
    if (path.includes("/allocations")) return "Allocations";
    if (path.includes("/notifications")) return "Notifications";
    if (path.includes("/my-room")) return "My Room";
    if (path.includes("/settings")) return "Settings";
    return "Dashboard";
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const getRoleLabel = () => {
    if (role === "super_admin") return "Super Admin";
    if (role === "admin") return "Hostel Admin";
    return "Student";
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <span className="text-[17px] font-semibold text-slate-800">
          HostelMS
        </span>
      </div>

      {/* Role badge */}
      <div className="px-5 pt-4 pb-2">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-600">
          {getRoleLabel()}
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Menu
        </p>
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">
              {user?.name ?? "User"}
            </p>
            <p className="truncate text-xs text-slate-400">
              {user?.email ?? ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:shrink-0 flex-col bg-white border-r border-slate-100 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 flex w-64 flex-col bg-white shadow-xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Minimalist Topbar Utility Row */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-6 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Balanced Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-s font-medium text-slate-400 select-none">
              <span className="tracking-wide">HostelMS</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600 font-semibold">
                {getHeaderTitle()}
              </span>
            </div>
          </div>

          {/* Right Utility Navigation Node */}
          <div className="flex items-center gap-3.5">
            {/* Interactive Notification Bell trigger Layout Component */}
            <button
              onClick={() => navigate("/notifications")}
              className="relative p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100 shadow-2xs"
              aria-label="View notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white ring-2 ring-white animate-fade-in">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 border border-indigo-100/40 shadow-xs">
              {initials}
            </div>
          </div>
        </header>

        {/* Dynamic Route View Page Frame */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
