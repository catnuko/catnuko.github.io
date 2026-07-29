import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string | string[];
  tags?: string[];
  team: Team[];
  link?: string;
};

type PostData = {
  metadata: Metadata;
  slug: string;
  content: string;
};

function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const results: string[] = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // Recurse into subfolders so posts can be grouped by category.
      results.push(...getMDXFiles(fullPath));
    } else if (path.extname(item) === ".mdx" || path.extname(item) === ".md") {
      results.push(fullPath);
    }
  }
  return results;
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    subtitle: data.subtitle || "",
    publishedAt: data.publishedAt || data.date || "",
    summary: data.summary || data.excerpt || "",
    image: data.image || data.coverImage || "",
    images: data.images || [],
    tag: data.tag || data.tags || [],
    team: data.team || [],
    link: data.link || "",
  };

  return { metadata, content };
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((filePath) => {
    const { metadata, content } = readMDXFile(filePath);
    // Slug stays as the file basename so public URLs (/blog/<slug>) are stable
    // regardless of which category folder the file lives in.
    const slug = path.basename(filePath, path.extname(filePath));
    return { metadata, slug, content };
  });
}

export function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir);
}

// Read articles from src/app/blog/posts/ directory
export function getArticles(): PostData[] {
  const articlesDir = path.join(process.cwd(), "src", "app", "blog", "posts");
  return getMDXData(articlesDir);
}

// Get a single article by slug from src/app/blog/posts/
// (searches recursively through category subfolders; slug = file basename)
export function getArticleBySlug(slug: string): PostData | null {
  const articlesDir = path.join(process.cwd(), "src", "app", "blog", "posts");
  const mdxFiles = getMDXFiles(articlesDir);
  const match = mdxFiles.find(
    (file) => path.basename(file, path.extname(file)) === slug,
  );
  if (!match) {
    return null;
  }
  return { ...readMDXFile(match), slug };
}
