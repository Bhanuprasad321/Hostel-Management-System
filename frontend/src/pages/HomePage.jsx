import { useNavigate } from "react-router-dom";
import { useState } from "react";

// ── Data ──────────────────────────────────────────────────────

const features = [
  {
    icon: "ti-door-enter",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    title: "Room Allocation",
    desc: "Assign rooms in seconds. Real-time occupancy tracking with capacity guards and MySQL transaction safety.",
  },
  {
    icon: "ti-users",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Student Management",
    desc: "Onboard, search, and manage students. Each student is fully scoped to their hostel — zero cross-tenant leaks.",
  },
  {
    icon: "ti-layout-dashboard",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    title: "Live Dashboard",
    desc: "Occupancy rates, allocation stats, and vacancy counts — updated instantly, no page refresh needed.",
  },
  {
    icon: "ti-shield-check",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    title: "Role-Based Access",
    desc: "Three airtight roles: Super Admin, Hostel Admin, Student. Every route protected server-side via JWT.",
  },
  {
    icon: "ti-building-skyscraper",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    title: "Multi-Tenant",
    desc: "Unlimited hostels on one platform. Each hostel is fully isolated — admins only ever see their own data.",
  },
  {
    icon: "ti-database",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    title: "Transaction Safety",
    desc: "Allocations and vacations run inside MySQL transactions. Any failure triggers a full rollback instantly.",
  },
];

