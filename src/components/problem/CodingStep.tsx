import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Code, Play, Send, Lightbulb, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CodingStepProps {
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  leetcodeUrl?: string;
  autoOpenLeetCode?: boolean;
}

const starterCode = {
  python: `def twoSum(nums: List[int], target: int) -> List[int]:
    # Your code here
    pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
};

const CodingStep = ({ isActive, isCompleted, onComplete, leetcodeUrl, autoOpenLeetCode = false }: CodingStepProps) => {
  const [language, setLanguage] = useState<"python" | "java" | "cpp">("python");
  const [code, setCode] = useState(starterCode.python);
  const [showHint, setShowHint] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const hasAutoOpenedRef = useRef(false);

  useEffect(() => {
    if (!isActive || !autoOpenLeetCode || !leetcodeUrl || hasAutoOpenedRef.current) return;
    hasAutoOpenedRef.current = true;
    window.open(leetcodeUrl, "_blank", "noopener,noreferrer");
  }, [autoOpenLeetCode, isActive, leetcodeUrl]);

  const handleLanguageChange = (lang: "python" | "java" | "cpp") => {
    setLanguage(lang);
    setCode(starterCode[lang]);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setOutput("Test Case 1: [2,7,11,15], target=9 → [0,1] ✓\nTest Case 2: [3,2,4], target=6 → [1,2] ✓\nAll test cases passed!");
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    handleRun();
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <Card variant={isActive ? "step-active" : isCompleted ? "step-completed" : "step-locked"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold">
              6
            </span>
            Coding Step
          </CardTitle>
          <div className="flex items-center gap-2">
            {isCompleted && (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Completed
              </Badge>
            )}
            {isActive && (
              <Badge variant="primary" className="flex items-center gap-1">
                <Code className="h-3 w-3" /> Unlocked
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isActive && !isCompleted && (
          <div className="text-center py-8 text-muted-foreground">
            <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Complete all thinking steps to unlock the code editor</p>
          </div>
        )}

        {isActive && (
          <>
            {/* Language Selector & Hint */}
            <div className="flex items-center justify-between">
              <Select value={language} onValueChange={(v) => handleLanguageChange(v as "python" | "java" | "cpp")}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                {leetcodeUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(leetcodeUrl, "_blank", "noopener,noreferrer")}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open LeetCode Compiler
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="text-warning"
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  {showHint ? "Hide Hint" : "Show Hint"}
                </Button>
              </div>
            </div>

            {/* Hint */}
            {showHint && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-sm animate-fade-in">
                <p className="text-warning font-medium">Logic Hint:</p>
                <p className="text-muted-foreground mt-1">
                  Remember your approach: iterate once, store seen values in a hash map, 
                  check for complements in O(1) time.
                </p>
              </div>
            )}

            {/* Code Editor (simplified) */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-secondary/50 px-4 py-2 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-warning/50" />
                  <div className="w-3 h-3 rounded-full bg-success/50" />
                </div>
                <span className="text-xs text-muted-foreground font-mono ml-2">solution.{language === "cpp" ? "cpp" : language === "java" ? "java" : "py"}</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 bg-background p-4 font-mono text-sm resize-none focus:outline-none"
                spellCheck={false}
              />
            </div>

            {/* Output */}
            {output && (
              <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm animate-fade-in">
                <p className="text-muted-foreground mb-2">Output:</p>
                <pre className="text-success whitespace-pre-wrap">{output}</pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={handleRun} disabled={isRunning}>
                <Play className="h-4 w-4 mr-1" />
                {isRunning ? "Running..." : "Run"}
              </Button>
              <Button variant="hero" onClick={handleSubmit} disabled={isRunning}>
                <Send className="h-4 w-4 mr-1" />
                Submit
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CodingStep;
