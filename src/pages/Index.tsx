import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star, ArrowRight, Users, FileText, BarChart3, MessageSquare, Clock, Shield, Zap } from 'lucide-react';
import { useDemoContent, DemoContainer, DemoScrollIndicator } from '@/components/demo';
import StatisticsSection from '@/components/StatisticsSection';
import Testimonials from '@/components/Testimonials';

const Index = () => {
  const { demoContent, isLoading } = useDemoContent();

  const scrollToDemo = () => {
    const demoSection = document.getElementById('interactive-demo');
    if (demoSection) {
      const offsetTop = demoSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-300">
              🚀 AI-Powered Business Setup
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Start Your UK Business
              <span className="text-blue-600 block">in Minutes, Not Months</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              From company formation to compliance, taxes, and beyond. Bizzy's AI assistant guides you through every step of building a successful UK business.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Start Your Business Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToDemo}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg"
            >
              See How It Works
            </Button>
          </motion.div>

          <DemoScrollIndicator className="mt-8" />
        </div>
      </section>

      {/* Statistics Section */}
      <StatisticsSection />

      {/* Why Choose Bizzy Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Bizzy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've simplified business setup with AI-powered guidance, comprehensive templates, and expert support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                title: "AI-Powered Setup",
                description: "Our intelligent assistant guides you through every step, making complex processes simple and fast."
              },
              {
                icon: <FileText className="h-8 w-8 text-blue-600" />,
                title: "200+ Templates",
                description: "Professional documents, contracts, and compliance templates ready to customize for your business."
              },
              {
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                title: "Expert Support",
                description: "Real UK business experts available when you need help navigating regulations and requirements."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex p-4 bg-blue-100 rounded-full mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything You Need Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Everything You Need After Forming Your Company
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From compliance tracking to business banking, we've got every aspect of your business journey covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
                title: "Compliance Tracking",
                description: "Never miss a deadline with automated reminders for VAT, Corporation Tax, and annual filings."
              },
              {
                icon: <Users className="h-6 w-6 text-blue-600" />,
                title: "HR & Employment",
                description: "Employment contracts, payroll setup, and workplace policies - all ready to customize."
              },
              {
                icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
                title: "Financial Management",
                description: "Accounting software integration, expense tracking, and financial reporting made simple."
              },
              {
                icon: <Shield className="h-6 w-6 text-orange-600" />,
                title: "Legal Protection",
                description: "Terms of service, privacy policies, and contract templates from UK legal experts."
              },
              {
                icon: <MessageSquare className="h-6 w-6 text-red-600" />,
                title: "Marketing Assets",
                description: "Website templates, social media content, and branding guidelines to grow your business."
              },
              {
                icon: <Clock className="h-6 w-6 text-teal-600" />,
                title: "Ongoing Support",
                description: "24/7 AI assistant plus access to real business advisors when you need expert guidance."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section - REPOSITIONED HERE */}
      <motion.section
        id="interactive-demo"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 bg-white"
      >
        <div className="container mx-auto max-w-7xl">
          {!isLoading && demoContent.length > 0 && (
            <DemoContainer demoData={demoContent} className="w-full" />
          )}
        </div>
      </motion.section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your UK Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of entrepreneurs who've simplified their business setup with Bizzy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Start Your Business Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                Schedule a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
