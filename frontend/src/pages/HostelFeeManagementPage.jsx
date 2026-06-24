import React, { useEffect, useState } from "react";
import {
  DollarSign,
  Clock,
  ShieldCheck,
  FileText,
  Settings,
  Search,
  Filter,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Users,
  Percent,
  TrendingUp,
  Activity,
  BarChart3,
} from "lucide-react";
import api from "../services/api";

export default function HostelFeeManagementPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [analytics, setAnalytics] = useState({
    total_collected: 0,
    pending_amount: 0,
    security_deposits_collected: 0,
    total_fee_records: 0,
    students_with_fees: 0,
    collection_rate: 0,
  });
  const [fees, setFees] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const [monthlyFee, setMonthlyFee] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [hasSettings, setHasSettings] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    feeId: null,
  });
  const [payingId, setPayingId] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      try {
        const settingsRes = await api.get("/fees");
        if (settingsRes.data) {
          setMonthlyFee(settingsRes.data.monthly_fee);
          setSecurityDeposit(settingsRes.data.security_deposit);
          setHasSettings(true);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setHasSettings(false);
        } else {
          console.error("Error loading settings:", err);
        }
      }

      const [analyticsRes, feesRes, activityRes] = await Promise.all([
        api.get("/fees/fee-analytics"),
        api.get("/fees/all-fees"),
        api.get("/fees/recect-fee-activities"),
      ]);

      if (analyticsRes.data) setAnalytics(analyticsRes.data);
      if (feesRes.data) setFees(feesRes.data);
      if (activityRes.data) setRecentActivities(activityRes.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load fee records. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (monthlyFee === "" || securityDeposit === "") {
      alert("Please enter both a monthly fee and security deposit amount.");
      return;
    }
    try {
      setSettingsLoading(true);
      const payload = {
        monthly_fee: Number(monthlyFee),
        security_deposit: Number(securityDeposit),
      };
      if (hasSettings) {
        await api.put("/fees", payload);
        showToast("Fee settings updated successfully!");
      } else {
        await api.post("/fees", payload);
        setHasSettings(true);
        showToast("Fee settings saved successfully!");
      }
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to save fee settings configuration.",
      );
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    const targetId = confirmModal.feeId;
    if (!targetId) return;
    try {
      setPayingId(targetId);
      await api.put(`/fees/pay/${targetId}`);
      setConfirmModal({ show: false, feeId: null });
      showToast("Fee record was successfully marked as paid!");
      const [analyticsRes, feesRes, activityRes] = await Promise.all([
        api.get("/fees/fee-analytics"),
        api.get("/fees/all-fees"),
        api.get("/fees/recect-fee-activities"),
      ]);
      setAnalytics(analyticsRes.data);
      setFees(feesRes.data);
      setRecentActivities(activityRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to mark this fee record as paid. Please try again.");
    } finally {
      setPayingId(null);
    }
  };

  const filteredFees = fees.filter((f) => {
    const matchesSearch = f.student_name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesFilter =
      statusFilter === "All" ||
      f.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm font-medium text-slate-400">Loading dashboard…</p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Collected",
      value: formatCurrency(analytics.total_collected),
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      label: "Pending Amount",
      value: formatCurrency(analytics.pending_amount),
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      label: "Security Deposits",
      value: formatCurrency(analytics.security_deposits_collected),
      icon: ShieldCheck,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
    },
    {
      label: "Collection Rate",
      value: `${analytics.collection_rate}%`,
      icon: Percent,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-500",
    },
    {
      label: "Students with Fees",
      value: analytics.students_with_fees,
      icon: Users,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
    },
    {
      label: "Total Records",
      value: analytics.total_fee_records,
      icon: FileText,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-2xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          {toast}
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="pb-4 border-b border-slate-200">
        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-1">
          Finance
        </p>
        <h1 className="text-xl font-semibold text-slate-800">Fee Management</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Monitor collections, process payments, and configure fee defaults.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Section 1: Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
          >
            {/* Icon */}
            <div
              className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl ${iconBg}`}
            >
              <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={1.75} />
            </div>
            {/* Text */}
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-tight truncate">
                {label}
              </p>
              <p className="text-xl font-bold text-slate-800 leading-tight mt-0.5 font-mono tracking-tight">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 2: Cards row → Settings + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee Settings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-indigo-50">
              <Settings
                className="h-4 w-4 text-indigo-500"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">
                Fee Settings
              </h2>
              <p className="text-[10px] text-slate-400">
                Monthly & deposit defaults
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">
                Monthly Hostel Fee (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={monthlyFee}
                min="0"
                onChange={(e) => setMonthlyFee(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 10000"
                value={securityDeposit}
                min="0"
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition"
              />
            </div>
            <button
              type="submit"
              disabled={settingsLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition disabled:opacity-60 shadow-sm"
            >
              {settingsLoading && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {hasSettings ? "Update Settings" : "Save Settings"}
            </button>
          </form>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-indigo-50">
              <Activity
                className="h-4 w-4 text-indigo-500"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">
                Recent Activity
              </h2>
              <p className="text-[10px] text-slate-400">
                Latest fee transactions
              </p>
            </div>
          </div>

          {recentActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-14 text-slate-300">
              <Activity className="h-7 w-7 mb-2" />
              <p className="text-xs font-medium text-slate-400">
                No recent activity
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/50">
                    <th className="px-5 py-3">Student</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentActivities.map((act) => (
                    <tr
                      key={act.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-5 py-3 text-sm font-medium text-slate-700">
                        {act.student_name}
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-400 font-medium">
                        {act.fee_type === "security_deposit"
                          ? "Security Deposit"
                          : act.fee_type}
                      </td>
                      <td className="px-5 py-3 text-right text-sm font-semibold text-slate-700 font-mono">
                        {formatCurrency(act.amount)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                            act.status === "paid"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${act.status === "paid" ? "bg-emerald-500" : "bg-amber-400"}`}
                          />
                          {act.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-xs text-slate-400 font-medium">
                        {formatDate(act.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 3: Student Fee Ledger ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-indigo-50">
              <FileText
                className="h-4 w-4 text-indigo-500"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">
                Student Fee Ledger
              </h2>
              <p className="text-[10px] text-slate-400">
                {filteredFees.length} record
                {filteredFees.length !== 1 ? "s" : ""} shown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search student…"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition w-44"
              />
            </div>
            <div className="flex items-center gap-1.5 border border-slate-200 bg-white rounded-xl px-3 py-2">
              <Filter className="h-3 w-3 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
        </div>

        {filteredFees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FileText className="h-7 w-7 mb-2 text-slate-200" />
            <p className="text-xs font-medium text-slate-400">
              No fee records found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3 w-10">#</th>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Due Date</th>
                  <th className="px-5 py-3 text-right">Paid At</th>
                  <th className="px-5 py-3 text-right">Created</th>
                  <th className="px-5 py-3 text-center w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredFees.map((fee, index) => (
                  <tr
                    key={fee.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs font-medium text-slate-300 font-mono">
                      {index + 1}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700">
                      {fee.student_name}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-lg">
                        {fee.fee_type === "security_deposit"
                          ? "Security Deposit"
                          : fee.fee_type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-700 font-mono">
                      {formatCurrency(fee.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${
                          fee.status === "paid"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${fee.status === "paid" ? "bg-emerald-500" : "bg-amber-400"}`}
                        />
                        {fee.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-slate-400 font-medium">
                      {formatDate(fee.due_date)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-slate-400 font-medium">
                      {formatDate(fee.paid_at)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-slate-400 font-medium">
                      {formatDate(fee.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {fee.status === "pending" ? (
                        <button
                          onClick={() =>
                            setConfirmModal({ show: true, feeId: fee.id })
                          }
                          className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-lg transition"
                        >
                          <Check className="h-3 w-3" />
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-medium italic">
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Confirm Payment Modal ── */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-emerald-50">
                  <CheckCircle2
                    className="h-4 w-4 text-emerald-500"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="text-sm font-semibold text-slate-700">
                  Confirm Payment
                </h3>
              </div>
              <button
                onClick={() => setConfirmModal({ show: false, feeId: null })}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-5 text-sm text-slate-500 leading-relaxed font-medium">
              Are you sure you want to mark this fee record as{" "}
              <span className="font-semibold text-slate-700">paid</span>? This
              action cannot be undone.
            </div>

            <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-slate-100 bg-slate-50/60">
              <button
                type="button"
                onClick={() => setConfirmModal({ show: false, feeId: null })}
                className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={payingId !== null}
                onClick={handleMarkAsPaid}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition flex items-center gap-1.5 disabled:opacity-60 shadow-sm"
              >
                {payingId && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
