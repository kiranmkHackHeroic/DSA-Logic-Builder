import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Timer, 
  Lock, 
  Unlock,
  Play, 
  Pause, 
  RotateCcw,
  Brain,
  Code,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react";

const InterviewMode = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [currentPhase, setCurrentPhase] = useState<"approach" | "coding" | "review">("approach");
  const [approachText, setApproachText] = useState("");
  const [isCodeUnlocked, setIsCodeUnlocked] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, isPaused, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleUnlockCode = () => {
    if (approachText.length >= 100) {
      setIsCodeUnlocked(true);
      setCurrentPhase("coding");
    }
  };

  const resetInterview = () => {
    setIsStarted(false);
    setIsPaused(false);
    setTimeLeft(45 * 60);
    setCurrentPhase("approach");
    setApproachText("");
    setIsCodeUnlocked(false);
  };

  const problem = {
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="warning" className="mb-4">Interview Mode</Badge>
            <h1 className="text-3xl font-bold mb-2">Simulate Real Interviews</h1>
            <p className="text-muted-foreground">
              Practice under pressure with locked code and forced explanation
            </p>
          </div>

          {!isStarted ? (
            /* Pre-Interview Screen */
            <Card variant="elevated" className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Ready to Begin?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <Timer className="h-8 w-8 mx-auto mb-2 text-warning" />
                    <p className="font-semibold">45 Minutes</p>
                    <p className="text-xs text-muted-foreground">Time Limit</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <Lock className="h-8 w-8 mx-auto mb-2 text-destructive" />
                    <p className="font-semibold">Locked Code</p>
                    <p className="text-xs text-muted-foreground">Until Explained</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-semibold">Logic First</p>
                    <p className="text-xs text-muted-foreground">Think Before Code</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Interview Rules:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• You must explain your approach before coding</li>
                    <li>• Code editor is locked until approach is accepted</li>
                    <li>• You will be evaluated on logic clarity, correctness, and optimization</li>
                    <li>• Timer cannot be paused once started</li>
                  </ul>
                </div>

                <Button 
                  variant="hero" 
                  size="xl" 
                  className="w-full"
                  onClick={() => setIsStarted(true)}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Interview
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Interview in Progress */
            <div className="space-y-6">
              {/* Timer Bar */}
              <Card variant={timeLeft < 300 ? "step-active" : "elevated"}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl font-mono font-bold ${timeLeft < 300 ? "text-destructive" : "text-foreground"}`}>
                        {formatTime(timeLeft)}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setIsPaused(!isPaused)}
                        >
                          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={resetInterview}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={currentPhase === "approach" ? "warning" : currentPhase === "coding" ? "primary" : "success"}>
                        {currentPhase === "approach" ? "Explain Approach" : currentPhase === "coding" ? "Coding" : "Review"}
                      </Badge>
                      {isCodeUnlocked ? (
                        <Unlock className="h-5 w-5 text-success" />
                      ) : (
                        <Lock className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={(timeLeft / (45 * 60)) * 100} 
                    variant={timeLeft < 300 ? "warning" : "accent"} 
                    className="mt-3"
                  />
                </CardContent>
              </Card>

              {/* Problem */}
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{problem.title}</CardTitle>
                    <Badge variant="easy">{problem.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{problem.description}</p>
                </CardContent>
              </Card>

              {/* Approach Phase */}
              {currentPhase === "approach" && (
                <Card variant="step-active">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Explain Your Approach
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                        <div>
                          <p className="font-medium text-warning">Code is locked!</p>
                          <p className="text-sm text-muted-foreground">
                            Write a detailed explanation of your approach. The code editor will unlock 
                            once your explanation is sufficient (min 100 characters).
                          </p>
                        </div>
                      </div>
                    </div>

                    <Textarea
                      value={approachText}
                      onChange={(e) => setApproachText(e.target.value)}
                      placeholder="Explain your approach here...&#10;&#10;1. What data structure will you use?&#10;2. What is your algorithm?&#10;3. What is the time and space complexity?&#10;4. What edge cases should you consider?"
                      className="min-h-[200px]"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {approachText.length}/100 characters minimum
                      </span>
                      <Button
                        variant={approachText.length >= 100 ? "hero" : "secondary"}
                        onClick={handleUnlockCode}
                        disabled={approachText.length < 100}
                      >
                        <Unlock className="h-4 w-4 mr-2" />
                        Unlock Code Editor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Coding Phase */}
              {currentPhase === "coding" && (
                <Card variant="step-active">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      Code Your Solution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="bg-secondary/50 px-4 py-2 border-b border-border flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-destructive/50" />
                          <div className="w-3 h-3 rounded-full bg-warning/50" />
                          <div className="w-3 h-3 rounded-full bg-success/50" />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono ml-2">solution.py</span>
                      </div>
                      <textarea
                        className="w-full h-64 bg-background p-4 font-mono text-sm resize-none focus:outline-none"
                        placeholder="# Write your solution here..."
                        spellCheck={false}
                      />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="outline">
                        Run Tests
                      </Button>
                      <Button variant="hero" onClick={() => setCurrentPhase("review")}>
                        Submit Solution
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Review Phase */}
              {currentPhase === "review" && (
                <Card variant="step-completed">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      Interview Complete!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-success">85%</p>
                        <p className="text-sm text-muted-foreground">Logic Clarity</p>
                      </div>
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-primary">90%</p>
                        <p className="text-sm text-muted-foreground">Correctness</p>
                      </div>
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-accent">75%</p>
                        <p className="text-sm text-muted-foreground">Optimization</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={resetInterview} className="flex-1">
                        Try Another Problem
                      </Button>
                      <Link to="/analytics" className="flex-1">
                        <Button variant="hero" className="w-full">
                          View Analytics
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewMode;
