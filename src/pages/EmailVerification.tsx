
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
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
          emailRedirectTo: `${window.location.origin}/dashboard`
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
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-24" />
          </Link>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to complete your Bizzy registration
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-medium text-blue-900 mb-1">
                      Welcome to Bizzy!
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
                  <strong>Next Steps:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-left">
                  <li>Check your email inbox for the verification message</li>
                  <li>Don't forget to check your spam/junk folder</li>
                  <li>Click the verification link in the email</li>
                  <li>You'll be automatically redirected to your dashboard</li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-3">
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
          </CardContent>
          
          <div className="p-6 pt-0">
            <div className="flex justify-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm text-[#1d4ed8] hover:underline"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
