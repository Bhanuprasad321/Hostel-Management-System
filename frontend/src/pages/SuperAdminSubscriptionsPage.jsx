import { useEffect, useState } from "react";
import {
  Layers,
  Building2,
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Receipt,
} from "lucide-react";
import api from "../services/api";

// ─── Helpers ────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLE = {
  active: "bg-emerald-50 text-emerald-600",
  trial: "bg-sky-50 text-sky-600",
  expired: "bg-rose-50 text-rose-600",
  cancelled: "bg-slate-100 text-slate-500",
  success: "bg-emerald-50 text-emerald-600",
  failed: "bg-rose-50 text-rose-600",
  pending: "bg-amber-50 text-amber-600",
};

function StatusBadge({ status }) {
  const key = (status || "").toLowerCase();
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${STATUS_STYLE[key] || "bg-slate-100 text-slate-500"}`}
    >
      {status}
    </span>
  );
}

const TABS = [
  { key: "plans", label: "Plans" },
  { key: "subscriptions", label: "Subscriptions" },
  { key: "payments", label: "Payments" },
];

// ─── Create / Edit Plan Modal ────────────────────────────────
function PlanModal({ initial, onClose, onSaved }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    price: initial?.price ?? "",
    duration_days: initial?.duration_days ?? "",
    max_employees: initial?.max_employees ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || form.price === "" || !form.duration_days) {
      setError("Name, price, and duration are required.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        duration_days: Number(form.duration_days),
        max_employees: Number(form.max_employees) || 1,
      };
      if (isEdit) {
        await api.put(`/plans/${initial.id}`, payload);
      } else {
        await api.post("/plans", payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to save plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-[15px] font-semibold text-slate-800">
            {isEdit ? "Edit Plan" : "Create Plan"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Plan name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Basic"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Price (₹)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="999"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Duration (days)
              </label>
              <input
                type="number"
                value={form.duration_days}
                onChange={(e) => set("duration_days", e.target.value)}
                placeholder="30"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Max employees
            </label>
            <input
              type="number"
              value={form.max_employees}
              onChange={(e) => set("max_employees", e.target.value)}
              placeholder="3"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

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
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Saving..." : isEdit ? "Save changes" : "Create plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete confirm modal ────────────────────────────────────
function DeleteConfirmModal({ plan, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await api.delete(`/plans/${plan.id}`);
      onDeleted();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to delete plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
        <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
          Delete "{plan.name}" plan?
        </h2>
        <p className="text-sm text-slate-500 mb-4">This cannot be undone.</p>
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 mb-4">
            {error}
          </div>
        )}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-60 transition-colors"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Plans ───────────────────────────────────────────────
function PlansTab() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState(null); // { mode: 'create'|'edit'|'delete', plan }

  const fetchPlans = () => {
    setLoading(true);
    api
      .get("/plans")
      .then((r) => setPlans(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchPlans, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[16px] font-semibold text-slate-800">
            Subscription Plans
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Create and manage available plans.
          </p>
        </div>
        <button
          onClick={() => setModalState({ mode: "create" })}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" /> Create Plan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 className="text-[16px] font-semibold text-slate-800">
                {plan.name}
              </h4>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                ₹{plan.price}
              </p>
              <p className="text-sm text-slate-500 mb-5">
                {plan.duration_days} Days · {plan.max_employees ?? 1} Employee
                {(plan.max_employees ?? 1) > 1 ? "s" : ""}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setModalState({ mode: "edit", plan })}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => setModalState({ mode: "delete", plan })}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalState?.mode === "create" && (
        <PlanModal onClose={() => setModalState(null)} onSaved={fetchPlans} />
      )}
      {modalState?.mode === "edit" && (
        <PlanModal
          initial={modalState.plan}
          onClose={() => setModalState(null)}
          onSaved={fetchPlans}
        />
      )}
      {modalState?.mode === "delete" && (
        <DeleteConfirmModal
          plan={modalState.plan}
          onClose={() => setModalState(null)}
          onDeleted={fetchPlans}
        />
      )}
    </div>
  );
}

// ─── Tab: Subscriptions ───────────────────────────────────────
function SubscriptionsTab() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api
      .get("/subscriptions")
      .then((r) => setSubs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "All"
      ? subs
      : subs.filter(
          (s) => (s.status || "").toLowerCase() === filter.toLowerCase(),
        );

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-[16px] font-semibold text-slate-800">
          Subscriptions
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">
          View all hostel subscriptions.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {["All", "Active", "Trial", "Expired", "Cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors border ${
              filter === f
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs text-slate-400 uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">Hostel</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Start Date</th>
                <th className="px-6 py-3 font-medium">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr key={s.id ?? i} className="border-t border-slate-50">
                    <td className="px-6 py-3.5 font-medium text-slate-700">
                      {s.hostel_name}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {s.plan_name}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {formatDate(s.start_date)}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {formatDate(s.end_date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Payments ────────────────────────────────────────────
function PaymentsTab() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/subscriptions/PaymentHistory")
      .then((r) => setPayments(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = payments
    .filter((p) => (p.status || "").toLowerCase() === "success")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const successCount = payments.filter(
    (p) => (p.status || "").toLowerCase() === "success",
  ).length;
  const failedCount = payments.filter(
    (p) => (p.status || "").toLowerCase() === "failed",
  ).length;

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-[16px] font-semibold text-slate-800">Payments</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Revenue</p>
            <p className="text-xl font-bold text-slate-800">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Successful Payments</p>
            <p className="text-xl font-bold text-slate-800">{successCount}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50">
            <XCircle className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Failed Payments</p>
            <p className="text-xl font-bold text-slate-800">{failedCount}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs text-slate-400 uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">Hostel</th>
                <th className="px-6 py-3 font-medium">Transaction ID</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No payments recorded yet
                  </td>
                </tr>
              ) : (
                payments.map((p, i) => (
                  <tr
                    key={p.transaction_id ?? i}
                    className="border-t border-slate-50"
                  >
                    <td className="px-6 py-3.5 font-medium text-slate-700">
                      {p.hostel_name}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-600">
                      {p.transaction_id}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-700">
                      ₹{p.amount}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {formatDate(p.date ?? p.payment_date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function SuperAdminSubscriptions() {
  const [activeTab, setActiveTab] = useState("plans");

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Subscriptions</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage plans, view active subscriptions, and monitor payments.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-slate-100">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.key === "plans" && <Layers className="h-4 w-4" />}
            {t.key === "subscriptions" && <Building2 className="h-4 w-4" />}
            {t.key === "payments" && <Receipt className="h-4 w-4" />}
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "plans" && <PlansTab />}
      {activeTab === "subscriptions" && <SubscriptionsTab />}
      {activeTab === "payments" && <PaymentsTab />}
    </div>
  );
}
