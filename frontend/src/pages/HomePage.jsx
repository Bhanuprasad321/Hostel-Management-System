import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: "ti-door",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    title: "Room allocation",
    desc: "Allocate rooms to students with capacity checks and instant occupancy updates. Full transaction safety.",
  },
  {
    icon: "ti-users",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Student management",
    desc: "Create, search, and manage students. Every student is scoped to their hostel — no cross-hostel data leaks.",
  },
  {
    icon: "ti-chart-bar",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    title: "Live dashboard",
    desc: "Real-time metrics for occupancy, vacancies, allocations and student counts — always up to date.",
  },
  {
    icon: "ti-shield-lock",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    title: "Role-based access",
    desc: "Super Admin, Hostel Admin, and Student roles. Every route enforced server-side with JWT middleware.",
  },
  {
    icon: "ti-building-skyscraper",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    title: "Multi-tenant",
    desc: "Each hostel is fully isolated. Admins can only see and manage their own hostel's data.",
  },
  {
    icon: "ti-database",
    color: "text-red-400",
    bg: "bg-red-500/10",
    title: "Transaction safety",
    desc: "All allocation and vacating operations are wrapped in MySQL transactions with full rollback on failure.",
  },
];

const roles = [
  {
    icon: "ti-crown",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    title: "Super admin",
    desc: "Platform-wide control. Creates hostels, assigns admins, views global analytics.",
    pills: ["Create hostels", "Manage admins", "Platform stats"],
    pillStyle: "bg-orange-500/10 text-orange-400",
  },
  {
    icon: "ti-user-cog",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    title: "Hostel admin",
    desc: "Manages one hostel. Allocates rooms, manages students, monitors occupancy.",
    pills: ["Allocate rooms", "Manage students", "Dashboard"],
    pillStyle: "bg-indigo-500/10 text-indigo-400",
  },
  {
    icon: "ti-school",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Student",
    desc: "Exists in the system. Student portal coming soon with allocation history and profile.",
    pills: ["View profile", "Portal (soon)"],
    pillStyle: "bg-emerald-500/10 text-emerald-400",
  },
];

const stats = [
  { value: "500+", label: "Hostels managed" },
  { value: "12k+", label: "Students tracked" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "3 roles", label: "Role-based access" },
];

