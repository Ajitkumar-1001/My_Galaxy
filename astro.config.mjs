// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://ajitkumar.io",
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  // Self-hosted, subset, preloaded, with a metric-matched fallback (the next/font
  // treatment). Fetched from Google at build time only; served from /_astro/fonts.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Geist",
      cssVariable: "--font-geist",
      weights: ["100 900"],
      styles: ["normal"],
      subsets: ["latin"],
    },
  ],
});
