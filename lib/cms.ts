export interface HomepageContent {
  title: string;
  description: string;
  callToAction: string;
}

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
}

export interface PostDetail extends PostSummary {
  content: string;
}

const fallbackHomepage: HomepageContent = {
  title: "Dynamic content, ready for your CMS",
  description:
    "This starter app is ready to fetch editable content from a headless CMS. Replace the fallback data by configuring a CMS endpoint and token.",
  callToAction: "Browse articles",
};

const fallbackPosts: PostDetail[] = [
  {
    id: "1",
    slug: "nextjs-with-cms",
    title: "Build a Next.js site with CMS content",
    excerpt: "Learn how to render editable homepage and article content with a headless CMS.",
    publishedAt: "2026-04-08",
    content:
      "This project uses a content provider layer so your CMS can replace static content without changing the UI. Start by modeling posts with title, excerpt, slug, and body in your chosen CMS.",
  },
  {
    id: "2",
    slug: "styling-with-sass",
    title: "Style the app with Sass",
    excerpt: "Use Sass for global and page-level styling in the App Router.",
    publishedAt: "2026-04-07",
    content:
      "The app already has a Sass-based stylesheet. Add more styles in component-specific SCSS files or in the global stylesheet as needed.",
  },
  {
    id: "3",
    slug: "deploy-to-vercel",
    title: "Deploy the finished site to Vercel",
    excerpt: "Push to GitHub, connect to Vercel, and add environment variables for your CMS.",
    publishedAt: "2026-04-06",
    content:
      "After connecting the CMS and confirming the site works locally, deploy to Vercel and make sure your CMS variables are available in production.",
  },
];

const cmsApiUrl = process.env.CMS_API_URL;
const cmsApiToken = process.env.CMS_API_TOKEN;
const useFallback = !cmsApiUrl || !cmsApiToken;

async function fetchCms<T>(path: string): Promise<T> {
  if (!cmsApiUrl || !cmsApiToken) {
    throw new Error("Missing CMS_API_URL or CMS_API_TOKEN in environment.");
  }

  const response = await fetch(`${cmsApiUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${cmsApiToken}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`CMS request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getHomepageContent(): Promise<HomepageContent> {
  if (useFallback) {
    return fallbackHomepage;
  }

  const data = await fetchCms<any>("/homepage");

  return {
    title: data.title ?? fallbackHomepage.title,
    description: data.description ?? fallbackHomepage.description,
    callToAction: data.call_to_action ?? fallbackHomepage.callToAction,
  };
}

export async function getPostList(): Promise<PostSummary[]> {
  if (useFallback) {
    return fallbackPosts.map(({ content, ...summary }) => summary);
  }

  const data = await fetchCms<any>("/posts?sort=publishedAt:desc");

  return data.map((item: any) => ({
    id: String(item.id),
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt || item.summary || "",
    publishedAt: item.publishedAt ?? item.published_at ?? "",
  }));
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  if (useFallback) {
    const post = fallbackPosts.find((item) => item.slug === slug);
    return post ?? null;
  }

  const data = await fetchCms<any>(`/posts?filters[slug][$eq]=${encodeURIComponent(slug)}`);
  const post = Array.isArray(data) ? data[0] : data;

  if (!post) {
    return null;
  }

  return {
    id: String(post.id),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || post.summary || "",
    publishedAt: post.publishedAt ?? post.published_at ?? "",
    content: post.content ?? post.body ?? "",
  };
}
