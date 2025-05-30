import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local/config";

const tapdOrigin = "https://www.tapd.cn";

/**
 * 发送请求
 * @param {*} url
 */
export async function request<T>(url: string, op: RequestInit): Promise<T> {
  if (!op.headers) {
    op.headers = {};
  }
  const cfWorkerUrl = (await configLocalStorage.get())?.cfWorkerUrl;
  if (!cfWorkerUrl) {
    throw new Error("cfWorkerUrl is not set");
  }
  url = `${cfWorkerUrl.replace(/\/+$/, "")}${url}`;
  Object.assign(op.headers, {
    "x-target": tapdOrigin,
    "x-cookie": (
      await chrome.cookies.getAll({
        url: tapdOrigin
      })
    )
      .map(item => `${item.name}=${item.value}`)
      .join(";")
  });
  return fetch(url, op)
    .then(res => res.json())
    .then(({ data, meta }) => {
      if (meta["code"] === "0") {
        return data;
      } else {
        throw new Error(meta["message"]);
      }
    });
}

/**
 * 获取dsc-token
 * @returns
 */
export const getDscToken = () => {
  return chrome.cookies
    .get({
      url: tapdOrigin,
      name: "dsc-token"
    })
    .then(c => {
      return c?.value || "";
    });
};
