import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostList } from "@/lib/cms";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getPostList();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const contentBlocks = paragraphs.length > 0 ? paragraphs : [post.content];

  return (
    <main className="page-content">
      <section className="article-hero">
        <div className="article-headline-block">
          <h1>{post.title}</h1>
          <div className="article-submeta">
            <Link href="/posts" className="text-link">
              Til baka
            </Link>
            <p className="post-meta">{post.publishedat}</p>
          </div>
          <p className="article-lead">{post.excerpt}</p>
        </div>
      </section>

      <article className="post-detail article-detail simple-article">
        {contentBlocks.map((paragraph, index) => (
          <p key={`${post.id}-${index}`}>{paragraph}</p>
        ))}
      </article>
    </main>
  );
}
