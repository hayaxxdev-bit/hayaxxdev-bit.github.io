import { defineConfig, type Plugin } from "vite";

import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

/* =========================================================
   PATH UTILITIES
========================================================= */

const fromRoot = (path: string): string =>
  fileURLToPath(new URL(path, import.meta.url));

const rootDir = fileURLToPath(new URL(".", import.meta.url));

/* =========================================================
   ENVIRONMENT
========================================================= */

const repository = process.env.GITHUB_REPOSITORY;
const isGithubActions = process.env.GITHUB_ACTIONS === "true";

const repositoryName = repository?.split("/")[1];

const isUserOrOrganizationSite = repository?.endsWith(".github.io") ?? false;

/**
 * Deployment base:
 *
 * GitHub User / Organization Pages:
 *   /
 *
 * GitHub Project Pages:
 *   /repository-name/
 *
 * Custom Domain:
 *   /
 *
 * Local Development:
 *   /
 */

const base =
  isGithubActions && repositoryName && !isUserOrOrganizationSite
    ? `/${repositoryName}/`
    : "/";

/* =========================================================
   MANIFEST GENERATOR
========================================================= */

/**
 * Generate site.webmanifest dynamically.
 *
 * Source:
 *   src/manifest.webmanifest
 *
 * Output:
 *   dist/site.webmanifest
 *
 * Replace:
 *   __BASE_URL__
 *
 * With:
 *   Vite base configuration.
 */

function manifestPlugin(): Plugin {
  return {
    name: "generate-web-manifest",

    apply: "build",

    async generateBundle() {
      const manifestPath = fromRoot("./src/manifest.webmanifest");

      const manifest = await readFile(manifestPath, "utf-8");

      const generatedManifest = manifest.replaceAll("__BASE_URL__", base);

      this.emitFile({
        type: "asset",
        fileName: "site.webmanifest",
        source: generatedManifest,
      });
    },
  };
}

/* =========================================================
   VITE CONFIGURATION
========================================================= */

export default defineConfig({
  /* ---------- Project Root ---------- */

  root: rootDir,

  /* ---------- Deployment Base ---------- */

  base,

  /* ---------- Plugins ---------- */

  plugins: [manifestPlugin()],

  /* ---------- Development Server ---------- */

  server: {
    host: true,
    port: 5173,
    allowedHosts: ["buffer-absentee-regalia.ngrok-free.dev"],
    strictPort: true,
    open: true,
  },

  /* ---------- Production Build ---------- */

  build: {
    target: "es2022",

    sourcemap: false,

    outDir: "dist",

    emptyOutDir: true,

    manifest: true,

    cssMinify: true,

    cssCodeSplit: true,

    reportCompressedSize: false,

    /* ---------- Rolldown Configuration ---------- */

    rolldownOptions: {
      input: {
        main: fromRoot("./index.html"),
        notFound: fromRoot("./404.html"),
        serverError: fromRoot("./500.html"),
      },

      output: {
        minify: {
          compress: {
            dropConsole: true,
            dropDebugger: true,
          },
        },
      },
    },
  },
});
