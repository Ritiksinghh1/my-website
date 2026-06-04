import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Protects routes that require login
export const PrivateRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Protects routes that require admin role
export const AdminRoute = () => {
  const { user } = useAuth();
  if (!user)          return <Navigate to="/login"  replace />;
  if (!user.isAdmin)  return <Navigate to="/"       replace />;
  return <Outlet />;
};