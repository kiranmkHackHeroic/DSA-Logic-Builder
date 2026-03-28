import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStreak } from "@/hooks/useUserStreak";
import { useAllProgress } from "@/hooks/useProblemProgress";
import { 
  Brain, 
  Target, 
  Clock, 
  TrendingUp, 
  BarChart3,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Zap,
  Loader2
} from "lucide-react";

const Analytics = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { streak, isLoading: streakLoading } = useUserStreak();
  const { data: allProgress, isLoading: progressLoading } = useAllProgress();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || streakLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completedProblems = allProgress?.filter(p => p.status === "completed") || [];
  const inProgressProblems = allProgress?.filter(p => p.status === "in_progress") || [];
  
  const logicScore = completedProblems.length > 0
    ? Math.round(completedProblems.reduce((sum, p) => sum + (p.logic_score || 70), 0) / completedProblems.length)
    : 0;

  const avgThinkingTime = completedProblems.length > 0
    ? Math.round(completedProblems.reduce((sum, p) => sum + (p.time_spent_thinking || 0), 0) / completedProblems.length)
    : 0;

  const avgCodingTime = completedProblems.length > 0
    ? Math.round(completedProblems.reduce((sum, p) => sum + (p.time_spent_coding || 0), 0) / completedProblems.length)
    : 0;

  const patternData = [
    { name: "Two Pointers", mastery: 85, problems: 8, color: "primary" },
    { name: "Sliding Window", mastery: 60, problems: 5, color: "accent" },
    { name: "Binary Search", mastery: 45, problems: 4, color: "success" },
    { name: "Dynamic Programming", mastery: 25, problems: 3, color: "warning" },
    { name: "Stack", mastery: 90, problems: 6, color: "primary" },
    { name: "Greedy", mastery: 70, problems: 4, color: "accent" },
  ];

  const weakAreas = [
    { area: "Edge case handling", score: 45, suggestion: "Practice more problems with tricky edge cases" },
    { area: "Space optimization", score: 55, suggestion: "Focus on in-place algorithms and space reduction" },
    { area: "Time complexity analysis", score: 60, suggestion: "Review Big O notation and practice estimation" },
  ];

  const totalTime = avgThinkingTime + avgCodingTime;
  const thinkingPercentage = totalTime > 0 ? Math.round((avgThinkingTime / totalTime) * 100) : 50;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Badge variant="primary" className="mb-4">Progress Analytics</Badge>
            <h1 className="text-3xl font-bold mb-2">Your Learning Journey</h1>
            <p className="text-muted-foreground">
              Track your progress, identify weak areas, and optimize your learning
            </p>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card variant="feature">
              <CardContent className="pt-6 text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{streak?.total_problems_attempted || 0}</p>
                <p className="text-xs text-muted-foreground">Problems Attempted</p>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold">{streak?.total_problems_solved || 0}</p>
                <p className="text-xs text-muted-foreground">Problems Solved</p>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6 text-center">
                <Brain className="h-6 w-6 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold">{logicScore}%</p>
                <p className="text-xs text-muted-foreground">Logic Accuracy</p>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-warning" />
                <p className="text-2xl font-bold">{avgThinkingTime}m</p>
                <p className="text-xs text-muted-foreground">Avg. Thinking Time</p>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6 text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{avgCodingTime}m</p>
                <p className="text-xs text-muted-foreground">Avg. Coding Time</p>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold">{streak?.longest_streak || 0}</p>
                <p className="text-xs text-muted-foreground">Longest Streak</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pattern Mastery */}
            <Card variant="elevated" className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Pattern Mastery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patternData.map((pattern) => (
                    <div key={pattern.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{pattern.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {pattern.problems} problems
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{pattern.mastery}%</span>
                      </div>
                      <Progress 
                        value={pattern.mastery} 
                        variant={pattern.color as "primary" | "accent" | "success" | "warning"}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Distribution */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-accent" />
                  Time Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-48 flex items-center justify-center mb-6">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="20"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="20"
                        strokeDasharray={`${(thinkingPercentage / 100) * 377} 377`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{thinkingPercentage}%</span>
                      <span className="text-xs text-muted-foreground">Thinking</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span>Thinking ({avgThinkingTime}m avg)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted" />
                    <span>Coding ({avgCodingTime}m avg)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weak Areas */}
            <Card variant="elevated" className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weakAreas.map((area) => (
                    <div key={area.area} className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{area.area}</span>
                        <Badge variant="warning">{area.score}%</Badge>
                      </div>
                      <Progress value={area.score} variant="warning" size="sm" className="mb-2" />
                      <p className="text-sm text-muted-foreground">{area.suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Current Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Current Streak</span>
                    <Badge variant="success">{streak?.current_streak || 0} days</Badge>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Longest Streak</span>
                    <Badge variant="primary">{streak?.longest_streak || 0} days</Badge>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Problems In Progress</span>
                    <Badge variant="warning">{inProgressProblems.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <Badge variant="accent">
                      {(streak?.total_problems_attempted || 0) > 0 
                        ? Math.round(((streak?.total_problems_solved || 0) / (streak?.total_problems_attempted || 1)) * 100)
                        : 0}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
