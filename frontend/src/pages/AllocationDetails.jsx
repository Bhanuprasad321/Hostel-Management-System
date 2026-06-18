import { useEffect, useState } from "react";
import {
  Home,
  Calendar,
  ShieldCheck,
  Users2,
  Loader2,
  AlertCircle,
  Hash,
  Activity,
  Milestone,
} from "lucide-react";
import api from "../services/api"; // Existing standardized Axios pipeline connection instance

export default function AllocationDetails() {
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllocationDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Invoke the endpoint payload: route.get("/allocation-details"...)
        const res = await api.get("/students/allocation-details");
        setAllocation(res.data);
      } catch (err) {
        console.error("Allocation blueprint trace failed:", err);
        if (err.response && err.response.status === 404) {
          setError(
            "No active room allocation metadata cataloged for this account.",
          );
        } else {
          setError(
            "Could not safely construct database definitions from active structural clusters.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllocationDetails();
  }, []);

  // Format Timestamp Helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-44 space-y-4 bg-slate-50/30 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Mapping Room Allocation Schema...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-slate-50/40 p-1 min-h-screen antialiased w-full">
      {/* ─── HEADER TITLE COMPONENT ─── */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          My Room Details
        </h2>
        <p className="text-xs font-bold text-slate-500 tracking-wide mt-0.5">
          View your room allocation and occupancy details
        </p>
      </div>

      {error || !allocation ? (
        /* ─── EMPTY STATE / ERROR BLUEPRINT GRAPHIC ─── */
        <div className="max-w-2xl bg-white border border-slate-100 p-12 rounded-2xl shadow-xs text-center mx-auto my-10 transition-all duration-300 hover:border-amber-300">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mx-auto mb-4 shadow-3xs">
            <AlertCircle className="h-6 w-6 stroke-[2]" />
          </div>
          <h3 className="text-base font-black text-slate-800 tracking-tight uppercase">
            No Active Allocation Registered
          </h3>
          <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
            Your profile does not currently reside inside an open room lifecycle
            structure. Please communicate with your hostel administration node
            to authorize space allocation parameters.
          </p>
        </div>
      ) : (
        /* ─── CORE PROPERTY DATA PRESENTATION FRAMEWORK ─── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Structural Detail Block View (Left) */}
          <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:border-indigo-400/50">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-6">
              <Home className="h-4 w-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Room Allocation Information
              </h3>
            </div>

            {/* Matrix Parameters Brea`kdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Variable field: Room Designator ID */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/60 border border-slate-100 transition hover:bg-slate-100/40">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-700 shadow-3xs">
                  <Hash className="h-4 w-4 text-slate-500" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Room Number
                  </p>
                  <p className="text-[18px] font-bold text-slate-800 tracking-tight">
                    Room {allocation.room_number}
                  </p>
                </div>
              </div>

              {/* Variable field: Allocation Authorization Code */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/60 border border-slate-100 transition hover:bg-slate-100/40">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-700 shadow-3xs">
                  <Milestone className="h-4 w-4 text-slate-500" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Allocation ID
                  </p>
                  <p className="text-[18px] font-bold text-slate-700 tracking-tight font-mono">
                    #{allocation.allocation_id}
                  </p>
                </div>
              </div>

              {/* Variable field: Timestamp Initialization Log */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/60 border border-slate-100 transition hover:bg-slate-100/40">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-700 shadow-3xs">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Allocated On
                  </p>
                  <p className="text-sm font-black text-slate-800 tracking-tight">
                    {formatDate(allocation.allocation_date)}
                  </p>
                </div>
              </div>

              {/* Variable field: Status Validation */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/60 border border-slate-100 transition hover:bg-slate-100/40">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-700 shadow-3xs">
                  <Activity className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Allocation Status
                  </p>
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase tracking-wider">
                      <ShieldCheck className="h-3 w-3 stroke-[2.5]" />
                      {allocation.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spatial Spatial Load Panel Area (Right) */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:border-indigo-400/50 flex flex-col justify-between min-h-[224px]">
            <div className="w-full space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Users2 className="h-4 w-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Room Occupancy
                </h3>
              </div>

              {/* Graphical Numeric Grid Matrix */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Current Occupancy
                  </p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">
                    {allocation.current_occupancy}
                  </p>
                </div>
                <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Room Capacity
                  </p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">
                    {allocation.capacity}
                  </p>
                </div>
              </div>

              {/* Progress Visual Vector Track */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wide">
                  <span className="text-slate-400">
                    Occupancy Rate
                  </span>
                  <span className="text-indigo-600 font-extrabold">
                    {Math.round(
                      (allocation.current_occupancy / allocation.capacity) *
                        100,
                    )}
                    % Occupied
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(allocation.current_occupancy / allocation.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
