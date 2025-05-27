
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, ArrowRight, User, LogOut, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0088cc] border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-12" />
            </div>

            {/* Right side - Navigation */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div 
                className="relative"
                onMouseEnter={() => setShowNotifications(true)}
                onMouseLeave={() => setShowNotifications(false)}
              >
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="relative text-white hover:text-white hover:bg-white/20"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">New guidance available</p>
                        <p className="text-gray-600">VAT registration guide has been updated</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Document ready</p>
                        <p className="text-gray-600">Your employee handbook is ready for download</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Consultation reminder</p>
                        <p className="text-gray-600">Your meeting is scheduled for tomorrow at 2 PM</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 text-white hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {user?.user_metadata?.company_name || 
                       (user?.user_metadata?.first_name 
                         ? `${user.user_metadata.first_name.charAt(0).toUpperCase() + user.user_metadata.first_name.slice(1)}`
                         : user?.email?.split('@')[0] || 'Account')}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings" className="flex items-center gap-2 w-full text-gray-700 hover:text-gray-900 cursor-pointer">
                      <User className="h-4 w-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'there'}!
          </h1>
          <p className="text-gray-600">Here's your business setup progress and next steps.</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#0088cc] mb-2">65%</div>
              <Progress value={65} className="h-2" />
              <p className="text-sm text-gray-600 mt-2">3 of 5 sections complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Next Step</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Tax Registration</span>
              </div>
              <p className="text-sm text-gray-600">Complete your VAT registration process</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Company Formation</span>
              </div>
              <p className="text-sm text-gray-600">Your company is officially registered</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Continue Your Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Pick up where you left off with your business setup guidance.
              </p>
              <Link to="/guided-help">
                <Button className="bg-[#0088cc] hover:bg-[#0088cc]/90 w-full">
                  Continue Setup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Talk to Bizzy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Get instant help and answers to your business questions.
              </p>
              <Button variant="outline" className="w-full">
                Start Conversation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
