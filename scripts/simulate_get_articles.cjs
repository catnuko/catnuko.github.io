#!/usr/bin/env node
/**
 * Directly use the project's getArticles() function via TypeScript compilation
 * or by replicating its behavior.
 */

process.chdir("D:\\code\\catnuko.github.io");

const path = require("path");
const fs = require("fs");
const matter = require("gray-matter");

const articlesDir = path.join(process.cwd(), "src", "app", "blog", "posts");

function collectMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  let out = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out = out.concat(collectMdFiles(full));
    else if (path.extname(item) === ".mdx" || path.extname(item) === ".md") out.push(full);
  }
  return out;
}

const files = collectMdFiles(articlesDir);

console.log(`Loading ${files.length} articles like utils.ts getArticles() does...\n`);

const allArticles = [];
for (const file of files) {
  const rawContent = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata = {
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

  const slug = path.basename(file, path.extname(file));
  allArticles.push({ metadata, slug, content });
}

// Sort like Posts.tsx does
const sorted = allArticles.sort((a, b) => {
  return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
});

console.log("All 34 articles sorted by publishedAt desc:\n");
sorted.forEach((article, i) => {
  const dateStr = article.metadata.publishedAt || "(no date)";
  const title = article.metadata.title || "(no title)";
  const isValid = article.metadata.publishedAt && !isNaN(new Date(article.metadata.publishedAt).getTime());

  const marker = isValid ? "  " : "X ";
  console.log(`${marker}${i+1}. [${dateStr}] ${article.slug} - ${title.slice(0, 40)}`);
});

// Check for articles with empty title or date
console.log("\n=== Articles with issues ===");
sorted.forEach((article, i) => {
  const issues = [];
  if (!article.metadata.title) issues.push("no title");
  if (!article.metadata.publishedAt) issues.push("no date");
  if (article.metadata.publishedAt && isNaN(new Date(article.metadata.publishedAt).getTime())) {
    issues.push("invalid date");
  }
  if (issues.length > 0) {
    console.log(`  ${i+1}. ${article.slug}: ${issues.join(", ")}`);
  }
});
