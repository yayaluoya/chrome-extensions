import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const cssFilePath = join(__dirname, "../dist/index.css");

/**
 * 处理:root选择器在影子dom下不管用的问题
 */

writeFileSync(cssFilePath, readFileSync(cssFilePath).toString().replace(/:root/g, "html"));

console.log("inject包index.css文件修改完成");
