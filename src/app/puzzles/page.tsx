"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdBanner } from "@/components/AdBanner";
import { getPuzzles, type PuzzleDoc } from "@/lib/puzzles";
import { mockPuzzles } from "@/lib/mockData";
import { Search, TrendingUp, User, Calendar } from "lucide-react";

export default function PuzzleLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [puzzles, setPuzzles] = useState<PuzzleDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPuzzles(true)
      .then(setPuzzles)
      .catch(() => {
        setPuzzles(
          mockPuzzles.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            difficulty: p.difficulty,
            category: p.category,
            creatorId: p.creatorId,
            creatorName: p.creatorName,
            question: p.question,
            answer: p.answer,
            reward: p.reward,
            solveCount: p.solveCount,
            active: true,
            createdAt: { toMillis: () => new Date(p.createdDate).getTime() },
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPuzzles = puzzles.filter((puzzle) => {
    const matchesSearch =
      puzzle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      puzzle.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || puzzle.category === categoryFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || puzzle.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = Array.from(new Set(puzzles.map((p) => p.category)));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Puzzle Library</h1>
          <p className="text-xl text-blue-100">
            Solve puzzles and earn rewards!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <AdBanner size="large" position="top" />
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search puzzles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <p className="text-center text-slate-600 py-8">Loading puzzles...</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPuzzles.map((puzzle) => (
            <Card key={puzzle.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getDifficultyColor(puzzle.difficulty)}>
                    {puzzle.difficulty}
                  </Badge>
                  <span className="text-green-600 font-bold">
                    {puzzle.reward} coins
                  </span>
                </div>
                <CardTitle className="line-clamp-2 leading-snug min-h-[2.5em]">{puzzle.title}</CardTitle>
                <CardDescription className="line-clamp-2 leading-snug">
                  {puzzle.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{puzzle.creatorName ?? "—"}</span>
                    </div>
                    <Badge variant="outline">{puzzle.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{puzzle.solveCount} solves</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {puzzle.createdAt
                          ? new Date(puzzle.createdAt.toMillis()).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/puzzle/${puzzle.id}`}>Solve Puzzle</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {!loading && filteredPuzzles.length === 0 && (
          <Card className="p-12">
            <p className="text-center text-slate-600">
              No puzzles found matching your filters. Try adjusting your search
              criteria.
            </p>
          </Card>
        )}

        <div className="mt-8">
          <AdBanner size="large" position="bottom" />
        </div>
      </div>
    </div>
  );
}
