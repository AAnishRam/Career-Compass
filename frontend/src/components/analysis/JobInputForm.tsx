import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload, Link2, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobInputFormProps {
  onAnalyze: (data: { jobDescription: string; resumeText: string }) => void;
}

export function JobInputForm({ onAnalyze }: JobInputFormProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [activeTab, setActiveTab] = useState<"paste" | "upload" | "url">("paste");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({ jobDescription, resumeText });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Job Description Section */}
      <div className="glass-card rounded-xl p-6 space-y-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Job Description</h3>
            <p className="text-sm text-muted-foreground">Paste the job posting you want to analyze</p>
          </div>
        </div>
        
        <Textarea 
          placeholder="Paste the complete job description here..."
          className="min-h-[200px] resize-none bg-background/50 border-border focus:border-primary"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      {/* Resume Section */}
      <div className="glass-card rounded-xl p-6 space-y-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <FileText className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Your Resume</h3>
            <p className="text-sm text-muted-foreground">Add your resume for matching analysis</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
          {[
            { id: "paste", label: "Paste Text", icon: FileText },
            { id: "upload", label: "Upload", icon: Upload },
            { id: "url", label: "URL", icon: Link2 },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "paste" && (
          <Textarea 
            placeholder="Paste your resume text here..."
            className="min-h-[200px] resize-none bg-background/50 border-border focus:border-primary"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        )}

        {activeTab === "upload" && (
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="font-medium text-foreground">Drop your resume here</p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
            <p className="text-xs text-muted-foreground mt-3">PDF, DOCX, TXT up to 5MB</p>
          </div>
        )}

        {activeTab === "url" && (
          <Input 
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            className="bg-background/50 border-border focus:border-primary"
          />
        )}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        size="lg"
        className="w-full gradient-primary text-primary-foreground font-semibold py-6 text-base hover:opacity-90 transition-opacity"
        disabled={!jobDescription.trim() || !resumeText.trim()}
      >
        <Sparkles className="h-5 w-5 mr-2" />
        Analyze Match
      </Button>
    </form>
  );
}
