"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdBanner } from "@/components/AdBanner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";
import {
  getPuzzleById,
  getPuzzles,
  hasUserSolved,
  recordSolveAndReward,
  type PuzzleDoc,
} from "@/lib/puzzles";
import { mockPuzzles } from "@/lib/mockData";
import {
  ArrowLeft,
  User,
  Calendar,
  TrendingUp,
  Trophy,
  AlertCircle,
} from "lucide-react";

export default function SolvePuzzlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { firebaseUser, firestoreUser } = useAuth();
  const [puzzle, setPuzzle] = useState<PuzzleDoc | null>(null);
  const [alreadySolved, setAlreadySolved] = useState(false);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fromMock, setFromMock] = useState(false);
  const [similar, setSimilar] = useState<PuzzleDoc[]>([]);

  useEffect(() => {
    getPuzzleById(id)
      .then((p) => {
        if (p) {
          setPuzzle(p);
          setFromMock(false);
        } else {
          const mock = mockPuzzles.find((m) => m.id === id);
          if (mock) {
            setPuzzle({
              id: mock.id,
              title: mock.title,
              description: mock.description,
              difficulty: mock.difficulty,
              category: mock.category,
              creatorId: mock.creatorId,
              creatorName: mock.creatorName,
              question: mock.question,
              answer: mock.answer,
              reward: mock.reward,
              solveCount: mock.solveCount,
              active: true,
              createdAt: { toMillis: () => new Date(mock.createdDate).getTime() },
            });
            setFromMock(true);
          } else {
            setPuzzle(null);
          }
        }
      })
      .catch(() => {
        const mock = mockPuzzles.find((m) => m.id === id);
        if (mock) {
          setPuzzle({
            id: mock.id,
            title: mock.title,
            description: mock.description,
            difficulty: mock.difficulty,
            category: mock.category,
            creatorId: mock.creatorId,
            creatorName: mock.creatorName,
            question: mock.question,
            answer: mock.answer,
            reward: mock.reward,
            solveCount: mock.solveCount,
            active: true,
            createdAt: { toMillis: () => new Date(mock.createdDate).getTime() },
          });
          setFromMock(true);
        } else {
          setPuzzle(null);
        }
      });
  }, [id]);

  useEffect(() => {
    if (!firebaseUser?.uid || !id) return;
    hasUserSolved(firebaseUser.uid, id).then(setAlreadySolved);
  }, [firebaseUser?.uid, id]);

  useEffect(() => {
    if (!id) return;
    getPuzzles(true)
      .then((list) => {
        setSimilar(
          list
            .filter((p) => p.id !== id && p.category === (puzzle?.category ?? ""))
            .slice(0, 3)
        );
      })
      .catch(() => setSimilar([]));
  }, [id, puzzle?.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser?.uid || !puzzle) {
      router.push("/login");
      return;
    }
    const isCorrect =
      answer.trim().toLowerCase() === puzzle.answer.toLowerCase();
    setResult(isCorrect ? "correct" : "incorrect");
    if (isCorrect) {
      setShowAnswer(true);
      if (!fromMock && firebaseUser?.uid) {
        setSubmitting(true);
        try {
          await recordSolveAndReward(
            firebaseUser.uid,
            puzzle.id,
            puzzle.reward,
            Math.round(puzzle.reward * 2)
          );
        } catch {
          // Keep showing success – answer was correct; reward save failed (e.g. permissions)
        } finally {
          setSubmitting(false);
        }
      }
    }
  };

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

  if (puzzle === undefined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Puzzle not found</h2>
          <Button asChild>
            <Link href="/puzzles">Browse Puzzles</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const currentUser = firebaseUser && firestoreUser;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/puzzles">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Puzzles
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(puzzle.difficulty)}>
                        {puzzle.difficulty}
                      </Badge>
                      <Badge variant="outline">{puzzle.category}</Badge>
                    </div>
                    <CardTitle className="text-3xl leading-snug pb-1 break-words">{puzzle.title}</CardTitle>
                    <CardDescription>{puzzle.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600 mb-1">Reward</div>
                    <div className="text-2xl font-bold text-green-600">
                      {puzzle.reward} coins
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 text-sm text-slate-600 pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Created by {puzzle.creatorName ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {puzzle.createdAt
                        ? new Date(puzzle.createdAt.toMillis()).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{puzzle.solveCount} solves</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Puzzle Question</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6">{puzzle.question}</p>

                {!currentUser && (
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You must be logged in to submit an answer.{" "}
                      <Link
                        href="/login"
                        className="text-blue-600 hover:underline"
                      >
                        Login here
                      </Link>
                    </AlertDescription>
                  </Alert>
                )}

                {alreadySolved && (
                  <Alert className="mb-6 bg-green-50 border-green-200">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      You already solved this puzzle and earned {puzzle.reward} coins.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Answer
                    </label>
                    <Input
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      disabled={!currentUser || result === "correct" || alreadySolved}
                      className="text-lg"
                    />
                  </div>

                  {result === "correct" && (
                    <Alert className="bg-green-50 border-green-200">
                      <Trophy className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Congratulations!</strong> You earned {puzzle.reward} coins
                        and {Math.round(puzzle.reward * 2)} XP!
                      </AlertDescription>
                    </Alert>
                  )}

                  {result === "incorrect" && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        That&apos;s not correct. Try again!
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={
                        !currentUser ||
                        !answer ||
                        result === "correct" ||
                        alreadySolved ||
                        submitting
                      }
                    >
                      {submitting ? "Recording..." : "Submit Answer"}
                    </Button>
                    {result === "correct" && (
                      <Button variant="outline" asChild>
                        <Link href="/puzzles">Solve Another Puzzle</Link>
                      </Button>
                    )}
                  </div>
                </form>

                {(showAnswer || alreadySolved) && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Answer
                    </p>
                    <p className="text-blue-800">{puzzle.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <AdBanner size="medium" position="sidebar" />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Similar Puzzles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {similar.map((similarPuzzle) => (
                  <div
                    key={similarPuzzle.id}
                    className="pb-4 border-b border-border last:border-0"
                  >
                    <h4 className="font-medium mb-1">{similarPuzzle.title}</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      {similarPuzzle.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge
                        className={getDifficultyColor(similarPuzzle.difficulty)}
                        variant="outline"
                      >
                        {similarPuzzle.difficulty}
                      </Badge>
                      <Button size="sm" variant="link" className="p-0 h-auto" asChild>
                        <Link href={`/puzzle/${similarPuzzle.id}`}>Solve</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <AdBanner size="medium" position="sidebar" />
          </div>
        </div>
      </div>
    </div>
  );
}
