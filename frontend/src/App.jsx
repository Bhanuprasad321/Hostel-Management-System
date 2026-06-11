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
import SubscriptionRoute from "./pages/SubscriptionsRoute";
import AllocationsRoute from "./pages/AllocationsRoute";
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
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/hostels" element={<HostelsRoute />} />
            <Route path="/:id/admin/" element={<AdminRoute />} />
            <Route path="/hostel-admin" element={<AdminDashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/rooms" element={<RoomRoute />} />
            <Route path="/subscriptions" element={<SubscriptionRoute />} />
            <Route path="/allocations" element={<AllocationsRoute />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
