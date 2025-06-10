
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface EmailVerificationGuardProps {
  children: React.ReactNode;
}

const EmailVerificationGuard = ({ children }: EmailVerificationGuardProps) => {
  const { user, loading } = useAuth();
  const [isResending, setIsResending] = useState(false);

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

  // Check if email is verified
  if (!user.email_confirmed_at) {
    const resendVerification = async () => {
      if (!user.email) return;
      
      setIsResending(true);
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: user.email
        });
        
        if (error) throw error;
        toast.success('Verification email sent! Please check your inbox.');
      } catch (error) {
        console.error('Error resending verification:', error);
        toast.error('Failed to resend verification email');
      } finally {
        setIsResending(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <CardTitle className="text-xl">Email Verification Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              Please verify your email address to access the platform. We've sent a verification link to:
            </p>
            <p className="font-semibold text-center break-all">{user.email}</p>
            <div className="space-y-3">
              <Button
                onClick={resendVerification}
                disabled={isResending}
                className="w-full"
                variant="outline"
              >
                <Mail className="w-4 h-4 mr-2" />
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
              <Button
                onClick={() => supabase.auth.signOut()}
                variant="ghost"
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default EmailVerificationGuard;
