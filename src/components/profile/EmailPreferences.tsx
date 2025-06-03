
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, Bell, Clock, Calendar, Settings, 
  FileText, Building2, Calculator, Users,
  Eye, Save, CheckCircle
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface EmailPreference {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  category: 'compliance' | 'progress' | 'platform' | 'marketing';
}

interface DeadlineReminder {
  id: string;
  label: string;
  enabled: boolean;
}

interface NotificationTiming {
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  deadlineReminders: string[];
  preferredTime: 'morning' | 'afternoon' | 'evening';
}

const EmailPreferences = () => {
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);

  const [emailPreferences, setEmailPreferences] = useState<EmailPreference[]>([
    // Compliance deadline reminders
    {
      id: 'hmrc-deadlines',
      label: 'HMRC Deadline Reminders',
      description: 'Corporation Tax, Self Assessment, and other HMRC filing deadlines',
      icon: <Building2 className="w-4 h-4" />,
      enabled: true,
      category: 'compliance'
    },
    {
      id: 'companies-house',
      label: 'Companies House Filings',
      description: 'Annual returns, confirmation statements, and statutory filings',
      icon: <FileText className="w-4 h-4" />,
      enabled: true,
      category: 'compliance'
    },
    {
      id: 'vat-returns',
      label: 'VAT Return Deadlines',
      description: 'Quarterly VAT submission reminders and payment dates',
      icon: <Calculator className="w-4 h-4" />,
      enabled: true,
      category: 'compliance'
    },
    {
      id: 'paye-submissions',
      label: 'PAYE Submissions',
      description: 'Monthly PAYE, RTI submissions, and payroll deadlines',
      icon: <Users className="w-4 h-4" />,
      enabled: false,
      category: 'compliance'
    },
    
    // Progress updates
    {
      id: 'weekly-progress',
      label: 'Weekly Progress Summaries',
      description: 'Overview of your compliance progress and completed tasks',
      icon: <CheckCircle className="w-4 h-4" />,
      enabled: true,
      category: 'progress'
    },
    {
      id: 'milestone-achievements',
      label: 'Milestone Notifications',
      description: 'Celebrations when you complete major compliance milestones',
      icon: <Calendar className="w-4 h-4" />,
      enabled: true,
      category: 'progress'
    },

    // Platform updates
    {
      id: 'new-features',
      label: 'New Feature Announcements',
      description: 'Updates about new Bizzy features and improvements',
      icon: <Settings className="w-4 h-4" />,
      enabled: true,
      category: 'platform'
    },
    {
      id: 'guidance-updates',
      label: 'Guidance Updates',
      description: 'New business guidance and compliance information',
      icon: <FileText className="w-4 h-4" />,
      enabled: true,
      category: 'platform'
    },
    {
      id: 'regulatory-changes',
      label: 'UK Regulatory Changes',
      description: 'Important updates affecting UK business compliance',
      icon: <Bell className="w-4 h-4" />,
      enabled: true,
      category: 'platform'
    },

    // Marketing communications
    {
      id: 'product-updates',
      label: 'Product Updates',
      description: 'Information about Bizzy improvements and new services',
      icon: <Mail className="w-4 h-4" />,
      enabled: false,
      category: 'marketing'
    },
    {
      id: 'tips-insights',
      label: 'Business Tips & Insights',
      description: 'Weekly tips, best practices, and business insights',
      icon: <Eye className="w-4 h-4" />,
      enabled: false,
      category: 'marketing'
    }
  ]);

  const [deadlineReminders, setDeadlineReminders] = useState<DeadlineReminder[]>([
    { id: '1-week', label: '1 week before', enabled: true },
    { id: '2-weeks', label: '2 weeks before', enabled: true },
    { id: '1-month', label: '1 month before', enabled: false }
  ]);

  const [notificationTiming, setNotificationTiming] = useState<NotificationTiming>({
    frequency: 'weekly',
    deadlineReminders: ['1-week', '2-weeks'],
    preferredTime: 'morning'
  });

  const togglePreference = (id: string) => {
    setEmailPreferences(prev => 
      prev.map(pref => 
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const toggleDeadlineReminder = (id: string) => {
    setDeadlineReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving email preferences:', {
        preferences: emailPreferences,
        deadlineReminders,
        notificationTiming
      });
      
      toast.success("Email preferences updated successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save email preferences");
    } finally {
      setSaving(false);
    }
  };

  const getPreviewContent = (preferenceId: string) => {
    const previews: Record<string, { subject: string; content: string }> = {
      'hmrc-deadlines': {
        subject: '🚨 HMRC Corporation Tax Deadline - 1 Week Remaining',
        content: 'Your Corporation Tax return is due on 31st December 2024. Complete your filing now to avoid penalties.'
      },
      'weekly-progress': {
        subject: '📊 Your Weekly Compliance Progress',
        content: 'This week you completed 3 compliance tasks. Your overall progress is 78% complete.'
      },
      'new-features': {
        subject: '🎉 New Feature: Automated VAT Calculations',
        content: 'We\'ve added automatic VAT calculation to make your quarterly returns even easier.'
      },
      'tips-insights': {
        subject: '💡 Tip of the Week: Expense Management',
        content: 'Did you know you can claim business mileage at 45p per mile for the first 10,000 miles?'
      }
    };
    
    return previews[preferenceId] || { subject: 'Preview not available', content: 'This is how your notification would appear.' };
  };

  const categorizePreferences = (category: string) => {
    return emailPreferences.filter(pref => pref.category === category);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      compliance: <FileText className="w-5 h-5" />,
      progress: <CheckCircle className="w-5 h-5" />,
      platform: <Settings className="w-5 h-5" />,
      marketing: <Mail className="w-5 h-5" />
    };
    return icons[category];
  };

  const getCategoryTitle = (category: string) => {
    const titles: Record<string, string> = {
      compliance: 'Compliance Deadlines',
      progress: 'Progress Updates',
      platform: 'Platform Updates', 
      marketing: 'Marketing Communications'
    };
    return titles[category];
  };

  return (
    <div className="space-y-6">
      {/* Email Categories */}
      {['compliance', 'progress', 'platform', 'marketing'].map(category => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {getCategoryIcon(category)}
              {getCategoryTitle(category)}
            </CardTitle>
            <CardDescription>
              {category === 'compliance' && 'Stay on top of important UK business compliance deadlines'}
              {category === 'progress' && 'Track your business setup and compliance progress'}
              {category === 'platform' && 'Stay informed about Bizzy updates and regulatory changes'}
              {category === 'marketing' && 'Optional communications about products and insights'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categorizePreferences(category).map(preference => (
              <div key={preference.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{preference.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Label htmlFor={preference.id} className="text-sm font-medium cursor-pointer">
                        {preference.label}
                      </Label>
                      {category === 'marketing' && (
                        <Badge variant="outline" className="text-xs">Optional</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{preference.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(showPreview === preference.id ? null : preference.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Switch
                    id={preference.id}
                    checked={preference.enabled}
                    onCheckedChange={() => togglePreference(preference.id)}
                  />
                </div>
              </div>
            ))}
            
            {/* Preview Panel */}
            {showPreview && categorizePreferences(category).some(p => p.id === showPreview) && (
              <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                <h4 className="text-sm font-medium mb-2">Email Preview:</h4>
                <div className="bg-white border rounded p-3">
                  <div className="text-sm font-medium mb-1">
                    {getPreviewContent(showPreview).subject}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getPreviewContent(showPreview).content}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Notification Timing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5" />
            Notification Timing
          </CardTitle>
          <CardDescription>
            Customize when and how often you receive email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Frequency Settings */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Email Frequency</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'immediate', label: 'Immediate' },
                { value: 'daily', label: 'Daily Digest' },
                { value: 'weekly', label: 'Weekly Digest' },
                { value: 'monthly', label: 'Monthly Summary' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setNotificationTiming(prev => ({ ...prev, frequency: option.value as any }))}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    notificationTiming.frequency === option.value
                      ? 'border-[#1d4ed8] bg-[#1d4ed8] text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Deadline Reminder Timing */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Deadline Reminder Timing</Label>
            <div className="space-y-3">
              {deadlineReminders.map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between">
                  <Label htmlFor={`reminder-${reminder.id}`} className="text-sm cursor-pointer">
                    {reminder.label}
                  </Label>
                  <Switch
                    id={`reminder-${reminder.id}`}
                    checked={reminder.enabled}
                    onCheckedChange={() => toggleDeadlineReminder(reminder.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Preferred Time */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Best Time to Receive Emails</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'morning', label: 'Morning', time: '9-12' },
                { value: 'afternoon', label: 'Afternoon', time: '12-17' },
                { value: 'evening', label: 'Evening', time: '17-20' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setNotificationTiming(prev => ({ ...prev, preferredTime: option.value as any }))}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    notificationTiming.preferredTime === option.value
                      ? 'border-[#1d4ed8] bg-[#1d4ed8] text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs opacity-80">{option.time}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
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
              Save Email Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EmailPreferences;
