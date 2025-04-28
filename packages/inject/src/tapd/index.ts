import { tapdLocal } from "@taozi-chrome-extensions/common/src/local/tapd";
export function papdInject() {
  get_my_worktable_common();
}

function get_my_worktable_common() {
  const dsc_token = getCookie("dsc-token");
  if (!dsc_token) {
    setTimeout(() => {
      get_my_worktable_common();
    }, 500);
    return;
  }
  fetch("https://www.tapd.cn/api/my_worktable/my_worktable/get_my_worktable_common", {
    method: "post",
    body: `{"need_view_config":true,"need_setting":true,"dsc_token":"${dsc_token}"}`
  })
    .then(res => res.json())
    .then(({ data }) => {
      if (data) {
        tapdLocal.set({
          workitem_count: data.workitem_count
        });
      }
      setTimeout(() => {
        get_my_worktable_common();
      }, 3000);
    });
}

function getCookie(name: string) {
  const cookieString = document.cookie;
  if (cookieString) {
    const cookies = cookieString.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === name) {
        return decodeURIComponent(cookie[1] || ""); // 解码 URL 编码的 Cookie 值
      }
    }
  }
  return null; // 如果找不到指定的 Cookie，则返回 null
}
