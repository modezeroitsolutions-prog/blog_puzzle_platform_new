import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBlogsByAuthorId } from "@/lib/blogs";
import { Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserBlogsPage({ params }: PageProps) {
  const { id } = await params;
  const blogs = await getBlogsByAuthorId(id);
  if (blogs.length === 0) notFound();

  const authorName = blogs[0].author;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-6 -ml-2 text-white/90 hover:text-white hover:bg-white/10"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-blue-100 mb-2">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">Author</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-snug pb-1 break-words">{authorName}</h1>
          <p className="mt-2 text-white/80">
            {blogs.length} {blogs.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              {post.imageUrl ? (
                <div className="aspect-video w-full bg-muted">
                  <ImageWithFallback
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-blue-400/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-slate-400 font-medium">
                    {post.title.split(" ")[0]}
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2 leading-snug min-h-[2.75em]">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2 leading-snug">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                  <span>{post.author}</span>
                  {post.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.createdAt.toMillis()).toLocaleDateString()}
                    </span>
                  )}
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
    </div>
  );
}