const steps = [
  {
    number: "01",
    title: "Super Admin creates a hostel",
    desc: "Register your institution on the platform. Each hostel gets its own isolated data space.",
    color: "text-indigo-400",
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
  },
  {
    number: "02",
    title: "Assign a hostel admin",
    desc: "Create a dedicated admin account for the hostel. They get full control over their campus only.",
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
  {
    number: "03",
    title: "Add rooms & students",
    desc: "Admin sets up rooms with capacity limits, then registers students into the system.",
    color: "text-sky-400",
    border: "border-sky-500/30",
    bg: "bg-sky-500/10",
  },
  {
    number: "04",
    title: "Allocate & manage live",
    desc: "Allocate students to rooms, monitor occupancy in real time, and vacate when needed.",
    color: "text-violet-400",
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
  },
];

const stats = [
  { value: "500+", label: "Hostels managed" },
  { value: "12k+", label: "Students tracked" },
  { value: "99.9%", label: "Uptime" },
  { value: "3", label: "Role levels" },
];

const testimonials = [
  {
    quote:
      "We cut room allocation time from 2 days to under 10 minutes. The dashboard gives us everything at a glance.",
    name: "Ramesh Kumar",
    role: "Hostel Admin, Green Valley Residency",
    initials: "RK",
    color: "bg-indigo-500",
  },
  {
    quote:
      "Managing 6 hostels from one super admin panel is exactly what we needed. No more spreadsheets.",
    name: "Priya Sharma",
    role: "Director of Operations, Sunrise Group",
    initials: "PS",
    color: "bg-emerald-500",
  },
  {
    quote:
      "The multi-tenant isolation is rock-solid. Each hostel team only sees what they should. Security first.",
    name: "Anil Mehta",
    role: "IT Head, Royal Campus",
    initials: "AM",
    color: "bg-violet-500",
  },
];

const faqs = [
  {
    q: "How is each hostel's data kept separate?",
    a: "Every record in the database carries a hostel_id. Hostel admins can only query data matching their own hostel_id — enforced server-side on every API route.",
  },
  {
    q: "Can one super admin manage multiple hostels?",
    a: "Yes. The super admin has platform-wide visibility and can create unlimited hostels, each with their own dedicated admin.",
  },
  {
    q: "What happens if an allocation fails midway?",
    a: "All allocations run inside MySQL transactions. If anything fails — room update, record insert — the entire operation rolls back leaving data clean.",
  },
  {
    q: "Is there a student-facing portal?",
    a: "Student accounts exist in the system today. A self-service student portal with allocation history and profile management is on the roadmap.",
  },
];

const floors = [
  { label: "Floor 1", pct: 95 },
  { label: "Floor 2", pct: 88 },
  { label: "Floor 3", pct: 72 },
  { label: "Floor 4", pct: 61 },
];

// ── Sub-components ────────────────────────────────────────────

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl transition-colors cursor-pointer ${
        open
          ? "border-indigo-500/40 bg-indigo-500/5"
          : "border-white/10 hover:border-white/20"
      }`}
      onClick={() => setOpen((v) => !v)}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-[15px] font-medium text-white pr-4">{q}</p>
        <span
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm transition-colors ${open ? "bg-indigo-500" : "bg-white/10"}`}
        >
          {open ? "−" : "+"}
        </span>
      </div>
      {open && (
        <p className="px-6 pb-5 text-[14px] text-white/55 leading-relaxed border-t border-white/[0.07] pt-4">
          {a}
        </p>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d1036] text-white font-sans">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-14 h-16 border-b border-white/[0.08] bg-[#0d1036]/90 backdrop-blur-md">
        <div className="flex items-center gap-3 text-[17px] font-semibold">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <i className="ti ti-building text-white text-base" />
          </div>
          HostelMS
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Testimonials", "FAQ"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              className="text-[13px] text-white/55 hover:text-white transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-[13px] text-white/70 hover:text-white transition-colors px-3 py-2"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-500 hover:bg-indigo-400 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Get started →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-[1100px] mx-auto px-8 md:px-14 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-16">
        {/* Left */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/30 rounded-full px-4 py-1.5 text-[12px] text-indigo-300 mb-7 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Now live — multi-tenant SaaS for hostels
          </div>
          <h1 className="text-[42px] md:text-[52px] font-bold leading-[1.12] text-white mb-6 tracking-tight">
            Run every hostel.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              From one platform.
            </span>
          </h1>
          <p className="text-[16px] text-white/55 leading-relaxed max-w-[460px] mb-10">
            HostelMS gives institutions a single command center to manage rooms,
            students, allocations and staff — with airtight multi-tenant
            isolation and real-time dashboards.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-7 py-3.5 rounded-xl text-[15px] font-medium transition-colors shadow-lg shadow-indigo-500/25"
            >
              <i className="ti ti-login text-lg" />
              Try demo login
            </button>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 bg-white/8 hover:bg-white/12 border border-white/15 text-white/80 hover:text-white px-6 py-3.5 rounded-xl text-[15px] transition-colors"
            >
              See how it works
              <i className="ti ti-arrow-right text-sm" />
            </a>
          </div>
          {/* Trust row */}
          <div className="flex items-center gap-6 mt-10">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-[22px] font-bold text-indigo-400">
                  {s.value}
                </p>
                <p className="text-[11px] text-white/40 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="flex-1 max-w-[460px] w-full">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
            {/* Titlebar */}
            <div className="bg-[#141852] px-4 py-3 flex items-center gap-2 border-b border-white/[0.07]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-[11px] text-white/35 font-mono">
                hostelms.app/dashboard
              </span>
            </div>
            {/* Content */}
            <div className="bg-[#0f1340] p-5">
              <p className="text-[11px] text-white/40 mb-3 font-medium uppercase tracking-widest">
                Sunrise Hostel — Live overview
              </p>
              {/* Mini stat cards */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {[
                  {
                    l: "Students",
                    v: "248",
                    s: "↑ 12 this month",
                    c: "text-indigo-400",
                  },
                  {
                    l: "Allocations",
                    v: "191",
                    s: "96% occupancy",
                    c: "text-emerald-400",
                  },
                  { l: "Rooms", v: "64", s: "4 floors", c: "text-white/30" },
                  {
                    l: "Vacant",
                    v: "8",
                    s: "Available now",
                    c: "text-amber-400",
                  },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="bg-[#1a1f5e] rounded-xl p-3.5 border border-white/[0.06]"
                  >
                    <p className="text-[10px] text-white/40 mb-1.5 uppercase tracking-wide">
                      {s.l}
                    </p>
                    <p className="text-[20px] font-bold text-white">{s.v}</p>
                    <p className={`text-[10px] mt-1 ${s.c}`}>{s.s}</p>
                  </div>
                ))}
              </div>
              {/* Occupancy bars */}
              <div className="bg-[#1a1f5e] rounded-xl p-4 border border-white/[0.06]">
                <p className="text-[10px] text-white/35 mb-3 uppercase tracking-widest">
                  Room occupancy
                </p>
                {floors.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-2.5 mb-2.5 last:mb-0"
                  >
                    <span className="text-[10px] text-white/45 w-14">
                      {f.label}
                    </span>
                    <div className="flex-1 bg-white/[0.07] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        style={{ width: `${f.pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/35 w-7 text-right">
                      {f.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        id="how-it-works"
        className="bg-[#080c2a] border-y border-white/[0.06] py-20 px-8 md:px-14"
      >
        <div className="max-w-[1100px] mx-auto">
          <p className="text-[11px] text-indigo-400 uppercase tracking-widest font-semibold mb-3">
            How it works
          </p>
          <h2 className="text-[30px] font-bold text-white mb-3">
            Up and running in 4 steps
          </h2>
          <p className="text-[15px] text-white/50 mb-14 max-w-[480px] leading-relaxed">
            From platform setup to live allocation — the entire workflow takes
            under an hour.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s) => (
              <div
                key={s.number}
                className={`relative bg-[#0f1340] border ${s.border} rounded-2xl p-6 hover:border-opacity-60 transition-colors`}
              >
                <div
                  className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-4`}
                >
                  <span className={`text-[13px] font-bold ${s.color}`}>
                    {s.number}
                  </span>
                </div>
                <h3 className="text-[14px] font-semibold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-[13px] text-white/45 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="max-w-[1100px] mx-auto px-8 md:px-14 py-20"
      >
        <p className="text-[11px] text-indigo-400 uppercase tracking-widest font-semibold mb-3">
          Features
        </p>
        <h2 className="text-[30px] font-bold text-white mb-3">
          Everything a hostel operation needs
        </h2>
        <p className="text-[15px] text-white/50 max-w-[500px] mb-14 leading-relaxed">
          Built for real hostel workflows — not generic CRUD. Every feature
          solves a specific daily pain point.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-[#0f1340] border border-white/[0.08] hover:border-indigo-500/40 rounded-2xl p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <div
                className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-5`}
              >
                <i className={`ti ${f.icon} ${f.color} text-[18px]`} />
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-[13px] text-white/45 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Demo CTA Banner ── */}
      <div className="mx-8 md:mx-14 mb-20 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-px">
        <div className="rounded-[15px] bg-gradient-to-r from-indigo-600/90 to-violet-600/90 px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[22px] font-bold text-white mb-1">
              See it live in 30 seconds
            </h3>
            <p className="text-white/70 text-[14px]">
              Use our demo credentials to explore the super admin and hostel
              admin views.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="bg-white/15 border border-white/20 rounded-xl px-5 py-3 text-[13px] text-white/80 font-mono">
              demo@hostelms.app
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-indigo-700 font-semibold text-[14px] px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
            >
              Launch demo →
            </button>
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <section
        id="testimonials"
        className="bg-[#080c2a] border-y border-white/[0.06] py-20 px-8 md:px-14"
      >
        <div className="max-w-[1100px] mx-auto">
          <p className="text-[11px] text-indigo-400 uppercase tracking-widest font-semibold mb-3">
            Testimonials
          </p>
          <h2 className="text-[30px] font-bold text-white mb-14">
            Trusted by hostel teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-[#0f1340] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className="ti ti-star-filled text-amber-400 text-[13px]"
                    />
                  ))}
                </div>
                <p className="text-[14px] text-white/65 leading-relaxed flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 border-t border-white/[0.07] pt-4">
                  <div
                    className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-[12px] font-bold text-white`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">
                      {t.name}
                    </p>
                    <p className="text-[11px] text-white/40">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="max-w-[720px] mx-auto px-8 md:px-14 py-20">
        <p className="text-[11px] text-indigo-400 uppercase tracking-widest font-semibold mb-3">
          FAQ
        </p>
        <h2 className="text-[30px] font-bold text-white mb-12">
          Common questions
        </h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <div className="bg-[#080c2a] border-t border-white/[0.06] py-24 px-8 text-center">
        <h2 className="text-[34px] md:text-[40px] font-bold text-white mb-4 leading-tight">
          Ready to modernise
          <br />
          your hostel?
        </h2>
        <p className="text-[15px] text-white/50 mb-10 max-w-[400px] mx-auto leading-relaxed">
          Sign in and start managing rooms, students, and allocations today.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-9 py-4 rounded-xl text-[15px] transition-colors shadow-xl shadow-indigo-500/30"
        >
          <i className="ti ti-login text-lg" />
          Get started free
        </button>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-[#080c2a] border-t border-white/[0.06] px-8 md:px-14 pt-14 pb-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <i className="ti ti-building text-white text-base" />
                </div>
                <span className="text-[16px] font-semibold text-white">
                  HostelMS
                </span>
              </div>
              <p className="text-[13px] text-white/40 leading-relaxed">
                Multi-tenant hostel management SaaS. Built for institutions that
                run on scale.
              </p>
            </div>
            {/* Product */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">
                Product
              </p>
              {["Features", "How it works", "Dashboard", "Pricing"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-[13px] text-white/45 hover:text-white/80 transition-colors mb-2.5"
                >
                  {l}
                </a>
              ))}
            </div>
            {/* Company */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">
                Company
              </p>
              {["About", "Contact", "Careers", "Blog"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-[13px] text-white/45 hover:text-white/80 transition-colors mb-2.5"
                >
                  {l}
                </a>
              ))}
            </div>
            {/* Legal */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">
                Legal
              </p>
              {["Privacy Policy", "Terms of Service", "Security"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-[13px] text-white/45 hover:text-white/80 transition-colors mb-2.5"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.07] pt-8">
            <p className="text-[12px] text-white/25">
              © 2026 HostelMS · Built with Node.js, React & MySQL
            </p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[12px] text-white/30">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
