import { useEffect, useState } from "react";
import {
  User,
  Mail,
  KeyRound,
  Search,
  Plus,
  X,
  Loader2,
  RefreshCw,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  Eye,
} from "lucide-react";
import api from "../services/api";

// ─── Helpers ─────────────────────────────────────────────────
function getInitials(name) {
  return name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ST";
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

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Add Student Form State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Student Details State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch Core Dataset
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load dynamic student index.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Creation Handler
  const addStudent = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are strictly required.");
      return;
    }
    try {
      setFormLoading(true);
      setError("");
      await api.post("/students", { name, email, password });

      // Reset inputs
      setName("");
      setEmail("");
      setPassword("");
      setShowPass(false);
      setOpenAddModal(false);

      fetchStudents();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to execute student generation sequence.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Profile Drawer Lookups
  const openStudentDetails = async (id) => {
    try {
      setDetailsOpen(true);
      setDetailsLoading(true);
      const res = await api.get(`/students/${id}`);
      setSelectedStudent(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to pull target profile insights.",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* ─── Page Header Section ─── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Students</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage student accounts and hostel residents
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <button
            onClick={fetchStudents}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* ─── Metric Blocks ─── */}
      <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Total Students
            </p>
            <h2 className="text-3xl font-bold text-slate-800 mt-0.5">
              {students.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Error Alert Display */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 animate-fadeIn">
          {error}
        </div>
      )}

      {/* ─── Control Utility Filter Row ─── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Total Students:{" "}
          <span className="font-semibold text-slate-700">
            {filteredStudents.length}
          </span>{" "}
          students
        </p>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
      </div>

      {/* ─── Main Enterprise Data Table ─── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center bg-white">
          <GraduationCap className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            {search
              ? "No matching records found in this context"
              : "No student entries compiled inside this database"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => openStudentDetails(student.id)}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${avatarColor(student.id)} text-xs font-bold text-white shadow-sm`}
                        >
                          {getInitials(student.name)}
                        </div>
                        <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-normal">
                      {student.email}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openStudentDetails(student.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Add Student Modal ─── */}
      {openAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-800">
                    Create Student Profile
                  </h2>
                  <p className="text-xs text-slate-400">
                    Create a student account
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpenAddModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={addStudent} className="px-6 py-5 space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Adarsh Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="e.g. adarsh@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Assign operational credential string"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-16 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                    required
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

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50 mt-5">
                <button
                  type="button"
                  onClick={() => setOpenAddModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors shadow-sm"
                >
                  {formLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {formLoading ? "Saving Profile..." : "Create Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Student Profile Insights Modal ─── */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-800">
                    Student Details
                  </h2>
                  <p className="text-xs text-slate-400">
                    Student account information
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDetailsOpen(false);
                  setSelectedStudent(null);
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Profile Sheet */}
            <div className="p-6">
              {detailsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-xs text-slate-400">
                    Loading Student Details
                  </p>
                </div>
              ) : selectedStudent ? (
                <div className="space-y-5">
                  {/* Summary Profile Block card alignment */}
                  <div className="flex items-center gap-4 rounded-xl bg-slate-50 border border-slate-100 p-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${avatarColor(selectedStudent.id)} text-lg font-bold text-white shadow-md`}
                    >
                      {getInitials(selectedStudent.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-800 truncate">
                        {selectedStudent.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">
                        Student ID: #{selectedStudent.id}
                      </p>
                    </div>
                  </div>

                  {/* Field Breakdown Grid logs */}
                  <div className="space-y-3 pt-1">
                    <div className="flex flex-col gap-1 py-2 border-b border-slate-50">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Full Name
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {selectedStudent.name}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 py-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Email Address
                      </span>
                      <span className="text-sm font-medium text-slate-800 break-all">
                        {selectedStudent.email}
                      </span>
                    </div>
                  </div>

                  {/* Operational Controls dismiss hook */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setDetailsOpen(false);
                        setSelectedStudent(null);
                      }}
                      className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 text-center font-medium">
                  Failed to fetch full target schema documentation.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
