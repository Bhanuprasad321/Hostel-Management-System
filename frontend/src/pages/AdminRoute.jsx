import { useEffect, useState } from "react";
import {
  Users, Plus, X, Loader2, Mail, KeyRound,
  User, Building2, ChevronDown, ShieldCheck,
} from "lucide-react";
import api from "../services/api";

// ─── Helpers ─────────────────────────────────────────────────
function getInitials(name) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-violet-500", "bg-emerald-500",
  "bg-rose-500",   "bg-amber-500",  "bg-cyan-500",
];
function avatarColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

// ─── Create Admin Modal ───────────────────────────────────────
function CreateAdminModal({ hostels, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "", email: "", password: "", hostel_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showPass, setShowPass] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.hostel_id) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/hostels/${form.hostel_id}/admin`, {
        name:      form.name,
        email:     form.email,
        password:  form.password,
        hostel_id: Number(form.hostel_id),
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to create admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800">New hostel admin</h2>
              <p className="text-xs text-slate-400">Assign an admin to a hostel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Full name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="e.g. ramesh@gmail.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-16 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-indigo-500 hover:text-indigo-700"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Hostel select */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Assign to hostel</label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={form.hostel_id}
                onChange={(e) => set("hostel_id", e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-white"
              >
                <option value="">Select a hostel</option>
                {hostels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.hostel_name} — {h.address}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {loading ? "Creating..." : "Create admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Admin Card ───────────────────────────────────────────────
function AdminCard({ admin, hostelName, colorIndex }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white border border-slate-100 px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Avatar */}
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${avatarColor(colorIndex)} text-sm font-bold text-white`}>
        {getInitials(admin.name)}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-slate-800">{admin.name}</p>
        <p className="truncate text-sm text-slate-400">{admin.email}</p>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-600">
          Admin
        </span>
        {hostelName && (
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Building2 className="h-3 w-3" />
            {hostelName}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AdminRoute() {
  const [hostels, setHostels]       = useState([]);
  const [admins, setAdmins]         = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [loadingHostels, setLoadingHostels] = useState(true);
  const [loadingAdmins, setLoadingAdmins]   = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [search, setSearch]         = useState("");

  // fetch all hostels for dropdown + hostel selector
  useEffect(() => {
    api.get("/hostels/")
      .then((r) => {
        setHostels(r.data);
        if (r.data.length > 0) setSelectedHostel(r.data[0].id);
      })
      .catch(console.error)
      .finally(() => setLoadingHostels(false));
  }, []);

  // fetch admins whenever selected hostel changes
  useEffect(() => {
    if (!selectedHostel) return;
    setLoadingAdmins(true);
    api.get(`/hostels/${selectedHostel}/admin/`)
      .then((r) => setAdmins(r.data))
      .catch(console.error)
      .finally(() => setLoadingAdmins(false));
  }, [selectedHostel]);

  const refetchAdmins = () => {
    if (!selectedHostel) return;
    setLoadingAdmins(true);
    api.get(`/hostels/${selectedHostel}/admin/`)
      .then((r) => setAdmins(r.data))
      .catch(console.error)
      .finally(() => setLoadingAdmins(false));
  };

  const currentHostel = hostels.find((h) => h.id === Number(selectedHostel));

  const filtered = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hostel Admins</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage admins across all hostels
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New admin
        </button>
      </div>

      {/* Hostel selector tabs */}
      {loadingHostels ? (
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading hostels...
        </div>
      ) : (
        <div className="mb-6 flex flex-wrap gap-2">
          {hostels.map((h) => (
            <button
              key={h.id}
              onClick={() => { setSelectedHostel(h.id); setSearch(""); }}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors border ${
                selectedHostel === h.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {h.hostel_name}
            </button>
          ))}
        </div>
      )}

      {/* Search + count bar */}
      {selectedHostel && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{admins.length}</span>{" "}
            admin{admins.length !== 1 ? "s" : ""} in{" "}
            <span className="font-semibold text-indigo-600">{currentHostel?.hostel_name}</span>
          </p>
          <div className="relative max-w-xs w-full">
            <Users className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search admins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>
      )}

      {/* Admin list */}
      {loadingAdmins ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
          <Users className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            {search ? "No admins match your search" : "No admins for this hostel yet"}
          </p>
          {!search && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-sm font-medium text-indigo-600 hover:underline"
            >
              Add the first admin →
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((admin, i) => (
            <AdminCard
              key={admin.id}
              admin={admin}
              hostelName={currentHostel?.hostel_name}
              colorIndex={admin.id}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CreateAdminModal
          hostels={hostels}
          onClose={() => setShowModal(false)}
          onCreated={refetchAdmins}
        />
      )}
    </div>
  );
}