import React from "react";
import { Link } from "next/link";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a192f] backdrop-blur supports-[backdrop-filter]:bg-[#0a192f]/95 border-b border-white/10">
        <div className="container max-w-7xl mx-auto py-3 px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center font-bold text-white">
            <AspectRatio ratio={16 / 9} className="w-40">
              <img
                src="/lovable-uploads/0fe1641f-b619-4877-9023-1095fd1e0df1.png"
                alt="Bizzy Logo"
                className="object-contain"
              />
            </AspectRatio>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
          </nav>
          <div className="space-x-4">
            <Link href="/login" className="hidden md:inline-block text-[#1d4ed8] hover:underline">
              Log In
            </Link>
            <Link href="/sign-up">
              <Button className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-md shadow-sm transition-colors">
                Sign Up
              </Button>
            </Link>
            <Button variant="outline" size="icon" aria-label="Toggle menu" className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-[#0f1419] to-[#0a192f]">
          <div className="container max-w-5xl mx-auto text-center px-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4">
              Start, Run, and Grow Your Business with Bizzy
            </h1>
            <p className="text-xl text-blue-100/80 mb-8">
              Your all-in-one platform for business success. From initial setup to ongoing growth, Bizzy provides the tools, resources, and support you need to thrive.
            </p>
            <div className="space-x-4">
              <Link href="/sign-up">
                <Button className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-md shadow-sm transition-colors text-lg px-8 py-3">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="text-white hover:text-blue-100 border-blue-500 hover:border-blue-400 transition-colors text-lg px-8 py-3">
                  View Pricing
                </Button>
              </Link>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <img
                src="/hero-image.png"
                alt="Abstract background"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full object-cover hero-image"
              />
            </div>
          </div>
        </section>

        {/* Meet Bizzy Section - Compressed */}
        <section id="meet-bizzy" className="py-6 bg-gradient-to-b from-[#0a192f] to-slate-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
              <div className="py-12 px-6">
                <h2 className="text-3xl font-bold text-white mb-2">Meet Bizzy</h2>
                <p className="text-blue-100/80 my-8">
                  Bizzy is your AI-powered business assistant, designed to simplify the complexities of starting and running a business.
                </p>
                <div className="py-8">
                  <Link href="/about">
                    <Button className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-md shadow-sm transition-colors">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <AspectRatio ratio={1}>
                  <img
                    src="/lovable-uploads/0fe1641f-b619-4877-9023-1095fd1e0df1.png"
                    alt="Bizzy AI Assistant"
                    className="object-contain rounded-lg shadow-xl"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="pt-12 pb-8 bg-gradient-to-b from-slate-900 to-[#0a192f]">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 text-white">Everything You Need to Start Your Business</h2>
            <p className="text-xl mb-10 text-center text-blue-100/80 max-w-3xl mx-auto">Bizzy provides all the tools and guidance you need to navigate the complex world of business set-up administration</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {/* Feature 1 - Step-by-Step Guidance - Updated with your improved code */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-blue-500/30 via-blue-700/30 to-blue-900/40 border border-blue-700/50 shadow-lg transform transition-all hover:scale-105 hover:shadow-blue-500/20 hover:shadow-xl group">
                {/* Professionally Assured Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3" fill="currentColor" />
                    <span>Professionally Assured</span>
                  </div>
                </div>
                
                <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-bl-full"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="p-3 z-10 relative flex flex-col h-full">
                  {/* Increased image container height and adjusted positioning */}
                  <div className="w-full h-[200px] mx-auto flex items-end justify-center">
                    <img 
                      src="/lovable-uploads/35ad1d99-4078-450d-ac41-27dce4da642c.png" 
                      alt="Step-by-Step Guidance" 
                      className="max-w-full h-[180px] object-contain transform scale-110 translate-y-4"
                      style={{ maxWidth: '85%' }}
                    />
                  </div>
                  
                  {/* Adjusted spacing to align with other boxes */}
                  <div className="mt-6 mb-4">
                    <h3 className="text-lg font-bold text-[#3b82f6] mb-2 text-center">
                      Step-by-Step Guidance
                    </h3>
                    <p className="text-blue-100 text-center text-sm">
                      Comprehensive step by step guidance across HR, Finance, Accounting, Payroll, Compliance and more, with skippable sections
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 - AI Assistant */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-purple-500/30 via-purple-700/30 to-purple-900/40 border border-purple-700/50 shadow-lg transform transition-all hover:scale-105 hover:shadow-purple-500/20 hover:shadow-xl group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-bl-full"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="p-3 z-10 relative flex flex-col h-full">
                  <div className="w-full h-[200px] mx-auto flex items-end justify-center">
                    <img 
                      src="/lovable-uploads/0fe1641f-b619-4877-9023-1095fd1e0df1.png" 
                      alt="AI Assistant" 
                      className="max-w-full h-[180px] object-contain transform scale-110 translate-y-4"
                      style={{ maxWidth: '85%' }}
                    />
                  </div>
                  <div className="mt-6 mb-4">
                    <h3 className="text-lg font-bold text-[#9333ea] mb-2 text-center">
                      AI Assistant
                    </h3>
                    <p className="text-blue-100 text-center text-sm">
                      Get instant answers to your business questions with our AI-powered assistant, Bizzy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 - Document Generation */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-green-500/30 via-green-700/30 to-green-900/40 border border-green-700/50 shadow-lg transform transition-all hover:scale-105 hover:shadow-green-500/20 hover:shadow-xl group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-green-500/10 rounded-bl-full"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-500/5 rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="p-3 z-10 relative flex flex-col h-full">
                  <div className="w-full h-[200px] mx-auto flex items-end justify-center">
                    <img 
                      src="/lovable-uploads/4999a944-9e20-46c8-a9ae-bca989a49324.png" 
                      alt="Document Generation" 
                      className="max-w-full h-[180px] object-contain transform scale-110 translate-y-4"
                      style={{ maxWidth: '85%' }}
                    />
                  </div>
                  <div className="mt-6 mb-4">
                    <h3 className="text-lg font-bold text-[#16a34a] mb-2 text-center">
                      Document Generation
                    </h3>
                    <p className="text-blue-100 text-center text-sm">
                      Generate essential business documents quickly and easily, including contracts, policies, and more.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 4 - Expert Consultations */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-orange-500/30 via-orange-700/30 to-orange-900/40 border border-orange-700/50 shadow-lg transform transition-all hover:scale-105 hover:shadow-orange-500/20 hover:shadow-xl group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/10 rounded-bl-full"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/5 rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="p-3 z-10 relative flex flex-col h-full">
                  <div className="w-full h-[200px] mx-auto flex items-end justify-center">
                    <img 
                      src="/consultation-icon.png" 
                      alt="Expert Consultations" 
                      className="max-w-full h-[180px] object-contain transform scale-110 translate-y-4"
                      style={{ maxWidth: '85%' }}
                    />
                  </div>
                  <div className="mt-6 mb-4">
                    <h3 className="text-lg font-bold text-[#ea580c] mb-2 text-center">
                      Expert Consultations
                    </h3>
                    <p className="text-blue-100 text-center text-sm">
                      Connect with industry experts for personalized advice and guidance on your business journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Disclaimer Links - Positioned to straddle under first two boxes */}
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

        {/* Pricing Section */}
        <section id="pricing" className="py-16 bg-gradient-to-b from-[#0a192f] to-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8 text-white">Simple and Transparent Pricing</h2>
            <p className="text-xl text-blue-100/80 text-center max-w-3xl mx-auto mb-12">
              Choose the plan that fits your needs. No hidden fees, no surprises.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="relative overflow-hidden rounded-xl bg-slate-800 border border-slate-700 shadow-lg perspective-1000">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
                <div className="p-6 flex flex-col h-full pricing-card">
                  <h3 className="text-2xl font-semibold text-white mb-4">Free</h3>
                  <div className="text-blue-100 mb-4">
                    <span className="text-4xl font-bold">$0</span> / month
                  </div>
                  <ul className="mb-6 flex-grow">
                    <li className="py-2 border-b border-slate-700 last:border-none text-blue-100 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-green-500 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      Basic Guidance
                    </li>
                    <li className="py-2 border-b border-slate-700 last:border-none text-blue-100 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-green-500 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      Limited AI Support
                    </li>
                    <li className="py-2 border-b border-slate-700 last:border-none text-blue-100 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle text-red-500 mr-2"><circle cx="12" cy="12" r="10"></circle><line x1="15" x2="9" y1="9" y2="15"></line><line x1="9" x2="15" y1="9" y2="15"></line></svg>
                      Community Support Only
                    </li>
                  </ul>
                  <Button className="bg-green-500 hover:bg-green-400 text-white rounded-md shadow-sm transition-colors mt-auto pricing-button">
                    Get Started Free
                  </Button>
                </div>
              </div>

              {/* Standard Plan */}
              <div className="relative overflow-hidden rounded-xl bg-slate-800 border border-slate-700 shadow-lg transform scale-105 z-10 perspective-1000">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-pink-500"></div>
                <div className="p-6 flex flex-col h-full pricing-card">
                  <h3 className="text-2xl font-semibold text-white mb-4">Standard</h3>
                  <div className="text-blue-100 mb-4">
                    <span className="text-4xl font-bold">$49</span> / month
                  </div>
                  <ul className="mb-6 flex-grow">
                    <li className="py-2 border-b border-slate-700 last:border-none text-blue-100 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-green-500 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      Comprehensive Guidance
                    </li>
                    <li className="py-2 border-b border-slate-700 last:border-none text-blue-100 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-green-500 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      Unlimited AI Support
                    </li>
                    <li className="py-2 border-b border-slate-700 last:border-none text-blue-100 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-green-500 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      Email &amp; Chat Support
                    </li>
                  </ul>
                  <Button className="bg-purple-500 hover:bg-purple-400 text-white rounded-md shadow-sm transition-colors mt-auto pricing-button">
                    Start Standard
                  </Button>
                </div>
              </div>

              {/* Platinum Plan */}
              <div className="relative overflow-hidden rounded-xl bg-slate-50 border border-slate-200 shadow-lg perspective-1000">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-red-500"></div>
                <div className="p-6 flex flex-col h-full pricing-card">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Platinum</h3>
                  <div className="text-gray-600 mb-4">
                    <span className="text-4xl font-bold">$99</span> / month
                  </div>
                  <ul className="mb-6 flex-grow">
                    <li className="py-2 border-b border-slate-200 last:border-none text-gray-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-green-500 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      Everything in Standard
                    </li>
                    <li className="py-2 border-b border-slate-200 last:border-none text-gray-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-green-500 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      Priority Support
                    </li>
                    <li className="py-2 border-b border-slate-200 last:border-none text-gray-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-green-500 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      Expert Consultations
                    </li>
                  </ul>
                  <Button className="bg-yellow-500 hover:bg-yellow-400 text-gray-800 rounded-md shadow-sm transition-colors mt-auto pricing-button">
                    Start Platinum
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-gradient-to-b from-slate-900 to-[#0a192f]">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8 text-white">Contact Us</h2>
            <p className="text-xl text-blue-100/80 text-center max-w-3xl mx-auto mb-12">
              Have questions? Our team is here to help. Reach out to us and we'll get back to you as soon as possible.
            </p>

            <div className="max-w-3xl mx-auto">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-blue-100">Name</label>
                  <input type="text" id="name" className="mt-1 block w-full rounded-md shadow-sm bg-slate-700 border-slate-600 text-blue-100 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] sm:text-sm" placeholder="Your Name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-blue-100">Email</label>
                  <input type="email" id="email" className="mt-1 block w-full rounded-md shadow-sm bg-slate-700 border-slate-600 text-blue-100 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] sm:text-sm" placeholder="Your Email" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-blue-100">Message</label>
                  <textarea id="message" rows={4} className="mt-1 block w-full rounded-md shadow-sm bg-slate-700 border-slate-600 text-blue-100 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] sm:text-sm" placeholder="Your Message"></textarea>
                </div>
                <div>
                  <Button className="w-full bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-md shadow-sm transition-colors">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
