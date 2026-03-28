import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAllProgress } from "@/hooks/useProblemProgress";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  Target,
  BookOpen,
  ArrowRight
} from "lucide-react";

const problems = [
  // Two Pointers
  { id: 1, title: "Two Sum", difficulty: "easy", pattern: "Two Pointers", status: "completed", companies: ["Google", "Amazon", "Meta"] },
  { id: 2, title: "Container With Most Water", difficulty: "medium", pattern: "Two Pointers", status: "completed", companies: ["Amazon", "Microsoft"] },
  { id: 3, title: "3Sum", difficulty: "medium", pattern: "Two Pointers", status: "pending", companies: ["Amazon", "Adobe"] },
  { id: 4, title: "Trapping Rain Water", difficulty: "hard", pattern: "Two Pointers", status: "pending", companies: ["Google", "Amazon", "Meta"] },
  { id: 5, title: "Remove Duplicates from Sorted Array", difficulty: "easy", pattern: "Two Pointers", status: "pending", companies: ["Meta", "Microsoft"] },
  { id: 6, title: "Move Zeroes", difficulty: "easy", pattern: "Two Pointers", status: "pending", companies: ["Meta", "Bloomberg"] },
  
  // Sliding Window
  { id: 7, title: "Longest Substring Without Repeating Characters", difficulty: "medium", pattern: "Sliding Window", status: "in-progress", companies: ["Meta", "Bloomberg"] },
  { id: 8, title: "Minimum Window Substring", difficulty: "hard", pattern: "Sliding Window", status: "pending", companies: ["Meta", "Amazon", "Google"] },
  { id: 9, title: "Sliding Window Maximum", difficulty: "hard", pattern: "Sliding Window", status: "pending", companies: ["Amazon", "Google"] },
  { id: 10, title: "Longest Repeating Character Replacement", difficulty: "medium", pattern: "Sliding Window", status: "pending", companies: ["Google", "Amazon"] },
  { id: 11, title: "Permutation in String", difficulty: "medium", pattern: "Sliding Window", status: "pending", companies: ["Microsoft", "Amazon"] },
  { id: 12, title: "Find All Anagrams in a String", difficulty: "medium", pattern: "Sliding Window", status: "pending", companies: ["Meta", "Amazon"] },
  
  // Binary Search
  { id: 13, title: "Binary Search", difficulty: "easy", pattern: "Binary Search", status: "pending", companies: ["Google", "Apple"] },
  { id: 14, title: "Search in Rotated Sorted Array", difficulty: "medium", pattern: "Binary Search", status: "pending", companies: ["Meta", "Amazon", "Microsoft"] },
  { id: 15, title: "Find Minimum in Rotated Sorted Array", difficulty: "medium", pattern: "Binary Search", status: "pending", companies: ["Amazon", "Microsoft"] },
  { id: 16, title: "Koko Eating Bananas", difficulty: "medium", pattern: "Binary Search", status: "pending", companies: ["Google", "Amazon"] },
  { id: 17, title: "Median of Two Sorted Arrays", difficulty: "hard", pattern: "Binary Search", status: "pending", companies: ["Google", "Amazon", "Apple"] },
  { id: 18, title: "Search a 2D Matrix", difficulty: "medium", pattern: "Binary Search", status: "pending", companies: ["Amazon", "Microsoft"] },
  
  // Stack
  { id: 19, title: "Valid Parentheses", difficulty: "easy", pattern: "Stack", status: "pending", companies: ["Google", "Uber"] },
  { id: 20, title: "Min Stack", difficulty: "medium", pattern: "Stack", status: "pending", companies: ["Amazon", "Bloomberg"] },
  { id: 21, title: "Daily Temperatures", difficulty: "medium", pattern: "Stack", status: "pending", companies: ["Meta", "Amazon"] },
  { id: 22, title: "Largest Rectangle in Histogram", difficulty: "hard", pattern: "Stack", status: "pending", companies: ["Google", "Amazon"] },
  { id: 23, title: "Next Greater Element I", difficulty: "easy", pattern: "Stack", status: "pending", companies: ["Amazon", "Bloomberg"] },
  { id: 24, title: "Evaluate Reverse Polish Notation", difficulty: "medium", pattern: "Stack", status: "pending", companies: ["Amazon", "LinkedIn"] },
  
  // Dynamic Programming
  { id: 25, title: "Maximum Subarray", difficulty: "medium", pattern: "Dynamic Programming", status: "pending", companies: ["Microsoft", "LinkedIn"] },
  { id: 26, title: "Climbing Stairs", difficulty: "easy", pattern: "Dynamic Programming", status: "pending", companies: ["Amazon", "Apple"] },
  { id: 27, title: "House Robber", difficulty: "medium", pattern: "Dynamic Programming", status: "pending", companies: ["Amazon", "Google"] },
  { id: 28, title: "Coin Change", difficulty: "medium", pattern: "Dynamic Programming", status: "pending", companies: ["Amazon", "Microsoft"] },
  { id: 29, title: "Longest Increasing Subsequence", difficulty: "medium", pattern: "Dynamic Programming", status: "pending", companies: ["Google", "Amazon"] },
  { id: 30, title: "Unique Paths", difficulty: "medium", pattern: "Dynamic Programming", status: "pending", companies: ["Google", "Amazon"] },
  { id: 31, title: "Edit Distance", difficulty: "medium", pattern: "Dynamic Programming", status: "pending", companies: ["Amazon", "Google"] },
  { id: 32, title: "Longest Common Subsequence", difficulty: "medium", pattern: "Dynamic Programming", status: "pending", companies: ["Amazon", "Google"] },
  
  // Greedy
  { id: 33, title: "Jump Game", difficulty: "medium", pattern: "Greedy", status: "pending", companies: ["Amazon", "Microsoft"] },
  { id: 34, title: "Jump Game II", difficulty: "medium", pattern: "Greedy", status: "pending", companies: ["Amazon", "Google"] },
  { id: 35, title: "Gas Station", difficulty: "medium", pattern: "Greedy", status: "pending", companies: ["Amazon", "Bloomberg"] },
  { id: 36, title: "Merge Intervals", difficulty: "medium", pattern: "Greedy", status: "pending", companies: ["Meta", "Netflix"] },
  { id: 37, title: "Non-overlapping Intervals", difficulty: "medium", pattern: "Greedy", status: "pending", companies: ["Amazon", "Microsoft"] },
  { id: 38, title: "Task Scheduler", difficulty: "medium", pattern: "Greedy", status: "pending", companies: ["Meta", "Amazon"] },
  
  // Hash Map
  { id: 39, title: "Group Anagrams", difficulty: "medium", pattern: "Hash Map", status: "pending", companies: ["Amazon", "Meta"] },
  { id: 40, title: "Top K Frequent Elements", difficulty: "medium", pattern: "Hash Map", status: "pending", companies: ["Amazon", "Meta"] },
  { id: 41, title: "Valid Anagram", difficulty: "easy", pattern: "Hash Map", status: "pending", companies: ["Amazon", "Microsoft"] },
  { id: 42, title: "Longest Consecutive Sequence", difficulty: "medium", pattern: "Hash Map", status: "pending", companies: ["Google", "Amazon"] },
  { id: 43, title: "Subarray Sum Equals K", difficulty: "medium", pattern: "Hash Map", status: "pending", companies: ["Meta", "Google"] },
  
  // Trees & Graphs
  { id: 44, title: "Invert Binary Tree", difficulty: "easy", pattern: "Trees", status: "pending", companies: ["Google", "Amazon"] },
  { id: 45, title: "Maximum Depth of Binary Tree", difficulty: "easy", pattern: "Trees", status: "pending", companies: ["Amazon", "LinkedIn"] },
  { id: 46, title: "Validate Binary Search Tree", difficulty: "medium", pattern: "Trees", status: "pending", companies: ["Amazon", "Meta"] },
  { id: 47, title: "Binary Tree Level Order Traversal", difficulty: "medium", pattern: "Trees", status: "pending", companies: ["Amazon", "Meta"] },
  { id: 48, title: "Lowest Common Ancestor of BST", difficulty: "medium", pattern: "Trees", status: "pending", companies: ["Meta", "Amazon"] },
  { id: 49, title: "Number of Islands", difficulty: "medium", pattern: "Graph", status: "pending", companies: ["Amazon", "Google", "Meta"] },
  { id: 50, title: "Clone Graph", difficulty: "medium", pattern: "Graph", status: "pending", companies: ["Meta", "Amazon"] },
  { id: 51, title: "Course Schedule", difficulty: "medium", pattern: "Graph", status: "pending", companies: ["Amazon", "Meta"] },
  { id: 52, title: "Pacific Atlantic Water Flow", difficulty: "medium", pattern: "Graph", status: "pending", companies: ["Google", "Amazon"] },
  
  // Linked List
  { id: 53, title: "Reverse Linked List", difficulty: "easy", pattern: "Linked List", status: "pending", companies: ["Amazon", "Microsoft"] },
  { id: 54, title: "Merge Two Sorted Lists", difficulty: "easy", pattern: "Linked List", status: "pending", companies: ["Amazon", "Microsoft"] },
  { id: 55, title: "Linked List Cycle", difficulty: "easy", pattern: "Linked List", status: "pending", companies: ["Amazon", "Microsoft"] },
  { id: 56, title: "Remove Nth Node From End of List", difficulty: "medium", pattern: "Linked List", status: "pending", companies: ["Meta", "Amazon"] },
  { id: 57, title: "Reorder List", difficulty: "medium", pattern: "Linked List", status: "pending", companies: ["Amazon", "Meta"] },
  { id: 58, title: "LRU Cache", difficulty: "medium", pattern: "Linked List", status: "pending", companies: ["Amazon", "Meta", "Google"] },
  
  // Heap/Priority Queue
  { id: 59, title: "Kth Largest Element in an Array", difficulty: "medium", pattern: "Heap", status: "pending", companies: ["Meta", "Amazon"] },
  { id: 60, title: "Merge K Sorted Lists", difficulty: "hard", pattern: "Heap", status: "pending", companies: ["Amazon", "Meta", "Google"] },
  { id: 61, title: "Find Median from Data Stream", difficulty: "hard", pattern: "Heap", status: "pending", companies: ["Amazon", "Google"] },
  { id: 62, title: "K Closest Points to Origin", difficulty: "medium", pattern: "Heap", status: "pending", companies: ["Meta", "Amazon"] },
  
  // Backtracking
  { id: 63, title: "Subsets", difficulty: "medium", pattern: "Backtracking", status: "pending", companies: ["Amazon", "Meta"] },
  { id: 64, title: "Permutations", difficulty: "medium", pattern: "Backtracking", status: "pending", companies: ["Amazon", "Meta"] },
  { id: 65, title: "Combination Sum", difficulty: "medium", pattern: "Backtracking", status: "pending", companies: ["Amazon", "Meta"] },
  { id: 66, title: "Word Search", difficulty: "medium", pattern: "Backtracking", status: "pending", companies: ["Amazon", "Microsoft"] },
  { id: 67, title: "N-Queens", difficulty: "hard", pattern: "Backtracking", status: "pending", companies: ["Amazon", "Google"] },
  { id: 68, title: "Letter Combinations of a Phone Number", difficulty: "medium", pattern: "Backtracking", status: "pending", companies: ["Meta", "Amazon"] },
];

