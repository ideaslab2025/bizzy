
import { forwardRef } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQSection = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section id="faqs" ref={ref} className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-[#3b82f6]">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full touch-interaction-spacing">
            <AccordionItem value="item-1" className="border-blue-900/30">
              <AccordionTrigger className="text-blue-100 hover:text-[#3b82f6] touch-target-large">What's included in the Bizzy platform?</AccordionTrigger>
              <AccordionContent className="text-blue-100/80">
                Bizzy provides everything you need after forming your UK company: step-by-step guided walkthroughs for all business setup tasks (tax registration, banking, insurance, HR, compliance), a comprehensive library of legal document templates, AI-powered assistance, video tutorials, and direct links to official government services - all in one organized platform.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-blue-900/30">
              <AccordionTrigger className="text-blue-100 hover:text-[#3b82f6]">Is this advice or just guidance?</AccordionTrigger>
              <AccordionContent className="text-blue-100/80">
                Bizzy provides practical guidance, templates, and educational information to help you understand and complete business administration tasks. We are not an advice firm or accountancy practice and cannot provide personalised legal, tax, or financial advice. Our templates and guides are created and pre assured by professionals though, to save you time and money, but should be adapted to your specific situation. For complex matters, we'll clearly indicate when you should consult a qualified professional.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-blue-900/30">
              <AccordionTrigger className="text-blue-100 hover:text-[#3b82f6]">Who is Bizzy designed for?</AccordionTrigger>
              <AccordionContent className="text-blue-100/80">
                Bizzy is perfect for first-time UK company directors, sole traders transitioning to limited companies, and small business owners who want to handle their own administration properly. Whether you've just registered at Companies House or are catching up on compliance, our platform guides you through everything you need to do - no prior business experience required.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-blue-900/30">
              <AccordionTrigger className="text-blue-100 hover:text-[#3b82f6]">How much time will Bizzy save me?</AccordionTrigger>
              <AccordionContent className="text-blue-100/80">
                Most new business owners spend 100+ hours researching and completing setup tasks across multiple websites and services. Bizzy consolidates everything into one platform with clear, actionable steps. Our users typically complete their entire business setup 75% faster, avoiding costly mistakes and missed deadlines along the way.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border-blue-900/30">
              <AccordionTrigger className="text-blue-100 hover:text-[#3b82f6]">Do I need to pay for Bizzy if I already have an accountant?</AccordionTrigger>
              <AccordionContent className="text-blue-100/80">
                Bizzy complements professional advisers perfectly. While your accountant handles tax returns and financial advice, Bizzy helps with everything else: employment contracts, health & safety policies, data protection compliance, insurance decisions, and dozens of other tasks that accountants typically don't cover. Plus, being better organized saves you accountancy fees.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6" className="border-blue-900/30">
              <AccordionTrigger className="text-blue-100 hover:text-[#3b82f6]">What makes Bizzy different from free government websites?</AccordionTrigger>
              <AccordionContent className="text-blue-100/80">
                Government websites provide official information but can be overwhelming and fragmented across multiple departments. Bizzy curates and organizes everything into a logical journey, adds practical examples, provides ready-to-use templates, tracks your progress, sends deadline reminders, and explains not just what to do but why it matters - all in plain English.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7" className="border-blue-900/30">
              <AccordionTrigger className="text-blue-100 hover:text-[#3b82f6]">How current is the information and what about law changes?</AccordionTrigger>
              <AccordionContent className="text-blue-100/80">
                Our content is reviewed and updated quarterly by UK business professionals. When laws change (like tax rates or employment regulations), we update affected sections and notify active users. Your one-off payment includes 12 months of updates, ensuring you're always working with current requirements.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8" className="border-blue-900/30">
              <AccordionTrigger className="text-blue-100 hover:text-[#3b82f6]">Can I complete sections in any order or at my own pace?</AccordionTrigger>
              <AccordionContent className="text-blue-100/80">
                Absolutely! While we recommend a logical sequence (some tasks depend on others being completed first), you can jump to any section you need. Mark sections as complete, skip items that don't apply to your business, and return anytime. Your progress is saved automatically, and there's no time limit on access.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
});

FAQSection.displayName = "FAQSection";
