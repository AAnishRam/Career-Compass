import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { JobInputForm } from "@/components/analysis/JobInputForm";
import { Sparkles, Zap, Shield, Clock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { analyzeJob } from "@/services/jobs.service";
import { toast } from "sonner";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description: "Advanced algorithms analyze your fit for any job posting",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get detailed matching insights in seconds",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is processed securely and stored safely",
  },
  {
    icon: Clock,
    title: "Save Hours",
    description: "Know where to focus your application efforts",
  },
];

export default function Analyze() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    location: "",
    jobDescription: "",
  });

  const analyzeMutation = useMutation({
    mutationFn: analyzeJob,
    onSuccess: (data) => {
      toast.success("Job analysis completed!");
      // Navigate to results page with the job ID
      navigate(`/results?jobId=${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to analyze job. Please try again.");
    },
  });

  const handleAnalyze = (data: {
    jobDescription: string;
    resumeText: string;
  }) => {
    // Extract job title and company from description (simple heuristic)
    const lines = data.jobDescription.split("\n").filter((line) => line.trim());
    const jobTitle = lines[0]?.trim() || "Job Position";
    const company = lines[1]?.trim() || "Company";

    analyzeMutation.mutate({
      jobTitle,
      company,
      location: formData.location || undefined,
      jobDescription: data.jobDescription,
    });
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Analyze Job <span className="text-gradient">Match</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Paste a job description and your resume to get an instant analysis
            of how well you match the requirements.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <JobInputForm
              onAnalyze={handleAnalyze}
              isLoading={analyzeMutation.isPending}
            />
          </div>

          {/* Features Sidebar */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground mb-4">
              Why Use JobMatch?
            </h3>
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card rounded-xl p-4 flex items-start gap-4 animate-slide-up"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Tips Card */}
            <div className="glass-card rounded-xl p-5 border-l-4 border-l-primary mt-6">
              <h4 className="font-display font-semibold text-foreground">
                Pro Tip
              </h4>
              <p className="text-sm text-muted-foreground mt-2">
                For the best results, paste the complete job description
                including requirements, responsibilities, and qualifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
