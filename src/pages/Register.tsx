
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Info, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [email, setEmail] = useState("");
  
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
  
  // Get strength color
  const getStrengthColor = (strength: number) => {
    if (strength < 50) return "bg-red-500";
    if (strength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  // Get strength text
  const getStrengthText = (strength: number) => {
    if (strength < 50) return "Weak";
    if (strength < 75) return "Medium";
    return "Strong";
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (emailVerificationSent && !isCodeValid) {
      toast.error("Please verify your email first");
      return;
    }
    
    if (passwordStrength < 50) {
      toast.error("Please use a stronger password");
      return;
    }
    
    setIsLoading(true);
    
    // This is a placeholder for actual Supabase authentication
    // Once Supabase is connected, replace with actual auth code
    setTimeout(() => {
      toast.success("Account created successfully!");
      setIsLoading(false);
      navigate("/onboarding");
    }, 1500);
  };
  
  const sendVerificationCode = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setEmailVerificationSent(true);
    toast.success("Verification code sent to your email");
    
    // In a real implementation, this would send an email with the code
    // For demo purposes, we'll use a hardcoded code: "123456"
  };
  
  const verifyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // For demo purposes, the code is "123456"
    if (verificationCode === "123456") {
      setIsCodeValid(true);
      toast.success("Email verified successfully!");
    } else {
      toast.error("Invalid verification code");
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
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Smith" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={emailVerificationSent && isCodeValid}
                  />
                  {!emailVerificationSent && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={sendVerificationCode}
                      className="whitespace-nowrap"
                    >
                      Verify Email
                    </Button>
                  )}
                </div>
              </div>
              
              {emailVerificationSent && !isCodeValid && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="verificationCode" 
                      placeholder="Enter code sent to your email" 
                      required 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={verifyCode}
                    >
                      Verify
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For demo purposes, use code: 123456
                  </p>
                </div>
              )}
              
              {isCodeValid && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <Check className="h-4 w-4 text-green-500" />
                  <AlertDescription className="flex items-center gap-2">
                    Email successfully verified
                  </AlertDescription>
                </Alert>
              )}
              
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
                <Input id="confirmPassword" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full mb-4 bg-[#1d4ed8] hover:bg-[#1d4ed8]/90"
                disabled={isLoading || (emailVerificationSent && !isCodeValid)}
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
