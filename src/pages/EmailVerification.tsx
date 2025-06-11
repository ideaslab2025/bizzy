
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const email = searchParams.get("email");

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("No email address found. Please try registering again.");
      return;
    }

    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-verification-success`
        }
      });

      if (error) {
        console.error("Resend error:", error);
        toast.error("Failed to resend verification email. Please try again.");
      } else {
        toast.success("Verification email sent! Please check your inbox.");
      }
    } catch (error) {
      console.error("Unexpected resend error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30 items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Link to="/">
            <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-64 lg:h-80 xl:h-96" />
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              Please verify your email address to complete your Bizzy registration
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-medium text-blue-900 mb-1">
                      Verification Required
                    </p>
                    <p className="text-sm text-blue-800">
                      We've sent a verification email to <strong>{email || "your email address"}</strong>. 
                      Please check your inbox and click the verification link to activate your account and access your business compliance dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Important:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-left">
                  <li>Check your email inbox for the verification message</li>
                  <li>Don't forget to check your spam/junk folder</li>
                  <li>Click the verification link in the email</li>
                  <li>You must verify your email before you can sign in</li>
                </ul>
              </div>

              <div className="border-t pt-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email?
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? "Sending..." : "Resend Verification Email"}
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-center text-muted-foreground mt-4">
              Already verified your email?{" "}
              <Link to="/login" className="text-[#1d4ed8] hover:underline">
                Go to Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
