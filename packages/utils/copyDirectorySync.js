import fs from "fs";
import path from "path";

export function copyDirectorySync(src, dest) {
  try {
    // 检查源目录是否存在
    if (!fs.existsSync(src)) {
      throw new Error("源目录不存在");
    }
    // 创建目标目录，如果不存在
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);

    files.forEach(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);

      const stats = fs.statSync(srcPath);

      if (stats.isDirectory()) {
        copyDirectorySync(srcPath, destPath);
      } else {
        console.log('copyFile', srcPath, destPath);
        fs.copyFileSync(srcPath, destPath);
      }
    });
  } catch (err) {
    console.error("复制目录时出错:", err);
  }
}
