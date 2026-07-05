import type { NextConfig } from "next";
import path from "node:path";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGitHubPages = process.env.GITHUB_ACTIONS === "true" && Boolean(repositoryName);
const basePath = isGitHubPages ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
