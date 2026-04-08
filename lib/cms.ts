export interface HomepageContent {
  title: string;
  description: string;
  calltoaction: string;
}

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedat: string;
}

export interface PostDetail extends PostSummary {
  content: string;
}

const fallbackHomepage: HomepageContent = {
  title: "Velkomin á verkefnið",
  description: "Þetta er verkefni með Next.js og headless CMS. Tengdu við DatoCMS til að sjá raunverulegt efni.",
  calltoaction: "Skoða færslur",
};

const fallbackPosts: PostDetail[] = [
  {
    id: "1",
    slug: "nextjs-with-cms",
    title: "Next.js og headless CMS",
    excerpt: "Dæmi um hvernig hægt er að birta efni frá CMS í Next.js.",
    publishedat: "2026-04-08",
    content:
      "Þessi færsla er sýnishorn. Tengdu við DatoCMS til að sækja þetta efni beint úr gagnagrunni.",
  },
  {
    id: "2",
    slug: "sass-styling",
    title: "Styling með Sass",
    excerpt: "Náðu stjórn á stíl með Sass í App Router verkefni.",
    publishedat: "2026-04-07",
    content: "Þessi færsla sýnir hvernig hægt er að nota Sass í Next.js verkefni fyrir hreinan og sveigjanlegan stíl.",
  },
  {
    id: "3",
    slug: "vercel-deployment",
    title: "Setja verkefnið á Vercel",
    excerpt: "Besta leiðin til að hýsa Next.js verkefni er á Vercel.",
    publishedat: "2026-04-06",
    content: "Þegar þú tengir verkefnið við GitHub og setur upp umhverfisbreytur getur þú hýst það á Vercel á nokkrum mínútum.",
  },
];

const cmsApiUrl = process.env.CMS_API_URL;
const cmsApiToken = process.env.CMS_API_TOKEN;
const useFallback = !cmsApiUrl || !cmsApiToken;

console.log("[CMS] Env vars loaded:", {
  CMS_API_URL: cmsApiUrl ? "✓ present" : "✗ missing",
  CMS_API_TOKEN: cmsApiToken ? "✓ present" : "✗ missing",
  useFallback,
});

interface DatoCmsResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

async function fetchDatoCms<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!cmsApiUrl || !cmsApiToken) {
    throw new Error("Missing CMS_API_URL or CMS_API_TOKEN in environment.");
  }

  console.log("[CMS] Fetching query:", query.substring(0, 50) + "...");

  const response = await fetch(cmsApiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cmsApiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    console.error("[CMS] Request failed:", response.status, response.statusText);
    throw new Error(`DatoCMS request failed: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as DatoCmsResponse<T>;

  if (json.errors && json.errors.length > 0) {
    console.error("[CMS] GraphQL errors:", json.errors);
    throw new Error(`DatoCMS GraphQL error: ${json.errors.map((error) => error.message).join(", ")}`);
  }

  console.log("[CMS] Response received:", JSON.stringify(json).substring(0, 100) + "...");
  return json.data;
}

export async function getHomepageContent(): Promise<HomepageContent> {
  if (useFallback) {
    console.log("[CMS] Using fallback homepage content");
    return fallbackHomepage;
  }

  const query = `query Homepage { homepage { title description calltoaction } }`;
  const data = await fetchDatoCms<{ homepage: { title?: string; description?: string; calltoaction?: string } }>(query);

  const result = {
    title: data.homepage?.title ?? fallbackHomepage.title,
    description: data.homepage?.description ?? fallbackHomepage.description,
    calltoaction: data.homepage?.calltoaction ?? fallbackHomepage.calltoaction,
  };
  console.log("[CMS] Homepage returned:", result);
  return result;
}

export async function getPostList(): Promise<PostSummary[]> {
  if (useFallback) {
    console.log("[CMS] Using fallback posts");
    return fallbackPosts.map(({ content, ...summary }) => summary);
  }

  const query = `query AllPosts { allPosts { id slug title excerpt publishedat } }`;
  const data = await fetchDatoCms<{ allPosts: Array<{ id: string; slug: string; title: string; excerpt?: string; publishedat?: string }> }>(query);

  const posts = data.allPosts.map((post) => ({
    id: String(post.id),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    publishedat: post.publishedat ?? "",
  }));

  console.log("[CMS] Posts returned:", posts.length, "posts");
  return posts.sort((a, b) => (a.publishedat > b.publishedat ? -1 : 1));
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  if (useFallback) {
    console.log("[CMS] Using fallback post for slug:", slug);
    return fallbackPosts.find((item) => item.slug === slug) ?? null;
  }

  console.log("[CMS] Fetching post by slug:", slug);
  const query = `query PostBySlug($slug: String) { allPosts(filter: { slug: { eq: $slug } }) { id slug title excerpt content publishedat } }`;
  const data = await fetchDatoCms<{ allPosts: Array<{ id: string; slug: string; title: string; excerpt?: string; content?: string; publishedat?: string }> }>(query, { slug });

  const post = data.allPosts[0];
  if (!post) {
    console.log("[CMS] No post found for slug:", slug);
    return null;
  }

  const result = {
    id: String(post.id),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    publishedat: post.publishedat ?? "",
    content: post.content ?? "",
  };
  console.log("[CMS] Post returned:", result.slug);
  return result;
}
