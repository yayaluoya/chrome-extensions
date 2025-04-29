import { getDscToken, request } from "./request";
import type { MyWorktableCommonRes } from "./type";

export function get_my_worktable_common() {
  return request<MyWorktableCommonRes>("https://www.tapd.cn/api/my_worktable/my_worktable/get_my_worktable_common", {
    method: "post",
    body: JSON.stringify({
      need_view_config: true,
      need_setting: true,
      dsc_token: getDscToken()
    })
  });
}
