import mdx from "@next/mdx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fm from "front-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Auto-generate articles.json by scanning public/articles directory (recursive)
function autoGenerateArticlesIndex() {
  const articlesDir = path.resolve(__dirname, "public/articles");
  const outputFile = path.resolve(__dirname, "public/data/articles.json");

  function findMdFiles(dir) {
    const results = [];
    const items = fs.existsSync(dir) ? fs.readdirSync(dir) : [];

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const subItems = findMdFiles(fullPath);
        for (const subItem of subItems) {
          if (subItem.category) {
            subItem.category = `${item}/${subItem.category}`;
          } else {
            subItem.category = item;
          }
          results.push(subItem);
        }
      } else if (item.endsWith(".md")) {
        const content = fs.readFileSync(fullPath, "utf-8");
        try {
          const { attributes } = fm(content);
          if (attributes.published === false) {
            console.log(`  Skipping draft: ${path.relative(articlesDir, fullPath)}`);
            continue;
          }
        } catch (e) {
          // ignore parse errors for malformed files
        }
        const slug = item.replace(/\.md$/, "");
        results.push({ slug });
      }
    }
    return results;
  }

  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
  }
  const dataDir = path.dirname(outputFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const articles = findMdFiles(articlesDir);
  const hasCategories = articles.some((a) => a.category);
  const output = hasCategories ? articles : articles.map((a) => a.slug);
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2) + "\n", "utf-8");
  console.log(`✓ Auto-generated articles.json with ${articles.length} article(s)`);
  articles.forEach((a) => {
    console.log(`  - ${a.category ? a.category + "/" : ""}${a.slug}`);
  });
}

autoGenerateArticlesIndex();

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    unoptimized: true,
  },
  basePath: "",
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default withMDX(nextConfig);
