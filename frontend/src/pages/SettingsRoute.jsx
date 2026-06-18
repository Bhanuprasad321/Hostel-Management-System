import { useEffect, useState } from "react";
import {
  User,
  Lock,
  Building2,
  KeyRound,
  ShieldCheck,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
} from "lucide-react";
import api from "../services/api"; // Adjust file location to match your folder hierarchy

export default function SettingsRoute() {
  const [activeTab, setActiveTab] = useState("profile"); // profile | password | hostel

  // User metadata context states
  const raw = localStorage.getItem("user");
  const userContext = raw ? JSON.parse(raw) : null;
  const isHostelAdmin = userContext?.role === "admin";

  // Form Field States
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    curr_pass: "",
    new_pass: "",
    confirm_pass: "",
  });
  const [hostelForm, setHostelForm] = useState({
    hostel_name: "",
    address: "",
  });

  // Core Status Handlers
  const [pageLoading, setPageLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [bannerMsg, setBannerMsg] = useState({ type: "", text: "" }); // type: success | error

  // System notification timeout reference anchor
  const triggerBanner = (type, text) => {
    setBannerMsg({ type, text });
    setTimeout(() => setBannerMsg({ type: "", text: "" }), 5000);
  };

  // Sync state settings on runtime startup loop
  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        setPageLoading(true);

        // Concurrent initialization vectors
        const requests = [api.get("/settings/profile")];
        if (isHostelAdmin) {
          requests.push(api.get("/settings/hostel"));
        }

        const responses = await Promise.all(requests);

        setProfileForm({
          name: responses[0].data.name || "",
          email: responses[0].data.email || "",
        });

        if (isHostelAdmin && responses[1]) {
          setHostelForm({
            hostel_name: responses[1].data.hostel_name || "",
            address: responses[1].data.address || "",
          });
        }
      } catch (err) {
        console.error("Configuration payload synchronization dropped:", err);
        triggerBanner(
          "error",
          "Failed to retrieve configuration schemas from cluster nodes.",
        );
      } finally {
        setPageLoading(false);
      }
    };

    fetchSystemSettings();
  }, [isHostelAdmin]);

  // Handler 1: Update personal user parameters
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const res = await api.put("/settings/profile", {
        name: profileForm.name,
      });

      // Update local storage representation so layout synchronization stays aligned
      if (userContext) {
        userContext.name = profileForm.name;
        localStorage.setItem("user", JSON.stringify(userContext));
      }

      triggerBanner(
        "success",
        res.data.message || "Profile data saved successfully.",
      );
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      triggerBanner(
        "error",
        err.response?.data?.message || "Profile transaction discarded.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Handler 2: Secure password update logic
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new_pass !== passwordForm.confirm_pass) {
      triggerBanner(
        "error",
        "Confirmation parameter mismatch: Passwords must be identical.",
      );
      return;
    }

    try {
      setFormLoading(true);
      const res = await api.put("/settings/change-password", {
        curr_pass: passwordForm.curr_pass,
        new_pass: passwordForm.new_pass,
      });

      triggerBanner(
        "success",
        res.data.message || "Security credentials updated.",
      );
      setPasswordForm({ curr_pass: "", new_pass: "", confirm_pass: "" });
    } catch (err) {
      triggerBanner(
        "error",
        err.response?.data?.message ||
          "Authentication change validation error.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Handler 3: Structural administrative site profile mutation
  const handleUpdateHostel = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const res = await api.put("/settings/hostel", hostelForm);
      triggerBanner(
        "success",
        res.data.message || "Structural profiles altered.",
      );
    } catch (err) {
      triggerBanner(
        "error",
        err.response?.data?.message || "Data constraints collision error.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-4 bg-slate-50/30 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Mapping system configuration metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-slate-50/40 p-1 min-h-screen antialiased max-w-4xl">
      {/* Title contextual row */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Account Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          Manage your profile information and account security
        </p>
      </div>

      {/* Global State Toast Banners */}
      {bannerMsg.text && (
        <div
          className={`rounded-xl border p-4 text-xs font-bold flex items-center gap-2.5 transition-all duration-300 animate-fade-in ${
            bannerMsg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          {bannerMsg.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{bannerMsg.text}</span>
        </div>
      )}

      {/* Segmented Layout Grid Setup */}
      <div className="grid grid-col-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar Matrix */}
        <div className="flex flex-row md:flex-col gap-1 p-1 rounded-xl bg-slate-100/70 md:bg-transparent overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2.5 px-3.5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap w-full justify-start ${
              activeTab === "profile"
                ? "bg-white md:bg-indigo-600 text-indigo-600 md:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/80"
            }`}
          >
            <User className="h-4 w-4 shrink-0" />
            Profile Information
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`flex items-center gap-2.5 px-3.5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap w-full justify-start ${
              activeTab === "password"
                ? "bg-white md:bg-indigo-600 text-indigo-600 md:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/80"
            }`}
          >
            <Lock className="h-4 w-4 shrink-0" />
            Password & Security
          </button>

          {isHostelAdmin && (
            <button
              onClick={() => setActiveTab("hostel")}
              className={`flex items-center gap-2.5 px-3.5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap w-full justify-start ${
                activeTab === "hostel"
                  ? "bg-white md:bg-indigo-600 text-indigo-600 md:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/80"
              }`}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              Hostel Settings
            </button>
          )}
        </div>

        {/* Input Interface Panels */}
        <div className="md:col-span-3 rounded-xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 hover:border-indigo-400/60 hover:ring-4 hover:ring-indigo-50/50">
          {/* TAB FRAME A: USER PROFILE */}
          {activeTab === "profile" && (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                <User className="h-4 w-4 text-indigo-500" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Identity Specifications
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <input
                    type="email"
                    value={profileForm.email}
                    disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pl-9 text-sm text-slate-400 outline-hidden cursor-not-allowed select-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  * System email labels cannot be mutated manually.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  required
                  disabled={formLoading}
                  placeholder="Enter user identifier handle..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2 text-sm text-slate-700 outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {formLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Update Profile
                </button>
              </div>
            </form>
          )}

          {/* TAB FRAME B: SECURITY CREDENTIALS */}
          {activeTab === "password" && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                <KeyRound className="h-4 w-4 text-indigo-500" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Update Password
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.curr_pass}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      curr_pass: e.target.value,
                    })
                  }
                  required
                  disabled={formLoading}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2 text-sm text-slate-700 outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.new_pass}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      new_pass: e.target.value,
                    })
                  }
                  required
                  disabled={formLoading}
                  placeholder="Enter your new password"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2 text-sm text-slate-700 outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirm_pass}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirm_pass: e.target.value,
                    })
                  }
                  required
                  disabled={formLoading}
                  placeholder="Re-enter your new password"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2 text-sm text-slate-700 outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {formLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  )}
                  Update Password
                </button>
              </div>
            </form>
          )}

          {/* TAB FRAME C: HOSTEL SCOPE ENVIRONMENT PARAMETERS */}
          {activeTab === "hostel" && isHostelAdmin && (
            <form onSubmit={handleUpdateHostel} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                <Building2 className="h-4 w-4 text-indigo-500" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Hostel Information
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Hostel Name
                </label>
                <input
                  type="text"
                  value={hostelForm.hostel_name}
                  onChange={(e) =>
                    setHostelForm({
                      ...hostelForm,
                      hostel_name: e.target.value,
                    })
                  }
                  required
                  disabled={formLoading}
                  placeholder="ABC Enterprise Complex Area..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2 text-sm text-slate-700 outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Hostel Address
                </label>
                <textarea
                  rows={3}
                  value={hostelForm.address}
                  onChange={(e) =>
                    setHostelForm({ ...hostelForm, address: e.target.value })
                  }
                  required
                  disabled={formLoading}
                  placeholder="Street footprint, physical localized grid location, regional block mapping parameters..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2 text-sm text-slate-700 outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {formLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Update Hostel Details
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
