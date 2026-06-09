import { useEffect, useState } from "react";
import { Building2, Plus, X, MapPin, Calendar, Loader2 } from "lucide-react";
import api from "../services/api";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Create Hostel Modal ──────────────────────────────────────
function CreateHostelModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ hostel_name: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.hostel_name.trim() || !form.address.trim()) {
      setError("Both fields are required.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/hostels/", form);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to create hostel.");
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
              <Building2 className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800">New Hostel</h2>
              <p className="text-xs text-slate-400">Fill in the details below</p>
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

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Hostel name
            </label>
            <input
              type="text"
              placeholder="e.g. Royal Hostel"
              value={form.hostel_name}
              onChange={(e) => setForm({ ...form, hostel_name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Address
            </label>
            <input
              type="text"
              placeholder="e.g. Hyderabad"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
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
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {loading ? "Creating..." : "Create hostel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Hostel Card ──────────────────────────────────────────────
function HostelCard({ hostel }) {
  const initials = hostel.hostel_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="group flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-slate-800">
            {hostel.hostel_name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate text-sm">{hostel.address}</span>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
          Active
        </span>
      </div>

      <div className="flex items-center gap-1.5 border-t border-slate-50 pt-3 text-xs text-slate-400">
        <Calendar className="h-3.5 w-3.5" />
        Created {formatDate(hostel.created_at)}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function HostelsRoute() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hostels/");
      setHostels(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const filtered = hostels.filter(
    (h) =>
      h.hostel_name.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hostels</h2>
          <p className="mt-1 text-sm text-slate-500">
            {hostels.length} hostel{hostels.length !== 1 ? "s" : ""} registered on the platform
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New hostel
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-sm">
        <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-white"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
          <Building2 className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            {search ? "No hostels match your search" : "No hostels yet"}
          </p>
          {!search && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-sm font-medium text-indigo-600 hover:underline"
            >
              Create your first hostel →
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((h) => (
            <HostelCard key={h.id} hostel={h} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CreateHostelModal
          onClose={() => setShowModal(false)}
          onCreated={fetchHostels}
        />
      )}
    </div>
  );
}