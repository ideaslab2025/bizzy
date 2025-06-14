
export const FooterSection = () => {
  return (
    <footer className="bg-[#071629] border-t border-blue-900/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 touch-interaction-spacing">
          <div>
            <h3 className="font-bold mb-4 text-[#3b82f6] text-2xl">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base touch-target-standard">Features</a></li>
              <li><a href="#pricing" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base touch-target-standard">Pricing</a></li>
              <li><a href="#faqs" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base touch-target-standard">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-[#3b82f6] text-2xl">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base touch-target-standard">Blog</a></li>
              <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base touch-target-standard">Guides</a></li>
              <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base touch-target-standard">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-[#3b82f6] text-2xl">Company</h3>
            <ul className="space-y-3">
              <li><a href="#about" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base touch-target-standard">About Us</a></li>
              <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base touch-target-standard">Careers</a></li>
              <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base touch-target-standard">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-[#3b82f6] text-2xl">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base touch-target-standard">Terms</a></li>
              <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base touch-target-standard">Privacy</a></li>
              <li><a href="#" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base touch-target-standard">Cookies</a></li>
              <li><a href="/disclaimer" className="text-blue-100/70 hover:text-[#3b82f6] transition-colors text-base touch-target-standard">Disclaimer</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-900/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center touch-interaction-spacing">
          <p className="text-blue-100/70 mb-4 md:mb-0">© 2025 Bizzy. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" aria-label="Twitter" className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors touch-target-icon">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors touch-target-icon">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5v1.5c1-1.6 2.7-2.5 4.5-2.5 3.5 0 6 2.5 6 6.5v7.5h-5v-7c0-1-1-2-2-2h-1.5z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
