/**
 * - 分隔符转大小写分隔
 * @param name
 * @param capitalCase
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
