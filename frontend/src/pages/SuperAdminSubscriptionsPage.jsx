import { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Plus,
  X,
  Check,
  Loader2,
  AlertCircle,
  Layers,
} from "lucide-react";
import api from "../services/api";

// Core static feature list registry
const SYSTEM_FEATURES = [
  "students",
  "rooms",
  "allocations",
  "visitors",
  "complaints",
  "notices",
  "analytics",
  "audit_logs",
  "exports",
];

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [maxEmployees, setMaxEmployees] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]); // Array state managing checkboxes

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch registered subscription plans matrix
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/plans");
      setPlans(res.data || []);
    } catch (err) {
      console.error("Failed to sync structural subscription matrices:", err);
      setError("Failed to download subscription plans mapping layers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle Feature Checkbox Toggle Operations
  const handleToggleFeature = (featureKey) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureKey)
        ? prev.filter((f) => f !== featureKey)
        : [...prev, featureKey],
    );
  };

  // Open modal container for a clean payload injection format
  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlanId(plan.id);
      setName(plan.name);
      setDescription(plan.description || "");
      setPrice(plan.price);
      setMaxEmployees(plan.max_employees);
      setDurationDays(plan.duration_days);

      // Handle safe feature parsing layers
      try {
        const parsed =
          typeof plan.features === "string"
            ? JSON.parse(plan.features)
            : plan.features;
        setSelectedFeatures(Array.isArray(parsed) ? parsed : []);
      } catch {
        setSelectedFeatures([]);
      }
    } else {
      setEditingPlanId(null);
      setName("");
      setDescription("");
      setPrice("");
      setMaxEmployees("");
      setDurationDays("");
      setSelectedFeatures([]);
    }
    setFormError("");
    setIsModalOpen(true);
  };

  // Submit creation / update payload configurations
  const handleSubmitPlan = async (e) => {
    e.preventDefault();
    if (!name || !maxEmployees || !durationDays) {
      setFormError(
        "Required identification parameters must be fully populated.",
      );
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price) || 0,
      max_employees: Number(maxEmployees),
      duration_days: Number(durationDays),
      features: selectedFeatures, // Explicit array committed straight to server endpoints
    };

    try {
      setFormLoading(true);
      setFormError("");

      if (editingPlanId) {
        await api.put(`/plans/${editingPlanId}`, payload);
      } else {
        await api.post("/plans", payload);
      }

      setIsModalOpen(false);
      fetchPlans();
    } catch (err) {
      console.error("Payload transaction aborted:", err);
      setFormError(
        err.response?.data?.message ||
          "Operational pipeline execution failure.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePlan = async (id) => {
    if (
      !confirm(
        "Are you sure you want to completely erase this plan specification?",
      )
    )
      return;
    try {
      await api.delete(`/plans/${id}`);
      fetchPlans();
    } catch (err) {
      alert(err.response?.data?.message || "Error dropping targeted plan row.");
    }
  };

  // Safely evaluate incoming database strings/arrays
  const renderFeaturesList = (featuresData) => {
    try {
      const target =
        typeof featuresData === "string"
          ? JSON.parse(featuresData)
          : featuresData;
      if (!Array.isArray(target) || target.length === 0) return null;

      return (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
          {target.map((feat) => (
            <span
              key={feat}
              className="inline-flex items-center gap-1 bg-indigo-50/60 text-indigo-700 text-[10px] px-2 py-0.5 rounded font-bold tracking-tight capitalize"
            >
              <Check className="h-2.5 w-2.5 stroke-[3]" />
              {feat.replace("_", " ")}
            </span>
          ))}
        </div>
      );
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-4 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Loading Configuration Matrices...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1 min-h-screen antialiased w-full bg-slate-50/40">
      {/* HEADER ROW */}
      <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Subscription Plans
          </h2>
          <p className="text-xs text-slate-500 tracking-wide">
            Configure systemic authorization structures and pricing metrics
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition duration-200 uppercase tracking-wider cursor-pointer shadow-3xs"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Create New Plan
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-bold text-red-600 flex items-center gap-2.5 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* PLAN CARD CAROUSEL SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-5"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                {plan.name}
              </h3>
              <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                ₹{Number(plan.price).toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide mt-1">
                {plan.duration_days} Days &middot; {plan.max_employees}{" "}
                Employees
              </p>
              {plan.description && (
                <p className="text-xs font-medium text-slate-400 mt-2 line-clamp-2">
                  {plan.description}
                </p>
              )}
              {/* DYNAMICALLY INJECTED FEATURE PILLS MATRIX */}
              {renderFeaturesList(plan.features)}
            </div>

            {/* BUTTON MATRIX MATCHING ORIGINAL UI */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleOpenModal(plan)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition duration-150 cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5 text-slate-400" />
                Edit
              </button>
              <button
                onClick={() => handleDeletePlan(plan.id)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-white py-2 text-xs font-bold text-red-500 hover:bg-red-50 hover:border-red-200 transition duration-150 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATION & MUTATION MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !formLoading && setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-500" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  {editingPlanId ? "Modify Plan" : "Add Subscription Plan"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={formLoading}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 transition cursor-pointer"
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

            <form onSubmit={handleSubmitPlan} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={formLoading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-3 pr-3 py-2.5 text-xs font-bold tracking-tight text-slate-800 focus:border-indigo-500 focus:outline-hidden transition shadow-3xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    disabled={formLoading}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-3 pr-3 py-2.5 text-xs font-bold tracking-tight text-slate-800 focus:border-indigo-500 focus:outline-hidden transition shadow-3xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Max Employees
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    disabled={formLoading}
                    value={maxEmployees}
                    onChange={(e) => setMaxEmployees(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-3 pr-3 py-2.5 text-xs font-bold tracking-tight text-slate-800 focus:border-indigo-500 focus:outline-hidden transition shadow-3xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    disabled={formLoading}
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-3 pr-3 py-2.5 text-xs font-bold tracking-tight text-slate-800 focus:border-indigo-500 focus:outline-hidden transition shadow-3xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  Description
                </label>
                <input
                  type="text"
                  disabled={formLoading}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-3 pr-3 py-2.5 text-xs font-medium tracking-tight text-slate-700 focus:border-indigo-500 focus:outline-hidden transition shadow-3xs"
                />
              </div>

              {/* CHECKBOX FEATURES MATRIX INTERFACE LAYERS */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  Features Provided
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 max-h-48 overflow-y-auto">
                  {SYSTEM_FEATURES.map((featureKey) => {
                    const isChecked = selectedFeatures.includes(featureKey);
                    return (
                      <label
                        key={featureKey}
                        className="flex items-center gap-2.5 p-1 text-xs font-bold text-slate-700 cursor-pointer select-none transition hover:text-indigo-600"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleFeature(featureKey)}
                          disabled={formLoading}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 transition cursor-pointer"
                        />
                        <span className="capitalize tracking-tight">
                          {featureKey.replace("_", " ")}
                        </span>
                      </label>
                    );
                  })}
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
                  disabled={formLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black text-white hover:bg-indigo-700 transition shadow-sm uppercase tracking-wider cursor-pointer"
                >
                  {formLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Save Plan"
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
