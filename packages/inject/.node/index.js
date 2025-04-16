import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

writeFileSync(join(__dirname, '../dist/index.css'), readFileSync(join(__dirname, '../dist/index.css')).toString().replace(/:root/g, 'html'))