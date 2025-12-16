import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSkill } from "@/services/skills.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddSkillDialog({ open, onOpenChange }: AddSkillDialogProps) {
  const [skillName, setSkillName] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState(50);
  const [status, setStatus] = useState<"matched" | "partial" | "missing">(
    "matched"
  );
  const [category, setCategory] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast({
        title: "Success",
        description: "Skill added successfully!",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to add skill",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSkillName("");
    setProficiencyLevel(50);
    setStatus("matched");
    setCategory("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!skillName.trim()) {
      toast({
        title: "Validation Error",
        description: "Skill name is required",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      skillName: skillName.trim(),
      proficiencyLevel,
      status,
      category: category.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
          <DialogDescription>
            Add a skill to your profile. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Skill Name */}
            <div className="space-y-2">
              <Label htmlFor="skillName">
                Skill Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="skillName"
                placeholder="e.g., React, Python, Project Management"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                placeholder="e.g., Frontend, Backend, Soft Skills"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            {/* Proficiency Level */}
            <div className="space-y-2">
              <Label htmlFor="proficiency">
                Proficiency Level: {proficiencyLevel}%
              </Label>
              <Slider
                id="proficiency"
                min={0}
                max={100}
                step={5}
                value={[proficiencyLevel]}
                onValueChange={(value) => setProficiencyLevel(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: any) => setStatus(value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matched">Matched</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="missing">Missing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Skill
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
