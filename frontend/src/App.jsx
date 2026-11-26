import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginRoute";
import ProtectedRoute from "./pages/ProtectedRoute";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Students from "./pages/StudentRoute";
import RoomRoute from "./pages/RoomRoute";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import HostelsRoute from "./pages/HostelRoute";
import AdminRoute from "./pages/AdminRoute";
import AllocationsRoute from "./pages/AllocationsRoute";
import AuditLogs from "./pages/AuditLogs";
import NotificationsRoute from "./pages/NotificationsRoute";
import SettingsRoute from "./pages/SettingsRoute";
import AnalyticsSuperAdminRoute from "./pages/AnalyticsSuperAdminRoute";
import AnalyticsAdminRoute from "./pages/AnalyticsAdminRoute";
import StudentDashboard from "./pages/StudentDashboard";
import AllocationDetails from "./pages/AllocationDetails";
import NoticesPage from "./pages/NoticesPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import ProfilePage from "./pages/ProfilePage";
import VisitorsPage from "./pages/VisitorsPage";
import SuperAdminSubscriptions from "./pages/SuperAdminSubscriptionsPage";
import AdminSubscriptionsPage from "./pages/AdminSubscriptionsPage";
import BusinessInsightsPage from "./pages/BusinessInsightsPage";
import SupportTicketsPage from "./pages/SupportTicketsPage";
import HostelFeeManagementPage from "./pages/HostelFeeManagementPage";
import StudentFeeManagement from "./pages/StudentFeeManagementPage";
import DemoRequestsPage from "./pages/DemoRequestsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — no layout */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes — wrapped in DashboardLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Super Admin only */}
            <Route
              element={<ProtectedRoute allowedRoles={["super_admin"]} />}
            >
              <Route path="/super-admin" element={<SuperAdminDashboard />} />
              <Route path="/hostels" element={<HostelsRoute />} />
              <Route path="/admins" element={<AdminRoute />} />
              <Route
                path="/super-admin/subscriptions"
                element={<SuperAdminSubscriptions />}
              />
              <Route
                path="/super-admin/analytics"
                element={<AnalyticsSuperAdminRoute />}
              />
              <Route
                path="/business-insights"
                element={<BusinessInsightsPage />}
              />
              <Route path="/demo-requests" element={<DemoRequestsPage />} />
            </Route>

            {/* Hostel Admin only */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/hostel-admin" element={<AdminDashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/rooms" element={<RoomRoute />} />
              <Route path="/allocations" element={<AllocationsRoute />} />
              <Route
                path="/fee-management"
                element={<HostelFeeManagementPage />}
              />
              <Route
                path="/admin/subscriptions"
                element={<AdminSubscriptionsPage />}
              />
              <Route path="/admin/analytics" element={<AnalyticsAdminRoute />} />
              <Route path="/visitors" element={<VisitorsPage />} />
            </Route>

            {/* Student only */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route
                path="/allocation-details"
                element={<AllocationDetails />}
              />
              <Route path="/my-fees" element={<StudentFeeManagement />} />
            </Route>

            {/* Super Admin & Hostel Admin */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["super_admin", "admin"]} />
              }
            >
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="/support-tickets" element={<SupportTicketsPage />} />
            </Route>

            {/* Hostel Admin & Student */}
            <Route
              element={<ProtectedRoute allowedRoles={["admin", "student"]} />}
            >
              <Route path="/notices" element={<NoticesPage />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
            </Route>

            {/* All authenticated roles */}
            <Route path="/notifications" element={<NotificationsRoute />} />
            <Route path="/settings" element={<SettingsRoute />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
