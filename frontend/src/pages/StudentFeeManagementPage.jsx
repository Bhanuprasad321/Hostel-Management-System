import React, { useEffect, useState } from "react";
import {
  Ticket,
  DollarSign,
  Clock,
  CheckCircle,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";

export default function StudentFeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyFees = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/fees/my-fees");
        setFees(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load fee records. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyFees();
  }, []);

  // Compute summary cards context data
  const totalFees = fees.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0,
  );
  const pendingFees = fees
    .filter((f) => f.status === "pending")
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const paidFees = fees
    .filter((f) => f.status === "paid")
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-slate-50 min-h-screen w-full">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Loading My Fees...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen w-full text-xs space-y-6 antialiased">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-800">My Fees</h2>
        <p className="text-slate-500 mt-0.5">
          Track your hostel subscription costs, security deposits, and
          transaction statements.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 font-bold text-red-600 flex items-center gap-2 max-w-2xl">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── Metric Cards Grid Layer ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Fees Card */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Total Fees
            </p>
            <h3 className="text-2xl font-black text-slate-800 font-mono">
              {formatCurrency(totalFees)}
            </h3>
            
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        {/* Pending Fees Card */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Pending Fees
            </p>
            <h3 className="text-2xl font-black text-slate-800 font-mono">
              {formatCurrency(pendingFees)}
            </h3>
            
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Paid Fees Card */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Paid Fees
            </p>
            <h3 className="text-2xl font-black text-slate-800 font-mono">
              {formatCurrency(paidFees)}
            </h3>
            
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ─── Individual Fees Invoice Grid Table ─── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[12px]">
            Fee Statement Records
          </h4>
        </div>

        {fees.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="h-9 w-9 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-500 uppercase tracking-wide text-[11px]">
              No fee records found
            </p>
            <p className="text-slate-400 mt-0.5 text-[10px]">
              You do not have any transaction items assigned to your profile
              record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-200 tracking-wider">
                  <th className="p-4 w-12">#</th>
                  <th className="p-4">Fee Type</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Due Date</th>
                  <th className="p-4 text-right">Paid At</th>
                  <th className="p-4 text-right">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                {fees.map((fee, index) => (
                  <tr
                    key={fee.id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    {/* Maps dynamic indices sequentially (1 to N) over the custom object array row mapping logic */}
                    <td className="p-4 font-bold text-slate-400 font-mono">
                      {index + 1}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 block">
                        {fee.fee_type}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-slate-800 font-mono">
                      {formatCurrency(fee.amount)}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                          fee.status === "paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
                        }`}
                      >
                        {fee.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-500 font-semibold">
                      {formatDate(fee.due_date)}
                    </td>
                    <td className="p-4 text-right text-slate-500 font-semibold">
                      {formatDate(fee.paid_at)}
                    </td>
                    <td className="p-4 text-right text-slate-400 font-semibold">
                      {formatDate(fee.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
