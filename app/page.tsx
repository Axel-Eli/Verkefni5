import Link from "next/link";
import { getHomepageContent } from "@/lib/cms";

export default async function Home() {
  const homepage = await getHomepageContent();

  return (
    <main className="page-content">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Next.js + Headless CMS</p>
          <h1>{homepage.title}</h1>
          <p>{homepage.description}</p>
          <div className="hero-actions">
            <Link href="/posts" className="primary-button">
              {homepage.calltoaction}
            </Link>
          </div>
        </div>
      </section>

      <section className="next-steps">
        <h2>How it works</h2>
        <p>
          This app is already set up to use a CMS data layer. Later you can replace the fallback content by configuring
          a CMS endpoint and token in environment variables.
        </p>
      </section>
    </main>
  );
}
