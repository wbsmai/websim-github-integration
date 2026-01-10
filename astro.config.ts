import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [solid()],
  vite: { plugins: [tailwindcss()] },
  site: "https://websim.rman.dev",
});
