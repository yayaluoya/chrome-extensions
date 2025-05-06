const tapdOrigin = "https://www.tapd.cn";

/**
 * 发送请求
 * @param {*} url
 */
export async function request<T>(url: string, op: RequestInit): Promise<T> {
  if (!op.headers) {
    op.headers = {};
  }
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

export function getDscToken() {
  return chrome.cookies
    .get({
      url: tapdOrigin,
      name: "dsc-token"
    })
    .then(c => {
      return c?.value || "";
    });
}
