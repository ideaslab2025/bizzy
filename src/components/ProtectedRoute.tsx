
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import EmailVerificationGuard from "./EmailVerificationGuard";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0088cc]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <EmailVerificationGuard>
      {children}
    </EmailVerificationGuard>
  );
};

export default ProtectedRoute;
