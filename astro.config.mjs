import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://facturation-electronique.netlify.app",
  output: "static",
  trailingSlash: "ignore",
  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: { theme: "github-dark-dimmed", wrap: true },
      gfm: true,
    }),
    react(),
    sitemap({ i18n: { defaultLocale: "fr", locales: { fr: "fr-FR" } } }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["chart.js", "react-chartjs-2"],
    },
    optimizeDeps: {
      exclude: ["pdfjs-dist"],
    },
  },
  build: {
    inlineStylesheets: "auto",
  },
  prefetch: {
    defaultStrategy: "viewport",
  },
});
