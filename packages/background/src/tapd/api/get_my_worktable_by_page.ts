import { request } from "./request";
import type { MyWorktableByPage } from "./type";

export function get_my_worktable_by_page(group_id: string, select_workspace_ids: string[], dsc_token: string) {
  return request<MyWorktableByPage>(
    "https://taozi-chrome-extensions-cf-worker.yayaluoya.sbs/api/my_worktable/my_worktable/get_my_worktable_by_page?needRepeatInterceptors=false",
    {
      method: "post",
      body: JSON.stringify({
        group: "workspace",
        group_id,
        order_field: "owner",
        order_type: "asc",
        select_workspace_ids,
        select_object_types: ["story", "tobject", "board_card", "launchform", "task", "bug"],
        search_filter_time: "all_time",
        show_fields: ["name", "status", "priority", "iteration_id", "due", "owner", "created"],
        perpage: "999999",
        page: 1,
        setting_view: "tree",
        exclude_workspace_configs: [],
        tab: "todo",
        dsc_token
      })
    }
  );
}
