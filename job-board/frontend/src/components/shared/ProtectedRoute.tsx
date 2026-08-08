import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import type { UserRole } from "../../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole; // Si se especifica, solo ese rol puede acceder
}

export default function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Mientras verifica la sesión, mostramos spinner (no redirigimos prematuramente)
  if (loading) return <LoadingSpinner />;

  // Si no hay usuario logueado, redirigimos al login
  if (!user) return <Navigate to="/login" replace />;

  // Si la ruta requiere un rol específico y el usuario no lo tiene
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
