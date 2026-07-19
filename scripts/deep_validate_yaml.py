#!/usr/bin/env python3
"""Comprehensive YAML frontmatter validation for all WebGIS blog posts."""

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

print(f"Checking {len(webgis_files)} WebGIS files for YAML issues\n")

issues_found = []

for fname in webgis_files:
    fpath = os.path.join(post_dir, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract frontmatter
    if not content.startswith("---"):
        continue

    rest = content[3:]
    end = rest.find("---")
    if end == -1:
        continue

    frontmatter = rest[:end].strip()
    lines = frontmatter.split("\n")

    # Check each line for potential issues
    for i, line in enumerate(lines, 1):
        line_stripped = line.strip()

        # Skip if not a key-value line
        if ":" not in line_stripped:
            continue

        key, _, val = line_stripped.partition(":")
        key = key.strip()
        val = val.strip()

        # Check if value is a quoted string
        if val.startswith('"') and val.endswith('"'):
            # Extract the inner content
            inner = val[1:-1]
            # Check for embedded ASCII double quotes (would break YAML)
            if '"' in inner:
                issues_found.append((fname, i, f"{key}: contains embedded ASCII double quotes"))
                continue

            # Check for problematic patterns: colons followed by space
            # (could confuse YAML if multiline)
            # Actually we already check that it's a single line, so colons should be fine

            # Check for backslashes that might be escape issues
            if "\\" in inner and '"' not in inner:
                # Could be intentional escapes, just note it
                pass

        # Check for unquoted values with colons
        elif ":" in val and not val.startswith('"'):
            # Check if there's a colon followed by something that looks like a key
            # e.g., "value: key" - this would break YAML
            if " #" in val or re.search(r':\s+\w+:', val):
                issues_found.append((fname, i, f"{key}: unquoted value contains colon"))

# Also check for files that might have other issues
# Check date format
for fname in webgis_files:
    fpath = os.path.join(post_dir, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract date
    m = re.search(r'publishedAt:\s*"([^"]+)"', content)
    if m:
        date = m.group(1)
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", date):
            issues_found.append((fname, 0, f"invalid date format: {date}"))

if issues_found:
    print(f"Found {len(issues_found)} potential issues:\n")
    for fname, line, desc in issues_found:
        print(f"  \u274c {fname}:{line} - {desc}")
else:
    print("\u2705 No issues found in check!")
