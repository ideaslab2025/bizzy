
import { Star } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section id="features" className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#3b82f6]">Everything You Need After Forming Your Company</h2>
        <p className="text-xl mb-10 text-center text-blue-100/80 max-w-3xl mx-auto">Bizzy provides all the tools and guidance you need to navigate the complex world of business set-up administration</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {/* Feature 1 - Step-by-Step Guidance */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-blue-500/30 via-blue-700/30 to-blue-900/40 border border-blue-700/50 shadow-lg transform transition-all hover:scale-105 hover:shadow-blue-500/20 hover:shadow-xl group">
            <div className="absolute top-3 right-3 z-20">
              <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3" fill="currentColor" />
                <span>Professionally Assured</span>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-bl-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-3 z-10 relative flex flex-col h-full">
              <div className="w-full h-[200px] mx-auto flex items-end justify-center pt-16">
                <img src="/lovable-uploads/35ad1d99-4078-450d-ac41-27dce4da642c.png" alt="Step-by-Step Guidance" className="h-[170px] object-contain scale-125 translate-y-3" style={{maxWidth: '90%'}} />
              </div>
              <div className="mt-6 mb-4">
                <h3 className="text-lg font-bold text-[#3b82f6] mb-2 text-center">Step-by-Step Guidance</h3>
                <p className="text-blue-100 text-center text-sm">Comprehensive step by step guidance across HR, Finance, Accounting, Payroll, Compliance and more, with skippable sections </p>
              </div>
            </div>
          </div>
          
          {/* Feature 2 - Document Engine */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-blue-400/30 via-blue-600/30 to-blue-800/40 border border-blue-600/50 shadow-lg transform transition-all hover:scale-105 hover:shadow-blue-500/20 hover:shadow-xl group">
            <div className="absolute top-3 right-3 z-20">
              <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3" fill="currentColor" />
                <span>Professionally Assured</span>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-bl-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-3 z-10 relative flex flex-col h-full">
              <div className="w-full h-[240px] mx-auto flex items-center justify-center translate-y-4">
                <img src="/lovable-uploads/90f74494-efee-4fb1-9e17-f1398ff68008.png" alt="Document Engine" className="max-w-full max-h-[230px] object-contain" />
              </div>
              <h3 className="text-lg font-bold text-[#3b82f6] mb-1 text-center">Document Engine</h3>
              <p className="text-blue-100 text-center text-sm">
                Access hundreds of pre-approved templates for every business need, automatically populated with your company details.
              </p>
            </div>
          </div>
          
          {/* Feature 3 - Bizzy AI Assistant */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-blue-500/30 via-blue-700/30 to-blue-900/40 border border-blue-700/50 shadow-lg transform transition-all hover:scale-105 hover:shadow-blue-500/20 hover:shadow-xl group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-bl-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-3 z-10 relative flex flex-col h-full">
              <div className="w-full h-[240px] mx-auto flex items-center justify-center">
                <img src="/lovable-uploads/a4589c72-9113-4641-a8bd-1d23e740ac0d.png" alt="Bizzy AI Assistant" className="max-w-full max-h-[230px] object-contain" />
              </div>
              <h3 className="text-lg font-bold text-[#3b82f6] mb-1 text-center">Bizzy AI Assistant</h3>
              <p className="text-blue-100 text-center text-sm">
                Get real-time help from our AI assistant, pointing you to resources and answering your questions instantly.
              </p>
            </div>
          </div>
          
          {/* Feature 4 - Video Explainers */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-blue-400/30 via-blue-600/30 to-blue-800/40 border border-blue-600/50 shadow-lg transform transition-all hover:scale-105 hover:shadow-blue-500/20 hover:shadow-xl group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-bl-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-3 z-10 relative flex flex-col h-full">
              <div className="w-full h-[240px] mx-auto flex items-center justify-center">
                <img src="/lovable-uploads/13ddab9c-cf4d-4451-99b7-a0e7c8d24062.png" alt="Video Explainers" className="max-w-full max-h-[230px] object-contain" />
              </div>
              <h3 className="text-lg font-bold text-[#3b82f6] mb-1 text-center">Video Explainers</h3>
              <p className="text-blue-100 text-center text-sm">
                Watch short 30-60 second video explainers on key process steps to quickly understand complex business procedures.
              </p>
            </div>
          </div>
        </div>
        
        {/* Disclaimer Links */}
        <div className="flex justify-start max-w-5xl mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
            <div className="md:col-span-2 lg:col-span-2 flex justify-center">
              <a href="/disclaimer" className="text-blue-300 hover:text-blue-100 text-sm underline">
                Read our disclaimer
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
