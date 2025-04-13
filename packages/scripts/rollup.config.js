import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, "src");

const inputs = fs
  .readdirSync(srcDir)
  .map(item => item.match(/^([\w-]+)\.index\.ts$/))
  .filter(Boolean)
  .reduce((a, b) => {
    a[b[1]] = path.resolve(srcDir, b[0]);
    return a;
  }, {});

export default Object.keys(inputs).map(name => {
  return defineConfig({
    input: inputs[name],
    output: {
      dir: path.resolve(__dirname, "dist"),
      entryFileNames: `${name}.js`,
      format: "iife"
    },
    plugins: [typescript()]
  });
});