const Problems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const { user } = useAuth();
  const { data: allProgress } = useAllProgress();

  // Build a map of problem_id -> status from DB
  const progressMap = new Map<string, string>();
  if (allProgress) {
    allProgress.forEach((p) => {
      progressMap.set(p.problem_id, p.status);
    });
  }

  const getStatus = (problemId: number) => {
    if (!user) return "pending";
    const dbStatus = progressMap.get(String(problemId));
    if (dbStatus === "completed") return "completed";
    if (dbStatus === "in_progress" || dbStatus === "in-progress") return "in-progress";
    return "pending";
  };

  const patterns = [...new Set(problems.map(p => p.pattern))];
  
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.pattern.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || problem.difficulty === selectedDifficulty;
    const matchesPattern = !selectedPattern || problem.pattern === selectedPattern;
    return matchesSearch && matchesDifficulty && matchesPattern;
  });

  const completed = problems.filter(p => getStatus(p.id) === "completed").length;
  const inProgress = problems.filter(p => getStatus(p.id) === "in-progress").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Problem Library</h1>
            <p className="text-muted-foreground">
              Master each problem with our step-locked learning approach
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-2xl font-bold">{completed}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">{inProgress}</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{problems.length}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card variant="elevated" className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search problems or patterns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedDifficulty === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(null)}
                  >
                    All
                  </Button>
                  {["easy", "medium", "hard"].map((diff) => (
                    <Button
                      key={diff}
                      variant={selectedDifficulty === diff ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(diff)}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Pattern Filter */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Patterns:
                </span>
                <Button
                  variant={selectedPattern === null ? "step-active" : "step"}
                  size="sm"
                  onClick={() => setSelectedPattern(null)}
                >
                  All
                </Button>
                {patterns.map((pattern) => (
                  <Button
                    key={pattern}
                    variant={selectedPattern === pattern ? "step-active" : "step"}
                    size="sm"
                    onClick={() => setSelectedPattern(pattern)}
                  >
                    {pattern}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Problem List */}
          <div className="space-y-3">
            {filteredProblems.map((problem) => {
              const status = getStatus(problem.id);
              return (
              <Link key={problem.id} to={`/problems/${problem.id}`}>
                <Card variant="interactive" className="group">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center
                          ${status === "completed" ? "bg-success/10" : 
                            status === "in-progress" ? "bg-warning/10" : "bg-muted"}
                        `}>
                          {status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : status === "in-progress" ? (
                            <Clock className="h-5 w-5 text-warning" />
                          ) : (
                            <Target className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="font-semibold group-hover:text-primary transition-colors">
                              {problem.id}. {problem.title}
                            </p>
                            <Badge variant={problem.difficulty as "easy" | "medium" | "hard"}>
                              {problem.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {problem.pattern}
                            </span>
                            <div className="flex gap-1">
                              {problem.companies.slice(0, 2).map((company) => (
                                <Badge key={company} variant="secondary" className="text-xs">
                                  {company}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Problems;
