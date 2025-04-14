import path, { dirname } from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";

const __dirname = dirname(fileURLToPath(import.meta.url))

const srcDir = path.resolve(__dirname, "src");

const libs = fs
  .readdirSync(srcDir)
  .map(item => item.match(/^([\w-]+)\.index\.ts$/))
  .reduce<Record<string, string>>((a, b) => {
    if (!b) { return a; }
    a[b[1]] = path.resolve(srcDir, b[0]);
    return a;
  }, {});

export default defineConfig({
  build: {
    lib: {
      entry: libs,
      formats: ['es'],
      cssFileName: 'index',
    },
  },
  plugins: [vue()],
  define: {
    'process.env': {},
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: true,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  }
})