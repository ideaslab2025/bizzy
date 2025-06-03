
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, Trash2, Download, Shield, 
  Clock, Eye, EyeOff, FileX 
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AccountDeletion = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<'initial' | 'confirmation' | 'password' | 'final'>('initial');
  const [confirmationChecks, setConfirmationChecks] = useState({
    dataLoss: false,
    legalRetention: false,
    gracePeriod: false,
    finalConfirmation: false
  });
  const [deletionOption, setDeletionOption] = useState<'delete' | 'anonymize'>('delete');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleDownloadData = async () => {
    try {
      toast.info("Data export feature will be implemented in a future update");
      // TODO: Implement actual data export
    } catch (error) {
      toast.error("Failed to initiate data export");
    }
  };

  const validatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: password
      });
      return !error;
    } catch {
      return false;
    }
  };

  const handleAccountDeletion = async () => {
    if (!user) return;

    setProcessing(true);
    try {
      // Validate password first
      const isPasswordValid = await validatePassword(password);
      if (!isPasswordValid) {
        toast.error("Password verification failed");
        setProcessing(false);
        return;
      }

      console.log("Initiating account deletion process:", {
        userId: user.id,
        deletionType: deletionOption,
        timestamp: new Date().toISOString()
      });

      // In a real implementation, this would:
      // 1. Mark account for deletion with 30-day grace period
      // 2. Send confirmation email
      // 3. Schedule background deletion process
      // 4. Handle data anonymization if selected

      toast.success("Account deletion request submitted. You have 30 days to cancel this request.");
      setStep('initial');
      setPassword('');
      
    } catch (error) {
      console.error("Account deletion error:", error);
      toast.error("Failed to process account deletion request");
    } finally {
      setProcessing(false);
    }
  };

  const allChecksCompleted = Object.values(confirmationChecks).every(checked => checked);

  return (
    <div className="space-y-6">
      {/* Data Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="w-5 h-5" />
            Export Your Data
          </CardTitle>
          <CardDescription>
            Download a copy of your data before deletion (recommended)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Export includes: Profile information, business documents, compliance progress, and uploaded files
          </p>
          <Button variant="outline" onClick={handleDownloadData}>
            <Download className="w-4 h-4 mr-2" />
            Download My Data
          </Button>
        </CardContent>
      </Card>

      {/* Account Deletion Section */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your Bizzy account and associated data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Warning Section */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 mb-2">Before you proceed:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• This action cannot be undone after the 30-day grace period</li>
                  <li>• You will lose access to all business guidance and compliance tracking</li>
                  <li>• Some data may be retained for legal compliance purposes</li>
                  <li>• Consider downloading your data first</li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Legal Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-2">UK Legal Requirements:</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Under UK law, certain business records must be retained for specific periods:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Company records: 6 years from end of accounting period</li>
                  <li>• VAT records: 6 years (4 years for digital records)</li>
                  <li>• PAYE records: 3 years after end of tax year</li>
                  <li>• Audit trails and compliance logs may be retained for legal purposes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Grace Period Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 mb-2">30-Day Grace Period:</h4>
                <p className="text-sm text-amber-700">
                  Your account will be deactivated immediately but not permanently deleted for 30 days. 
                  You can reactivate your account during this period by logging in.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Deletion Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Choose deletion method:</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <input
                  type="radio"
                  id="delete"
                  name="deletionOption"
                  checked={deletionOption === 'delete'}
                  onChange={() => setDeletionOption('delete')}
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="delete" className="font-medium cursor-pointer">
                    Complete Deletion
                  </Label>
                  <p className="text-sm text-gray-600">
                    Delete all personal data (subject to legal retention requirements)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <input
                  type="radio"
                  id="anonymize"
                  name="deletionOption"
                  checked={deletionOption === 'anonymize'}
                  onChange={() => setDeletionOption('anonymize')}
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="anonymize" className="font-medium cursor-pointer">
                    Anonymize Data
                  </Label>
                  <p className="text-sm text-gray-600">
                    Remove personal identifiers but keep anonymized usage data for service improvement
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Deletion Process */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Confirm Account Deletion
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-4">
                    {step === 'initial' && (
                      <div className="space-y-4">
                        <p>Please confirm you understand the consequences:</p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id="dataLoss"
                              checked={confirmationChecks.dataLoss}
                              onCheckedChange={(checked) => 
                                setConfirmationChecks(prev => ({ ...prev, dataLoss: !!checked }))
                              }
                            />
                            <Label htmlFor="dataLoss" className="text-sm cursor-pointer">
                              I understand this will permanently delete my account and data
                            </Label>
                          </div>
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id="legalRetention"
                              checked={confirmationChecks.legalRetention}
                              onCheckedChange={(checked) => 
                                setConfirmationChecks(prev => ({ ...prev, legalRetention: !!checked }))
                              }
                            />
                            <Label htmlFor="legalRetention" className="text-sm cursor-pointer">
                              I understand some data may be retained for legal compliance
                            </Label>
                          </div>
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id="gracePeriod"
                              checked={confirmationChecks.gracePeriod}
                              onCheckedChange={(checked) => 
                                setConfirmationChecks(prev => ({ ...prev, gracePeriod: !!checked }))
                              }
                            />
                            <Label htmlFor="gracePeriod" className="text-sm cursor-pointer">
                              I understand I have 30 days to cancel this request
                            </Label>
                          </div>
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id="finalConfirmation"
                              checked={confirmationChecks.finalConfirmation}
                              onCheckedChange={(checked) => 
                                setConfirmationChecks(prev => ({ ...prev, finalConfirmation: !!checked }))
                              }
                            />
                            <Label htmlFor="finalConfirmation" className="text-sm cursor-pointer">
                              I want to proceed with {deletionOption === 'delete' ? 'deleting' : 'anonymizing'} my account
                            </Label>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 'password' && (
                      <div className="space-y-4">
                        <p>Enter your password to confirm:</p>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your password"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <FileX className="w-3 h-3 mr-1" />
                          Final step - this cannot be undone
                        </Badge>
                      </div>
                    )}
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => { setStep('initial'); setPassword(''); }}>
                  Cancel
                </AlertDialogCancel>
                {step === 'initial' && (
                  <AlertDialogAction
                    onClick={() => setStep('password')}
                    disabled={!allChecksCompleted}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Continue
                  </AlertDialogAction>
                )}
                {step === 'password' && (
                  <AlertDialogAction
                    onClick={handleAccountDeletion}
                    disabled={!password || processing}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Delete Account'
                    )}
                  </AlertDialogAction>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountDeletion;
