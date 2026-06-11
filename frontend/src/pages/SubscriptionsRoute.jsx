import { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Building2,
  X,
  ExternalLink,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

// ─── Helpers ─────────────────────────────────────────────────
function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Plan styling lookup
const PLAN_TAGS = {
  trial: { bg: "bg-amber-50 text-amber-700 border-amber-200", label: "Trial" },
  basic: { bg: "bg-cyan-50 text-cyan-700 border-cyan-200", label: "Basic" },
  pro: { bg: "bg-purple-50 text-purple-700 border-purple-200", label: "Pro" },
};

// Status styling lookup
const STATUS_TAGS = {
  active: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  trial: { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  expired: { bg: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
  cancelled: {
    bg: "bg-slate-50 text-slate-600 border-slate-200",
    icon: XCircle,
  },
};

function PlanBadge({ plan }) {
  const meta = PLAN_TAGS[plan?.toLowerCase()] || {
    bg: "bg-slate-50 text-slate-600 border-slate-200",
    label: plan,
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${meta.bg}`}
    >
      {meta.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_TAGS[status?.toLowerCase()] || {
    bg: "bg-slate-50 text-slate-600 border-slate-200",
    icon: Clock,
  };
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${meta.bg}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : ""}
    </span>
  );
}

// ─── Subscription Details Modal ──────────────────────────────
function SubscriptionDetailModal({ subscriptionId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/subscriptions/${subscriptionId}`)
      .then((r) => setDetails(r.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch complete subscription insight details.");
      })
      .finally(() => setLoading(false));
  }, [subscriptionId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
              <CreditCard className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800">
                Subscription Insights
              </h2>
              <p className="text-xs text-slate-400">
                Detailed snapshot of tenant account status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <p className="text-xs text-slate-400">
                Retrieving operational data matrix...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && details && (
            <div className="space-y-5">
              {/* Top Summary Banner */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 p-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <Building2 className="h-3.5 w-3.5" /> Hostel Name
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-slate-800">
                    {details.hostel_name}
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <PlanBadge plan={details.plan} />
                  <StatusBadge status={details.status} />
                </div>
              </div>

              {/* Days Counter Metric Block */}
              <div
                className={`rounded-xl border p-4 flex items-center justify-between ${
                  details.days_remaining <= 0
                    ? "bg-rose-50/50 border-rose-100 text-rose-800"
                    : details.days_remaining <= 5
                      ? "bg-amber-50/50 border-amber-100 text-amber-800"
                      : "bg-indigo-50/40 border-indigo-100 text-indigo-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${details.days_remaining <= 5 ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-600"}`}
                  >
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-slate-500">
                      Timeline Runway
                    </h4>
                    <p className="text-sm font-semibold mt-0.5">
                      {details.days_remaining <= 0
                        ? "Subscription Expired"
                        : `${details.days_remaining} Days Remaining`}
                    </p>
                  </div>
                </div>
                {details.days_remaining <= 5 && details.days_remaining > 0 && (
                  <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse" />
                )}
              </div>

              {/* Data Timeline Fields */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Term Start Date
                  </span>
                  <span className="font-medium text-slate-700">
                    {formatDate(details.start_date)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm py-1.5">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Term Expiration Date
                  </span>
                  <span className="font-medium text-slate-700">
                    {formatDate(details.end_date)}
                  </span>
                </div>
              </div>

              {/* Action Dismiss button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Close Insights Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Upgrade Plan Modal (Super Admin Control Panel) ───────────
function UpgradePlanModal({ subscription, onClose, onUpdated }) {
  const [plan, setPlan] = useState(subscription.plan);
  const [status, setStatus] = useState(subscription.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.put(`/subscriptions/${subscription.id}/upgrade`, {
        plan,
        status,
      });
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to upgrade subscription details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
              <CreditCard className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800">
                Modify Plan Context
              </h2>
              <p className="text-xs text-slate-400">
                {subscription.hostel_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Licensing Tier
            </label>
            <div className="relative">
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 py-2.5 pl-4 pr-10 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-white"
              >
                <option value="trial">Trial</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Licensing Status
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 py-2.5 pl-4 pr-10 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-white"
              >
                <option value="trial">Trial</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors shadow-sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Target Modifications"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Subscriptions Page ─────────────────────────────────
export default function SubscriptionRoute() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Tracking active targets for multi-modal panels
  const [activeSubId, setActiveSubId] = useState(null);
  const [upgradeTarget, setUpgradeTarget] = useState(null);
  const [renewingId, setRenewingId] = useState(null);

  // Initial lookup of base subscriptions list
  const fetchSubscriptions = () => {
    setLoading(true);
    api
      .get("/subscriptions/")
      .then((r) => setSubscriptions(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Super Admin Instant 30-Day Renewal Pipeline
  const handleRenewal = async (subId) => {
    if (
      !window.confirm(
        "Are you sure you want to extend this license context roadmap by another 30 days?",
      )
    )
      return;
    setRenewingId(subId);
    try {
      await api.put(`/subscriptions/${subId}/renewal`);
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
      alert("Failed to fire continuous renewal strategy pipeline.");
    } finally {
      setRenewingId(null);
    }
  };

  // Soft fuzzy search handling across names and plans
  const filtered = subscriptions.filter(
    (sub) =>
      sub.hostel_name?.toLowerCase().includes(search.toLowerCase()) ||
      sub.plan?.toLowerCase().includes(search.toLowerCase()) ||
      sub.status?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* Page Header Layout */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Platform Subscriptions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Monitor tenant licensing runtime states, service plans, and active
            billing statuses
          </p>
        </div>
      </div>

      {/* Control Utility Bar (Search Input Counter Combination) */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Tracking{" "}
          <span className="font-semibold text-slate-700">
            {filtered.length}
          </span>{" "}
          SaaS deployment instance{filtered.length !== 1 ? "s" : ""}
        </p>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by hostel, plan, state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
      </div>

      {/* Primary Data Render UI */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center bg-white">
          <CreditCard className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            {search
              ? "No subscriptions match parameters"
              : "No subscription entities logged on platform yet"}
          </p>
        </div>
      ) : (
        /* Structured Data Table matching enterprise administration design patterns */
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Hostel
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Plan
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-4">
                    End Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Super Admin Suite Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {filtered.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-slate-800">
                          {sub.hostel_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PlanBadge plan={sub.plan} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs font-normal">
                      {formatDate(sub.start_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs font-normal">
                      {formatDate(sub.end_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* 30-Day Instant Renewal Action */}
                        <button
                          onClick={() => handleRenewal(sub.id)}
                          disabled={renewingId === sub.id}
                          className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 transition-all shadow-xs disabled:opacity-50"
                          title="Instant 30-day continuous runtime provisioning cycle"
                        >
                          {renewingId === sub.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                          Renew 30d
                        </button>

                        {/* Upgrade Tier and Status Config Configurator */}
                        <button
                          onClick={() => setUpgradeTarget(sub)}
                          className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-all shadow-xs"
                        >
                          Upgrade/Status
                        </button>

                        {/* Inspect Analytics Context Overlay */}
                        <button
                          onClick={() => setActiveSubId(sub.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm"
                        >
                          Inspect
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Detail Modal Target Integration */}
      {activeSubId && (
        <SubscriptionDetailModal
          subscriptionId={activeSubId}
          onClose={() => setActiveSubId(null)}
        />
      )}

      {/* Upgrade/Status Control Modal Component Integration */}
      {upgradeTarget && (
        <UpgradePlanModal
          subscription={upgradeTarget}
          onClose={() => setUpgradeTarget(null)}
          onUpdated={fetchSubscriptions}
        />
      )}
    </div>
  );
}
