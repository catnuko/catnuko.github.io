#!/usr/bin/env node
/**
 * Use the actual js-yaml library (the one that throws the error)
 * to validate all blog posts with the most strict settings.
 */

const fs = require("fs");
const path = require("path");
const yaml = require("D:/code/catnuko.github.io/node_modules/.pnpm/js-yaml@3.14.2/node_modules/js-yaml");

const postDir = "D:\\code\\catnuko.github.io\\src\\app\\blog\\posts";

const files = fs.readdirSync(postDir)
  .filter(f => f.endsWith(".mdx") || f.endsWith(".md"))
  .sort();

console.log(`Validating ${files.length} files using js-yaml directly...\n`);

let valid = 0;
let invalid = 0;
const errors = [];

for (const fname of files) {
  const fpath = path.join(postDir, fname);
  const content = fs.readFileSync(fpath, "utf-8");

  // Extract frontmatter
  if (!content.startsWith("---")) {
    console.log(`  \u274c ${fname}: no opening ---`);
    invalid++;
    continue;
  }

  const rest = content.slice(3);
  const endIdx = rest.indexOf("\n---");
  if (endIdx === -1) {
    console.log(`  \u274c ${fname}: no closing ---`);
    invalid++;
    continue;
  }

  const frontmatter = rest.slice(0, endIdx);

  try {
    // Use the same YAML schema as the project (default safe schema)
    const data = yaml.load(frontmatter);

    // Check required fields
    const issues = [];
    if (!data || typeof data !== "object") {
      issues.push("not an object");
    } else {
      if (!data.title) issues.push("missing/empty title");
      if (!data.summary) issues.push("missing/empty summary");
      if (!data.publishedAt) issues.push("missing/empty publishedAt");
    }

    if (issues.length > 0) {
      console.log(`  \u274c ${fname}: ${issues.join(", ")}`);
      console.log(`     Parsed data: ${JSON.stringify(data).slice(0, 200)}`);
      invalid++;
    } else {
      valid++;
    }
  } catch (e) {
    console.log(`  \u274c ${fname}: YAML PARSE ERROR`);
    console.log(`     ${e.message.split("\n").slice(0, 3).join(" | ")}`);
    invalid++;
    errors.push({ fname, error: e.message });
  }
}

console.log(`\n=== Results ===`);
console.log(`Valid: ${valid}`);
console.log(`Invalid: ${invalid}`);
console.log(`Total: ${files.length}`);
