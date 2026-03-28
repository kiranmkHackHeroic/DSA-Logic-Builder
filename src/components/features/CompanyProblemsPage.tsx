import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Building2,
  Search,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import FeatureLayout from "@/components/layout/FeatureLayout";

// Company data with problem counts
const COMPANIES = [
  { id: "google", name: "Google", logo: "🔍", problems: 450, color: "bg-blue-500/10 text-blue-500" },
  { id: "amazon", name: "Amazon", logo: "📦", problems: 380, color: "bg-orange-500/10 text-orange-500" },
  { id: "meta", name: "Meta", logo: "👤", problems: 320, color: "bg-blue-600/10 text-blue-600" },
  { id: "apple", name: "Apple", logo: "🍎", problems: 250, color: "bg-gray-500/10 text-gray-700" },
  { id: "microsoft", name: "Microsoft", logo: "🪟", problems: 340, color: "bg-cyan-500/10 text-cyan-500" },
  { id: "netflix", name: "Netflix", logo: "🎬", problems: 120, color: "bg-red-500/10 text-red-500" },
  { id: "uber", name: "Uber", logo: "🚗", problems: 180, color: "bg-gray-800/10 text-gray-800" },
  { id: "airbnb", name: "Airbnb", logo: "🏠", problems: 150, color: "bg-pink-500/10 text-pink-500" },
  { id: "linkedin", name: "LinkedIn", logo: "💼", problems: 200, color: "bg-blue-700/10 text-blue-700" },
  { id: "twitter", name: "Twitter", logo: "🐦", problems: 130, color: "bg-sky-500/10 text-sky-500" },
  { id: "bloomberg", name: "Bloomberg", logo: "📊", problems: 220, color: "bg-amber-500/10 text-amber-500" },
  { id: "salesforce", name: "Salesforce", logo: "☁️", problems: 160, color: "bg-blue-400/10 text-blue-400" },
];

// Mock problems with company tags
const PROBLEMS_WITH_COMPANIES = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "easy" as const,
    pattern: "Hash Map",
    companies: ["google", "amazon", "meta", "apple", "microsoft"],
    frequency: 95,
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "easy" as const,
    pattern: "Stack",
    companies: ["amazon", "meta", "bloomberg"],
    frequency: 88,
  },
  {
    id: 3,
    title: "Merge Intervals",
    difficulty: "medium" as const,
    pattern: "Intervals",
    companies: ["google", "meta", "uber", "linkedin"],
    frequency: 82,
  },
  {
    id: 4,
    title: "LRU Cache",
    difficulty: "medium" as const,
    pattern: "Design",
    companies: ["amazon", "microsoft", "google", "netflix"],
    frequency: 90,
  },
  {
    id: 5,
    title: "Trapping Rain Water",
    difficulty: "hard" as const,
    pattern: "Two Pointers",
    companies: ["google", "amazon", "apple", "bloomberg"],
    frequency: 75,
  },
  {
    id: 6,
    title: "Word Break",
    difficulty: "medium" as const,
    pattern: "Dynamic Programming",
    companies: ["meta", "amazon", "uber"],
    frequency: 78,
  },
  {
    id: 7,
    title: "Number of Islands",
    difficulty: "medium" as const,
    pattern: "Graph/BFS",
    companies: ["amazon", "google", "microsoft", "meta"],
    frequency: 92,
  },
  {
    id: 8,
    title: "Reverse Linked List",
    difficulty: "easy" as const,
    pattern: "Linked List",
    companies: ["amazon", "microsoft", "apple"],
    frequency: 85,
  },
];

type SortOption = "frequency" | "difficulty";

const CompanyProblemsPage = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("frequency");

  const filteredProblems = PROBLEMS_WITH_COMPANIES.filter((problem) => {
    const matchesCompany =
      !selectedCompany || problem.companies.includes(selectedCompany);
    const matchesDifficulty =
      selectedDifficulty === "all" || problem.difficulty === selectedDifficulty;
    const matchesSearch =
      !searchQuery ||
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.pattern.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCompany && matchesDifficulty && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "frequency") return b.frequency - a.frequency;
    const diffOrder = { easy: 0, medium: 1, hard: 2 };
    return diffOrder[a.difficulty] - diffOrder[b.difficulty];
  });

  const selectedCompanyData = COMPANIES.find((c) => c.id === selectedCompany);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          Company Problems
        </h1>
        <p className="text-muted-foreground">
          Practice problems frequently asked by top tech companies
        </p>
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {COMPANIES.map((company) => (
          <Card
            key={company.id}
            className={`cursor-pointer transition-all hover:border-primary/50 ${
              selectedCompany === company.id ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={() =>
              setSelectedCompany(
                selectedCompany === company.id ? null : company.id
              )
            }
          >
            <CardContent className="pt-4 text-center">
              <span className="text-3xl mb-2 block">{company.logo}</span>
              <h3 className="font-semibold text-sm">{company.name}</h3>
              <p className="text-xs text-muted-foreground">
                {company.problems} problems
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Company Info */}
      {selectedCompanyData && (
        <Card className={`${selectedCompanyData.color}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selectedCompanyData.logo}</span>
                <div>
                  <h2 className="text-xl font-bold">{selectedCompanyData.name}</h2>
                  <p className="text-sm opacity-80">
                    {selectedCompanyData.problems} problems in database
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {filteredProblems.length}
                  </p>
                  <p className="text-xs opacity-80">Matching</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frequency">Frequency</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Problems List */}
      <div className="space-y-3">
        {filteredProblems.map((problem) => (
          <Card
            key={problem.id}
            className="group hover:border-primary/30 transition-all"
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                    #{problem.id}
                  </div>
                  <div>
                    <h3 className="font-semibold">{problem.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={problem.difficulty}>
                        {problem.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {problem.pattern}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{problem.frequency}%</span>
                  </div>
                  <div className="flex -space-x-1">
                    {problem.companies.slice(0, 4).map((companyId) => {
                      const company = COMPANIES.find((c) => c.id === companyId);
                      return (
                        <div
                          key={companyId}
                          className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center border-2 border-background text-xs"
                          title={company?.name}
                        >
                          {company?.logo}
                        </div>
                      );
                    })}
                    {problem.companies.length > 4 && (
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center border-2 border-background text-xs">
                        +{problem.companies.length - 4}
                      </div>
                    )}
                  </div>
                  <Link to={`/problems/${problem.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const CompanyProblemsPageWithLayout = () => (
  <FeatureLayout>
    <CompanyProblemsPage />
  </FeatureLayout>
);

export default CompanyProblemsPageWithLayout;
