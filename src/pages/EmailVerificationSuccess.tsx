
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EmailVerificationSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check if user is now authenticated and verified
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          toast.error('Verification failed. Please try again.');
          navigate('/register');
          return;
        }

        if (session?.user?.email_confirmed_at) {
          setVerificationComplete(true);
          toast.success('Email verified successfully! Welcome to Bizzy!');
        } else {
          // If not verified, redirect back to verification page
          toast.error('Email verification incomplete. Please check your email again.');
          navigate('/email-verification');
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Verification failed. Please try again.');
        navigate('/register');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [navigate]);

  const handleContinueToDashboard = () => {
    navigate('/dashboard');
  };

  if (isVerifying) {
    return (
      <div className="flex min-h-screen bg-muted/30 items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0088cc] mx-auto mb-4"></div>
              <p className="text-muted-foreground">Verifying your email...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!verificationComplete) {
    return (
      <div className="flex min-h-screen bg-muted/30 items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Redirecting...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-600">Email Verified!</CardTitle>
            <CardDescription>
              Your account has been successfully verified and activated
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-center">
                  <p className="font-medium text-green-900 mb-2">
                    🎉 Welcome to Bizzy!
                  </p>
                  <p className="text-sm text-green-800">
                    Your email has been verified and your account is now fully activated. 
                    You can now access all features of your business compliance dashboard.
                  </p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>What's Next:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-left">
                  <li>Complete your business profile setup</li>
                  <li>Explore your personalized compliance dashboard</li>
                  <li>Start generating required business documents</li>
                  <li>Set up automated compliance reminders</li>
                </ul>
              </div>

              <Button 
                onClick={handleContinueToDashboard}
                className="w-full"
                size="lg"
              >
                Continue to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerificationSuccess;
