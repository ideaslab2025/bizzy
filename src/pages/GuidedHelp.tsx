
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CheckCircle, Play, ExternalLink, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { Link } from "react-router-dom";
import type { Json } from "@/integrations/supabase/types";

interface GuidanceSection {
  id: number;
  title: string;
  description: string;
  order_number: number;
  icon: string;
}

interface GuidanceStep {
  id: number;
  section_id: number;
  title: string;
  content: string;
  video_url?: string;
  external_links: Json;
  order_number: number;
}

interface UserProgress {
  section_id: number;
  step_id: number;
  completed: boolean;
}

const GuidedHelp = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState<GuidanceSection[]>([]);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [steps, setSteps] = useState<GuidanceStep[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    fetchSections();
    if (user) {
      fetchProgress();
    }
  }, [user]);

  useEffect(() => {
    if (currentSection) {
      fetchSteps(currentSection);
    }
  }, [currentSection]);

  const fetchSections = async () => {
    const { data, error } = await supabase
      .from('guidance_sections')
      .select('*')
      .order('order_number');
    
    if (data && !error) {
      setSections(data);
    }
  };

  const fetchSteps = async (sectionId: number) => {
    const { data, error } = await supabase
      .from('guidance_steps')
      .select('*')
      .eq('section_id', sectionId)
      .order('order_number');
    
    if (data && !error) {
      setSteps(data);
      setCurrentStep(1);
    }
  };

  const fetchProgress = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_guidance_progress')
      .select('section_id, step_id, completed')
      .eq('user_id', user.id);
    
    if (data && !error) {
      setProgress(data);
    }
  };

  const markStepCompleted = async (stepId: number) => {
    if (!user) return;
    
    await supabase
      .from('user_guidance_progress')
      .upsert({
        user_id: user.id,
        section_id: currentSection,
        step_id: stepId,
        completed: true,
        last_visited_at: new Date().toISOString()
      });
    
    fetchProgress();
  };

  const isSectionCompleted = (sectionId: number) => {
    const sectionSteps = steps.filter(step => step.section_id === sectionId);
    const completedSteps = progress.filter(p => p.section_id === sectionId && p.completed);
    return sectionSteps.length > 0 && sectionSteps.length === completedSteps.length;
  };

  const getCurrentStepData = () => {
    return steps.find(step => step.order_number === currentStep);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1);
      setCurrentStep(1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      // We'll set to last step of previous section
      const prevSectionSteps = steps.filter(step => step.section_id === currentSection - 1);
      setCurrentStep(prevSectionSteps.length);
    }
  };

  const skipSection = () => {
    if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1);
      setCurrentStep(1);
    }
  };

  const currentStepData = getCurrentStepData();
  
  // Helper function to safely parse external links
  const getExternalLinks = (links: Json): Array<{ title: string; url: string }> => {
    if (Array.isArray(links)) {
      return links.filter((link): link is { title: string; url: string } => 
        typeof link === 'object' && 
        link !== null && 
        typeof (link as any).title === 'string' && 
        typeof (link as any).url === 'string'
      );
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar - Blue */}
      <div className="w-80 bg-[#0088cc] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/lovable-uploads/0fe1641f-b619-4877-9023-1095fd1e0df1.png" alt="Bizzy Logo" className="h-8" />
            <span className="font-bold text-xl">Bizzy</span>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex-1 p-6">
          <h2 className="text-lg font-semibold mb-6">Your Business Setup Journey</h2>
          <div className="space-y-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.order_number)}
                className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all ${
                  currentSection === section.order_number
                    ? 'bg-white text-[#0088cc]'
                    : 'hover:bg-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  isSectionCompleted(section.id)
                    ? 'bg-green-500 text-white'
                    : currentSection === section.order_number
                    ? 'bg-[#0088cc] text-white'
                    : 'bg-white/20'
                }`}>
                  {isSectionCompleted(section.id) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    section.order_number
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium">{section.title}</div>
                  <div className="text-sm opacity-75">{section.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area - White */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {sections.find(s => s.order_number === currentSection)?.title}
            </h1>
            <p className="text-gray-600">
              Step {currentStep} of {steps.length}
            </p>
          </div>
          <Button 
            onClick={() => setShowChatbot(true)}
            className="bg-[#0088cc] hover:bg-[#0088cc]/90"
          >
            Talk to Bizzy
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          {currentStepData && (
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {currentStepData.title}
              </h2>

              {/* Video Section */}
              {currentStepData.video_url && (
                <div className="mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <Button variant="outline" size="lg" className="gap-2">
                          <Play className="w-5 h-5" />
                          Watch Video Guide
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">
                        30-60 second video explanation
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Content */}
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="prose max-w-none">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {currentStepData.content}
                    </p>
                  </div>

                  {/* External Links */}
                  {getExternalLinks(currentStepData.external_links).length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold mb-3">Helpful Resources:</h3>
                      <div className="space-y-2">
                        {getExternalLinks(currentStepData.external_links).map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#0088cc] hover:underline"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mark as Complete */}
              <div className="mb-8">
                <Button
                  onClick={() => currentStepData && markStepCompleted(currentStepData.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-gray-50 p-6 flex justify-between items-center border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentSection === 1 && currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={skipSection}
              disabled={currentSection === sections.length}
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip Section
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={currentSection === sections.length && currentStep === steps.length}
              className="bg-[#0088cc] hover:bg-[#0088cc]/90"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 h-[500px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-[#0088cc] text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full overflow-hidden">
                  <AspectRatio ratio={1}>
                    <img 
                      src="/lovable-uploads/0fe1641f-b619-4877-9023-1095fd1e0df1.png" 
                      alt="Bizzy" 
                      className="w-full h-full object-contain"
                    />
                  </AspectRatio>
                </div>
                <span className="font-medium">Talk to Bizzy</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={() => setShowChatbot(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="flex-1 p-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm">
                  Hi! I'm here to help you with your business setup journey. What questions do you have about this step?
                </p>
              </div>
            </div>
            
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input 
                  placeholder="Ask me anything..." 
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button className="bg-[#0088cc] hover:bg-[#0088cc]/90">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidedHelp;
