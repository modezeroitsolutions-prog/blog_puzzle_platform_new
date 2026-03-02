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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";
import { createBlog } from "@/lib/blogs";
import { BookOpen, ArrowLeft, CheckCircle } from "lucide-react";

export default function CreateBlogPage() {
  const router = useRouter();
  const { firebaseUser, firestoreUser, loading: authLoading } = useAuth();
  const currentUser = firebaseUser && firestoreUser;
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: firestoreUser?.email ?? "",
    imageUrl: "",
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
              You must be logged in to create a blog post
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
    if (!firestoreUser) return;
    setSubmitting(true);
    setLoadErr("");
    try {
      await createBlog({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author || firestoreUser.email,
        authorId: firebaseUser?.uid,
        imageUrl: formData.imageUrl || undefined,
      });
      setSubmitted(true);
      setTimeout(() => router.push("/"), 2000);
    } catch {
      setLoadErr("Failed to create blog post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Create a New Blog Post</h1>
          <p className="text-xl text-blue-100">
            Share your ideas and write for the community
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Blog Post Details
            </CardTitle>
            <CardDescription>
              Fill in the title, excerpt, and content. Author will default to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Success!</strong> Your blog post has been published. Redirecting...
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="e.g., Tips for Creating Great Puzzles"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Short excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleChange("excerpt", e.target.value)}
                    placeholder="A brief summary shown in the blog list"
                    rows={2}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author name</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleChange("author", e.target.value)}
                    placeholder={firestoreUser?.email ?? "Your name or email"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (optional)</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleChange("imageUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    placeholder="Write your full blog post here. You can use multiple paragraphs."
                    rows={12}
                    required
                  />
                </div>
                {loadErr && (
                  <p className="text-sm text-red-600">{loadErr}</p>
                )}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" size="lg" disabled={submitting}>
                    {submitting ? "Publishing..." : "Publish Post"}
                  </Button>
                  <Button type="button" variant="outline" size="lg" asChild>
                    <Link href="/">Cancel</Link>
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
