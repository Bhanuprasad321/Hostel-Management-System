import { useEffect, useState } from "react";
import {
  UserCheck,
  Plus,
  User,
  Phone,
  FileText,
  Hash,
  LogOut,
  Calendar,
  Loader2,
  AlertCircle,
  Inbox,
  X,
  Users,
} from "lucide-react";
import api from "../services/api";

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dropdown options array for hostel students
  const [studentsList, setStudentsList] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Modal & Form Registry States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // State mapping for operational inline mutation loads
  const [mutatingId, setMutatingId] = useState(null);

  // Synchronize visitors registry from database endpoints
  const fetchVisitors = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/visitors");
      setVisitors(res.data || []);
    } catch (err) {
      console.error("Visitors core pipeline read trace failed:", err);
      setError(
        "Could not safely map current guest visitor entries from secure server metrics.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Synchronize student data elements for drop-down selection
  const fetchStudentsDropdown = async () => {
    try {
      setLoadingStudents(true);
      const res = await api.get("/students/dropdown");
      setStudentsList(res.data || []);
    } catch (err) {
      console.error(
        "Failed to parse infrastructure students for selection options:",
        err,
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // Fetch target dropdown rows concurrently when opening modal gateway panels
  useEffect(() => {
    if (isModalOpen) {
      fetchStudentsDropdown();
    }
  }, [isModalOpen]);

  // Handle New Entry Submission
  const handleRegisterVisitor = async (e) => {
    e.preventDefault();
    if (
      !studentId ||
      !visitorName.trim() ||
      !visitorPhone.trim() ||
      !purpose.trim()
    ) {
      setFormError(
        "All input fields are required to process entry authorization.",
      );
      return;
    }

    try {
      setFormLoading(true);
      setFormError("");

      await api.post("/visitors", {
        student_id: studentId,
        visitor_name: visitorName.trim(),
        visitor_phone: visitorPhone.trim(),
        purpose: purpose.trim(),
      });

      // Clear operational forms completely
      setStudentId("");
      setVisitorName("");
      setVisitorPhone("");
      setPurpose("");
      setIsModalOpen(false);
      fetchVisitors();
    } catch (err) {
      console.error("Failed to commit visitor log payload:", err);
      setFormError(
        err.response?.data?.message ||
          "Internal failure validating guest authorization.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Lifespan Checkout Actions
  const handleCheckout = async (id) => {
    try {
      setMutatingId(id);
      await api.put(`/visitors/${id}/checkout`);

      // Live patch structural array memory timelines
      setVisitors((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                status: "checked_out",
                check_out: new Date().toISOString(),
              }
            : v,
        ),
      );
    } catch (err) {
      console.error("Checkout operation dropped:", err);
      alert(
        err.response?.data?.message ||
          "Could not complete checkout execution framework.",
      );
    } finally {
      setMutatingId(null);
    }
  };

  // Status Badge Token Map
  const getStatusBadge = (status) => {
    const isOut = status?.toLowerCase() === "checked_out";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-black rounded-sm uppercase tracking-wider border ${
          isOut
            ? "bg-slate-50 border-slate-200 text-slate-500"
            : "bg-amber-50 border-amber-200 text-amber-700"
        }`}
      >
        {isOut ? "Checked Out" : "Active Inside"}
      </span>
    );
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return "Active Session";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  // Live Metric Calculation Layer
  const liveActiveInside = visitors.filter(
    (v) => v.status?.toLowerCase() !== "checked_out",
  ).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-4 bg-slate-50/30 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Mapping Guest Registry Records...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-slate-50/40 p-1 min-h-screen antialiased w-full">
      {/* ─── HEADER BAR TITLE & TRIGGER CONTEXT ─── */}
      <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              Visitors
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-black tracking-tight text-amber-800 shadow-3xs">
              <Users className="h-3.5 w-3.5 text-amber-600" />
              Active Visitors: {liveActiveInside}
            </div>
          </div>
          <p className="text-xs  text-slate-500 tracking-wide">
            Track and manage hostel visitor entries
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-3xs uppercase tracking-wider cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Add Visitor
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-bold text-red-600 flex items-center gap-2.5 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── DATA EMPTY VIEWPORT ─── */}
      {!error && visitors.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl bg-white max-w-2xl mx-auto shadow-xs">
          <Inbox className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-black text-slate-600 uppercase tracking-wide">
            Registry Log Empty
          </p>
          <p className="text-xs font-medium text-slate-400 mt-1">
            No guest visitors have been logged to this register yet.
          </p>
        </div>
      ) : (
        /* ─── LOG GRID DISPLAY MATRIX ─── */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {visitors.map((log) => {
            const isCheckedOut = log.status?.toLowerCase() === "checked_out";
            return (
              <div
                key={log.id}
                className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:scale-[1.005] hover:border-indigo-400/40 hover:shadow-sm flex flex-col justify-between space-y-5"
              >
                {/* Meta Top Line Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider font-mono">
                      Visitor #{log.id}
                    </p>
                    <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                      {log.visitor_name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(log.status)}

                    {/* Checkout Button Render conditional */}
                    {!isCheckedOut && (
                      <button
                        onClick={() => handleCheckout(log.id)}
                        disabled={mutatingId === log.id}
                        title="Execute Exit Timestamp Checkout"
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer disabled:opacity-40"
                      >
                        {mutatingId === log.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-red-600" />
                        ) : (
                          <LogOut className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Info Attributes Two-Column Split Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate tracking-tight">
                        {log.visitor_phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-indigo-500 shrink-0" />
                      <div className="truncate">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block leading-none">
                          Student
                        </span>
                        <span className="font-bold text-slate-700">
                          {log.student_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 border-t sm:border-t-0 sm:border-l border-slate-200/60 pt-3 sm:pt-0 sm:pl-4">
                    <div className="flex items-start gap-2">
                      <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block leading-none">
                          Purpose
                        </span>
                        <p className="text-slate-700 font-medium tracking-tight text-[16px] line-clamp-2 mt-0.5 leading-tight">
                          {log.purpose}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Timestamps Row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Check In: {formatTimestamp(log.check_in)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LogOut className="h-3.5 w-3.5 text-slate-400" />
                    <span
                      className={
                        isCheckedOut
                          ? "text-slate-500"
                          : "font-mono tracking-wide text-amber-600"
                      }
                    >
                      Check Out: {formatTimestamp(log.check_out)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── MODAL CONTAINER SLIDEOVER ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => !formLoading && setIsModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-indigo-500" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Add Visitor
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={formLoading}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-[11px] font-bold text-red-600 flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterVisitor} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Student
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400 z-10" />
                    <select
                      required
                      disabled={formLoading || loadingStudents}
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-bold tracking-tight text-slate-800 focus:border-indigo-500 focus:outline-hidden transition shadow-3xs disabled:bg-slate-50 appearance-none cursor-pointer"
                    >
                      <option value="">
                        {loadingStudents
                          ? "Fetching records..."
                          : "Select Student"}
                      </option>
                      {studentsList.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name}{" "}
                          {student.room_number
                            ? `(Room ${student.room_number})`
                            : "(No Room Specified)"}
                        </option>
                      ))}
                    </select>
                    {/* Native dropdown chevron custom spacing integration override wrapper */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Visitor Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      disabled={formLoading}
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-bold tracking-tight text-slate-800 focus:border-indigo-500 focus:outline-hidden transition shadow-3xs disabled:bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210"
                    disabled={formLoading}
                    value={visitorPhone}
                    onChange={(e) => {
                      // Allows an optional leading '+' followed exclusively by numerical digits
                      const cleanedValue = e.target.value.replace(
                        /(?!^\+)[^\d]/g,
                        "",
                      );
                      setVisitorPhone(cleanedValue);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-bold tracking-tight text-slate-800 focus:border-indigo-500 focus:outline-hidden transition shadow-3xs disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  Purpose of Visit
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Parent visit, friend visit, document delivery"
                    disabled={formLoading}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-medium tracking-tight text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden transition shadow-3xs disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={formLoading}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-500 bg-white hover:bg-slate-50 transition uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading || loadingStudents}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black text-white hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 uppercase tracking-wider cursor-pointer"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    "Add Visitor"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
