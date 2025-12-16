import { MainLayout } from "@/components/layout/MainLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MessageCircle,
  Mail,
  FileText,
  Zap,
  HelpCircle,
  BookOpen,
  Video,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Send,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FAQ {
  question: string;
  answer: string;
  category: string;
  helpful?: number;
  notHelpful?: number;
}

const faqs: FAQ[] = [
  // Getting Started
  {
    category: "Getting Started",
    question: "How do I get started with Career Compass?",
    answer:
      "Getting started is easy! First, create an account and upload your resume. Then, navigate to the Analyze page and paste a job description you're interested in. Our AI will analyze the match and provide detailed insights within seconds.",
    helpful: 45,
    notHelpful: 2,
  },
  {
    category: "Getting Started",
    question: "What formats are supported for resume upload?",
    answer:
      "We support PDF, DOCX, and TXT files up to 5MB. You can also paste your resume text directly or link your LinkedIn profile for automatic parsing.",
    helpful: 38,
    notHelpful: 1,
  },
  {
    category: "Getting Started",
    question: "Do I need to create an account?",
    answer:
      "Yes, an account is required to save your analyses, track your progress, and access personalized recommendations. Creating an account is free and takes less than a minute.",
    helpful: 32,
    notHelpful: 3,
  },

  // Features
  {
    category: "Features",
    question: "How does the job matching work?",
    answer:
      "Our AI analyzes both your resume and the job description, extracting skills, experience, and requirements. It then calculates a match score based on how well your profile aligns with the job requirements, considering factors like required skills, experience level, and qualifications.",
    helpful: 67,
    notHelpful: 4,
  },
  {
    category: "Features",
    question: "Can I analyze multiple jobs at once?",
    answer:
      "Yes! You can analyze as many jobs as you want. All your analyses are saved in your dashboard where you can compare them side by side and track your progress over time.",
    helpful: 52,
    notHelpful: 2,
  },
  {
    category: "Features",
    question: "How do I improve my match score?",
    answer:
      "Check the Recommendations section after each analysis. We provide personalized suggestions for skills to learn, experiences to highlight, and specific actions to take. You can also use the Skills page to track your progress on recommended skills.",
    helpful: 78,
    notHelpful: 1,
  },
  {
    category: "Features",
    question: "What information does the analysis provide?",
    answer:
      "Each analysis includes: overall match score, matched skills, missing skills, areas for improvement, your strengths, and personalized recommendations. You can also see a detailed breakdown of how each skill contributes to your match score.",
    helpful: 61,
    notHelpful: 3,
  },

  // Account & Privacy
  {
    category: "Account & Privacy",
    question: "Is my data secure?",
    answer:
      "Yes! We use industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit. We never share your personal data with third parties, and you can delete your data at any time from the settings page.",
    helpful: 89,
    notHelpful: 0,
  },
  {
    category: "Account & Privacy",
    question: "Can I delete my account?",
    answer:
      "Yes, you can permanently delete your account from the Settings page. This will remove all your data including resumes, job analyses, and personal information. This action cannot be undone.",
    helpful: 41,
    notHelpful: 2,
  },
  {
    category: "Account & Privacy",
    question: "How do I change my password?",
    answer:
      "Go to Settings > Security and click 'Change Password'. You'll need to enter your current password and then your new password twice to confirm.",
    helpful: 35,
    notHelpful: 1,
  },

  // Technical
  {
    category: "Technical",
    question: "How accurate are the match scores?",
    answer:
      "Our matching algorithm has been trained on thousands of successful job placements and achieves over 85% accuracy in predicting interview callbacks. However, remember that match scores are one factor - your unique experiences and soft skills also matter greatly.",
    helpful: 72,
    notHelpful: 5,
  },
  {
    category: "Technical",
    question: "Why is my analysis taking so long?",
    answer:
      "Most analyses complete in 10-30 seconds. If it's taking longer, it might be due to high server load or a very detailed job description. Try refreshing the page. If the issue persists, contact support.",
    helpful: 28,
    notHelpful: 4,
  },
  {
    category: "Technical",
    question: "The app isn't working properly. What should I do?",
    answer:
      "First, try clearing your browser cache and cookies, then refresh the page. Make sure you're using a modern browser (Chrome, Firefox, Safari, or Edge). If issues persist, contact our support team with details about the problem.",
    helpful: 44,
    notHelpful: 2,
  },

  // Billing
  {
    category: "Billing",
    question: "Is Career Compass free?",
    answer:
      "Yes! Career Compass is completely free to use. All core features including job analysis, skill tracking, and recommendations are available at no cost.",
    helpful: 95,
    notHelpful: 1,
  },
];

