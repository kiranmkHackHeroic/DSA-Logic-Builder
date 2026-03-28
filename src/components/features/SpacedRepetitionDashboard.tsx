import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  RotateCcw,
  Zap
} from "lucide-react";
import { useSpacedRepetition, ReviewQuality } from "@/hooks/useSpacedRepetition";
import { Link } from "react-router-dom";

interface ReviewCardProps {
  problemId: string;
  problemTitle: string;
  problemDifficulty: "easy" | "medium" | "hard";
  pattern: string;
  onReview: (quality: ReviewQuality) => void;
}

const ReviewCard = ({
  problemId,
  problemTitle,
  problemDifficulty,
  pattern,
  onReview,
}: ReviewCardProps) => {
  const [showRating, setShowRating] = useState(false);

  const qualityButtons: { quality: ReviewQuality; label: string; color: string }[] = [
    { quality: 1, label: "Again", color: "bg-destructive hover:bg-destructive/80" },
    { quality: 3, label: "Hard", color: "bg-warning hover:bg-warning/80" },
    { quality: 4, label: "Good", color: "bg-primary hover:bg-primary/80" },
    { quality: 5, label: "Easy", color: "bg-success hover:bg-success/80" },
  ];

  return (
    <Card className="group hover:border-primary/50 transition-all">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{problemTitle}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={problemDifficulty}>{problemDifficulty}</Badge>
                <span className="text-xs text-muted-foreground">{pattern}</span>
              </div>
            </div>
          </div>

          {!showRating ? (
            <div className="flex items-center gap-2">
              <Link to={`/problems/${problemId}`}>
                <Button variant="outline" size="sm">
                  Review
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRating(true)}
              >
                Rate
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {qualityButtons.map(({ quality, label, color }) => (
                <Button
                  key={quality}
                  size="sm"
                  className={`${color} text-white text-xs px-2`}
                  onClick={() => {
                    onReview(quality);
                    setShowRating(false);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const SpacedRepetitionDashboard = () => {
  const { dueForReview, upcomingReviews, stats, reviewProblem } = useSpacedRepetition();

  // Mock problem data - in real app, fetch from database
  const getProblemInfo = (problemId: string) => ({
    title: `Problem ${problemId}`,
    difficulty: "medium" as const,
    pattern: "Two Pointers",
  });

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.dueToday}</p>
                <p className="text-xs text-muted-foreground">Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.learningCards}</p>
                <p className="text-xs text-muted-foreground">Learning</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.masteredCards}</p>
                <p className="text-xs text-muted-foreground">Mastered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgEaseFactor}</p>
                <p className="text-xs text-muted-foreground">Avg. Ease</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Due Today */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Due for Review
            </CardTitle>
            {dueForReview.length > 0 && (
              <Badge variant="warning">{dueForReview.length} problems</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {dueForReview.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm">No reviews due today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dueForReview.slice(0, 5).map((card) => {
                const info = getProblemInfo(card.problemId);
                return (
                  <ReviewCard
                    key={card.problemId}
                    problemId={card.problemId}
                    problemTitle={info.title}
                    problemDifficulty={info.difficulty}
                    pattern={info.pattern}
                    onReview={(quality) => reviewProblem(card.problemId, quality)}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Reviews (Next 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingReviews.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              No upcoming reviews scheduled
            </p>
          ) : (
            <div className="space-y-2">
              {upcomingReviews.slice(0, 10).map((card) => (
                <div
                  key={card.problemId}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                >
                  <span className="font-medium">Problem {card.problemId}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(card.nextReviewDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpacedRepetitionDashboard;
