
const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header - Made logo bigger to match homepage */}
      <header className="border-b border-border sticky top-0 z-50 bg-background backdrop-blur-md shadow-md">
        <div className="container mx-auto py-0 px-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/502b3627-55d4-4915-b44e-a2aa01e5751e.png" alt="Bizzy Logo" className="h-40" />
          </a>
          
          <div className="flex gap-2">
            <a href="/login" className="px-4 py-2 text-[#1d4ed8] hover:text-[#3b82f6] transition">
              Log in
            </a>
            <a href="/register" className="px-4 py-2 bg-[#1d4ed8] hover:bg-[#1d4ed8]/80 rounded text-white transition">
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-[#3b82f6]">Disclaimer</h1>
        
        <div className="space-y-8 text-blue-100/90 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#3b82f6]">Your Business Guidance, Professionally Assured</h2>
            <p className="text-lg">
              Bizzy provides comprehensive step-by-step guidance across every aspect of getting your new UK business started (post formation), telling you everything you need to do across finance, payroll, tax, HR, Gov.UK services, paperwork and beyond. We walk alongside you at every stage, breaking down complex processes into clear, actionable steps, so you know exactly what you need to do (guidance + documents).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#3b82f6]">Quality You Can Trust</h2>
            <p className="text-lg">
              All our guidance pathways and document library have been meticulously developed with input from qualified accountants, lawyers, and HR professionals, then regularly updated by our Bizzy team to reflect current UK regulations and best practices. This means you're getting the same foundational knowledge and documentation that advisors charge hundreds of pounds to provide - all integrated into one affordable platform that guides you through each process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#3b82f6]">Important Notice</h2>
            <p className="text-lg mb-4">
              While our guidance is professionally informed and quality-assured, it remains guidance under UK law rather than regulated advice. This distinction is important under UK law as it means:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg ml-4">
              <li>Bizzy guides you step-by-step through what needs doing and exactly how to do it</li>
              <li>On top of this guidance we provide a comprehensive document library that you can tailor to your company's specific details (pre-written, but tailored with your company details for speed).</li>
              <li>We connect you directly to relevant government services and other services and walk you through the requirements of what you need to do, step by step, category by category, department by department.</li>
              <li>We explain each process with interactive short videos, guided text, and clear next steps, through our Bizzy platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#3b82f6]">When You Might Need Additional Support or Professional Advice</h2>
            <p className="text-lg mb-4">
              Our platform handles the vast majority of standard business needs through detailed, sequential guidance. However, you may wish to seek regulated professional advice for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg ml-4">
              <li>Specific recommendations for your exact situation</li>
              <li>Complex tax structuring or unusual circumstances related to your business</li>
              <li>Specific legal disputes or non-standard contracts</li>
              <li>Bespoke financial planning or investment decisions</li>
            </ul>
            <p className="text-lg mt-4">
              Think of Bizzy as your expert business operations team - providing the complete roadmap, guiding you through each step, supplying the right documents, and ensuring you know exactly what to do next, while being clear about when specialist input might benefit your unique situation.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#071629] border-t border-blue-900/30 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-100/70">© 2025 Bizzy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Disclaimer;
