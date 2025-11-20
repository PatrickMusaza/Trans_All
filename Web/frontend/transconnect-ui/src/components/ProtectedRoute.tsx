import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'driver' | 'user' | 'agency_admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/signin');
      } else if (requiredRole && !hasRole(requiredRole)) {
        navigate('/dashboard');
      }
    }
  }, [user, loading, requiredRole, hasRole, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || (requiredRole && !hasRole(requiredRole))) {
    return null;
  }

  return <>{children}</>;
}
