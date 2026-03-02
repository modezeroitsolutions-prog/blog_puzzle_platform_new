"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdBanner } from "@/components/AdBanner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";
import { createPuzzle } from "@/lib/puzzles";
import { Puzzle, ArrowLeft, CheckCircle } from "lucide-react";

export default function CreatePuzzlePage() {
  const router = useRouter();
  const { firebaseUser, firestoreUser, loading: authLoading } = useAuth();
  const currentUser = firebaseUser && firestoreUser;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    question: "",
    answer: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              You must be logged in to create puzzles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser?.uid || !firestoreUser) return;
    setSubmitting(true);
    try {
      await createPuzzle({
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        category: formData.category,
        question: formData.question,
        answer: formData.answer,
        reward: estimatedReward(),
        creatorId: firebaseUser.uid,
        creatorName: firestoreUser.email,
      });
      setSubmitted(true);
      setTimeout(() => router.push("/puzzles"), 2000);
    } catch {
      setLoadErr("Failed to create puzzle");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const estimatedReward = () => {
    switch (formData.difficulty) {
      case "easy":
        return 5;
      case "medium":
        return 10;
      case "hard":
        return 15;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Create a New Puzzle</h1>
          <p className="text-xl text-blue-100">
            Share your creativity and earn money when others solve your puzzle
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/puzzles">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Puzzles
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Puzzle className="w-6 h-6" />
                  Puzzle Details
                </CardTitle>
                <CardDescription>
                  Fill in all the details to create your puzzle. Make sure
                  it&apos;s clear and solvable!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Success!</strong> Your puzzle has been submitted
                      and is under review. Redirecting...
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Puzzle Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          handleChange("title", e.target.value)
                        }
                        placeholder="e.g., The Missing Number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Short Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        placeholder="A brief description of what the puzzle is about"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(v) => handleChange("category", v)}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Math">Math</SelectItem>
                            <SelectItem value="Logic">Logic</SelectItem>
                            <SelectItem value="Riddle">Riddle</SelectItem>
                            <SelectItem value="Pattern">Pattern</SelectItem>
                            <SelectItem value="Word">Word</SelectItem>
                            <SelectItem value="Visual">Visual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty *</Label>
                        <Select
                          value={formData.difficulty}
                          onValueChange={(v) =>
                            handleChange("difficulty", v)
                          }
                        >
                          <SelectTrigger id="difficulty">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy ($5)</SelectItem>
                            <SelectItem value="medium">Medium ($10)</SelectItem>
                            <SelectItem value="hard">Hard ($15)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="question">Puzzle Question *</Label>
                      <Textarea
                        id="question"
                        value={formData.question}
                        onChange={(e) =>
                          handleChange("question", e.target.value)
                        }
                        placeholder="Write your puzzle question here. Be clear and specific."
                        rows={5}
                        required
                      />
                      <p className="text-sm text-slate-600">
                        Make sure your question is clear and unambiguous
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="answer">Correct Answer *</Label>
                      <Input
                        id="answer"
                        value={formData.answer}
                        onChange={(e) =>
                          handleChange("answer", e.target.value)
                        }
                        placeholder="Enter the correct answer"
                        required
                      />
                      <p className="text-sm text-slate-600">
                        This will be used to verify solver submissions
                        (not case-sensitive)
                      </p>
                    </div>
                    <div className="flex gap-3 pt-4">
                      {loadErr && <p className="text-sm text-red-600">{loadErr}</p>}
                      <Button type="submit" size="lg" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Puzzle"}
                      </Button>
                      <Button type="button" variant="outline" size="lg" asChild>
                        <Link href="/puzzles">Cancel</Link>
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Earning Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Base Reward</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${estimatedReward().toFixed(2)}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-slate-700 mb-2">
                      Additional bonuses:
                    </p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• $2 per 10 solves</li>
                      <li>• $10 for top-rated puzzle</li>
                      <li>• $5 monthly popularity bonus</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips for Success</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>✓ Make sure your puzzle is original</p>
                <p>✓ Test it with friends first</p>
                <p>✓ Use clear, unambiguous language</p>
                <p>✓ Provide enough information to solve</p>
                <p>✓ Avoid trick questions</p>
                <p>✓ Double-check your answer</p>
              </CardContent>
            </Card>
            <AdBanner size="medium" position="sidebar" />
          </div>
        </div>
      </div>
    </div>
  );
}
