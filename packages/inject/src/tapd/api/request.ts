import Cookies from "js-cookie";

/**
 * 发送请求
 * @param {*} url
 */
export function request<T>(url: string, op: RequestInit): Promise<T> {
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
  return Cookies.get("dsc-token");
}
