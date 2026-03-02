import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdBanner } from "@/components/AdBanner";
import { getBlogById, getBlogs } from "@/lib/blogs";
import { mockBlogPosts } from "@/lib/mockData";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

interface PageProps {
  params: Promise<{ id: string }>;
}

type PostData = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorId?: string;
  dateStr: string;
  imageUrl: string;
};

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;

  let post: PostData | null = null;
  const fromDb = await getBlogById(id);
  if (fromDb) {
    post = {
      id: fromDb.id,
      title: fromDb.title,
      excerpt: fromDb.excerpt,
      content: fromDb.content,
      author: fromDb.author,
      authorId: fromDb.authorId,
      dateStr: fromDb.createdAt
        ? new Date(fromDb.createdAt.toMillis()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
      imageUrl: fromDb.imageUrl ?? "",
    };
  } else {
    const mock = mockBlogPosts.find((p) => p.id === id);
    if (mock) {
      post = {
        id: mock.id,
        title: mock.title,
        excerpt: mock.excerpt,
        content: mock.content,
        author: mock.author,
        dateStr: new Date(mock.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        imageUrl: mock.imageUrl ?? "",
      };
    }
  }

  if (!post) notFound();

  const authorHref = post.authorId
    ? `/user/${post.authorId}`
    : `/blog/author/${encodeURIComponent(post.author)}`;

  let related: { id: string; title: string; excerpt: string }[] = [];
  try {
    const allBlogs = await getBlogs();
    related = allBlogs
      .filter((p) => p.id !== id)
      .slice(0, 2)
      .map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
      }));
  } catch {
    related = mockBlogPosts
      .filter((p) => p.id !== id)
      .slice(0, 2)
      .map((p) => ({ id: p.id, title: p.title, excerpt: p.excerpt }));
  }
  if (related.length === 0) {
    related = mockBlogPosts
      .filter((p) => p.id !== id)
      .slice(0, 2)
      .map((p) => ({ id: p.id, title: p.title, excerpt: p.excerpt }));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Theme-aligned hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-6 -ml-2 text-white/90 hover:text-white hover:bg-white/10"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-blue-100 text-sm mb-4">
            <BookOpen className="w-4 h-4" />
            <span>Article</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 shrink-0" />
              <Link
                href={authorHref}
                className="hover:underline underline-offset-2"
              >
                {post.author}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{post.dateStr}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 pb-16">
        <Card className="shadow-lg border-border overflow-hidden">
          {post.imageUrl ? (
            <div className="aspect-video w-full bg-muted">
              <ImageWithFallback
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}
          <CardContent className="p-0">
            <div className={`px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 ${!post.imageUrl ? "pt-8 sm:pt-10" : ""} min-w-0 overflow-x-hidden`}>
              <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-[15px] sm:prose-p:text-base prose-p:last:mb-0 break-words">
                {post.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-wrap break-words">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10">
          <AdBanner size="large" position="article-bottom" />
        </div>

        <section className="mt-16 pt-12 border-t border-slate-200">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-4">
            Keep reading
          </p>
          <h2 className="text-2xl font-bold mb-6 text-slate-900">
            More Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((relatedPost) => (
              <Card
                key={relatedPost.id}
                className="hover:shadow-lg hover:border-slate-200 transition-all overflow-hidden group border border-slate-200/80"
              >
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {relatedPost.excerpt}
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 font-medium hover:text-blue-700"
                    asChild
                  >
                    <Link href={`/blog/${relatedPost.id}`}>Read More →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
