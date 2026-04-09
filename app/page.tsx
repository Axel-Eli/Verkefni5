import Link from "next/link";
import { getHomepageContent, getPostList } from "@/lib/cms";

export default async function Home() {
  const homepage = await getHomepageContent();
  const posts = await getPostList();
  const [newestPost, ...olderPosts] = posts;

  return (
    <main className="page-content">
      <section className="hero">
        <div className="hero-content">
          <h1>{homepage.title}</h1>
          <p className="hero-body">{homepage.description}</p>
          <div className="hero-actions">
            <Link href="/posts" className="pill-button">
              {homepage.calltoaction}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-grid">
        {newestPost ? (
          <article className="manifesto-panel featured-lead-panel">
            <div className="section-heading">
              <Link href={`/posts/${newestPost.slug}`} className="text-link">
                Lesa meira
              </Link>
            </div>
            <p className="featured-index">01</p>
            <p className="post-meta">{newestPost.publishedat}</p>
            <h2>{newestPost.title}</h2>
            <p>{newestPost.excerpt}</p>
          </article>
        ) : null}

        <section className="featured-panel">
          <div className="featured-list">
            {olderPosts.map((post, index) => (
              <article key={post.id} className="featured-item">
                <p className="featured-index">{String(index + 2).padStart(2, "0")}</p>
                <div>
                  <p className="post-meta">{post.publishedat}</p>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>

          <Link href="/posts" className="text-link archive-link">
            Skoða allar færslur
          </Link>
        </section>
      </section>
    </main>
  );
}
