import { defineConfig } from "usts/config";

import solidPlugin from "@rolldown-plugin/solid";

export default defineConfig({
  entryPoint: "src/userscript/index.tsx",
  outDir: "dist/userscript",
  clean: false,
  header: {
    name: "Websim Github Integration",
    namespace: "rman.dev",
    description: "Websim Github Integration",
    match: ["https://websim.com/*"],
    version: "0.0.0",
  },
  plugins: [solidPlugin()],
});
