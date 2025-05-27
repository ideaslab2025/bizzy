import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, ArrowRight, User, LogOut, BookOpen, FileText, Video, MessageCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

const GuidedHelp = () => {
  const { user, signOut } = useAuth();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const guidanceCategories = [
    {
      id: "hr",
      title: "HR & Employment",
      description: "Set up your workforce management",
      icon: <User className="h-6 w-6" />,
      progress: 75,
      totalSteps: 8,
      completedSteps: 6,
      estimatedTime: "2-3 hours",
      steps: [
        { title: "Employee Handbook", completed: true, type: "document" },
        { title: "Employment Contracts", completed: true, type: "document" },
        { title: "Payroll Setup", completed: true, type: "guide" },
        { title: "Workplace Pension", completed: true, type: "guide" },
        { title: "Health & Safety Policy", completed: true, type: "document" },
        { title: "GDPR Compliance", completed: true, type: "guide" },
        { title: "Recruitment Process", completed: false, type: "guide" },
        { title: "Performance Management", completed: false, type: "document" }
      ]
    },
    {
      id: "finance",
      title: "Finance & Accounting",
      description: "Manage your business finances",
      icon: <BookOpen className="h-6 w-6" />,
      progress: 60,
      totalSteps: 10,
      completedSteps: 6,
      estimatedTime: "3-4 hours",
      steps: [
        { title: "Business Bank Account", completed: true, type: "guide" },
        { title: "Accounting Software Setup", completed: true, type: "guide" },
        { title: "Chart of Accounts", completed: true, type: "document" },
        { title: "Invoice Templates", completed: true, type: "document" },
        { title: "Expense Policies", completed: true, type: "document" },
        { title: "Financial Reporting", completed: true, type: "guide" },
        { title: "Cash Flow Management", completed: false, type: "guide" },
        { title: "Credit Control", completed: false, type: "document" },
        { title: "Budget Planning", completed: false, type: "guide" },
        { title: "Financial Controls", completed: false, type: "document" }
      ]
    },
    {
      id: "tax",
      title: "Tax & Compliance",
      description: "Stay compliant with UK regulations",
      icon: <FileText className="h-6 w-6" />,
      progress: 40,
      totalSteps: 12,
      completedSteps: 5,
      estimatedTime: "4-5 hours",
      steps: [
        { title: "Corporation Tax Registration", completed: true, type: "guide" },
        { title: "VAT Registration", completed: true, type: "guide" },
        { title: "PAYE Setup", completed: true, type: "guide" },
        { title: "Annual Returns", completed: true, type: "document" },
        { title: "Tax Calendar", completed: true, type: "document" },
        { title: "Making Tax Digital", completed: false, type: "guide" },
        { title: "Tax Planning", completed: false, type: "guide" },
        { title: "Record Keeping", completed: false, type: "document" },
        { title: "Tax Reliefs", completed: false, type: "guide" },
        { title: "Compliance Checklist", completed: false, type: "document" },
        { title: "Self Assessment", completed: false, type: "guide" },
        { title: "Tax Deadlines", completed: false, type: "document" }
      ]
    },
    {
      id: "operations",
      title: "Operations & Marketing",
      description: "Build your business operations",
      icon: <ArrowRight className="h-6 w-6" />,
      progress: 25,
      totalSteps: 15,
      completedSteps: 4,
      estimatedTime: "5-6 hours",
      steps: [
        { title: "Business Plan", completed: true, type: "document" },
        { title: "Marketing Strategy", completed: true, type: "guide" },
        { title: "Website Setup", completed: true, type: "guide" },
        { title: "Social Media", completed: true, type: "guide" },
        { title: "Brand Guidelines", completed: false, type: "document" },
        { title: "Customer Database", completed: false, type: "guide" },
        { title: "Sales Process", completed: false, type: "guide" },
        { title: "Quality Assurance", completed: false, type: "document" },
        { title: "Supplier Management", completed: false, type: "guide" },
        { title: "Inventory System", completed: false, type: "guide" },
        { title: "Customer Service", completed: false, type: "document" },
        { title: "Data Backup", completed: false, type: "guide" },
        { title: "Insurance Review", completed: false, type: "guide" },
        { title: "Legal Compliance", completed: false, type: "document" },
        { title: "Growth Planning", completed: false, type: "guide" }
      ]
    }
  ];

  const overallProgress = Math.round(
    guidanceCategories.reduce((acc, cat) => acc + cat.progress, 0) / guidanceCategories.length
  );

  const totalSteps = guidanceCategories.reduce((acc, cat) => acc + cat.totalSteps, 0);
  const completedSteps = guidanceCategories.reduce((acc, cat) => acc + cat.completedSteps, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-16" />
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsAccountDropdownOpen(true)}
                onMouseLeave={() => setIsAccountDropdownOpen(false)}
              >
                <DropdownMenu open={isAccountDropdownOpen} onOpenChange={setIsAccountDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 font-medium"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white">
                        {user?.user_metadata?.company_name?.charAt(0)?.toUpperCase() || 
                         user?.user_metadata?.first_name?.charAt(0)?.toUpperCase() || 
                         user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span>
                        {user?.user_metadata?.company_name || 
                         (user?.user_metadata?.first_name 
                           ? `${user.user_metadata.first_name.charAt(0).toUpperCase() + user.user_metadata.first_name.slice(1)}`
                           : user?.email?.split('@')[0] || 'Account')}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg z-50">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center gap-2 w-full text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-2 py-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-red-600 focus:text-red-600 hover:bg-red-50 cursor-pointer px-2 py-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Guided Help</h1>
              <p className="text-gray-600 mt-2">Complete step-by-step guidance to get your business running smoothly</p>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Overall Progress</h2>
                  <p className="text-blue-100">You've completed {completedSteps} out of {totalSteps} steps</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{overallProgress}%</div>
                  <p className="text-blue-100">Complete</p>
                </div>
              </div>
              <Progress value={overallProgress} className="h-3 bg-blue-400" />
            </CardContent>
          </Card>
        </div>

        {/* Guidance Categories */}
        <div className="grid gap-6">
          {guidanceCategories.map((category) => (
            <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription className="text-gray-600">{category.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{category.progress}%</div>
                    <div className="text-sm text-gray-500">{category.completedSteps}/{category.totalSteps} steps</div>
                    <Badge variant="secondary" className="mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {category.estimatedTime}
                    </Badge>
                  </div>
                </div>
                <Progress value={category.progress} className="mt-3 h-2" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-3">
                  {category.steps.map((step, index) => (
                    <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      step.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                    }`}>
                      <div className={`flex-shrink-0 ${
                        step.completed 
                          ? 'text-green-600' 
                          : 'text-gray-400'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-current"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          step.completed ? 'text-green-900' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {step.type === 'document' && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Document
                          </Badge>
                        )}
                        {step.type === 'guide' && (
                          <Badge variant="outline" className="text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Guide
                          </Badge>
                        )}
                        {step.type === 'video' && (
                          <Badge variant="outline" className="text-xs">
                            <Video className="h-3 w-3 mr-1" />
                            Video
                          </Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant={step.completed ? "secondary" : "default"}
                          className="text-xs"
                        >
                          {step.completed ? 'Review' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-700 mb-4">
              Our AI assistant Bizzy is here to help you with any questions about your business setup process.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask Bizzy
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuidedHelp;
