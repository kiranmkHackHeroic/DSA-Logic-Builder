import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StepIndicator from "@/components/problem/StepIndicator";
import UnderstandProblemStep from "@/components/problem/UnderstandProblemStep";
import HumanThinkingStep from "@/components/problem/HumanThinkingStep";
import BruteForceStep from "@/components/problem/BruteForceStep";
import OptimizationStep from "@/components/problem/OptimizationStep";
import FinalApproachStep from "@/components/problem/FinalApproachStep";
import CodingStep from "@/components/problem/CodingStep";
import VisualizationStep from "@/components/problem/VisualizationStep";
import { useProblemProgress } from "@/hooks/useProblemProgress";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";

const sampleProblem = {
  id: 1,
  title: "Two Sum",
  difficulty: "easy",
  pattern: "Hash Map",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0, 1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1, 2]",
    },
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists",
  ],
};

const ProblemSolving = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const problemId = id || "1";
  const { progress, isLoading, updateProgress } = useProblemProgress(problemId);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load saved progress from DB
  useEffect(() => {
    if (progress && !initialized) {
      setCurrentStep(progress.current_step || 1);
      setCompletedSteps(progress.completed_steps || []);
      setInitialized(true);
    } else if (!isLoading && !progress && !initialized) {
      setInitialized(true);
    }
  }, [progress, isLoading, initialized]);

  const totalSteps = 7;
  const progressPercent = (completedSteps.length / totalSteps) * 100;

  const completeStep = useCallback((step: number) => {
    const newCompleted = completedSteps.includes(step) 
      ? completedSteps 
      : [...completedSteps, step];
    const newStep = step < totalSteps ? step + 1 : step;
    
    setCompletedSteps(newCompleted);
    setCurrentStep(newStep);

    if (user) {
      const isAllComplete = newCompleted.length === totalSteps;
      updateProgress({
        current_step: newStep,
        completed_steps: newCompleted,
        status: isAllComplete ? "completed" : "in_progress",
        ...(isAllComplete ? { completed_at: new Date().toISOString() } : {}),
      });
    }
  }, [completedSteps, user, updateProgress]);

  const getStepStatus = (step: number): "completed" | "active" | "locked" => {
    if (completedSteps.includes(step)) return "completed";
    if (step === currentStep) return "active";
    return "locked";
  };

  const steps = [
    { id: 1, title: "Understand Problem", status: getStepStatus(1) },
    { id: 2, title: "Human Thinking", status: getStepStatus(2) },
    { id: 3, title: "Brute Force", status: getStepStatus(3) },
    { id: 4, title: "Optimization", status: getStepStatus(4) },
    { id: 5, title: "Final Approach", status: getStepStatus(5) },
    { id: 6, title: "Coding", status: getStepStatus(6) },
    { id: 7, title: "Visualization", status: getStepStatus(7) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Link to="/problems">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">{sampleProblem.title}</h1>
                  <Badge variant={sampleProblem.difficulty as "easy" | "medium" | "hard"}>
                    {sampleProblem.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {sampleProblem.pattern}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    ~30 min
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Progress: {completedSteps.length}/{totalSteps} steps
              </div>
              <Progress value={progressPercent} variant="accent" className="w-32" />
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-[240px_1fr] gap-6">
            {/* Step Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 bg-card/50 rounded-xl border border-border p-4">
                <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
                  Problem Flow
                </h3>
                <StepIndicator 
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={(step) => {
                    if (completedSteps.includes(step) || step === currentStep) {
                      setCurrentStep(step);
                    }
                  }}
                />
              </div>
            </div>

            {/* Steps Content */}
            <div className="space-y-6">
              <UnderstandProblemStep
                problem={sampleProblem}
                onComplete={() => completeStep(1)}
                isActive={currentStep === 1}
              />
              
              <HumanThinkingStep
                onComplete={() => completeStep(2)}
                isActive={currentStep === 2}
                isCompleted={completedSteps.includes(2)}
              />
              
              <BruteForceStep
                constraints={sampleProblem.constraints}
                onComplete={() => completeStep(3)}
                isActive={currentStep === 3}
                isCompleted={completedSteps.includes(3)}
              />
              
              <OptimizationStep
                onComplete={() => completeStep(4)}
                isActive={currentStep === 4}
                isCompleted={completedSteps.includes(4)}
              />
              
              <FinalApproachStep
                onComplete={() => completeStep(5)}
                isActive={currentStep === 5}
                isCompleted={completedSteps.includes(5)}
              />
              
              <CodingStep
                isActive={currentStep === 6}
                isCompleted={completedSteps.includes(6)}
                onComplete={() => completeStep(6)}
              />
              
              <VisualizationStep
                isActive={currentStep >= 7 || completedSteps.includes(6)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemSolving;
