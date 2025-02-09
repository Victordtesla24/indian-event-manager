import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { UserRole, AdminPermission } from "../core/enums";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import AdminLayout from "../components/layouts/AdminLayout";

// Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/admin/Dashboard";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";
import EventDetails from "../pages/EventDetails";
import EventDiscovery from "../pages/EventDiscovery";

// Lazy load admin pages
const UserManagement = React.lazy(() => import("../pages/admin/UserManagement"));
const EventManagement = React.lazy(() => import("../pages/admin/EventManagement"));
const SystemSettings = React.lazy(() => import("../pages/admin/SystemSettings"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/events" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/events",
    element: <EventDiscovery />,
  },
  {
    path: "/events/:id",
    element: <EventDetails />,
  },
  // Admin routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute roles={[UserRole.ADMIN]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute permissions={[AdminPermission.VIEW_DASHBOARD]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute permissions={[AdminPermission.MANAGE_USERS]}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "events",
        element: (
          <ProtectedRoute permissions={[AdminPermission.MANAGE_EVENTS]}>
            <EventManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute permissions={[AdminPermission.MANAGE_SETTINGS]}>
            <SystemSettings />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
