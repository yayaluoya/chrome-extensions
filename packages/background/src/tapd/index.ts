import { tapdLocalStorage } from "@taozi-chrome-extensions/common/src/local/tapd";
import { get_my_worktable_common } from "./api/get_my_worktable_common";
import { get_my_worktable_by_page } from "./api/get_my_worktable_by_page";
import { setIcon } from "@/utils/setIcon";

export async function tapdTask() {
  await tapdLocalStorage.edit(v => {
    v.dataUpdateTime = Date.now();
  });
  try {
    await get_my_worktable_common().then(async data => {
      const d = await get_my_worktable_by_page(data.group_list[0]?.group_id, data.select_workspace_ids);
      await tapdLocalStorage.edit(v => {
        v.workitemCount.story = parseInt(data.workitem_count?.story || "0");
        v.workitemCount.task = parseInt(data.workitem_count?.task || "0");
        v.workitemCount.bug = parseInt(data.workitem_count?.bug || "0");
        v.viewConfig.current_tab = data.view_config?.current_tab || "";
        v.todoList = d.workitem_list.map(item => {
          return {
            title: item.title || item.name,
            detail_url: item.detail_url,
            priority_name: item.priority_name,
            entity_type: item.entity_type
          };
        });
        const { bug = 0 } = v?.workitemCount || {};
        setIcon(bug > 0);
        v.errMsg = "";
      });
    });
  } catch (err) {
    await tapdLocalStorage.edit(v => {
      v.errMsg = err + "";
    });
    setIcon(true);
  }
}
