import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Code,
  Play,
  Send,
  Lightbulb,
  Copy,
  RotateCcw,
  Maximize2,
  Minimize2,
  Check,
} from "lucide-react";
import { useProblemSolvingShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useToast } from "@/hooks/use-toast";

interface CodingStepProps {
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  problemId?: string;
  starterCode?: {
    python: string;
    java: string;
    cpp: string;
    javascript: string;
  };
}

type Language = "python" | "java" | "cpp" | "javascript";

const defaultStarterCode: Record<Language, string> = {
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
  javascript: `function twoSum(nums, target) {
    // Your code here
    return [];
}`,
};

const languageExtensions: Record<Language, string> = {
  python: "py",
  java: "java",
  cpp: "cpp",
  javascript: "js",
};

const ImprovedCodingStep = ({
  isActive,
  isCompleted,
  onComplete,
  starterCode = defaultStarterCode,
}: CodingStepProps) => {
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(starterCode.python);
  const [showHint, setShowHint] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Handle language change
  const handleLanguageChange = useCallback(
    (lang: Language) => {
      setLanguage(lang);
      setCode(starterCode[lang] || defaultStarterCode[lang]);
      setOutput(null);
    },
    [starterCode]
  );

  // Reset code to starter
  const handleReset = useCallback(() => {
    setCode(starterCode[language] || defaultStarterCode[language]);
    setOutput(null);
    toast({
      title: "Code Reset",
      description: "Code has been reset to the starter template.",
    });
  }, [language, starterCode, toast]);

  // Copy code to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy code to clipboard.",
        variant: "destructive",
      });
    }
  }, [code, toast]);

  // Run code (simulated)
  const handleRun = useCallback(() => {
    setIsRunning(true);
    setOutput(null);

    // Simulate code execution
    setTimeout(() => {
      setOutput(
        `Running ${language} code...\n\nTest Case 1: [2,7,11,15], target=9 → [0,1] ✓\nTest Case 2: [3,2,4], target=6 → [1,2] ✓\nTest Case 3: [3,3], target=6 → [0,1] ✓\n\nAll test cases passed!`
      );
      setIsRunning(false);
    }, 1500);
  }, [language]);

  // Submit code
  const handleSubmit = useCallback(() => {
    handleRun();
    setTimeout(() => {
      onComplete();
      toast({
        title: "Solution Submitted!",
        description: "Your solution has been accepted.",
      });
    }, 2000);
  }, [handleRun, onComplete, toast]);

  // Keyboard shortcuts
  useProblemSolvingShortcuts({
    onRunCode: handleRun,
    onSubmitCode: handleSubmit,
    enabled: isActive,
  });

  // Handle tab key in textarea
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = e.currentTarget.selectionStart;
        const end = e.currentTarget.selectionEnd;
        const newCode = code.substring(0, start) + "    " + code.substring(end);
        setCode(newCode);
        // Set cursor position after the tab
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start + 4;
            textareaRef.current.selectionEnd = start + 4;
          }
        }, 0);
      }
    },
    [code]
  );

  // Line numbers
  const lineCount = code.split("\n").length;

  return (
    <Card
      variant={isActive ? "step-active" : isCompleted ? "step-completed" : "step-locked"}
      className={isExpanded ? "fixed inset-4 z-50 overflow-auto" : ""}
    >
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
            <p className="text-xs mt-2">This ensures you understand the problem before coding</p>
          </div>
        )}

        {(isActive || isCompleted) && (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Select
                  value={language}
                  onValueChange={(v) => handleLanguageChange(v as Language)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  title="Reset code"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>

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

            {/* Hint */}
            {showHint && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-sm animate-fade-in">
                <p className="text-warning font-medium">💡 Logic Hint:</p>
                <p className="text-muted-foreground mt-1">
                  Remember your approach: iterate once, store seen values in a hash map, check
                  for complements in O(1) time. The key insight is that for each element, you
                  need target - element.
                </p>
              </div>
            )}

            {/* Code Editor */}
            <div className="border border-border rounded-lg overflow-hidden">
              {/* Editor Header */}
              <div className="bg-secondary/50 px-4 py-2 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/50" />
                    <div className="w-3 h-3 rounded-full bg-warning/50" />
                    <div className="w-3 h-3 rounded-full bg-success/50" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono ml-2">
                    solution.{languageExtensions[language]}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Ctrl+R: Run | Ctrl+Shift+S: Submit
                </div>
              </div>

              {/* Editor Body with Line Numbers */}
              <div className="flex bg-background">
                {/* Line Numbers */}
                <div className="py-4 px-2 bg-secondary/30 text-right select-none border-r border-border">
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div
                      key={i}
                      className="font-mono text-xs text-muted-foreground leading-6 px-2"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Code Area */}
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-transparent leading-6 ${
                    isExpanded ? "min-h-[60vh]" : "min-h-[300px]"
                  }`}
                  spellCheck={false}
                  placeholder="Write your solution here..."
                />
              </div>
            </div>

            {/* Output */}
            {output && (
              <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground font-semibold">Output:</span>
                  <Badge variant="success">All Tests Passed</Badge>
                </div>
                <pre className="text-foreground whitespace-pre-wrap">{output}</pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground">
                {lineCount} lines • {code.length} characters
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleRun} disabled={isRunning}>
                  <Play className="h-4 w-4 mr-1" />
                  {isRunning ? "Running..." : "Run Code"}
                </Button>
                <Button variant="hero" onClick={handleSubmit} disabled={isRunning}>
                  <Send className="h-4 w-4 mr-1" />
                  Submit Solution
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ImprovedCodingStep;
