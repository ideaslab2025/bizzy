import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ArrowLeft, User, LogOut, Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

const GuidedHelp = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const guidanceCategories = [
    {
      title: "Starting a Business",
      description: "Guidance on registering your company, choosing a business structure, and more.",
      topics: [
        { name: "Company Registration", link: "/help/company-registration" },
        { name: "Business Structures", link: "/help/business-structures" },
        { name: "Funding Options", link: "/help/funding-options" },
      ],
    },
    {
      title: "Financial Management",
      description: "Help with bookkeeping, taxes, and managing your business finances.",
      topics: [
        { name: "Bookkeeping Basics", link: "/help/bookkeeping-basics" },
        { name: "Tax Obligations", link: "/help/tax-obligations" },
        { name: "Financial Planning", link: "/help/financial-planning" },
      ],
    },
    {
      title: "Legal Compliance",
      description: "Information on legal requirements, contracts, and data protection.",
      topics: [
        { name: "Contract Law", link: "/help/contract-law" },
        { name: "Data Protection", link: "/help/data-protection" },
        { name: "Employment Law", link: "/help/employment-law" },
      ],
    },
    {
      title: "HR & Employment",
      description: "Guidance on hiring, managing employees, and creating HR policies.",
      topics: [
        { name: "Hiring Employees", link: "/help/hiring-employees" },
        { name: "HR Policies", link: "/help/hr-policies" },
        { name: "Employee Management", link: "/help/employee-management" },
      ],
    },
    {
      title: "Sales & Marketing",
      description: "Tips on sales strategies, marketing, and customer relations.",
      topics: [
        { name: "Sales Strategies", link: "/help/sales-strategies" },
        { name: "Marketing Basics", link: "/help/marketing-basics" },
        { name: "Customer Relations", link: "/help/customer-relations" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" 
                  alt="Bizzy" 
                  className="h-12 w-auto" 
                />
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/" className="hover:text-primary">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span>Guided Help</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-[#0088cc] hover:underline">
                    Dashboard
                  </Link>
                  
                  {/* Account Dropdown with improved hover */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsAccountDropdownOpen(true)}
                    onMouseLeave={() => setIsAccountDropdownOpen(false)}
                  >
                    <DropdownMenu open={isAccountDropdownOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-2 text-gray-900 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 font-medium"
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
                      <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg z-50">
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/settings" className="flex items-center gap-2 w-full text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-2 py-2 cursor-pointer">
                            <User className="h-4 w-4" />
                            Account Settings
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
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-[#0088cc] hover:underline">
                    Login
                  </Link>
                  <Link to="/register">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Guided Help</h1>
        <p className="text-gray-700 mb-8">
          Explore our guided help resources to understand various aspects of running your business.
        </p>

        {/* Guidance Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guidanceCategories.map((category, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{category.title}</CardTitle>
                <CardDescription className="text-gray-600">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul>
                  {category.topics.map((topic, i) => (
                    <li key={i} className="mb-2">
                      <Link to={topic.link} className="text-[#0088cc] hover:underline">
                        {topic.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GuidedHelp;
