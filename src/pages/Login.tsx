
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { SecureAuthForm } from "@/components/auth/SecureAuthForm";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    navigate("/dashboard");
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
            <CardTitle>Log in to your account</CardTitle>
            <CardDescription>
              Welcome back! Enter your details to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecureAuthForm mode="login" onSuccess={handleSuccess} />
            
            <div className="mt-6 text-center">
              <Link to="/forgot-password" className="text-sm text-[#1d4ed8] hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <p className="text-sm text-center text-muted-foreground mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#1d4ed8] hover:underline">
                Register now
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
