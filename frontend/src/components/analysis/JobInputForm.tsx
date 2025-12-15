import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Link2,
  FileText,
  Sparkles,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadResume } from "@/services/resume.service";
import { toast } from "sonner";

interface JobInputFormProps {
  onAnalyze: (data: {
    jobTitle: string;
    company: string;
    location?: string;
    jobDescription: string;
    resumeText: string;
  }) => void;
  isLoading?: boolean;
}

export function JobInputForm({
  onAnalyze,
  isLoading = false,
}: JobInputFormProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [activeTab, setActiveTab] = useState<"paste" | "upload" | "url">(
    "paste"
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      jobTitle,
      company,
      location: location || undefined,
      jobDescription,
      resumeText,
    });
  };

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (file.type !== "application/pdf" && file.type !== "text/plain") {
      toast.error("Only PDF and text files are supported");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);

    try {
      const response = await uploadResume(file);

      // Show success message
      if (response.resume.skillsExtracted > 0) {
        toast.success(
          `Resume uploaded! ${response.resume.skillsExtracted} skills extracted`
        );
      } else {
        toast.success("Resume uploaded successfully!");
      }

      // Use the parsed content from the response
      if (response.resume.parsedContent) {
        setResumeText(response.resume.parsedContent);
      } else {
        // Fallback for text files
        if (file.type === "text/plain") {
          const text = await file.text();
          setResumeText(text);
        } else {
          setResumeText(
            `[PDF Resume: ${file.name}]\n\nYour resume has been uploaded and processed.`
          );
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload resume");
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setResumeText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Job Details Section */}
      <div className="glass-card rounded-xl p-6 space-y-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              Job Details
            </h3>
            <p className="text-sm text-muted-foreground">
              Enter the job information
            </p>
          </div>
        </div>

        {/* Job Title and Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="jobTitle"
              className="text-sm font-medium text-foreground"
            >
              Job Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="jobTitle"
              placeholder="e.g., Senior Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isLoading || isUploading}
              className="bg-background/50 border-border focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="company"
              className="text-sm font-medium text-foreground"
            >
              Company <span className="text-destructive">*</span>
            </label>
            <Input
              id="company"
              placeholder="e.g., Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={isLoading || isUploading}
              className="bg-background/50 border-border focus:border-primary"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label
            htmlFor="location"
            className="text-sm font-medium text-foreground"
          >
            Location{" "}
            <span className="text-muted-foreground text-xs">(Optional)</span>
          </label>
          <Input
            id="location"
            placeholder="e.g., San Francisco, CA or Remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isLoading || isUploading}
            className="bg-background/50 border-border focus:border-primary"
          />
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label
            htmlFor="jobDescription"
            className="text-sm font-medium text-foreground"
          >
            Job Description <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="jobDescription"
            placeholder="Paste the complete job description here..."
            className="min-h-[200px] resize-none bg-background/50 border-border focus:border-primary"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isLoading || isUploading}
          />
        </div>
      </div>

      {/* Resume Section */}
      <div
        className="glass-card rounded-xl p-6 space-y-4 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <FileText className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              Your Resume
            </h3>
            <p className="text-sm text-muted-foreground">
              Add your resume for matching analysis
            </p>
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
              disabled={isLoading || isUploading}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
                (isLoading || isUploading) && "opacity-50 cursor-not-allowed"
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
            disabled={isLoading || uploadedFile !== null}
          />
        )}

        {activeTab === "upload" && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading || isLoading}
            />

            {!uploadedFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                  (isUploading || isLoading) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-10 w-10 text-primary mx-auto mb-4 animate-spin" />
                    <p className="font-medium text-foreground">
                      Uploading and processing...
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Extracting skills with AI
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="font-medium text-foreground">
                      Drop your resume here
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      PDF or TXT up to 10MB
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="border-2 border-primary/50 rounded-xl p-6 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    disabled={isLoading || isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "url" && (
          <Input
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            className="bg-background/50 border-border focus:border-primary"
            disabled={isLoading || uploadedFile !== null}
          />
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full gradient-primary text-primary-foreground font-semibold py-6 text-base hover:opacity-90 transition-opacity"
        disabled={
          !jobTitle.trim() ||
          !company.trim() ||
          !jobDescription.trim() ||
          !resumeText.trim() ||
          isLoading ||
          isUploading
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Analyze Match
          </>
        )}
      </Button>
    </form>
  );
}
