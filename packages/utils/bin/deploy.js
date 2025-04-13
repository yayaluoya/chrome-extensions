import { copyDirectorySync } from "../copyDirectorySync.js";
import { getExtensionsDir } from "../getExtensionsDir.js";
import path from "path";
import fs from "fs";

export function deploy(distDir, target) {
  const targetDir = path.resolve(getExtensionsDir(), target);

  fs.readdirSync(targetDir).forEach(item => {
    if (!/^readme\.md$/i.test(item)) {
      fs.rmSync(path.resolve(targetDir, item), {
        recursive: true
      });
    }
  });

  copyDirectorySync(distDir, targetDir);
}

deploy(...process.argv.slice(2));
