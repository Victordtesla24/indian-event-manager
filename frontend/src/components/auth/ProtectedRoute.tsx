import { Navigate, useLocation } from "react-router-dom";
import { UserRole, AdminPermission } from "../../core/enums";
import { useAuthStore } from "../../stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permissions?: AdminPermission[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
  permissions,
  redirectTo = "/login",
}) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // TODO: Replace with proper loading component
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission-based access for admin users
  if (permissions) {
    if (user.role !== UserRole.ADMIN || !user.permissions) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    if (!permissions.every((permission) => user.permissions?.includes(permission))) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
