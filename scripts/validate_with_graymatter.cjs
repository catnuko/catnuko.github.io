#!/usr/bin/env node
/**
 * Use the actual gray-matter library (the same one the project uses)
 * to validate all WebGIS blog posts.
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const postDir = "D:\\code\\catnuko.github.io\\src\\app\\blog\\posts";

const webgisFiles = fs.readdirSync(postDir)
  .filter(f => f.endsWith(".mdx"))
  .sort();

console.log(`Validating ${webgisFiles.length} WebGIS files using gray-matter...\n`);

let valid = 0;
let invalid = 0;
const errors = [];

for (const fname of webgisFiles) {
  const fpath = path.join(postDir, fname);
  const content = fs.readFileSync(fpath, "utf-8");

  try {
    const parsed = matter(content);
    const data = parsed.data;

    // Check required fields
    const issues = [];
    if (!data.title) issues.push("missing title");
    if (!data.summary) issues.push("missing summary");
    if (!data.publishedAt) issues.push("missing publishedAt");
    if (data.publishedAt) {
      const d = new Date(data.publishedAt);
      if (isNaN(d.getTime())) {
        issues.push(`invalid date: ${data.publishedAt}`);
      }
    }
    if (!data.tag) issues.push("missing tag");

    if (issues.length > 0) {
      console.log(`  \u274c ${fname}: ${issues.join(", ")}`);
      invalid++;
      errors.push({ fname, issues, data });
    } else {
      valid++;
    }
  } catch (e) {
    console.log(`  \u274c ${fname}: PARSE ERROR - ${e.message}`);
    invalid++;
    errors.push({ fname, error: e.message });
  }
}

console.log(`\n=== Results ===`);
console.log(`Valid: ${valid}`);
console.log(`Invalid: ${invalid}`);
console.log(`Total: ${webgisFiles.length}`);
