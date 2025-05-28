
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Clock, Users, Building, FileText, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const GuidedHelp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const guides = [
    {
      id: 1,
      title: "Business Registration & Setup",
      description: "Complete guide to registering your business in the UK",
      category: "Foundation",
      difficulty: "Beginner",
      estimatedTime: "2-3 hours",
      steps: 12,
      completedSteps: 0,
      tags: ["Registration", "Legal", "Mandatory"],
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: 2,
      title: "VAT Registration Process",
      description: "When and how to register for VAT in the UK",
      category: "Tax & Finance",
      difficulty: "Intermediate",
      estimatedTime: "1-2 hours",
      steps: 8,
      completedSteps: 0,
      tags: ["VAT", "Tax", "HMRC"],
      color: "bg-green-50 border-green-200"
    },
    {
      id: 3,
      title: "Employment Law Basics",
      description: "Understanding your obligations when hiring employees",
      category: "HR & Employment",
      difficulty: "Intermediate",
      estimatedTime: "3-4 hours",
      steps: 15,
      completedSteps: 0,
      tags: ["Employment", "Legal", "HR"],
      color: "bg-purple-50 border-purple-200"
    },
    {
      id: 4,
      title: "Data Protection (GDPR) Compliance",
      description: "Ensuring your business complies with UK GDPR requirements",
      category: "Legal & Compliance",
      difficulty: "Advanced",
      estimatedTime: "4-5 hours",
      steps: 20,
      completedSteps: 0,
      tags: ["GDPR", "Privacy", "Compliance"],
      color: "bg-orange-50 border-orange-200"
    },
    {
      id: 5,
      title: "Business Insurance Guide",
      description: "Understanding what insurance your business needs",
      category: "Risk Management",
      difficulty: "Beginner",
      estimatedTime: "1-2 hours",
      steps: 6,
      completedSteps: 0,
      tags: ["Insurance", "Protection", "Risk"],
      color: "bg-indigo-50 border-indigo-200"
    },
    {
      id: 6,
      title: "Corporation Tax Basics",
      description: "Understanding and managing your corporation tax obligations",
      category: "Tax & Finance",
      difficulty: "Intermediate",
      estimatedTime: "2-3 hours",
      steps: 10,
      completedSteps: 0,
      tags: ["Corporation Tax", "HMRC", "Finance"],
      color: "bg-teal-50 border-teal-200"
    }
  ];

  const categories = [
    { name: "All Guides", count: guides.length },
    { name: "Foundation", count: guides.filter(g => g.category === "Foundation").length },
    { name: "Tax & Finance", count: guides.filter(g => g.category === "Tax & Finance").length },
    { name: "HR & Employment", count: guides.filter(g => g.category === "HR & Employment").length },
    { name: "Legal & Compliance", count: guides.filter(g => g.category === "Legal & Compliance").length },
    { name: "Risk Management", count: guides.filter(g => g.category === "Risk Management").length }
  ];

  const filteredGuides = guides.filter(guide =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Guided Help</h1>
                <p className="text-gray-600">Step-by-step guidance for your business needs</p>
              </div>
            </div>
            
            {/* Account Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsAccountDropdownOpen(true)}
              onMouseLeave={() => setIsAccountDropdownOpen(false)}
            >
              <DropdownMenu open={isAccountDropdownOpen} onOpenChange={setIsAccountDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 font-medium"
                  >
                    <User className="h-4 w-4" />
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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search guides, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.name}
                variant="outline"
                className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Card key={guide.id} className={`${guide.color} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getDifficultyColor(guide.difficulty)}>
                    {guide.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {guide.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{guide.title}</CardTitle>
                <CardDescription className="text-sm">
                  {guide.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>{guide.completedSteps}/{guide.steps} steps</span>
                  </div>
                  <Progress 
                    value={(guide.completedSteps / guide.steps) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{guide.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{guide.steps} steps</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {guide.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  {guide.completedSteps > 0 ? "Continue Guide" : "Start Guide"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No guides found matching your search.</p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-white/80">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-600">24</CardTitle>
              <CardDescription>Total Guides Available</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-white/80">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-green-600">0</CardTitle>
              <CardDescription>Guides Completed</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-white/80">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-purple-600">~15h</CardTitle>
              <CardDescription>Estimated Total Time</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuidedHelp;
