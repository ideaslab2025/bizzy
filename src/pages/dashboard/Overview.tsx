
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, FileText, Users, TrendingUp, ArrowRight, Play, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDocuments } from "@/hooks/useDocuments";
import { supabase } from "@/integrations/supabase/client";

interface GuidanceSection {
  id: number;
  title: string;
  description: string;
  order_number: number;
}

interface UserProgress {
  section_id: number;
  section_completed: boolean;
}

const Overview = () => {
  const { user } = useAuth();
  const { documents, stats: documentStats, loading: documentsLoading } = useDocuments();
  const [sections, setSections] = useState<GuidanceSection[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchSections();
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchSections = async () => {
    const { data, error } = await supabase
      .from('guidance_sections')
      .select('*')
      .order('order_number');
    
    if (data && !error) {
      setSections(data);
    }
  };

  const fetchProgress = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_guidance_progress')
      .select('section_id, section_completed')
      .eq('user_id', user.id)
      .eq('section_completed', true);
    
    if (data && !error) {
      setProgress(data);
      const completedSectionIds = data.map(item => item.section_id);
      setCompletedSections(new Set(completedSectionIds));
    }
  };

  const completionPercentage = sections.length > 0 ? Math.round((completedSections.size / sections.length) * 100) : 0;
  
  // Get popular documents (required ones)
  const popularDocuments = documents.filter(doc => doc.is_required).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your business setup</p>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Setup Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#0088cc]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedSections.size} of {sections.length} sections completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-[#0088cc]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentStats.completed}</div>
            <p className="text-xs text-muted-foreground">
              of {documentStats.required} required completed
            </p>
            <Progress value={documentStats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Steps</CardTitle>
            <Clock className="h-4 w-4 text-[#0088cc]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sections.length - completedSections.size}
            </div>
            <p className="text-xs text-muted-foreground">sections remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completionPercentage > 50 ? 'On Track' : 'Getting Started'}
            </div>
            <p className="text-xs text-muted-foreground">
              {completionPercentage > 50 ? 'Great progress!' : 'Keep going!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-[#0088cc]" />
              Continue Your Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Pick up where you left off with your business setup guide.</p>
            <div className="space-y-2">
              {sections.slice(0, 3).map((section) => {
                const isCompleted = completedSections.has(section.id);
                return (
                  <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : section.order_number}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{section.title}</p>
                        <p className="text-xs text-gray-500">{section.description}</p>
                      </div>
                    </div>
                    {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                );
              })}
            </div>
            <Button asChild className="w-full">
              <Link to="/guided-help">
                Continue Guide <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#0088cc]" />
              Essential Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Get started with these important business documents.</p>
            <div className="space-y-2">
              {!documentsLoading && popularDocuments.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{document.title}</p>
                    <p className="text-xs text-gray-500">{document.description?.substring(0, 60)}...</p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
              ))}
              {documentsLoading && (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              )}
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/documents">
                View All Documents <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium">Account Created Successfully</p>
                <p className="text-sm text-gray-600">You've joined Bizzy and can now access all features</p>
              </div>
            </div>
            {completedSections.size > 0 && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <Play className="w-8 h-8 text-[#0088cc]" />
                <div>
                  <p className="font-medium">Started Business Setup Guide</p>
                  <p className="text-sm text-gray-600">You've completed {completedSections.size} section{completedSections.size !== 1 ? 's' : ''}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
