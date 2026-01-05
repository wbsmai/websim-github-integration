import { defineConfig } from "usts/config";

export default defineConfig({
  entryPoint: "src/userscript/index.tsx",
  outDir: "dist/userscript",
  clean: false,
  header: {
    name: "Websim Github Integration",
    namespace: "rman.dev",
    description: "",
    match: [],
    version: "0.0.0",
  },
});
