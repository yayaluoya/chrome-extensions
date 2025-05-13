const apifoxOrigin = "https://api.apifox.com";

/**
 * 发送请求
 * @param {*} url
 */
export function request<T>(url: string, op: RequestInit, projectId: string): Promise<T> {
  if (!op.headers) {
    op.headers = {};
  }
  Object.assign(op.headers, {
    authorization: getAuthorization(),
    "x-project-id": projectId
  });
  url = `${apifoxOrigin}${url}`;
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

/**
 * 获取Authorization
 * @returns
 */
const getAuthorization = () => {
  return (localStorage.getItem("common.accessToken") || "").replace(/^"|"$/g, "");
};
