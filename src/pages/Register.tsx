import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;
    
    // Contains uppercase or number
    if (/[A-Z0-9]/.test(password)) strength += 25;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [password]);
  
  // Get strength text
  const getStrengthText = (strength: number) => {
    if (strength < 50) return "Weak";
    if (strength < 75) return "Medium";
    return "Strong";
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (passwordStrength < 50) {
      toast.error("Please use a stronger password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Starting registration process...");
      console.log("User data:", { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim().toLowerCase() });
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          }
        }
      });

      console.log("Registration response:", { data, error });

      if (error) {
        console.error("Registration error:", error);
        
        // Handle specific error cases
        if (error.message.includes("User already registered")) {
          toast.error("An account with this email already exists. Please try logging in instead.");
          return;
        }
        
        if (error.message.includes("Invalid email")) {
          toast.error("Please enter a valid email address.");
          return;
        }
        
        if (error.message.includes("Password should be")) {
          toast.error("Password does not meet security requirements. Please try a stronger password.");
          return;
        }
        
        toast.error(error.message || "Failed to create account. Please try again.");
        return;
      }

      if (data.user) {
        console.log("User created successfully:", data.user);
        console.log("User metadata sent:", data.user.user_metadata);
        
        // Always redirect to email verification page with professional messaging
        const userEmail = encodeURIComponent(email.trim().toLowerCase());
        
        if (!data.user.email_confirmed_at) {
          // Email confirmation required - show verification page
          toast.success("Account created successfully! Please check your email for verification.");
          setTimeout(() => {
            navigate(`/email-verification?email=${userEmail}`);
          }, 1500);
        } else {
          // Email confirmation disabled - redirect directly to dashboard  
          toast.success("Account created successfully! Welcome to Bizzy!");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }
      } else {
        console.error("No user data returned from registration");
        toast.error("Account creation failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Unexpected registration error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Get started with Bizzy and streamline your business administration
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    required 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Smith" 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Password strength:</span>
                      <span className={
                        passwordStrength < 50 ? "text-red-500" : 
                        passwordStrength < 75 ? "text-yellow-500" : 
                        "text-green-500"
                      }>
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <Progress value={passwordStrength} className="h-1" />
                    <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                      <li className="flex items-center gap-2">
                        {password.length >= 8 ? 
                          <Check className="h-3 w-3 text-green-500" /> : 
                          <X className="h-3 w-3 text-red-500" />} 
                        At least 8 characters
                      </li>
                      <li className="flex items-center gap-2">
                        {/[a-z]/.test(password) ? 
                          <Check className="h-3 w-3 text-green-500" /> : 
                          <X className="h-3 w-3 text-red-500" />} 
                        Lowercase letter
                      </li>
                      <li className="flex items-center gap-2">
                        {/[A-Z0-9]/.test(password) ? 
                          <Check className="h-3 w-3 text-green-500" /> : 
                          <X className="h-3 w-3 text-red-500" />} 
                        Uppercase letter or number
                      </li>
                      <li className="flex items-center gap-2">
                        {/[^A-Za-z0-9]/.test(password) ? 
                          <Check className="h-3 w-3 text-green-500" /> : 
                          <X className="h-3 w-3 text-red-500" />} 
                        Special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full mb-4 bg-[#1d4ed8] hover:bg-[#1d4ed8]/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-[#1d4ed8] hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
