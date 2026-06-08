import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginRoute";
import ProtectedRoute from "./pages/ProtectedRoute";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Students from "./pages/StudentRoute";
import RoomRoute from "./pages/RoomRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/hostel-admin" element={<AdminDashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/rooms" element={<RoomRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
