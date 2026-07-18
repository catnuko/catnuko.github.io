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

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    notFound();
  }
  return fs.readdirSync(dir).filter(
    (file) => path.extname(file) === ".mdx" || path.extname(file) === ".md",
  );
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
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));
    return { metadata, slug, content };
  });
}

export function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir);
}

// Read articles from public/articles/ directory
export function getArticles(): PostData[] {
  const articlesDir = path.join(process.cwd(), "public", "articles");
  return getMDXData(articlesDir);
}

// Get a single article by slug from public/articles/
export function getArticleBySlug(slug: string): PostData | null {
  const articlesDir = path.join(process.cwd(), "public", "articles");
  const filePath = path.join(articlesDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    // Also try with subdirectories (category/slug)
    const articles = getArticles();
    return articles.find((a) => a.slug === slug) || null;
  }

  return { ...readMDXFile(filePath), slug };
}
