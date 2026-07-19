#!/usr/bin/env node
/**
 * Use the same front-matter library the project uses (in next.config.mjs)
 * to validate all blog posts.
 */

const fs = require("fs");
const path = require("path");
const fm = require("front-matter");

const postDir = "D:\\code\\catnuko.github.io\\src\\app\\blog\\posts";

const files = fs.readdirSync(postDir)
  .filter(f => f.endsWith(".mdx") || f.endsWith(".md"))
  .sort();

console.log(`Validating ${files.length} files using front-matter (the build-time parser)...\n`);

let valid = 0;
let invalid = 0;
const errors = [];

for (const fname of files) {
  const fpath = path.join(postDir, fname);
  const content = fs.readFileSync(fpath, "utf-8");

  try {
    const parsed = fm(content);
    const data = parsed.attributes;

    const issues = [];
    if (!data.title) issues.push("missing/empty title");
    if (!data.summary) issues.push("missing/empty summary");
    if (!data.publishedAt) issues.push("missing/empty publishedAt");
    if (data.publishedAt) {
      const d = new Date(data.publishedAt);
      if (isNaN(d.getTime())) {
        issues.push(`invalid date: ${data.publishedAt}`);
      }
    }

    if (issues.length > 0) {
      console.log(`  \u274c ${fname}: ${issues.join(", ")}`);
      invalid++;
      errors.push({ fname, issues, data: {
        title: data.title,
        summary: data.summary ? data.summary.slice(0, 80) : null,
        publishedAt: data.publishedAt,
      }});
    } else {
      valid++;
    }
  } catch (e) {
    console.log(`  \u274c ${fname}: PARSE ERROR`);
    console.log(`     ${e.message.split("\n")[0]}`);
    invalid++;
    errors.push({ fname, error: e.message });
  }
}

console.log(`\n=== Results ===`);
console.log(`Valid: ${valid}`);
console.log(`Invalid: ${invalid}`);
console.log(`Total: ${files.length}`);

if (errors.length > 0) {
  console.log("\n=== Error Details ===");
  for (const err of errors) {
    console.log(`\n${err.fname}:`);
    if (err.error) {
      console.log(`  Error: ${err.error}`);
    } else if (err.issues) {
      console.log(`  Issues: ${err.issues.join(", ")}`);
      console.log(`  Data: ${JSON.stringify(err.data, null, 2).replace(/\n/g, "\n  ")}`);
    }
  }
}
