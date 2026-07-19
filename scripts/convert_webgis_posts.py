#!/usr/bin/env python3
"""
Convert 23 WebGIS blog posts from source markdown to project blog MDX format.

- Removes AIGC metadata block
- Removes AI disclaimer at bottom
- Extracts H1 as title, generates summary from first paragraph
- Adds proper frontmatter (title, summary, publishedAt, tag)
- Outputs as .mdx with English slug filename
"""

import os
import re
import shutil

SOURCE_DIR = r"C:\Users\Administrator\Downloads\20260719\20260719"
TARGET_DIR = r"D:\code\catnuko.github.io\src\app\blog\posts"

# Date mapping: file number -> publishedAt
DATES = {
    1: "2020-03-01",
    2: "2020-06-18",
    3: "2020-10-05",
    4: "2021-01-20",
    5: "2021-05-08",
    6: "2021-08-25",
    7: "2021-12-10",
    8: "2022-03-28",
    9: "2022-07-15",
    10: "2022-11-01",
    11: "2023-02-15",
    12: "2023-06-05",
    13: "2023-09-20",
    14: "2024-01-08",
    15: "2024-04-25",
    16: "2024-08-12",
    17: "2024-11-28",
    18: "2025-03-15",
    19: "2025-06-30",
    20: "2025-10-15",
    21: "2026-02-01",
    22: "2026-05-15",
    23: "2026-06-30",
}

# Slug mapping: file number -> English slug
SLUGS = {
    1: "webgis-coordinate-system",
    2: "vector-tile-inside",
    3: "ogc-standard-parsing",
    4: "million-point-rendering",
    5: "d3-map-projection",
    6: "webgis-performance-optimization",
    7: "poi-rendering-comparison",
    8: "turf-spatial-analysis",
    9: "cesium-custom-shader",
    10: "offline-webgis-deployment",
    11: "gis-visualization-dashboard",
    12: "openlayers-vector-editing",
    13: "llm-webgis-paradigm",
    14: "generative-ai-map-making",
    15: "digital-twin-energy-visualization",
    16: "serverless-tile-architecture",
    17: "spatiotemporal-big-data-engine",
    18: "webgpu-map-rendering",
    19: "3d-tiles-next",
    20: "webgis-framework-comparison",
    21: "3d-webgis-engine-comparison",
    22: "tile-scheme-comparison",
    23: "gis-data-format-comparison",
}


def extract_title(content):
    """Extract H1 title from markdown content."""
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return None


def remove_h1(content):
    """Remove the H1 line from content."""
    return re.sub(r'^#\s+.*$\n?', '', content, count=1, flags=re.MULTILINE)


def remove_aigc_metadata(content):
    """Remove the AIGC metadata block (between --- markers)."""
    # Match the first --- ... --- block at the start of file
    if content.startswith('---'):
        end = content.find('---', 3)
        if end != -1:
            return content[end + 3:].lstrip('\n')
    return content


def remove_ai_disclaimer(content):
    """Remove the AI disclaimer line at the bottom."""
    disclaimer_pattern = r'\*?（内容由AI生成，仅供参考）\*?\n?'
    return re.sub(disclaimer_pattern, '', content)


def generate_summary(content, title):
    """Generate a summary from the first meaningful paragraph."""
    # Split into paragraphs
    paragraphs = re.split(r'\n\n+', content)
    
    for para in paragraphs:
        para = para.strip()
        # Skip empty, headers, code blocks, and very short lines
        if not para or para.startswith('#') or para.startswith('```') or len(para) < 20:
            continue
        # Clean up markdown formatting
        clean = re.sub(r'[*_~`]', '', para)
        clean = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', clean)
        clean = clean.strip()
        if len(clean) > 30:
            # Truncate to a reasonable length
            if len(clean) > 150:
                clean = clean[:147] + "..."
            return clean
    
    # Fallback
    return f"关于 {title} 的深入技术解析与实战经验分享。"


def process_file(filepath):
    """Process a single source file and return the target filename and content."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract file number from filename (e.g., "01-..." -> 1)
    basename = os.path.basename(filepath)
    num_match = re.match(r'(\d+)-', basename)
    if not num_match:
        print(f"  ⏭️  Skipping (no number prefix): {basename}")
        return None
    
    num = int(num_match.group(1))
    
    # Remove AIGC metadata block
    content = remove_aigc_metadata(content)
    
    # Remove AI disclaimer
    content = remove_ai_disclaimer(content)
    
    # Extract title
    title = extract_title(content)
    if not title:
        print(f"  ⚠️  No H1 title found in file {num}")
        title = basename.replace('.md', '').split('-', 1)[-1]
    
    # Generate summary
    summary = generate_summary(content, title)
    
    # Remove H1 from content (title is rendered from frontmatter)
    content = remove_h1(content)
    
    # Clean up leading blank lines
    content = content.lstrip('\n')
    
    # Build frontmatter
    slug = SLUGS.get(num, f"post-{num:02d}")
    date = DATES.get(num, "2020-01-01")
    
    frontmatter = f"""---
title: "{title}"
summary: "{summary}"
publishedAt: "{date}"
tag: "WebGIS"
---

"""
    
    full_content = frontmatter + content
    
    # Target filename
    target_name = f"{slug}.mdx"
    target_path = os.path.join(TARGET_DIR, target_name)
    
    return target_path, full_content


def main():
    os.makedirs(TARGET_DIR, exist_ok=True)
    
    # Get sorted list of source files
    files = sorted(os.listdir(SOURCE_DIR))
    
    success_count = 0
    skip_count = 0
    
    for fname in files:
        if not fname.endswith('.md'):
            continue
        if not re.match(r'\d+-', fname):
            print(f"  ⏭️  Skipping (no number): {fname}")
            skip_count += 1
            continue
        
        filepath = os.path.join(SOURCE_DIR, fname)
        result = process_file(filepath)
        
        if result is None:
            skip_count += 1
            continue
        
        target_path, content = result
        
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        basename = os.path.basename(target_path)
        print(f"  ✅ {basename}")
        success_count += 1
    
    print(f"\n{'='*50}")
    print(f"Done! {success_count} files converted, {skip_count} skipped.")
    print(f"Target: {TARGET_DIR}")


if __name__ == "__main__":
    main()
