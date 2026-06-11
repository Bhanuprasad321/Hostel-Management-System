import { useEffect, useState } from "react";
import {
  Users,
  Plus,
  X,
  Loader2,
  Mail,
  KeyRound,
  Search,
  User,
  Building2,
  ChevronDown,
  ShieldCheck,
  Info,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
} from "lucide-react";
import api from "../services/api";

// ─── Helpers ─────────────────────────────────────────────────
function getInitials(name) {
  if (!name) return "A";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-cyan-500",
];
function avatarColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

// ─── Create Admin Modal ───────────────────────────────────────
function CreateAdminModal({ hostels, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    hostel_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.hostel_id) {
      setError("All credentials and structural definitions are required.");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/hostels/${form.hostel_id}/admin`, {
        name: form.name,
        email: form.email,
        password: form.password,
        hostel_id: Number(form.hostel_id),
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "Failed to provision administrative credential.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800">
                New Hostel Administrator
              </h2>
              <p className="text-xs text-slate-400">
                Provision a high-clearance tenant node profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 animate-fadeIn">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Security Email Identity
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="e.g. ramesh@hostelms.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Account Passcode
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Minimum 6 characters structural key"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-16 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Hostel select */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Assign Authority Scope
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={form.hostel_id}
                onChange={(e) => set("hostel_id", e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-white cursor-pointer"
                required
              >
                <option value="">Select Target Deployment Unit</option>
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
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 transition shadow-sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {loading ? "Provisioning..." : "Assign Administrator"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Admin Details Modal Popover Card ─────────────────────────
function AdminDetailsModal({ admin, hostelName, onClose }) {
  if (!admin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-5">
        {/* Profile Card Header Layout */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${avatarColor(admin.id)} text-xl font-bold text-white shadow-md border-2 border-white ring-4 ring-slate-50`}
          >
            {getInitials(admin.name)}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{admin.name}</h3>
            <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
              System Administrator
            </span>
          </div>
        </div>

        {/* Credentials Data Grid */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50 space-y-3 text-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Unique Node Index
            </span>
            <span className="text-slate-700 font-semibold text-xs bg-white px-2 py-0.5 rounded border border-slate-100 inline-block">
              USR-ADMIN-{admin.id}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Communication Routing
            </span>
            <span className="text-slate-700 font-medium break-all flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              {admin.email}
            </span>
          </div>

          {hostelName && (
            <div className="space-y-1 pt-1 border-t border-slate-200/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Assigned Structural Scope
              </span>
              <span className="text-slate-800 font-semibold flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                {hostelName}
              </span>
            </div>
          )}
        </div>

        {/* Actions Row */}
        <button
          onClick={onClose}
          className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition shadow-xs"
        >
          Close Profile File
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AdminRoute() {
  const [hostels, setHostels] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [loadingHostels, setLoadingHostels] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Search, Filtering & Core Table Sorting Configuration
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Fetch structural assets context catalog
  useEffect(() => {
    api
      .get("/hostels/")
      .then((r) => {
        const structuralData = Array.isArray(r.data) ? r.data : [];
        setHostels(structuralData);
        if (structuralData.length > 0) {
          setSelectedHostel(structuralData[0].id.toString());
        }
      })
      .catch(console.error)
      .finally(() => setLoadingHostels(false));
  }, []);

  // Sync internal admin databank state upon shifting core scopes
  useEffect(() => {
    if (!selectedHostel) return;
    refetchAdmins();
  }, [selectedHostel]);

  const refetchAdmins = () => {
    setLoadingAdmins(true);
    api
      .get(`/hostels/${selectedHostel}/admin/`)
      .then((r) => setAdmins(Array.isArray(r.data) ? r.data : []))
      .catch(console.error)
      .finally(() => setLoadingAdmins(false));
  };

  const currentHostel = hostels.find((h) => h.id === Number(selectedHostel));

  // Sort Matrix dispatcher state updater
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render reflective visual tags mapping to column sorting vectors
  const renderSortIcon = (field) => {
    if (sortField !== field)
      return (
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-slate-400 opacity-60" />
      );
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-indigo-600" />
    ) : (
      <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-indigo-600" />
    );
  };

  // Pipeline computation: Search query pass filters + functional memory array ordering
  const processedAdmins = admins
    .filter(
      (a) =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.email?.toLowerCase().includes(search.toLowerCase()) ||
        a.id?.toString().includes(search),
    )
    .sort((a, b) => {
      let valA = a[sortField] ? a[sortField].toString().toLowerCase() : "";
      let valB = b[sortField] ? b[sortField].toString().toLowerCase() : "";

      if (sortField === "id") {
        valA = a.id;
        valB = b.id;
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hostel Admins</h2>
          <p className="mt-1 text-sm text-slate-500">
            Provision and audit administrative clearing profiles across
            deployments
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New Admin
        </button>
      </div>
      {/* Control Utility Filter Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Core Name & ID Match Parameters */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search admins by name, index or routing identity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={!selectedHostel || loadingAdmins}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:opacity-60"
          />
        </div>

        {/* Structural Deployment Filter Component */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 select-none">
            <Filter className="h-3 w-3" /> Targeted Cluster:
          </span>
          {loadingHostels ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 py-2.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />{" "}
              Syncing structures...
            </div>
          ) : (
            <div className="relative">
              <select
                value={selectedHostel}
                onChange={(e) => {
                  setSelectedHostel(e.target.value);
                  setSearch("");
                }}
                className="appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer shadow-sm"
              >
                {hostels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.hostel_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          )}
        </div>
      </div>
      {/* Central Interactive Grid Architecture Data Workspace */}
      {loadingAdmins ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : processedAdmins.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center bg-white">
          <Users className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            {search
              ? "No administrators found matching criteria"
              : `No clear administrative paths assigned to ${currentHostel?.hostel_name ?? "this scope"}`}
          </p>
          {!search && selectedHostel && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-sm font-medium text-indigo-600 hover:underline"
            >
              Initialize cluster profile workspace →
            </button>
          )}
        </div>
      ) : (
        /* Data Layout Frame Container */
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
                <tr>
                  <th
                    scope="col"
                    onClick={() => handleSort("id")}
                    className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors w-32"
                  >
                    <div className="flex items-center">
                      System Index {renderSortIcon("id")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("name")}
                    className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center">
                      Administrator Profile {renderSortIcon("name")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("email")}
                    className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center">
                      Routing Email Address {renderSortIcon("email")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 select-none text-slate-400 font-medium"
                  >
                    Clearance Tier
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {processedAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    onClick={() => setSelectedAdmin(admin)}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                  >
                    {/* Index identifier code */}
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-normal">
                      # {admin.id}
                    </td>

                    {/* Administrator visual anchor node */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${avatarColor(admin.id)} text-[11px] font-bold text-white group-hover:scale-105 transition-transform shadow-xs`}
                        >
                          {getInitials(admin.name)}
                        </div>
                        <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-xs">
                          {admin.name}
                        </span>
                      </div>
                    </td>

                    {/* Direct email parameters cell link */}
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-normal">
                      <span className="truncate max-w-xs block">
                        {admin.email}
                      </span>
                    </td>

                    {/* Uniform platform authority operational badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                        Admin Scope
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dynamic Data Table Operational Info Footer */}
          <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-3 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Viewing {processedAdmins.length} profile entries</span>
            <span>Cluster Context: {currentHostel?.hostel_name ?? "N/A"}</span>
          </div>
        </div>
      )}
      {/* Profile Creation Anchor Elements Modal */}
      {showModal && (
        <CreateAdminModal
          hostels={hostels}
          onClose={() => setShowModal(false)}
          onCreated={refetchAdmins}
        />
      )}
      {/* Operational Inspection Popover Sheet Element Overlay block link */}
      {selectedAdmin && (
        <AdminDetailsModal
          admin={selectedAdmin}
          hostelName={currentHostel?.hostel_name}
          onClose={() => setSelectedAdmin(null)}
        />
      )}
    </div>
  );
}
