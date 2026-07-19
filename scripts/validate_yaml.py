#!/usr/bin/env python3
"""Validate YAML frontmatter of all WebGIS blog posts."""

import os
import re

post_dir = r"D:\code\catnuko.github.io\src\app\blog\posts"

# Identify original template files to exclude
orig_files = {
    "blog.mdx", "components.mdx", "content.mdx", "localization.mdx",
    "mailchimp.mdx", "pages.mdx", "password.mdx", "quick-start.mdx",
    "seo.mdx", "styling.mdx", "work.mdx",
}

webgis_files = sorted(
    f for f in os.listdir(post_dir)
    if f.endswith(".mdx") and f not in orig_files
)

print(f"Validating {len(webgis_files)} WebGIS files...\n")

valid = 0
invalid = 0
errors = []

for fname in webgis_files:
    fpath = os.path.join(post_dir, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    if not content.startswith("---"):
        errors.append(f"{fname}: no opening ---")
        invalid += 1
        continue

    rest = content[3:]
    end = rest.find("---")
    if end == -1:
        errors.append(f"{fname}: no closing ---")
        invalid += 1
        continue

    frontmatter = rest[:end].strip()

    # Check required fields
    has_title = "title:" in frontmatter
    has_summary = "summary:" in frontmatter
    has_date = "publishedAt:" in frontmatter
    has_tag = "tag:" in frontmatter

    date_match = re.search(r'publishedAt:\s*"(\d{4}-\d{2}-\d{2})"', frontmatter)
    date_ok = date_match is not None

    if not all([has_title, has_summary, has_date, has_tag, date_ok]):
        missing = []
        if not has_title: missing.append("title")
        if not has_summary: missing.append("summary")
        if not has_date: missing.append("publishedAt")
        if not has_tag: missing.append("tag")
        if not date_ok: missing.append("bad_date_format")
        errors.append(f"{fname}: missing {', '.join(missing)}")
        invalid += 1
        continue

    # Check for unescaped ASCII quotes in YAML values
    for line in frontmatter.split("\n"):
        stripped = line.strip()
        if ":" in stripped:
            key, _, val = stripped.partition(":")
            val = val.strip()
            if val.startswith('"') and val.endswith('"'):
                inner = val[1:-1]
                if '"' in inner:
                    errors.append(f"{fname}: ASCII quotes in {key}")
                    invalid += 1
                    break

    # Check that closing delimiter is exactly --- (not ------ etc.)
    closing_line = rest[end:end+6]
    if closing_line != "---\n" and closing_line != "---":
        errors.append(f"{fname}: bad closing delimiter: {repr(closing_line)}")
        invalid += 1
        continue

    valid += 1

# Print results
for err in errors:
    print(f"  \u274c {err}")

print(f"\nResults: {valid} valid, {invalid} invalid out of {len(webgis_files)}")
