/**
 * 将 kebab-case 格式的字符串转换为 camelCase 或 PascalCase
 * @param name - kebab-case 格式的输入字符串
 * @param capitalCase - 如果为 true，转换为 PascalCase，否则转换为 camelCase
 * @returns 转换后的 camelCase 或 PascalCase 字符串
 * @throws 如果输入不是字符串则抛出错误
 */
export function kebabToCamelCase(name: string, capitalCase = false): string {
  if (typeof name !== "string") {
    throw new Error("输入必须是字符串类型");
  }

  if (capitalCase) {
    name = name.replace(/^[a-z]/, char => char.toUpperCase());
  }

  return name.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * 将 camelCase 或 PascalCase 格式的字符串转换为 kebab-case
 * @param name - camelCase 或 PascalCase 格式的输入字符串
 * @returns 转换后的 kebab-case 字符串
 * @throws 如果输入不是字符串则抛出错误
 */
export function camelToKebabCase(name: string): string {
  if (typeof name !== "string") {
    throw new Error("输入必须是字符串类型");
  }

  return name.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
}

/**
 * 将字符串转换为有效的 JavaScript 变量名
 * @param str - 要转换的输入字符串
 * @returns 有效的 JavaScript 变量名
 * @throws 如果输入不是字符串则抛出错误
 */
export function toValidVariableName(str: string): string {
  if (typeof str !== "string") {
    throw new Error("输入必须是字符串类型");
  }

  return (
    str
      // 将无效字符替换为空格
      .replace(/[^0-9A-Za-z_$]/g, " ")
      // 将空格后的字母转换为大写
      .replace(/\s+([a-zA-Z])/g, (_, char) => char.toUpperCase())
      // 将空格替换为下划线
      .replace(/\s+/g, "_")
      // 移除首尾下划线
      .replace(/^_|_$/g, "")
      // 移除数字开头
      .replace(/^[0-9]+/, "")
      // 将首字母转换为小写
      .replace(/^[A-Z]/, char => char.toLowerCase())
  );
}

/**
 * 防抖函数
 * @param fn - 需要防抖的函数
 * @param delay - 防抖时间
 * @returns 防抖后的函数
 */
export function debounce(fn: Function, delay: number) {
  let timer: number | null = null;
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 等待指定时间
 * @param ms - 等待时间（毫秒）
 * @returns 一个 Promise，在指定时间后 resolve
 */
export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
