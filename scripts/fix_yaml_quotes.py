#!/usr/bin/env python3
"""Fix YAML quote conflicts in blog frontmatter summaries."""

import os
import re

post_dir = r"D:\code\catnuko.github.io\src\app\blog\posts"
affected = [
    "generative-ai-map-making.mdx",
    "llm-webgis-paradigm.mdx",
    "ogc-standard-parsing.mdx",
    "poi-rendering-comparison.mdx",
    "serverless-tile-architecture.mdx",
    "tile-scheme-comparison.mdx",
]

for fname in affected:
    fpath = os.path.join(post_dir, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the frontmatter section
    end = content.find("---", 3)
    if end == -1:
        print(f"  Skipping {fname}: no closing frontmatter")
        continue

    frontmatter = content[3:end]
    body = content[end:]

    # Process each line
    lines = frontmatter.split("\n")
    new_lines = []
    fixed = False

    for line in lines:
        if line.startswith("summary:"):
            # Check if the line has the format: summary: "value"
            m = re.match(r'^(summary:\s*")(.*)(")$', line)
            if m:
                prefix = m.group(1)
                value = m.group(2)
                suffix = m.group(3)

                inner_count = value.count('"')
                if inner_count > 0:
                    # Replace inner ASCII double quotes with Chinese quotes
                    quote_idx = [0]

                    def replace_quote(m):
                        quote_idx[0] += 1
                        if quote_idx[0] % 2 == 1:
                            return "\u201c"  # left "
                        else:
                            return "\u201d"  # right "

                    new_value = re.sub(r'"', replace_quote, value)
                    line = prefix + new_value + suffix
                    fixed = True

        new_lines.append(line)

    if fixed:
        content = "---\n" + "\n".join(new_lines).strip() + "\n---" + body
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  ✅ Fixed {fname}")

print("Done!")
