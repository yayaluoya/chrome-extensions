/**
 * 发送请求
 * @param {*} url
 */
export function request<T>(url: string, op: RequestInit): Promise<T> {
  return fetch(url, op)
    .then(res => res.json())
    .then((res: any) => {
      if (res.success) {
        return res["data"];
      } else {
        throw res.msg;
      }
    });
}
