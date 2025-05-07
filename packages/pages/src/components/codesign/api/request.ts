const tapdOrigin = "https://codesign.qq.com";

/**
 * 发送请求
 * @param {*} url
 */
export async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  if (!init.headers) {
    init.headers = {};
  }
  url = `${tapdOrigin}${url}`;
  Object.assign(init.headers, {
    cookie: (
      await chrome.cookies.getAll({
        url: tapdOrigin
      })
    )
      .map(item => `${item.name}=${item.value}`)
      .join(";")
  });
  return fetch(url, init).then(res => res.json());
}
