import { wait } from "@taozi-chrome-extensions/common/src/utils/global";

/** 挂载检查间隔 */
export const MOUNT_CHECK_DELAY = 10;

/**
 * 插入挂载元素
 * @param parentEl 父元素
 * @param getInsertBeforeEl 获取插入到指定元素之前
 * @param className 元素类名
 * @returns 插入的元素
 */
export async function insertMountEl(parentEl: Element, getInsertBeforeEl: () => Element | null, className: string) {
  [...parentEl.querySelectorAll(`:scope > .${className}`)].forEach(el => el.remove());
  const mountEl = document.createElement("div");
  mountEl.className = className;
  parentEl.insertBefore(mountEl, getInsertBeforeEl());
  await wait(MOUNT_CHECK_DELAY);
  return parentEl.contains(mountEl) ? mountEl : null;
}
