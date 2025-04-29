/**
 * - 分隔符转大小写分隔
 * @param name
 * @param capitalCase 首字母大写
 * @returns
 */
export function handleVarName1(name: string, capitalCase = false) {
  if (capitalCase) {
    name = name.replace(/^./, a => a.toLocaleUpperCase());
  }
  return name.replace(/-(.)/g, (_, a) => {
    return a.toLocaleUpperCase();
  });
}

/**
 * 大小写分隔符转 - 分隔符
 * @param name
 * @returns
 */
export function handleVarName2(name: string) {
  return name.replace(/([A-Z])/g, (_, a: string) => {
    return "-" + a.toLocaleLowerCase();
  });
}

/**
 * 字符串转变量名
 * @param str
 * @returns
 */
export function strToVarName(str: string) {
  return str
    .replace(/[^0-9A-Za-z_$]/g, " ")
    .replace(/\s+([a-zA-Z])/g, (_, a) => a.toLocaleUpperCase())
    .replace(/^[A-Z]/, _ => _.toLocaleLowerCase())
    .replace(/\s+/g, "_")
    .replace(/^_|_$/g, "");
}
