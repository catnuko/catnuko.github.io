#!/usr/bin/env python3
"""Check raw publishedAt strings for any anomalies."""

import os
import re

post_dir = r"D:\code\catnuko.github.io\src\app\blog\posts"

print("Checking raw publishedAt values for all 34 files:\n")

issues = []
for fname in sorted(os.listdir(post_dir)):
    if not fname.endswith(".mdx"):
        continue
    fpath = os.path.join(post_dir, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        c = f.read()

    # Find the raw publishedAt value (with surrounding quotes)
    m = re.search(r'publishedAt:\s*"([^"]*)"', c)
    if m:
        date = m.group(1)
        # Check for any non-standard characters
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", date):
            issues.append((fname, repr(date)))
    else:
        # Couldn't find quoted date - look for unquoted
        m2 = re.search(r"publishedAt:\s*([^\s]+)", c)
        if m2:
            date = m2.group(1)
            issues.append((fname, f"unquoted: {repr(date)}"))
        else:
            issues.append((fname, "no publishedAt found"))

if issues:
    print(f"Found {len(issues)} anomalies:\n")
    for fname, date in issues:
        print(f"  \u26a0\ufe0f {fname}: {date}")
else:
    print("\u2705 All publishedAt values are clean YYYY-MM-DD strings")
