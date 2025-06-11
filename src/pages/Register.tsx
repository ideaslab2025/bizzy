
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { SecureAuthForm } from "@/components/auth/SecureAuthForm";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    const userEmail = encodeURIComponent(''); // Email will be handled by the secure form
    navigate(`/email-verification?email=${userEmail}`);
  };
  
  return (
    <div className="flex min-h-screen bg-muted/30 items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-64 lg:h-80 xl:h-96" />
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Get started with Bizzy and streamline your business administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecureAuthForm mode="register" onSuccess={handleSuccess} />
            
            <p className="text-sm text-center text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-[#1d4ed8] hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
