
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Overview = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to your Bizzy Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Setup Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-[#0088cc] w-[45%]"></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              12 of 28 tasks completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-2">
              Documents available based on your business profile
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Gold</div>
            <p className="text-xs text-muted-foreground mt-2">
              Access to 85% of platform features
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Continue Setup</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                { 
                  title: "Complete your company profile", 
                  description: "Add company logo, mission statement and other important details",
                  completion: 75
                },
                { 
                  title: "Set up your tax information", 
                  description: "Provide tax registration details to generate appropriate documentation",
                  completion: 30
                },
                { 
                  title: "Review HR policies", 
                  description: "Ensure your business has all required HR documentation in place",
                  completion: 0
                },
                { 
                  title: "Set up banking information", 
                  description: "Add your business bank account details for a complete profile",
                  completion: 0
                }
              ].map((task, index) => (
                <div key={index} className="flex items-center gap-4 p-4">
                  <div className="w-8 h-8 rounded-full bg-[#0088cc]/20 flex items-center justify-center">
                    {task.completion === 100 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0088cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : (
                      <span className="text-xs font-bold text-[#0088cc]">{task.completion}%</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <button className="text-[#0088cc] text-sm font-medium hover:underline">
                    {task.completion > 0 && task.completion < 100 ? "Continue" : "Start"}
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommended Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "VAT Registration Guide",
              type: "Guide",
              description: "Step-by-step process for UK VAT registration"
            },
            {
              title: "Employee Handbook Template",
              type: "Document",
              description: "Customizable template for company policies"
            },
            {
              title: "Year-End Tax Filing",
              type: "Video",
              description: "How to prepare for your first tax return"
            }
          ].map((resource, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-2 bg-[#0088cc]"></div>
              <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>{resource.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{resource.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
