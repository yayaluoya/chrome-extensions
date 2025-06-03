import { tapdLocalStorage } from "@taozi-chrome-extensions/common/src/local/tapd";
import { get_my_worktable_common } from "./api/get_my_worktable_common";
import { get_my_worktable_by_page } from "./api/get_my_worktable_by_page";
import { setIcon } from "@/utils/setIcon";

export async function tapdTask() {
  if ((await tapdLocalStorage.get())?.loading) {
    return;
  }
  await tapdLocalStorage.edit(v => {
    v.dataUpdateTime = Date.now();
  });
  try {
    await tapdLocalStorage.edit(v => {
      v.loading = true;
    });
    const worktableCommon = await get_my_worktable_common();
    const worktableByPage = await get_my_worktable_by_page(
      worktableCommon.group_list[0]?.group_id,
      worktableCommon.select_workspace_ids
    );
    await tapdLocalStorage.edit(v => {
      v.workitemCount.story = parseInt(worktableCommon.workitem_count?.story || "0");
      v.workitemCount.task = parseInt(worktableCommon.workitem_count?.task || "0");
      v.workitemCount.bug = parseInt(worktableCommon.workitem_count?.bug || "0");
      v.viewConfig.current_tab = worktableCommon.view_config?.current_tab || "";
      v.todoList = worktableByPage.workitem_list.map(item => {
        return {
          title: item.title || item.name,
          detail_url: item.detail_url,
          priority_name: item.priority_name,
          entity_type: item.entity_type,
          short_id: item.short_id
        };
      });
      const { bug = 0 } = v?.workitemCount || {};
      setIcon(bug > 0);
      v.errMsg = "";
    });
  } catch (err) {
    await tapdLocalStorage.edit(v => {
      v.errMsg = err + "";
    });
    setIcon(true);
  } finally {
    await tapdLocalStorage.edit(v => {
      v.loading = false;
    });
  }
}
