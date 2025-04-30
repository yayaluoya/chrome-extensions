import { request } from "./request";
import type { MyWorktableCommonRes } from "./type";

export function get_my_worktable_common(dsc_token: string) {
  return request<MyWorktableCommonRes>(
    "https://taozi-chrome-extensions-cf-worker.yayaluoya.sbs/api/my_worktable/my_worktable/get_my_worktable_common",
    {
      method: "post",
      body: JSON.stringify({
        need_view_config: true,
        need_setting: true,
        dsc_token
      })
    }
  );
}
