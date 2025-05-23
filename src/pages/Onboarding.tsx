
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setIsLoading(true);
    // This is a placeholder for saving onboarding data
    setTimeout(() => {
      toast.success("Company details saved!");
      setIsLoading(false);
      navigate("/pricing");
    }, 1500);
  };
  
  return (
    <div className="flex min-h-screen bg-muted/30 items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Bizzy</CardTitle>
            <CardDescription>
              Let's get your business set up on our platform
            </CardDescription>
            <div className="flex justify-between items-center mt-4">
              <div className={`h-2 w-1/3 ${step >= 1 ? 'bg-[#0088cc]' : 'bg-gray-200'} rounded-l-full`}></div>
              <div className={`h-2 w-1/3 ${step >= 2 ? 'bg-[#0088cc]' : 'bg-gray-200'}`}></div>
              <div className={`h-2 w-1/3 ${step >= 3 ? 'bg-[#0088cc]' : 'bg-gray-200'} rounded-r-full`}></div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company name</Label>
                    <Input id="companyName" placeholder="Acme Ltd" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyNumber">Company registration number</Label>
                    <Input id="companyNumber" placeholder="12345678" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyType">Company type</Label>
                    <Select defaultValue="limited">
                      <SelectTrigger>
                        <SelectValue placeholder="Select company type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="limited">Limited Company</SelectItem>
                        <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                        <SelectItem value="soleTrader">Sole Trader</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="sector">Business sector</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="finance">Financial Services</SelectItem>
                        <SelectItem value="health">Healthcare</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="employees">Number of employees</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Just me</SelectItem>
                        <SelectItem value="2-5">2-5</SelectItem>
                        <SelectItem value="6-10">6-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="50+">50+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vatRegistered">VAT registered?</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="planning">Planning to register soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="vatNumber">VAT number (if applicable)</Label>
                    <Input id="vatNumber" placeholder="GB123456789" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Registered address</Label>
                    <Input id="address" placeholder="1 Business Street" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="London" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input id="postcode" placeholder="EC1A 1BB" required />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              ) : (
                <div></div> // Empty div to maintain spacing
              )}
              <Button 
                type="submit" 
                className="bg-[#0088cc] hover:bg-[#0088cc]/90"
                disabled={isLoading}
              >
                {step < 3 ? "Next" : isLoading ? "Saving..." : "Complete"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
