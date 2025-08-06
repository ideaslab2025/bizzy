
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyNumber: "",
    companyType: "limited",
    sector: "",
    employees: "",
    vatRegistered: "",
    vatNumber: "",
    address: "",
    city: "",
    postcode: "",
  });
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!user) {
        toast.error("User not found. Please log in again.");
        navigate("/login");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: formData.companyName,
          business_type: formData.companyType,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        toast.error("Failed to save company details: " + error.message);
        return;
      }

      toast.success("Company details saved!");
      navigate("/pricing");
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
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
              <div className={`h-2 w-1/3 ${step >= 1 ? 'bg-primary' : 'bg-gray-200'} rounded-l-full`}></div>
              <div className={`h-2 w-1/3 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`h-2 w-1/3 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'} rounded-r-full`}></div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company name</Label>
                    <Input 
                      id="companyName" 
                      placeholder="Acme Ltd" 
                      required 
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyNumber">Company registration number</Label>
                    <Input 
                      id="companyNumber" 
                      placeholder="12345678" 
                      required 
                      value={formData.companyNumber}
                      onChange={(e) => handleInputChange("companyNumber", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyType">Company type</Label>
                    <Select 
                      value={formData.companyType} 
                      onValueChange={(value) => handleInputChange("companyType", value)}
                    >
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
                    <Select 
                      value={formData.sector} 
                      onValueChange={(value) => handleInputChange("sector", value)}
                    >
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
                    <Select 
                      value={formData.employees} 
                      onValueChange={(value) => handleInputChange("employees", value)}
                    >
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
                    <Select 
                      value={formData.vatRegistered} 
                      onValueChange={(value) => handleInputChange("vatRegistered", value)}
                    >
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
                    <Input 
                      id="vatNumber" 
                      placeholder="GB123456789" 
                      value={formData.vatNumber}
                      onChange={(e) => handleInputChange("vatNumber", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Registered address</Label>
                    <Input 
                      id="address" 
                      placeholder="1 Business Street" 
                      required 
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        placeholder="London" 
                        required 
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input 
                        id="postcode" 
                        placeholder="EC1A 1BB" 
                        required 
                        value={formData.postcode}
                        onChange={(e) => handleInputChange("postcode", e.target.value)}
                      />
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
                <div></div>
              )}
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
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
