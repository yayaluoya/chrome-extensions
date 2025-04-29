import { tapdLocalStorage } from "@taozi-chrome-extensions/common/src/local/tapd";
import { get_my_worktable_common } from "./api/get_my_worktable_common";
import { get_my_worktable_by_page } from "./api/get_my_worktable_by_page";

export function papdInject() {
  const f = () => {
    get_my_worktable_common()
      .then(async data => {
        const d = await get_my_worktable_by_page(data.group_list[0]?.group_id, data.select_workspace_ids, "todo");
        tapdLocalStorage.edit(v => {
          v.workitemCount.story = parseInt(data.workitem_count?.story || "0");
          v.workitemCount.task = parseInt(data.workitem_count?.task || "0");
          v.workitemCount.bug = parseInt(data.workitem_count?.bug || "0");
          v.viewConfig.current_tab = data.view_config?.current_tab || "";
          v.bugList = d.workitem_list.map(item => {
            return {
              title: item.title,
              detail_url: item.detail_url,
              priority_name: item.priority_name,
              entity_type: item.entity_type
            };
          });
        });
      })
      .catch(err => {
        tapdLocalStorage.edit(v => {
          v.errMsg = err + "";
        });
      })
      .finally(() => {
        setTimeout(() => {
          f();
        }, 1000);
      });
  };
  f();
}
