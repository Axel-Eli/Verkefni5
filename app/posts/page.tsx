import Link from "next/link";
import { getPostList } from "@/lib/cms";

export default async function PostsPage() {
  const posts = await getPostList();

  return (
    <main className="page-content">
      <section className="page-header">
        <p className="eyebrow">Article list</p>
        <h1>Editable posts from your CMS</h1>
        <p>Each post should be managed in the headless CMS so it can be updated without changing the code.</p>
      </section>

      <section className="post-list">
        {posts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-card-content">
              <p className="post-meta">{post.publishedat}</p>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </div>
            <Link className="post-link" href={`/posts/${post.slug}`}>
              Read article
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
