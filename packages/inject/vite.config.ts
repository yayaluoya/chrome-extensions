import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const __dirname = dirname(fileURLToPath(import.meta.url));

const srcDir = path.resolve(__dirname, "src");

export default defineConfig({
  build: {
    lib: {
      name: "inject",
      entry: path.resolve(srcDir, "index.ts"),
      formats: ["iife"],
      fileName: "index",
      cssFileName: "index"
    }
  },
  plugins: [vue()],
  define: {
    "process.env": {},
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: true,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
