#!/usr/bin/env python3
"""Fix the closing delimiter issue (------ -> ---) in affected files."""

import os

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

    # Replace ------ (6 dashes) with --- (3 dashes) to fix closing delimiter
    content = content.replace("\n------\n", "\n---\n")
    
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ✅ Fixed delimiter in {fname}")

print("Done!")
