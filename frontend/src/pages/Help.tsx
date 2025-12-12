import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, Mail, FileText, Zap, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does the job matching work?",
    answer: "Our AI analyzes both your resume and the job description, extracting skills, experience, and requirements. It then calculates a match score based on how well your profile aligns with the job requirements."
  },
  {
    question: "Is my data secure?",
    answer: "Yes! We use industry-standard encryption and never store your personal data longer than necessary. You can delete your data at any time from the settings page."
  },
  {
    question: "How accurate are the match scores?",
    answer: "Our matching algorithm has been trained on thousands of successful job placements and achieves over 85% accuracy in predicting interview callbacks."
  },
  {
    question: "Can I analyze multiple jobs at once?",
    answer: "Yes, with a Pro account you can analyze up to 50 jobs simultaneously and compare them side by side."
  },
  {
    question: "What formats are supported for resume upload?",
    answer: "We support PDF, DOCX, and TXT files up to 5MB. You can also paste your resume text directly or link your LinkedIn profile."
  },
  {
    question: "How do I improve my match score?",
    answer: "Check the Recommendations section after each analysis. We provide personalized suggestions for skills to learn, experiences to highlight, and actions to take."
  },
];

const quickLinks = [
  { icon: FileText, title: "Documentation", description: "Detailed guides and tutorials" },
  { icon: Zap, title: "Quick Start", description: "Get started in 5 minutes" },
  { icon: MessageCircle, title: "Community", description: "Join our Discord server" },
];

export default function Help() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-foreground">Help Center</h1>
          <p className="text-muted-foreground mt-2">Find answers to common questions</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for help..." 
            className="pl-12 py-6 text-base bg-card border-border"
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <div 
              key={link.title}
              className="glass-card rounded-xl p-5 text-center hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-3">
                <link.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display font-semibold text-foreground text-xl">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-4 data-[state=open]:bg-muted/30"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Section */}
        <div className="glass-card rounded-xl p-8 text-center gradient-primary text-primary-foreground">
          <Mail className="h-10 w-10 mx-auto mb-4" />
          <h2 className="font-display font-semibold text-xl">Still need help?</h2>
          <p className="opacity-90 mt-2 max-w-md mx-auto">
            Our support team is here to help you with any questions or issues.
          </p>
          <Button variant="secondary" className="mt-6 bg-white/20 hover:bg-white/30 border-0">
            Contact Support
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
