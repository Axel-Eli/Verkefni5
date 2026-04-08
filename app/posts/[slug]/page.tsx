import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/cms";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="page-content">
      <section className="page-header">
        <p className="eyebrow">Article detail</p>
        <h1>{post.title}</h1>
        <p className="post-meta">Published: {post.publishedAt}</p>
      </section>

      <article className="post-detail">
        <p>{post.content}</p>
      </article>
    </main>
  );
}
