#!/usr/bin/env node
/**
 * Use the project's actual getArticles() function to find problematic posts.
 */

const path = require("path");
const fs = require("fs");

// Set working directory
process.chdir("D:\\code\\catnuko.github.io");

// Use the same gray-matter the project uses
const matter = require("gray-matter");

const articlesDir = path.join(process.cwd(), "src", "app", "blog", "posts");

function collectMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  let out = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out = out.concat(collectMdFiles(full));
    else if (item.endsWith(".mdx") || item.endsWith(".md")) out.push(full);
  }
  return out;
}

const files = collectMdFiles(articlesDir);

console.log(`Loading ${files.length} articles using project's logic...\n`);

const articles = [];
for (const file of files) {
  const fpath = file;
  const rawContent = fs.readFileSync(fpath, "utf-8");
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

  // Check for issues
  const issues = [];
  if (!metadata.title) issues.push("EMPTY title");
  if (!metadata.summary) issues.push("EMPTY summary");
  if (!metadata.publishedAt) issues.push("EMPTY publishedAt");
  if (metadata.publishedAt) {
    const testDate = metadata.publishedAt.includes("T") ? metadata.publishedAt : metadata.publishedAt + "T00:00:00";
    const d = new Date(testDate);
    if (isNaN(d.getTime())) {
      issues.push(`INVALID date: ${metadata.publishedAt}`);
    }
  }

  if (issues.length > 0) {
    console.log(`  \u274c ${file}: ${issues.join(", ")}`);
    console.log(`     title: ${JSON.stringify(metadata.title).slice(0, 60)}`);
    console.log(`     publishedAt: ${JSON.stringify(metadata.publishedAt)}`);
    console.log(`     data.publishedAt raw: ${JSON.stringify(data.publishedAt)}`);
    console.log(`     data.summary raw: ${JSON.stringify(data.summary).slice(0, 100)}`);
    console.log();
  }

  articles.push({ metadata, slug, content });
}

console.log(`\nTotal articles loaded: ${articles.length}`);

// Sort and show first 20
const sorted = articles.sort((a, b) =>
  new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
);

console.log("\n=== Sorted articles (top 20) ===");
sorted.slice(0, 20).forEach((a, i) => {
  const d = new Date(a.metadata.publishedAt + "T00:00:00");
  const dateStr = isNaN(d.getTime()) ? "INVALID" : d.toLocaleDateString("en-us", { month: "long", day: "numeric", year: "numeric" });
  console.log(`${i+1}. ${a.slug} -> ${dateStr} (title: ${a.metadata.title.slice(0, 30)})`);
});