const videoTutorials = [
  {
    title: "Getting Started with Career Compass",
    duration: "3:45",
    thumbnail: "🎬",
    description: "Learn the basics and analyze your first job",
  },
  {
    title: "Understanding Your Match Score",
    duration: "5:20",
    description: "Deep dive into how match scores are calculated",
    thumbnail: "📊",
  },
  {
    title: "Improving Your Profile",
    duration: "4:15",
    description: "Tips to optimize your resume and skills",
    thumbnail: "⭐",
  },
];

const popularArticles = [
  { title: "How to write an ATS-friendly resume", views: 1234, icon: FileText },
  {
    title: "Top 10 skills employers look for in 2024",
    views: 987,
    icon: TrendingUp,
  },
  { title: "Preparing for technical interviews", views: 856, icon: BookOpen },
];

const quickLinks = [
  {
    icon: FileText,
    title: "Documentation",
    description: "Detailed guides and tutorials",
    link: "#docs",
  },
  {
    icon: Zap,
    title: "Quick Start",
    description: "Get started in 5 minutes",
    link: "#quickstart",
  },
  {
    icon: MessageCircle,
    title: "Community",
    description: "Join our Discord server",
    link: "#community",
  },
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [feedbackGiven, setFeedbackGiven] = useState<Set<number>>(new Set());
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium",
  });
  const { toast } = useToast();

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(faqs.map((faq) => faq.category))),
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFeedback = (index: number, helpful: boolean) => {
    if (feedbackGiven.has(index)) {
      toast({
        title: "Already submitted",
        description: "You've already provided feedback for this article.",
      });
      return;
    }

    setFeedbackGiven(new Set(feedbackGiven).add(index));
    toast({
      title: "Thank you!",
      description: `Your feedback helps us improve our help center.`,
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "Our support team will get back to you within 24 hours.",
    });

    // Reset form
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      priority: "medium",
    });
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Help Center
          </h1>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions and get support
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help articles, FAQs, tutorials..."
            className="pl-12 py-6 text-base bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <div
              key={link.title}
              className="glass-card rounded-xl p-5 text-center hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                <link.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {link.description}
              </p>
            </div>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground text-xl">
              Popular Articles
            </h2>
          </div>
          <div className="space-y-3">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/5 transition-colors cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <article.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {article.views.toLocaleString()} views
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Video className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground text-xl">
              Video Tutorials
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videoTutorials.map((video, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-3 flex items-center justify-center text-4xl">
                  {video.thumbnail}
                </div>
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                  {video.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {video.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Video className="h-3 w-3" />
                  {video.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section with Categories */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display font-semibold text-foreground text-xl">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Category Tabs */}
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="space-y-4"
          >
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="capitalize"
                >
                  {category === "all" ? "All" : category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">
                    No results found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or browse by category
                  </p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border border-border rounded-lg px-4 data-[state=open]:bg-muted/30 data-[state=open]:border-primary/50"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p className="text-muted-foreground">{faq.answer}</p>

                        {/* Feedback Section */}
                        <div className="flex items-center gap-4 pt-2 border-t border-border">
                          <span className="text-sm text-muted-foreground">
                            Was this helpful?
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleFeedback(index, true)}
                              disabled={feedbackGiven.has(index)}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              {faq.helpful || 0}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleFeedback(index, false)}
                              disabled={feedbackGiven.has(index)}
                            >
                              <ThumbsDown className="h-3 w-3" />
                              {faq.notHelpful || 0}
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Contact Support Form */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground text-xl">
              Contact Support
            </h2>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={contactForm.priority}
                  onValueChange={(value) =>
                    setContactForm({ ...contactForm, priority: value })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Describe your issue or question in detail..."
                rows={5}
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="gradient-primary w-full sm:w-auto gap-2"
            >
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </form>
        </div>

        {/* Still Need Help CTA */}
        <div className="glass-card rounded-xl p-8 text-center gradient-primary text-primary-foreground">
          <CheckCircle2 className="h-10 w-10 mx-auto mb-4" />
          <h2 className="font-display font-semibold text-xl mb-2">
            Can't find what you're looking for?
          </h2>
          <p className="opacity-90 max-w-md mx-auto mb-6">
            Our support team is available 24/7 to help you with any questions or
            issues.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 border-0 gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Live Chat
            </Button>
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 border-0 gap-2"
            >
              <Mail className="h-4 w-4" />
              Email Support
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
