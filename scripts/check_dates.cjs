#!/usr/bin/env node
/**
 * Simulate the EXACT getArticles() behavior and check the actual date strings
 * to find anomalies.
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const postDir = "D:\\code\\catnuko.github.io\\src\\app\\blog\\posts";

const files = fs.readdirSync(postDir)
  .filter(f => f.endsWith(".mdx") || f.endsWith(".md"))
  .sort();

console.log("Detailed metadata check for all 34 files:\n");

for (const file of files) {
  const fpath = path.join(postDir, file);
  const rawContent = fs.readFileSync(fpath, "utf-8");
  const { data } = matter(rawContent);

  const metadata = {
    title: data.title || "",
    publishedAt: data.publishedAt || data.date || "",
    summary: data.summary || data.excerpt || "",
    tag: data.tag || data.tags || [],
  };

  // Test the date format
  const testDate = metadata.publishedAt.includes("T")
    ? metadata.publishedAt
    : metadata.publishedAt + "T00:00:00";
  const d = new Date(testDate);
  const valid = !isNaN(d.getTime());

  // Check for any anomalies
  const anomalies = [];
  if (metadata.publishedAt.length !== 10 && metadata.publishedAt.length !== 0) {
    anomalies.push(`date len=${metadata.publishedAt.length}`);
  }
  if (metadata.publishedAt && !metadata.publishedAt.match(/^\d{4}-\d{2}-\d{2}$/)) {
    anomalies.push(`date format wrong: "${metadata.publishedAt}"`);
  }
  if (!metadata.title) anomalies.push("no title");
  if (!metadata.summary) anomalies.push("no summary");

  if (!valid && metadata.publishedAt) {
    anomalies.push(`invalid date: "${metadata.publishedAt}"`);
  }

  if (anomalies.length > 0) {
    console.log(`  \u26a0\ufe0f ${file}: ${anomalies.join(", ")}`);
  } else {
    console.log(`  \u2705 ${file}: ${metadata.publishedAt} - "${metadata.title.slice(0, 30)}"`);
  }
}