const floors = [
  { label: "Floor 1", pct: 95 },
  { label: "Floor 2", pct: 88 },
  { label: "Floor 3", pct: 75 },
  { label: "Floor 4", pct: 60 },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1a1f5e] text-white font-sans">

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-12 h-16 border-b border-white/10 bg-[#141852]">
        <div className="flex items-center gap-3 text-[18px] font-medium">
          <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center">
            <i className="ti ti-building text-white text-lg" />
          </div>
          HostelMS
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "Dashboard", "Pricing", "About"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm px-5 py-2 rounded-lg transition-colors"
        >
          Get started
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-[1200px] mx-auto px-12 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-12">

        {/* Left */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/40 rounded-full px-4 py-1 text-xs text-indigo-300 mb-6">
            <i className="ti ti-sparkles text-[13px]" />
            Multi-tenant SaaS platform
          </div>
          <h1 className="text-[44px] font-medium leading-[1.2] text-white mb-5">
            Manage every hostel.<br />
            <span className="text-indigo-400">From one platform.</span>
          </h1>
          <p className="text-base text-white/60 leading-relaxed max-w-[480px] mb-9">
            A powerful, role-based hostel management system. Allocate rooms,
            track students, and monitor occupancy — all in real time.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-7 py-3 rounded-lg text-[15px] transition-colors"
            >
              <i className="ti ti-login" />
              Sign in
            </button>
            <button className="bg-transparent text-white/75 hover:text-white border border-white/25 hover:border-white/50 px-6 py-3 rounded-lg text-[15px] transition-colors">
              Learn more
            </button>
          </div>
        </div>

        {/* Dashboard preview card */}
        <div className="flex-1 max-w-[480px] w-full">
          <div className="bg-[#0f1340] border border-white/10 rounded-2xl overflow-hidden">

            {/* Fake browser bar */}
            <div className="bg-[#141852] px-4 py-3 flex items-center gap-2 border-b border-white/[0.08]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[12px] text-white/40">
                Admin Dashboard — Sunrise Hostel
              </span>
            </div>

            <div className="p-5">
              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {[
                  { label: "Total students", val: "248", sub: "↑ 12 this month", subColor: "text-indigo-400" },
                  { label: "Active allocations", val: "191", sub: "96% occupancy", subColor: "text-emerald-400" },
                  { label: "Total rooms", val: "64", sub: "4 floors", subColor: "text-white/35" },
                  { label: "Vacant rooms", val: "8", sub: "Available now", subColor: "text-orange-400" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#1a1f5e] rounded-xl p-3.5">
                    <p className="text-[11px] text-white/45 mb-1.5">{s.label}</p>
                    <p className="text-[22px] font-medium text-white">{s.val}</p>
                    <p className={`text-[11px] mt-1 ${s.subColor}`}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Occupancy bars */}
              <p className="text-[11px] text-white/40 mb-2.5">Room occupancy by floor</p>
              {floors.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-[11px] text-white/50 w-[70px] whitespace-nowrap">
                    {f.label}
                  </span>
                  <div className="flex-1 bg-white/[0.08] rounded h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded bg-indigo-500"
                      style={{ width: `${f.pct}%`, opacity: f.pct > 85 ? 1 : f.pct > 70 ? 0.75 : 0.5 }}
                    />
                  </div>
                  <span className="text-[11px] text-white/40 w-8 text-right">{f.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="flex border-t border-b border-white/[0.07] bg-[#0f1340]">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex-1 text-center py-7 ${i < stats.length - 1 ? "border-r border-white/[0.07]" : ""}`}
          >
            <p className="text-[28px] font-medium text-indigo-400">{s.value}</p>
            <p className="text-[13px] text-white/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Features ── */}
      <section className="max-w-[1200px] mx-auto px-12 py-[72px]">
        <p className="text-xs text-indigo-400 uppercase tracking-widest mb-3">
          Platform features
        </p>
        <h2 className="text-[30px] font-medium text-white mb-3">
          Everything you need to run a hostel
        </h2>
        <p className="text-[15px] text-white/55 max-w-[520px] mb-12 leading-relaxed">
          From room allocation to student management, all critical workflows are
          handled with data integrity and transaction safety.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#0f1340] border border-white/10 hover:border-indigo-500/50 rounded-2xl p-7 transition-colors"
            >
              <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-5`}>
                <i className={`ti ${f.icon} ${f.color} text-xl`} />
              </div>
              <h3 className="text-[15px] font-medium text-white mb-2">{f.title}</h3>
              <p className="text-[13px] text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Roles ── */}
      <section className="max-w-[1200px] mx-auto px-12 pb-[72px]">
        <p className="text-xs text-indigo-400 uppercase tracking-widest mb-3">
          Access levels
        </p>
        <h2 className="text-[30px] font-medium text-white mb-3">
          Three roles, one system
        </h2>
        <p className="text-[15px] text-white/55 max-w-[480px] mb-12 leading-relaxed">
          Clear permission boundaries ensure every user sees only what they need to.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((r) => (
            <div
              key={r.title}
              className="bg-[#0f1340] border border-white/10 rounded-2xl p-7"
            >
              <div className={`w-11 h-11 ${r.bg} rounded-xl flex items-center justify-center`}>
                <i className={`ti ${r.icon} ${r.color} text-xl`} />
              </div>
              <h3 className="text-base font-medium text-white mt-4 mb-2">{r.title}</h3>
              <p className="text-[13px] text-white/50 leading-relaxed mb-4">{r.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {r.pills.map((p) => (
                  <span
                    key={p}
                    className={`text-[11px] px-2.5 py-1 rounded-full ${r.pillStyle}`}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="bg-[#0f1340] border-t border-white/[0.07] py-[72px] text-center px-12">
        <h2 className="text-[32px] font-medium text-white mb-3">
          Ready to get started?
        </h2>
        <p className="text-[15px] text-white/55 mb-9">
          Sign in to your dashboard and manage your hostel operations in minutes.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-7 py-3 rounded-lg text-[15px] transition-colors"
        >
          <i className="ti ti-login" />
          Sign in to dashboard
        </button>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-[#141852] border-t border-white/[0.07] px-12 py-6 flex items-center justify-between">
        <p className="text-[13px] text-white/35">
          © 2026 HostelMS · Built with Node.js, React & MySQL
        </p>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Support"].map((l) => (
            <a key={l} href="#" className="text-[13px] text-white/35 hover:text-white/60 transition-colors">
              {l}
            </a>
          ))}
        </div>
      </footer>

    </div>
  );
}
