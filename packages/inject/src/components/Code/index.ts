import Color from "color";

export enum CodeType {
  Vue = "vue",
  Js = "js",
  Css = "css",
  Ts = "ts"
}

const colorRegex =
  /(#[0-9a-f]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)|hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\))/gi;

export const parseCode = (code: string, type: CodeType) => {
  return code.split("\n").map(line => {
    // 替换特殊字符
    line = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/&nbsp;/g, " ");
    switch (type) {
      case CodeType.Css: {
        return (
          line
            // 高亮颜色
            .replace(colorRegex, _ => {
              try {
                return `<span style="
            background-color: ${_};
            color: ${new Color(_).isDark() ? "white" : "black"};
            padding: 1px 2px;
            border-radius: 3px;
            ">${_}</span>`;
              } catch {
                return _;
              }
            })
        );
      }
      default: {
        return line;
      }
    }
  });
};
