import { useEffect, useState } from "react";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  History,
  Receipt,
  Check,
  X,
  Loader2,
  Sparkles,
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

// ─── Upgrade confirmation modal ─────────────────────────────
function UpgradeModal({ plan, onClose, onConfirmed }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await api.put(`/subscriptions/${plan.id}/purchase`);
      onConfirmed();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to upgrade plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-[15px] font-semibold text-slate-800">
            Upgrade to {plan.name} Plan?
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Price</span>
            <span className="font-semibold text-slate-800">₹{plan.price}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Duration</span>
            <span className="font-semibold text-slate-800">
              {plan.duration_days} Days
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Upgrading..." : "Confirm Upgrade"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Plan card ───────────────────────────────────────────────
function PlanCard({ plan, isCurrent, onUpgrade }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
        isCurrent
          ? "border-indigo-300 bg-indigo-50/40"
          : "border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md"
      }`}
    >
      {isCurrent && (
        <span className="absolute -top-3 left-6 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-semibold text-white">
          Current Plan
        </span>
      )}
      <h3 className="text-[16px] font-semibold text-slate-800 mt-2">
        {plan.name}
      </h3>
      <p className="mt-2 text-3xl font-bold text-slate-900">
        ₹{plan.price}
        {plan.price > 0 && (
          <span className="text-sm font-normal text-slate-400">
            /{plan.duration_days}d
          </span>
        )}
      </p>
      <p className="text-sm text-slate-500 mb-4">
        {plan.duration_days} Days ·{" "}
        {plan.max_employees ?? plan.employee_limit ?? 1} Employee
        {(plan.max_employees ?? plan.employee_limit ?? 1) > 1 ? "s" : ""}
      </p>

      <div className="flex-1 space-y-2 mb-6">
        {(plan.features ?? ["Complaints", "Visitors", "Notices"]).map((f) => (
          <div
            key={f}
            className="flex items-center gap-2 text-sm text-slate-600"
          >
            <Check className="h-4 w-4 text-emerald-500 shrink-0" />
            {f}
          </div>
        ))}
      </div>

      <button
        disabled={isCurrent}
        onClick={() => onUpgrade(plan)}
        className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
          isCurrent
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-500"
        }`}
      >
        {isCurrent ? "Current Plan" : "Upgrade"}
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [history, setHistory] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgradePlan, setUpgradePlan] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [currentRes, plansRes, historyRes, paymentsRes] = await Promise.all(
        [
          api.get("/subscriptions/current"),
          api.get("/plans"),
          api.get("/subscriptions/history"),
          api.get("/subscriptions/PaymentHistory"),
        ],
      );
      setCurrentPlan(currentRes.data);
      setPlans(plansRes.data);
      setHistory(historyRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Subscription</h2>
        <p className="mt-1 text-sm text-slate-500">
          View your current plan, available upgrades, payment history, and
          subscription activity.
        </p>
      </div>

      {/* ── Current Plan ── */}
      <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-indigo-500" />
            <h3 className="text-[15px] font-semibold text-slate-800">
              Current Plan
            </h3>
          </div>
          <StatusBadge status={currentPlan?.status} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-slate-400 mb-1">Plan Name</p>
            <p className="text-[15px] font-semibold text-slate-800">
              {currentPlan?.plan_name}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Start Date</p>
            <p className="text-[15px] font-semibold text-slate-800">
              {formatDate(currentPlan?.start_date)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Expiry Date</p>
            <p className="text-[15px] font-semibold text-slate-800">
              {formatDate(currentPlan?.end_date)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Days Remaining</p>
            <p className="text-[15px] font-semibold text-indigo-600">
              {currentPlan?.days_remaining ?? "—"} Days
            </p>
          </div>
        </div>
      </div>

      {/* ── Available Plans ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <h3 className="text-[15px] font-semibold text-slate-800">
            Available Plans
          </h3>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={plan.name === currentPlan?.plan_name}
              onUpgrade={setUpgradePlan}
            />
          ))}
        </div>
      </div>

      {/* ── Subscription History ── */}
      <div className="mb-8 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <History className="h-5 w-5 text-indigo-500" />
          <h3 className="text-[15px] font-semibold text-slate-800">
            Subscription History
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs text-slate-400 uppercase tracking-wide">
              <th className="px-6 py-3 font-medium">Plan</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Start Date</th>
              <th className="px-6 py-3 font-medium">End Date</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-slate-400"
                >
                  No subscription history yet
                </td>
              </tr>
            ) : (
              history.map((h, i) => (
                <tr key={h.id ?? i} className="border-t border-slate-50">
                  <td className="px-6 py-3.5 font-medium text-slate-700">
                    {h.plan_name}
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={h.status} />
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {formatDate(h.start_date)}
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {formatDate(h.end_date)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Payment History ── */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <Receipt className="h-5 w-5 text-indigo-500" />
          <h3 className="text-[15px] font-semibold text-slate-800">
            Payment History
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs text-slate-400 uppercase tracking-wide">
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
                  colSpan={4}
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
      </div>

      {/* Upgrade modal */}
      {upgradePlan && (
        <UpgradeModal
          plan={upgradePlan}
          onClose={() => setUpgradePlan(null)}
          onConfirmed={fetchAll}
        />
      )}
    </div>
  );
}
