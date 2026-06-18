import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Building2,
  Calendar,
  Loader2,
  AlertCircle,
  Fingerprint,
  CheckCircle,
} from "lucide-react";
import api from "../services/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/settings/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Profile payload sync failed:", err);
        setError(
          "Could not safely map current account metadata from system repositories.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatRole = (role) => {
    if (!role) return "User";
    return role.replace("_", " ").toUpperCase();
  };

  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "super_admin":
        return "bg-purple-50 border-purple-200 text-purple-700";
      case "admin":
        return "bg-indigo-50 border-indigo-200 text-indigo-700";
      case "student":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      default:
        return "bg-slate-50 border-slate-200 text-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-4 bg-slate-50/30 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Mapping Identity Schema Context...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-slate-50/40 p-1 min-h-screen antialiased w-full">
      {/* ─── HEADER TITLE SECTION ─── */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          Account Profile
        </h2>
        <p className="text-xs text-slate-400 tracking-wide mt-0.5">
          View your account information and hostel details
        </p>
      </div>

      {error || !profile ? (
        <div className="max-w-xl bg-white border border-slate-100 p-8 rounded-2xl shadow-xs text-center mx-auto my-10">
          <div className="h-12 w-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mx-auto mb-4">
            <AlertCircle className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            {error || "Data Sync Failure"}
          </p>
        </div>
      ) : (
        /* ─── TWO-COLUMN WORKSPACE DETACHED FROM FORM LAYOUTS ─── */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* LEFT COMPACT PANEL: IDENTITY OVERVIEW PASSPORT CARD */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs text-center space-y-4 transition-all duration-300 hover:border-indigo-400/40">
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <User className="h-8 w-8 text-indigo-500 stroke-[1.5]" />
              </div>
              <div
                className="absolute -bottom-1 -right-1 h-5 w-5 rounded-md bg-emerald-500 flex items-center justify-center text-white ring-4 ring-white shadow-3xs"
                title="Account Verified"
              >
                <CheckCircle className="h-3 w-3 stroke-[3]" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800 tracking-tight leading-tight line-clamp-1">
                {profile.name}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black rounded-sm border uppercase tracking-wider ${getRoleBadgeStyle(profile.role)}`}
              >
                <Shield className="h-2.5 w-2.5 stroke-[2.5]" />
                {formatRole(profile.role)}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-50 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              <Fingerprint className="h-3..5 w-3.5 text-slate-400" />
              Verified Account
            </div>
          </div>

          {/* RIGHT DETAILED PANEL: DISCRETE READ-ONLY METADATA GRID */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Attribute: Full Name Display */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs transition-all duration-300 hover:border-indigo-400/40 flex items-start gap-4">
              <div className="p-2.5 bg-slate-50 rounded-xl text-slate-500 border border-slate-100 shrink-0">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  FULL NAME
                </p>
                <p className="text-m font-bold text-slate-800 tracking-tight">
                  {profile.name}
                </p>
              </div>
            </div>

            {/* Attribute: Email Node */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs transition-all duration-300 hover:border-indigo-400/40 flex items-start gap-4">
              <div className="p-2.5 bg-slate-50 rounded-xl text-slate-500 border border-slate-100 shrink-0">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  EMAIL ADDRESS
                </p>
                <p className="text-m font-bold  text-slate-700 tracking-tight truncate break-all">
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Attribute: Complex Tracking Assignment */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs transition-all duration-300 hover:border-indigo-400/40 flex items-start gap-4">
              <div className="p-2.5 bg-slate-50 rounded-xl text-slate-500 border border-slate-100 shrink-0">
                <Building2 className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  HOSTEL NAME
                </p>
                <p className="text-m font-bold text-indigo-600 tracking-tight">
                  {profile.hostel_name || "Global Management"}
                </p>
              </div>
            </div>

            {/* Attribute: Creation Log Record */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs transition-all duration-300 hover:border-indigo-400/40 flex items-start gap-4">
              <div className="p-2.5 bg-slate-50 rounded-xl text-slate-500 border border-slate-100 shrink-0">
                <Calendar className="h-4 w-4 text-slate-400" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  ACCOUNT CREATED
                </p>
                <p className="text- m font-bold text-slate-600 tracking-tight">
                  {formatDate(profile.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
