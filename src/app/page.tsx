import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdBanner } from "@/components/AdBanner";
import { getBlogs } from "@/lib/blogs";
import { mockBlogPosts } from "@/lib/mockData";
import { Calendar, User, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { HomeStats } from "@/components/HomeStats";

export default async function Home() {
  const mainBlogs = mockBlogPosts.map((m) => ({
    id: m.id,
    title: m.title,
    excerpt: m.excerpt,
    author: m.author,
    date: m.date,
    imageUrl: m.imageUrl ?? "",
  }));

  let posts: { id: string; title: string; excerpt: string; author: string; date: string; imageUrl: string }[] = mainBlogs;
  try {
    const fromDb = await getBlogs();
    const mainIds = new Set(mainBlogs.map((p) => p.id));
    const fromDbMapped = fromDb
      .filter((p) => !mainIds.has(p.id))
      .map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        author: p.author,
        date: p.createdAt ? new Date(p.createdAt.toMillis()).toISOString().slice(0, 10) : "",
        imageUrl: p.imageUrl ?? "",
      }));
    posts = [...mainBlogs, ...fromDbMapped];
  } catch {
    posts = mainBlogs;
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to PuzzleHub</h1>
            <p className="text-xl mb-8 text-blue-100">
              Create puzzles, solve challenges, and earn money while having fun!
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/create-blog">Create Blog</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/puzzles">Browse Puzzles</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <AdBanner size="large" position="top" />
        </div>

        <HomeStats />

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold">Latest from Our Blog</h2>
            <Button asChild>
              <Link href="/create-blog">Create Blog</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
                  {post.imageUrl ? (
                    <ImageWithFallback
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-white text-lg opacity-50">
                        {post.title.split(" ")[0]}
                      </span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date ? new Date(post.date).toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link href={`/blog/${post.id}`}>
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <AdBanner size="large" position="bottom" />
        </div>

        <div className="mt-12 bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-blue-600">
                For Puzzle Creators
              </h3>
              <ol className="space-y-2 list-decimal list-inside text-slate-700">
                <li>Sign up for a free account</li>
                <li>Create and submit your unique puzzle</li>
                <li>Get paid when users solve your puzzle</li>
                <li>Earn bonuses for popular puzzles</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-purple-600">
                For Puzzle Solvers
              </h3>
              <ol className="space-y-2 list-decimal list-inside text-slate-700">
                <li>Browse our extensive puzzle library</li>
                <li>Choose puzzles that interest you</li>
                <li>Solve them and earn rewards</li>
                <li>Climb the leaderboard for bonus prizes</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
