import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { User, Save, ArrowLeft, Lock, Eye, EyeOff, Shield, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import EmailPreferences from "@/components/profile/EmailPreferences";

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  business_type: string;
  phone: string;
  created_at: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    first_name: "",
    last_name: "",
    company_name: "",
    business_type: "",
    phone: "",
    created_at: ""
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      console.log("Fetching profile for user:", user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile information");
        return;
      }

      if (data) {
        console.log("Profile data loaded:", data);
        setProfileData({
          id: data.id,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          company_name: data.company_name || "",
          business_type: data.business_type || "",
          phone: data.phone || "",
          created_at: data.created_at
        });
      }
    } catch (error) {
      console.error("Unexpected error loading profile:", error);
      toast.error("An unexpected error occurred while loading your profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return score;
  };

  const getPasswordStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return { label: "Very Weak", color: "text-red-600" };
      case 2:
        return { label: "Weak", color: "text-orange-600" };
      case 3:
        return { label: "Fair", color: "text-yellow-600" };
      case 4:
        return { label: "Good", color: "text-blue-600" };
      case 5:
        return { label: "Strong", color: "text-green-600" };
      default:
        return { label: "", color: "" };
    }
  };

  const validatePasswordChange = () => {
    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password");
      return false;
    }
    if (!passwordData.newPassword) {
      toast.error("Please enter a new password");
      return false;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return false;
    }
    if (getPasswordStrength(passwordData.newPassword) < 3) {
      toast.error("Please choose a stronger password");
      return false;
    }
    return true;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePasswordChange()) return;

    setChangingPassword(true);

    try {
      console.log("Changing password...");

      // Verify current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: passwordData.currentPassword
      });

      if (verifyError) {
        console.error("Current password verification failed:", verifyError);
        toast.error("Current password is incorrect");
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (updateError) {
        console.error("Password update failed:", updateError);
        toast.error("Failed to update password. Please try again.");
        return;
      }

      console.log("Password updated successfully");
      toast.success("Password updated successfully!");
      
      // Clear password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Unexpected error changing password:", error);
      toast.error("An unexpected error occurred while changing password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    try {
      console.log("Saving profile data:", profileData);

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name.trim(),
          last_name: profileData.last_name.trim(),
          company_name: profileData.company_name.trim(),
          business_type: profileData.business_type.trim(),
          phone: profileData.phone.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error("Error saving profile:", error);
        toast.error("Failed to save profile changes");
        return;
      }

      console.log("Profile saved successfully");
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Unexpected error saving profile:", error);
      toast.error("An unexpected error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1d4ed8]"></div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(passwordData.newPassword);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-[#1d4ed8] hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your account information and preferences</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Information Card */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and business information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500">
                        Email address cannot be changed from this page
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={profileData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        placeholder="Enter your company name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Input
                        id="businessType"
                        value={profileData.business_type}
                        onChange={(e) => handleInputChange('business_type', e.target.value)}
                        placeholder="e.g., Limited Company, Sole Trader, Partnership"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#1d4ed8] hover:bg-[#1d4ed8]/90"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Account Summary Card */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Account Status</p>
                      <p className="text-sm text-green-600">Active</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Member Since</p>
                      <p className="text-sm text-gray-600">{formatDate(profileData.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">User ID</p>
                      <p className="text-xs text-gray-500 font-mono break-all">{profileData.id}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Keep your business information up to date to ensure compliance with UK regulations.
                    </p>
                    <Button variant="outline" className="w-full">
                      View Compliance Status
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Password Change Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      placeholder="Enter your current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder="Enter your new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {passwordData.newPassword && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            passwordStrength <= 1 ? 'bg-red-500 w-1/5' :
                            passwordStrength === 2 ? 'bg-orange-500 w-2/5' :
                            passwordStrength === 3 ? 'bg-yellow-500 w-3/5' :
                            passwordStrength === 4 ? 'bg-blue-500 w-4/5' :
                            'bg-green-500 w-full'
                          }`}
                        />
                      </div>
                      <span className={`text-sm font-medium ${strengthInfo.color}`}>
                        {strengthInfo.label}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters with uppercase, lowercase, numbers, and symbols
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-sm text-red-600">Passwords do not match</p>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handlePasswordSubmit}
                    disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    variant="outline"
                    className="border-[#1d4ed8] text-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white"
                  >
                    {changingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <EmailPreferences />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
